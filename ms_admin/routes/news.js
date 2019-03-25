var express = require('express');
var router = express.Router();
const dataCtrl = require('../controllers/news.controller')

router.post('/data', dataCtrl.create);
router.put('/data/:id', dataCtrl.update);
router.delete('/data/:id', dataCtrl.remove);
router.post('/data/removes', dataCtrl.removes);
router.get('/data/:id', dataCtrl.getData);
router.post('/list', dataCtrl.list);

module.exports = router;