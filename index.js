// // server.js
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*", // allow all for now
//     methods: ["GET", "POST"]
//   }
// });


// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("join", (roomId) => {
//     socket.join(roomId);
//     console.log(`User ${socket.id} joined room ${roomId}`);
//   });

//  socket.on("offer", (data) => {
//   console.log("Offer received on server:", data);
//   socket.to(data.roomId).emit("offer", data);
// });
// socket.on("answer", (data) => {
//   console.log("Answer received on server:", data);
//   socket.to(data.roomId).emit("answer", data);
// });
// socket.on("ice-candidate", (data) => {
//   console.log("ICE candidate received on server:", data);
//   socket.to(data.roomId).emit("ice-candidate", data);
// });
// socket.on("call-ended", (data) => {
//   console.log("Call ended in room:", data.roomId);
//   socket.to(data.roomId).emit("call-ended");
// });
// });
// // get route for testing
// app.get("/", (req, res) => {
//   res.send("Socket.IO signaling server is running");
// });
// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log("Socket.IO signaling server running on port 3000");
// });


// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const oneToOneHandlers = require("./oneToOne");
const groupCallHandlers = require("./groupCall");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Setup One-to-One logic
  oneToOneHandlers(io, socket);

  // Setup Group Call logic
  groupCallHandlers(io, socket);
});

app.get("/", (req, res) => {
  res.send("Combined Socket.IO Signaling Server Running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
