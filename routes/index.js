var express = require('express');
var router = express.Router();
var weixin = require('../modules/weixin.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('list', {
        title: '失物招领平台'
    });
});

router.get('/record', function(req, res, next) {
    res.render('record', {
        title: '失物登记'
    });
});

module.exports = router;
