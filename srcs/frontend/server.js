const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || 3000;

const ONLINE_USERS = {};

app.get("/*", (req, res) => {
  if (/^.*(?:\.js|\.css|\.png|\.json|\.jpg)$/.test(req.url)) {
    res.sendFile(path.resolve(__dirname, req.path.slice(1)));
    return;
  }

  res.sendFile(path.resolve(__dirname, "index.html"));
});

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

  // Listen to he 'chat_message' event
  socket.on('chat_message', data => {
    console.log(`chat_message_${data.chat_room.user1.id}`);
    io.emit(`chat_message_${data.chat_room.user1.id}`, data);
    console.log(`chat_message_${data.chat_room.user2.id}`);
    io.emit(`chat_message_${data.chat_room.user2.id}`, data);
  });

  // Listen to the 'friend_add' event
  socket.on('friend_add', (data) => {
    console.log(`friend_add_${data.user2.id}`);
    io.emit(`friend_add_${data.user2.id}`, data);
  });

  // Listen to the 'friend_refuse' event
  socket.on('friend_refuse', (data) => {
    console.log(`friend_refuse_${data.user1.id}`);
    io.emit(`friend_refuse_${data.user1.id}`, data);
  });

  // Listen to the 'friend_accept' event
  socket.on('friend_accept', (data) => {
    console.log(`friend_accept_${data.user1.id}`);
    io.emit(`friend_accept_${data.user1.id}`, data);
  });

  // Listen to the 'friend_cancel' event
  socket.on('friend_cancel', (data) => {
    console.log(`friend_cancel_${data.user2.id}`);
    io.emit(`friend_cancel_${data.user2.id}`, data);
  });
});

server.listen(port, () => console.log(`Server running at port: ${port}`));
