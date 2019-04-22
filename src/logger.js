const debug = require('debug');

module.exports = {
    info: debug('chat:info'),
    error: debug('chat:error'),
};