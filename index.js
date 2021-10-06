const express = require("express");
const app = express();
const http = require("http");
const { nextTick } = require("process");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
let userConected = [];
let messages = [];

var path = require('path');

app.use(express.static(path.join(__dirname, '/')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  userConected.push(socket.id);
  socket.on("sendMessage", (message) => {
    messages.push(message);
    io.emit("retrieveMessage", messages[messages.length-1]);
  });
  socket.on("disconnect", () => {
    userConected.splice(userConected.indexOf(socket.id), 1);
    io.emit("usersConected", userConected.length);
  });

  io.emit("usersConected", userConected.length);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
