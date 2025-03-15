const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("join", (username) => {
    socket.username = username;
    console.log(`${username} joined`);
  });

  socket.on("chatMessage", ({ username, message, timestamp }) => {
    io.emit("message", { username, message, timestamp });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
