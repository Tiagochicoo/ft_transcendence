const chatMessageSocketListener = (socket, io) => {
  // Listen to he 'chat_message' event
  socket.on('chat_message', data => {
    // console.log(`chat_message_${data.chat_room.user1.id}`);
    io.emit(`chat_message_${data.chat_room.user1.id}`, data);
    // console.log(`chat_message_${data.chat_room.user2.id}`);
    io.emit(`chat_message_${data.chat_room.user2.id}`, data);
  });
}

module.exports = chatMessageSocketListener;
