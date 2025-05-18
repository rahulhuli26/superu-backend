function setupSocket(io) {
  const fileRooms = {}; // optional tracking

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', ({ fileId }) => {
      socket.join(fileId);
      console.log(`User joined room: ${fileId}`);
    });

    socket.on('content-update', ({ fileId, html }) => {
      socket.to(fileId).emit('content-update', { html });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { setupSocket };
