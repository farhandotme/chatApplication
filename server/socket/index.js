const express = require("express");
const getconversation = require("../middlewares/getConversation");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../middlewares/userDetailsFromToken");
const userModel = require("../models/userModel");
const {
  conversationModel,
  messageModel,
} = require("../models/conversationModel");

const app = express();

// Socket connection

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Socket is running on http://localhost:8080

// Online user

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User Connected", socket.id);
  const token = socket.handshake.auth.token;

  if (!token) {
    console.error("Token not provided.");
    socket.disconnect();
    return;
  }

  // Current user details
  const user = await getUserDetailsFromToken(token);

  if (!user) {
    console.error("User not found for the provided token.");
    socket.disconnect();
    return;
  }

  // Create a Room

  const userss = user._id.toString();
  socket.join(userss);
  onlineUser.add(userss);
  io.emit("onlineUser", Array.from(onlineUser));

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("messagePage", async (userId) => {
    const userDetails = await userModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profilePic: userDetails?.profilePic,
      online: onlineUser.has(userId),
    };

    socket.emit("messageUser", payload);

    // Previous Messages
    const getConversationMessage = await conversationModel
      .findOne({
        $or: [
          { sender: user._id, receiver: userId },
          { sender: userId, receiver: user._id },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages || []);
  });

  // New message

  socket.on("new message", async (data) => {
    // Check if conversation is available or not
    let conversation = await conversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversation) {
      // Create new conversation
      conversation = await conversationModel.create({
        sender: data?.sender,
        receiver: data?.receiver,
      });
    }

    const message = await messageModel.create({
      text: data.text,
      messageBy: data?.messageBy,
    });
    const saveMessage = await message.save();

    await conversationModel.findByIdAndUpdate(
      conversation._id,
      {
        $push: {
          messages: saveMessage._id,
        },
      },
      { new: true }
    );

    const getConversationMessage = await conversationModel
      .findOne({
        $or: [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit(
      "message",
      getConversationMessage?.messages || []
    );

    // send conversation

    const conversationSender = await getconversation(data.sender);
    const conversationReceiver = await getconversation(data.receiver);

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReceiver);

    // io.emit("new message", data);
  });

  // SideBar

  socket.on("sidebar", async (currentUserId) => {
    console.log("current user", currentUserId);

    // Ensure that currentUserId is a valid ObjectId
    const conversation = await getconversation(currentUserId);
    socket.emit("conversation", conversation);
  });

  socket.on("seen", async (msgByUserId) => {
    let conversation = await conversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: msgByUserId },
        { sender: msgByUserId, receiver: user?._id },
      ],
    });

    const conversationMessages = conversation?.messages || [];

    const updateMessages = await messageModel.updateMany(
      { _id: { $in: conversationMessages }, messageBy: msgByUserId },
      { $set: { seen: true } }
    );

    const conversationSender = await getconversation(user?._id.toString());
    const conversationReceiver = await getconversation(msgByUserId);

    io.to(user?._id.toString()).emit("conversation", conversationSender);
    io.to(msgByUserId).emit("conversation", conversationReceiver);
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id.toString());
    console.log("User Disconnected", socket.id);
  });
});

module.exports = { server, app };
