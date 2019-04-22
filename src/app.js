const express = require('express');
const http = require('http');
const SocketServer = require('socket.io');
const config = require('./config');
const Server = require('./Server');
const logger = require('./logger');

const port = process.env.PORT || 8000;
const inactivityTime = process.env.INACTIVITY_TIME || config.inactivityTime;

const httpServer = http.createServer(express()); 
const io = new SocketServer(httpServer);

const chatServer = new Server(io, { inactivityTime });

httpServer.on('error', onError);
httpServer.on('listening', onListening);
httpServer.listen(port);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = httpServer.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    logger.info('server listening on %s', bind);
}

process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received');
    chatServer.shutDown();
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received.');
    chatServer.shutDown();
    process.exit(0);
});