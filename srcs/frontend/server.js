const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || 3000;

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

  socket.on('disconnect', () => {
    console.log(`User-${user_id} disconnected`);
  });

  // User join all his chatrooms
  const chat_rooms = JSON.parse(socket.handshake.headers['x-chat-rooms'] || '[]');
  chat_rooms.forEach(chat_room_id => {
    console.log(`User-${user_id} joined the room: chat-room-${chat_room_id}`);
    socket.join(`chat-room-${chat_room_id}`);
  });

  // Listen to he 'chat_message' event
  socket.on('chat_message', (chat_room_id, message) => {
    console.log(`Message to the chat-room-${chat_room_id}: ${message}`);
    io.to(`chat-room-${chat_room_id}`).emit('chat_message', chat_room_id, user_id, message);
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
