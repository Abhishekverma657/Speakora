// groupCall.js
const groupRooms = {}; // { roomId: [userId, userId...] }

module.exports = (io, socket) => {
  socket.on("join-group-room", (roomId) => {
    socket.join(roomId);
    console.log(`(Group) ${socket.id} joined room ${roomId}`);

    if (!groupRooms[roomId]) groupRooms[roomId] = [];

    const others = groupRooms[roomId].filter(id => id !== socket.id);
    socket.emit("group-all-users", others);

    groupRooms[roomId].push(socket.id);

    socket.to(roomId).emit("user-joined-group", socket.id);
  });

  socket.on("group-offer", ({ to, from, sdp }) => {
    io.to(to).emit("group-offer", { from, sdp });
  });

  socket.on("group-answer", ({ to, from, sdp }) => {
    io.to(to).emit("group-answer", { from, sdp });
  });

  socket.on("group-ice-candidate", ({ to, from, candidate }) => {
    io.to(to).emit("group-ice-candidate", { from, candidate });
  });

  socket.on("group-call-ended", (roomId) => {
    socket.to(roomId).emit("group-call-ended");
  });

  socket.on("disconnecting", () => {
    for (const roomId in groupRooms) {
      const index = groupRooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        groupRooms[roomId].splice(index, 1);
        socket.to(roomId).emit("group-user-left", socket.id);
      }
    }
  });
};
