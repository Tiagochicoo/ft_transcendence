const express = require("express");
const http = require("http");
const path = require("path");
const socket = require("socket.io");
const services = require("./server-services/index.js");

const app = express();
const server = http.createServer(app);
const io = socket(server);
const port = process.env.PORT || 3000;

const { socketListeners } = services;

app.get("/*", (req, res) => {
  if (/^.*(?:\.js|\.css|\.png|\.json|\.jpg|\.ico)$/.test(req.url)) {
    res.sendFile(path.resolve(__dirname, req.path.slice(1)));
    return;
  }

  res.sendFile(path.resolve(__dirname, "index.html"));
});

socketListeners(io);

server.listen(port, () => console.log(`Server running at port: ${port}`));
