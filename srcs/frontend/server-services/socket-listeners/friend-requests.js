const friendAddSocketListener = (socket, io) => {
  // Listen to the 'friend_add' event
  socket.on('friend_add', (data) => {
    // console.log(`friend_add_${data.user2.id}`);
    io.emit(`friend_add_${data.user2.id}`, data);
  });
}

const friendRefuseSocketListener = (socket, io) => {
  // Listen to the 'friend_refuse' event
  socket.on('friend_refuse', (data) => {
    // console.log(`friend_refuse_${data.user1.id}`);
    io.emit(`friend_refuse_${data.user1.id}`, data);
  });
}

const friendAcceptSocketListener = (socket, io) => {
  // Listen to the 'friend_accept' event
  socket.on('friend_accept', (data) => {
    // console.log(`friend_accept_${data.user1.id}`);
    io.emit(`friend_accept_${data.user1.id}`, data);
  });
}

const friendCancelSocketListener = (socket, io) => {
  // Listen to the 'friend_cancel' event
  socket.on('friend_cancel', (data) => {
    // console.log(`friend_cancel_${data.user2.id}`);
    io.emit(`friend_cancel_${data.user2.id}`, data);
  });
}

const friendRequests = (socket, io) => {
  friendAddSocketListener(socket, io);
  friendRefuseSocketListener(socket, io);
  friendAcceptSocketListener(socket, io);
  friendCancelSocketListener(socket, io);
}

module.exports = friendRequests;
