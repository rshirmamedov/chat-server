class Connections {

    constructor() {
        this.connections = new Map();
    }

    getInactiveConnections(inactivityTime) {
        const now = Date.now();
        return [...this.connections.entries()]
            .filter(([socket, user]) => now - user.lastActivityTime >= inactivityTime);
    }

    getUser(socket) {
        return this.connections.get(socket);    
    }

    add(socket, user) {
        this.validate(socket, user);
        this.connections.set(socket, user);
    }

    validate(socket, user) {
        if (this.getUser(socket)) {
            throw 'SOCKET_USED';
        }

        const isNicknameTaken = !![...this.connections.values()]
            .find(({ nickname }) => user.nickname === nickname);
    
        if (isNicknameTaken) {
            throw 'NICKNAME_TAKEN';
        }

        if (!/^[A-Za-z0-9]+$/.test(user.nickname)) {
            throw 'NICKNAME_SYMBOLS';
        }

        if (user.nickname.length < 3) {
            throw 'NICKNAME_MIN_LENGTH';
        }

        if (user.nickname.length > 16) {
            throw 'NICKNAME_MAX_LENGTH';
        }
    }

    remove(socket) {
        this.connections.delete(socket);
    }

    clear() {
        this.connections.clear();
    }

}

module.exports = Connections;
