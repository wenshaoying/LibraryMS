var express = require('express');
var router = express.Router();//调用路由

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;//接口暴露
