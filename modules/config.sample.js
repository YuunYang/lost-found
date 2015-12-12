var config = {
    mysql: {
        host: '127.0.0.1',
        port: '3306',
        username: 'root',
        password: '',
        database: 'lost_and_found'
    },
    memcached: {
        host: '127.0.0.1',
        port: '11211'
    },
    weixin: {
        debug: true,
        appId: '',
        appSecret: ''
    }
};

module.exports = config;
