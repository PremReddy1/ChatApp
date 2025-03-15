const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for user joining with a name
    socket.on('set username', (username) => {
        socket.username = username;
        console.log(`${username} joined the chat`);
        io.emit('user joined', `${username} joined the chat`);
    });

    // Listen for messages from clients
    socket.on('chat message', (msg) => {
        const timestamp = new Date().toLocaleTimeString();
        const messageData = {
            username: socket.username || 'Anonymous',
            message: msg,
            time: timestamp
        };
        io.emit('chat message', messageData);
    });

    socket.on('disconnect', () => {
        if (socket.username) {
            io.emit('user left', `${socket.username} left the chat`);
        }
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
