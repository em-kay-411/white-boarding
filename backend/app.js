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

const rooms = {};

io.on('connection', (socket) => {
    console.log(`User connected`);

    socket.on('joinRoom', (roomID) => {
        if (rooms[roomID]) {
            rooms[roomID].users.push(socket.id);
            socket.emit('displayRoomID', roomID);
            socket.join(roomID);
            console.log(rooms);
        } else {
            socket.emit('displayRoomID', 'No Such Room Found');
        }
    })

    socket.on('createRoom', (roomID) => {
        if (!rooms[roomID]) {
            socket.join(roomID);
            rooms[roomID] = {creator : socket.id, users : [socket.id]};
            socket.emit('displayRoomID', roomID);
        } else {
            socket.emit('displayRoomID', 'Room Already Exists');
        }
    });

    socket.on('getHistory', (roomID) => {
        if(rooms[roomID]){
            socket.to(rooms[roomID].creator).emit('sendHistory', (socket.id));
        }
    })

    socket.on('receiveHistory', (data) => {
        socket.to(data.socketID).emit('receiveHistory', data);
    })

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
        for (const room in rooms) {
            if(rooms[room].creator === socket.id){
                delete rooms[room];
            }
            else{
                const index = rooms[room].users.indexOf(socket.id);
                if(index !== -1){
                    rooms[room].users.splice(index, 1);
                }
            }
        }
        socket.to(socket.id).emit('saveRecording');
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})