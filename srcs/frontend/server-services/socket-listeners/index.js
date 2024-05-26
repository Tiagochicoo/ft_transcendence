
const chatMessageSocketListener = require("./chat-message.js");
const friendRequests = require("./friend-requests.js");
const matchRequests = require("./match-requests.js");

const ONLINE_USERS = {};

const socketListeners = (io) => {
  io.on('connection', async (socket) => {
    const user_id = socket.handshake.headers['x-user-id'];
    if (!user_id) {
      return;
    }

    console.log(`User-${user_id} connected`);

    // Notify that the User logged in
    if (ONLINE_USERS[user_id]) {
      ONLINE_USERS[user_id]++;
    } else {
      ONLINE_USERS[user_id] = 1;
    }
    io.emit('online_users', Object.keys(ONLINE_USERS).filter(key => ONLINE_USERS[key]));

    socket.on('disconnect', () => {
      console.log(`User-${user_id} disconnected`);

      // Notify that the User logged out
      ONLINE_USERS[user_id]--;
      if (ONLINE_USERS[user_id] <= 0) {
        io.emit('online_users', Object.keys(ONLINE_USERS).filter(key => ONLINE_USERS[key]));
      }
    });

    chatMessageSocketListener(socket, io);
    friendRequests(socket, io);
    matchRequests(socket, io);
  });
}

module.exports = socketListeners;
