// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for now
    methods: ["GET", "POST"]
  }
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

 socket.on("offer", (data) => {
  console.log("Offer received on server:", data);
  socket.to(data.roomId).emit("offer", data);
});
socket.on("answer", (data) => {
  console.log("Answer received on server:", data);
  socket.to(data.roomId).emit("answer", data);
});
socket.on("ice-candidate", (data) => {
  console.log("ICE candidate received on server:", data);
  socket.to(data.roomId).emit("ice-candidate", data);
});
});
// get route for testing
app.get("/", (req, res) => {
  res.send("Socket.IO signaling server is running");
});

server.listen(3000, () => {
  console.log("Socket.IO signaling server running on port 3000");
});
