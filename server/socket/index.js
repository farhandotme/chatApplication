const express = require("express");

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

  // Current user details
  const user = await getUserDetailsFromToken(token);

  // Create a Room

  socket.join(user?._id.toString());
  onlineUser.add(user?._id?.toString());

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
  });

  // New message

  socket.on("new message", async (data) => {
    // check conversation is available or not
    const conversation = await conversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    if (!conversation) {
      const createConversation = await conversationModel.create({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation;
    }

    const message = await messageModel.create({
      text: data.text,
      messaageBy: data?.messaageBy,
    });
    const saveMessage = await message.save();

    const updateConversation = await conversationModel.findByIdAndUpdate(
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

    io.to(data?.sender).emit("message", getConversationMessage.messages);
    io.to(data?.receiver).emit("message", getConversationMessage.messages);

    // io.emit("new message", data);
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("User Disconnected", socket.id);
  });
});

module.exports = { server, app };
