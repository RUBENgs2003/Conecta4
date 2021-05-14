const path = require('path');
const express = require('express');
const app = express();
const socketIO = require('socket.io');

// settings 

app.set('port', process.env.PORT || 3000);

// Static files

app.use(express.static(path.join(__dirname, 'public')));

// Start de server

const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

const io = socketIO(server);

client = 1;
turno = true;

// Web sockets
io.on('connection', (socket) => {

    console.log('new connection', socket.id);

    prop = {
        player: client,
        turno: turno
    }
    
    socket.emit('juego:conectado', (prop));

    client++;
    turno = !turno;

    socket.on('juego:movimiento', (data) => {
        console.log('movimiento', data.jugador, data.movimiento)
        io.sockets.emit('juego:movimiento', data)
    });

    socket.on('juego:turno', (data) => {
        io.sockets.emit('juego:turno', data);
    });

    socket.on('juego:chat', (data) => {
        io.sockets.emit('juego:chat', data);
    });

    io.on('disconnect', function() {
        clients--;
    });

    if(client >= 3){
        io.sockets.emit('juego:sincronizado', client);
    }

});


