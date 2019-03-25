var express = require('express');
var router = express.Router();
var dataCtrl = require('../controllers/product.controller'); //引入product的控制器

router.post('/data', dataCtrl.create) //创建

router.put('/data/:id', dataCtrl.update); //修改

router.delete('/data/:id', dataCtrl.remove); //删除

router.post('/list', dataCtrl.list); //查询与分页
router.get('/data/:id', dataCtrl.getData);
router.post('/data/removes', dataCtrl.removes);

// router.post('/a',dataCtrl.aaaa)


module.exports = router;