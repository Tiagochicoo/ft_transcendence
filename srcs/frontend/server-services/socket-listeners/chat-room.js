const chatMessageSocketListener = (socket, io) => {
  // Listen to he 'chat_message' event
  socket.on('chat_message', data => {
    io.emit(`chat_message_${data.chat_room.user1.id}`, data);
    io.emit(`chat_message_${data.chat_room.user2.id}`, data);
  });
}

const chatBlockSocketListener = (socket, io) => {
  // Listen to he 'chat_block' event
  socket.on('chat_block', data => {
    io.emit(`chat_block_${data.user1.id}`, data);
    io.emit(`chat_block_${data.user2.id}`, data);
  });
}

const chatUnblockSocketListener = (socket, io) => {
  // Listen to he 'chat_unblock' event
  socket.on('chat_unblock', data => {
    io.emit(`chat_unblock_${data.user1.id}`, data);
    io.emit(`chat_unblock_${data.user2.id}`, data);
  });
}

const chatRoomSocketListener = (socket, io) => {
  chatMessageSocketListener(socket, io);
  chatBlockSocketListener(socket, io);
  chatUnblockSocketListener(socket, io);
}

module.exports = chatRoomSocketListener;
