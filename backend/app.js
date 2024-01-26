const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIO(server, {
    cors: {
        origin : '*'
    }
});

const rooms = [];

io.on('connection', (socket) => {
    console.log(`User connected`);

    socket.on('joinRoom', (roomID) => {
        const room = rooms.find((r) => r === roomID);

        if (room !== undefined) {
            socket.join(roomID);
            socket.emit('displayRoomID', roomID);
        } else {
            socket.emit('displayRoomID', 'No Such Room Found');
        }
    })

    socket.on('createRoom', (roomID) => {
        if (!rooms.includes(roomID)) {
            socket.join(roomID);
            rooms.push(roomID);
            socket.emit('displayRoomID', roomID);
        } else {
            socket.emit('displayRoomID', 'Room Already Exists');
        }
    });

    socket.on('drawLine', (data) => {
        socket.to(data.roomID).emit('drawLine', (data));
    })

    socket.on('drawRectangle', (data) => {
        socket.to(data.roomID).emit('drawRectangle', (data));
    })

    socket.on('drawCircle', (data) => {
        socket.to(data.roomID).emit('drawCircle', (data));
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})