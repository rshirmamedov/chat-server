class User {

    constructor(nickname) {
        this.nickname = nickname;
        this.lastActivityTime = Date.now();
    }

    updateLastActivityTime() {
        this.lastActivityTime = Date.now();
    }

}

module.exports = User;