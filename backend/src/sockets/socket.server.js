const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { Server } = require("socket.io");
const { createMemory, queryMemory } = require("../services/vector.service");
const { removeGreeting, isLowIntentMessage } = require("../utils/text.utils");

const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const chatModel = require("../models/chat.model");

const aiService = require("../services/ai.service");

function initSocketServer(httpServer) {

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    },
  });
    
  /* Socket Middleware */
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    if (!cookies.token)
      next(
        new Error(
          "Authentication error: No token provided. Please login again.",
        ),
      );

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (error) {
      next(
        new Error("Authentication error: Invalid Token. Please login again."),
      );
    }
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.user._id);

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.user._id);
    });

    socket.on("message", async (messagePayload) => {
      try {
        // Saving user message to MongoDB
        const userMessage = await messageModel.create({
          fromUserId: socket.user._id,
          fromChatId: messagePayload.chat,
          content: messagePayload.content,
          role: "user",
        });

        // Getting Vector, Ran Query LTM, and Fetch STM
        const [queryVector, chatHistory] = await Promise.all([
          aiService.generateVector(messagePayload.content, "RETRIEVAL_QUERY"),
          messageModel
            .find({ fromChatId: messagePayload.chat })
            .sort({ createdAt: -1 })
            .limit(15) // Limit to last 15 messages for STM
            .lean(),
        ]);

        // Reversing history (oldest to newest)
        const chronologicalHistory = chatHistory.reverse();

        // Query for Pinecone (LTM)
        const rawMemory = await queryMemory({
          queryVector: queryVector,
          limit: 3,
          metadata: { fromUserId: String(socket.user._id) },
        });

        // Filtering out low-confidence matches and messages from the CURRENT chat
        // (STM already handles the current chat, we want LTM from past chats)
        const relevantMemories = rawMemory.filter(
          (memory) =>
            memory.score > 0.65 &&
            memory.metadata.fromChatId !== String(messagePayload.chat),
        );

        // Constructing the Payload
        const stmToSend = chronologicalHistory.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.content }],
        }));

        // Pop the very last message (the one the user just sent) so we can modify it
        const currentMessage = stmToSend.pop();

        // Inject LTM directly into the current prompt context
        let contextString = "";
        if (relevantMemories.length > 0) {
          contextString = `[SYSTEM NOTE: The user has discussed related topics in the past. Here are relevant snippets for context:\n`;
          contextString += relevantMemories
            .map((memory, index) => `${index + 1}. ${memory.metadata.text}`)
            .join("\n");
          contextString += `\nUse this information if it is helpful to answer the current question.]\n\n`;
        }

        // Rebuilding the final message with context + the actual user question
        const finalUserTurn = {
          role: "user",
          parts: [
            {
              text: `${contextString}Current Question: ${messagePayload.content}`,
            },
          ],
        };

        const contentsToSend = [...stmToSend, finalUserTurn];
        // console.log(contentsToSend);

        // Generate AI Response
        const aiResponseText = await aiService.generateResponse(contentsToSend);

        // Sending response to user
        socket.emit("ai-response", {
          content: aiResponseText,
          chat: messagePayload.chat,
        });

        // Generate a Chat Title (along with skip low-intent messages)
        const chat = await chatModel.findById(messagePayload.chat);

        // Runs only if still default
        if (chat.title === "New Chat") {
          const cleanedContent = removeGreeting(messagePayload.content);

          // Skip low-intent messages
          if (!isLowIntentMessage(messagePayload.content)) {
            const title = await aiService.generateTitle(cleanedContent);

            // Update only if still "New Chat"
            await chatModel.findOneAndUpdate(
              { _id: messagePayload.chat, title: "New Chat" }, // atomic check
              { title: title },
            );

            socket.emit("chat-title-updated", {
              chatId: messagePayload.chat,
              title,
            });
          }
        }

        // BACKGROUND TASKS: Saving AI response to MongoDB, Upsert to Pinecone
        processBackgroundTasks(
          socket,
          messagePayload,
          userMessage,
          aiResponseText,
        );
      } catch (error) {
        console.error("Error in message handler:", error);
        socket.emit("error", { message: "Failed to process message" });
      }
    });
  });

  // function to handle heavy vector generation and upserts in the background
  async function processBackgroundTasks(
    socket,
    messagePayload,
    userMessage,
    aiResponseText,
  ) {
    try {
      // Save Model message to DB
      const responseMessage = await messageModel.create({
        fromUserId: socket.user._id,
        fromChatId: messagePayload.chat,
        content: aiResponseText,
        role: "model",
      });

      // Generate vectors for BOTH user and model messages concurrently
      const [userVector, modelVector] = await Promise.all([
        aiService.generateVector(messagePayload.content, "RETRIEVAL_DOCUMENT"),
        aiService.generateVector(aiResponseText, "RETRIEVAL_DOCUMENT"),
      ]);

      // Upsert BOTH to Pinecone
      await Promise.all([
        createMemory({
          messageId: String(userMessage._id),
          vectors: userVector,
          metadata: {
            fromChatId: String(messagePayload.chat),
            fromUserId: String(socket.user._id),
            text: messagePayload.content,
            role: "user",
          },
        }),
        createMemory({
          messageId: String(responseMessage._id),
          vectors: modelVector,
          metadata: {
            fromChatId: String(messagePayload.chat),
            fromUserId: String(socket.user._id),
            text: aiResponseText,
            role: "model",
          },
        }),
      ]);

      console.log(
        "Background memory sync complete for chat:",
        messagePayload.chat,
      );
    } catch (error) {
      console.error("Failed to sync memory in background:", error);
    }
  }
}

module.exports = initSocketServer;
