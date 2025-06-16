// oneToOne.js
module.exports = (io, socket) => {
  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`(1:1) ${socket.id} joined room ${roomId}`);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data);
  });

  socket.on("call-ended", (data) => {
    socket.to(data.roomId).emit("call-ended");
  });
};
