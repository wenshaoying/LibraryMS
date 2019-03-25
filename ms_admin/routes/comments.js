var express = require('express');
var router = express.Router();
const dataCtrl = require('../controllers/comments.controller');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/data/:id', dataCtrl.getData);
router.post('/data', dataCtrl.create);
router.put('/data/:id', dataCtrl.update);
router.delete('/data/:id', dataCtrl.remove);
router.post('/list', dataCtrl.list);
router.post('/data/removes', dataCtrl.removes);
module.exports = router;