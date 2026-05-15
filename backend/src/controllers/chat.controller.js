const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");

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

module.exports = {
  createChat,
  getChats,
};
