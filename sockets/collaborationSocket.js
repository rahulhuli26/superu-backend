const { updatePageContent } = require('../models/pageModel');
exports.setupSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      socket.join(room);
    });
    socket.on('contentChange', ({ room, content }) => {
      socket.to(room).emit('contentUpdate', content);
      updatePageContent(room, JSON.stringify(content), () => {});
    });
  });
};