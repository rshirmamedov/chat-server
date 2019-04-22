const Connections = require('./Connections');
const User = require('./User');

describe('Connections', () => {

    it('should throw if socket used', () => {
        const connections = new Connections();
        connections.add('socket1', new User('user1'));
        connections.add('socket2', new User('user2'));
        expect(() => {
            connections.add('socket1', new User('user3'));
        }).toThrowError('SOCKET_USED');
    });

    it('should throw if nickname taken', () => {
        const connections = new Connections();
        connections.add('socket1', new User('user1'));
        connections.add('socket2', new User('user2'));
        expect(() => {
            connections.add('socket3', new User('user2'));
        }).toThrowError('NICKNAME_TAKEN');
    });

    it('should throw if nickname contains illegal symbols', () => {
        const connections = new Connections();
        expect(() => {
            connections.add('socket1', new User('user$$$$'));
        }).toThrowError('NICKNAME_SYMBOLS');
    });

    it('should throw if nickname length is less than 3 symbols', () => {
        const connections = new Connections();
        expect(() => {
            connections.add('socket1', new User('aa'));
        }).toThrowError('NICKNAME_MIN_LENGTH');
    });

    it('should throw if nickname length is greater than 16 symbols', () => {
        const connections = new Connections();
        expect(() => {
            connections.add('socket1', new User('abcdefghijklmnopq'));
        }).toThrowError('NICKNAME_MAX_LENGTH');
    });

    it('should get user', () => {
        const connections = new Connections();
        const user1 = new User('user1');
        const user2 = new User('user2');

        connections.add('socket1', user1);
        connections.add('socket2', user2);
        expect(connections.getUser('socket1')).toBe(user1);
        expect(connections.getUser('socket2')).toBe(user2);
    });

    it('should remove connection', () => {
        const connections = new Connections();
        connections.add('socket1', new User('user1'));
        connections.remove('socket1');
        expect(connections.getUser('socket1')).toBeUndefined();
    });

    it('should clear connections', () => {
        const connections = new Connections();
        connections.add('socket1', new User('user1'));
        connections.add('socket2', new User('user2'));
        connections.clear();
        expect(connections.getUser('socket1')).toBeUndefined();
        expect(connections.getUser('socket2')).toBeUndefined();
    });

});