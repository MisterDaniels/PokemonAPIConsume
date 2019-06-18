const express = require('express');
const app = require('express')();
const http = require('http').Server(app);

const io = require('socket.io').listen(http);

const path = require('path');

app.use('/assets', express.static(__dirname + '/../views/assets'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

io.on('connection', function(socket) {
    
    socket.on('music synth', function(tape) {
        
        io.emit('music synth', Buffer.from(data, 'utf-8').toString());
        
    });

})

http.listen(3000, function () {
    console.log('Servidor iniciado!');
});