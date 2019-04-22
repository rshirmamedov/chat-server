const User = require('./User');

describe('User', () => {

    it('should set user nickname', () => {
        const user = new User('Johnnie Walker');
        expect(user.nickname).toBe('Johnnie Walker');
    });

    it('should set user last activity time', () => {
        const realDateNow = Date.now.bind(global.Date);
        const mockDateNow = () => 123456789;
        global.Date.now = mockDateNow;

        const user = new User('Johnnie Walker');
        expect(user.lastActivityTime).toBe(123456789);

        global.Date.now = realDateNow;
    });

    it('should update user last activity time', () => {
        const user = new User('Johnnie Walker');

        const realDateNow = Date.now.bind(global.Date);
        const mockDateNow = () => 987654321;
        global.Date.now = mockDateNow;

        user.updateLastActivityTime();
        expect(user.lastActivityTime).toBe(987654321);

        global.Date.now = realDateNow;
    });

});