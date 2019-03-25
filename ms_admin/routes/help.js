var express = require('express');//引用express

var router = express.Router();//调用路由
const dataCtrl = require('../controllers/help.controller')

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/data', dataCtrl.create);
router.put('/data/:id', dataCtrl.update);
router.delete('/data/:id', dataCtrl.remove);
//router.search('/data/:id', dataCtrl.search);
router.post('/data/removes', dataCtrl.removes);
router.get('/data/:id', dataCtrl.getData);
router.post('/list', dataCtrl.list);

module.exports = router;
