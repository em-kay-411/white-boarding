const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin : "http://localhost:8000"
    }
});

io.on('connection', (socket) => {
    console.log(`User connected`);

    socket.on('drawLine', (data) => {
        socket.broadcast.emit('drawLine', (data));
    })

    socket.on('drawRectangle', (data) => {
        socket.broadcast.emit('drawRectangle', (data));
    })

    socket.on('drawCircle', (data) => {
        socket.broadcast.emit('drawCircle', (data));
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})