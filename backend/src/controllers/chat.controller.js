const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");
const { deleteMemory } = require("../services/vector.service");

// createChat
async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;

  const chat = await chatModel.create({
    fromUserId: user._id,
    title,
  });

  return res.status(201).json({
    message: "Chat Created Successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
    },
  });
}

// Delete Chat
async function deleteChat(req, res) {
  const chatId = req.params.id;

  try {
    console.log("Received chatId", chatId)
    const result = await chatModel.findByIdAndDelete(chatId);

    if (!result) {
      return res.status(404).json({ message: "Chat not found" });
    }

    await Promise.all([
      messageModel.deleteMany({ fromChatId: chatId }),
      deleteMemory(chatId),
    ]);

    return res.status(200).json({ 
      message: "Chat Deleted Successfully" 
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete chat",
    });
  }
}

// Get Chats
async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel.find({
    fromUserId: user._id,
  });

  return res.status(200).json({
    message: "Chats fetched successfully",
    chats: chats.map((chat) => ({
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      userId: chat.fromUserId,
    })),
  });
}

// Get Messages
async function getMessages(req, res) {
  try {
    const chatId = req.params.id;

    const messages = await messageModel
      .find({ fromChatId: chatId })
      .sort({ createdAt: 1 });

    return res.status(200).json({
      message: "Messages Retrieved Successfully",
      messages: messages,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve messages",
    });
  }
}

module.exports = {
  createChat,
  deleteChat,
  getChats,
  getMessages,
};
