var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();

var server = http.createServer(app).listen(5001,function (req, res) {    
    console.log("express server listening on port" );
});

//라우팅 설정
app.get('/', function (req, res) {
    fs.readFile('index.html', function (error, data) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
    
    socket.on('join', function (data) {
        socket.join(data.roomname);
        socket.set('room', data.roomname);
        socket.get('room', function (error, room) {
            io.sockets.in(room).emit('join', data.userid);
        });
    });

    socket.on('message', function (message) {
        socket.get('room', function (error, room) {
            io.sockets.in(room).emit('message', message);
        });
       // io.sockets.emit('message', message);
    });
    socket.on('disconnect', function () { });
});