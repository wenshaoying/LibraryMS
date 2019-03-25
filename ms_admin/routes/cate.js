var express = require('express');
var   router   = express.Router();
const dataCtrl = require('../controllers/cate.controller');

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearer      = bearerHeader.split(' ');
      const bearerToken = bearer[1];
            req.token   = bearerToken;
      next();
    } else {
      res.sendStatus(403); //客户端错误，禁止访问
    }
  }

router.post('/data', verifyToken,dataCtrl.create);
router.get('/data/:id', verifyToken,dataCtrl.getData);
router.put('/data/:id', verifyToken,dataCtrl.update);
router.post('/list/:type', verifyToken,dataCtrl.list);
router.delete('/data/:id', verifyToken,dataCtrl.remove);
router.post('/data/removes', verifyToken,dataCtrl.removes);

module.exports = router;