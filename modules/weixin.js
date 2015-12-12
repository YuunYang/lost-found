var http = require("http");
var https = require("https");
var async = require("async");
var Memcached = require('memcached');
var config = require('./config.js')
var sign = require('./sign.js');

var memcached = new Memcached(config.memcached.host + ":" + config.memcached.port);

var requestAccessToken = function(cb) {
    memcached.get('access_token', function(err, data) {
        if (err) {
            return cb(err, null);
        }
        if (data != undefined) {
            cb(null, data);
        } else {
            var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WeChat.appid + "&secret=" + WeChat.secret;
            https.get(url, function(res) {
                res.on("data", function(data) {
                    result = JSON.parse(data);
                    if (result.access_token != undefined) {
                        memcached.set('access_token', result.access_token, 7000, function(err) {
                            if (err) return console.log(err);
                        });
                        cb(null, result);
                    } else {
                        cb("err info:" + JSON.stringify(result), null);
                    }
                });
            }).on('error', function(e) {
                cb("Got error while get getticket: " + e.message, null);
            });
        }
    });
};


var requestJsTicket = function(cb) {
    memcached.get('js_ticket', function(err, data) {
        if (err) {
            return cb(err, null);
        }
        if (data != undefined) {
            cb(null, data);
        } else {
            memcached.get('access_token', function(err, data) {
                if (err) {
                    return cb(err, null);
                }
                var url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + data + "&type=jsapi";
                https.get(url, function(res) {
                    res.setEncoding('utf8');
                    res.on("data", function(data) {
                        result = JSON.parse(data);
                        if (result.ticket) {
                            memcached.set('js_ticket', result.ticket, 7000, function(err) {
                                if (err) return console.log(err);
                            });
                            cb(null, result.ticket);
                        } else {
                            cb("err info:" + JSON.stringify(result), null);
                        }

                    });
                }).on('error', function(e) {
                    cb("Got error while get getticket: " + e.message, null)
                });
            });
        }
    });
}


var getSignature = function(url, cb) {
    if (WeChat.js_ticket && WeChat.js_ticket_expired > (new Date()).getTime()) {
        var signValue = sign(WeChat.js_ticket, url)
        cb(null, signValue);
    } else {
        async.waterfall([
            function(callback) {
                requestAccessToken(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            },
            function(callback) {
                requestJsTicket(function(err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            },
            function(callback) {
                var signValue = sign(WeChat.js_ticket, url);
                cb(null, signValue);
            }
        ], function(err, result) {
            if (err) {
                cb(err, null);
            } else {
                cb(result);
            }
        });
    }
}

var init = function(appid, secret) {
    WeChat.appid = appid;
    WeChat.secret = secret;
}

var WeChat = {
    appid: config.weixin.appId,
    secret: config.weixin.appSecret,
    init: init,
    requestAccessToken: requestAccessToken,
    requestJsTicket: requestJsTicket,
    getSignature: getSignature

}

module.exports = WeChat;
