const logger = require('./logger');
const Connections = require('./Connections');
const User = require('./User');

class Server {

    constructor(io, { inactivityTime }) {
        this.io = io;
        this.connections = new Connections();

        this.io.on('connect', socket => {
            this.handleChatJoin(socket);
            this.handleChatMessage(socket);
            this.handleChatLeave(socket);
            this.handleDisconnect(socket);
        });

        this.inactivityIntervalId = setInterval(
            this.handleChatInactivity.bind(this, inactivityTime),
            1000
        );
    }
    
    handleChatInactivity(inactivityTime) {
        for (const [socket, user] of this.connections.getInactiveConnections(inactivityTime)) {
            this.connections.remove(socket);
            socket.emit('chat.kickout', { reason: 'USER_INACTIVITY' });
            this.io.emit("chat.left", {
                nickname: user.nickname,
                reason: 'USER_INACTIVITY',
            });
            logger.info('%s disconnected due to inactivity', user.nickname);
        }
    }

    handleChatJoin(socket) {
        socket.on('chat.join', ({ nickname }) => {
            try {
                this.connections.add(socket, new User(nickname));
                socket.emit('chat.join_success');
                this.io.emit("chat.joined", { nickname });
                logger.info('%s joined', nickname);
            } catch (error) {
                socket.emit('chat.join_error', { error });
                logger.error('%s failed to join due to %s', nickname, error);
            }
        });
    }

    handleChatMessage(socket) {
        socket.on('chat.message', ({ message }) => {
            const user = this.connections.getUser(socket);

            if (user) {
                this.io.emit("chat.message", { nickname: user.nickname, message });
                user.updateLastActivityTime();
                logger.info('%s sent message "%s"', user.nickname, message);
            }
        });
    }

    handleChatLeave(socket) {
        socket.on('chat.leave', () => {
            const user = this.connections.getUser(socket);

            if (user) {
                this.connections.remove(socket);
                this.io.emit("chat.left", { nickname: user.nickname });
                logger.info('%s left', user.nickname);
            }
        });
    }

    handleDisconnect(socket) {
        socket.on('disconnect', () => {
            const user = this.connections.getUser(socket);
    
            if (user) {
                this.connections.remove(socket);
                this.io.emit("chat.left", {
                    nickname: user.nickname,
                    reason: 'CONNECTION_LOST',
                });
                logger.info('%s left, connection lost', user.nickname);
            }
        });

    }

    shutDown() {
        if (this.inactivityIntervalId) {
            clearInterval(this.inactivityIntervalId);
        }

        this.io.emit("chat.kickout", { reason: 'SERVER_SHUTDOWN' });
        this.io.close();
        this.connections.clear();
        logger.info('server shutdown');
    }

}

module.exports = Server;
