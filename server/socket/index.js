const express = require("express");

const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../middlewares/userDetailsFromToken");
const userModel = require("../models/userModel");

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

  socket.join(user?._id);
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("messagePage", async (userId) => {
    const userDetails = await userModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails._id,
      name: userDetails.name,
      email: userDetails.email,
      // profilePic: userDetails.profilePic,
      online: onlineUser.has(userId),
    };

    socket.emit("messageUser", payload);
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("User Disconnected", socket.id);
  });
});

module.exports = { server, app };
