const matchRefuseSocketListener = (socket, io) => {
  // Listen to the 'match_refuse' event
  socket.on('match_refuse', (data) => {
    // console.log(`match_refuse_${data.user1.id}`);
    io.emit(`match_refuse_${data.user1.id}`, data);
  });
}

const matchAcceptSocketListener = (socket, io) => {
  // Listen to the 'match_accept' event
  socket.on('match_accept', (data) => {
    // console.log(`match_accept_${data.user1.id}`);
    io.emit(`match_accept_${data.user1.id}`, data);
  });
}

const matchCancelSocketListener = (socket, io) => {
  // Listen to the 'match_cancel' event
  socket.on('match_cancel', (data) => {
    // console.log(`match_cancel_${data.user2.id}`);
    io.emit(`match_cancel_${data.user2.id}`, data);
  });
}

const matchRequests = (socket, io) => {
  matchRefuseSocketListener(socket, io);
  matchAcceptSocketListener(socket, io);
  matchCancelSocketListener(socket, io);
}

module.exports = matchRequests;
