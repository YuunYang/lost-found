var express = require('express');
var router = express.Router();
var weixin = require('../modules/weixin.js');
var config = require('../modules/config.js');

router.get('/', function(req, res, next) {
    if(!req.query.referer){
        var referer = req.header('referer');
    }else{
        var referer = req.query.referer;
    }
    weixin.getSignature(referer, function(err, sign){
        if(err){
            console.log(err);
            return res.status(500);
        }
        var js = "\
            wx.config({\
                debug: " + config.weixin.debug + ",\
                appId: '" + config.weixin.appId + "',\
                timestamp: " + sign.timestamp + ",\
                nonceStr: '" + sign.nonceStr + "',\
                signature: '" + sign.signature + "',\
                jsApiList: []\
            });";

        res.send(js);
    });
});

module.exports = router;
