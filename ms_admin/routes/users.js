var express = require('express'); //引用express

var router = express.Router(); //调用路由
const dataCtrl = require('../controllers/user.controller')
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

router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.post('/data', dataCtrl.create);
router.put('/data/:id', dataCtrl.update);
router.delete('/data/:id', dataCtrl.remove);
// router.search('/data/:id', dataCtrl.search);
router.post('/data/removes', dataCtrl.removes);
router.get('/data/:id', dataCtrl.getData);

router.post('/list',verifyToken,dataCtrl.list);
router.post('/login',dataCtrl.login);
module.exports = router;