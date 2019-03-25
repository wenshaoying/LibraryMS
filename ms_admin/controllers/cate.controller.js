var mongoose = require('mongoose');
const Cate = require('../models/cate.model');
var   jwt  = require('jsonwebtoken');

// 新增
exports.create = function(req, res, next) {
    jwt.verify(req.token,'secret',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            const cate = new Cate(req.body);
            cate.save().then((data) => {
                res.json(data);
            });
        }
    })
}

exports.update = function(req, res, next) {
    jwt.verify(req.token,'secret',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            const id = req.params.id;
            Cate.findByIdAndUpdate(id, { $set: req.body }, { new: false })
                .then(data => {
                    res.json(data); // 这里返回的数据是修改之前的数据，不是修改之后的数据
            })
        }
    })
}
    //删除单个
exports.remove = function(req, res, next) {
    jwt.verify(req.token,'secret',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            const id = req.params.id;
            Cate.findByIdAndDelete(id, (err, data) => {
                res.json(data);
            })
        }
    })
}

//删除多个
exports.removes = function(req, res, next) {
    jwt.verify(req.token,'secret',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            const ids = req.body.ids.split(',');


            if (ids.length > 0) {
                console.log(ids);
                Cate.remove({ _id: { $in: ids } }).then(() => {
                    res.json({ 'message': '删除成功' });
                });
            }
        }
    })
};

function reverseTree(data, pid) {
    
            var result = [];
            var temp;
            var data = JSON.parse(JSON.stringify(data));
            for (var i in data) {
                if (data[i].parentId == pid) {
                    result.push(data[i]);
                    temp = reverseTree(data, data[i]._id);
                    if (temp.length > 0) {
                        data[i].children = temp;
                    }
                }
            }
            return result;

}
exports.list = function(req, res, next) {
    console.log(121324);
    jwt.verify(req.token,'secret',(err,authData)=>{
        
        if(err){
            res.sendStatus(403);
        }else{
            var type = req.params.type || 1;
            Cate.find({ type: type }).then(data => {
                // console.log(data);
                var rpTree = reverseTree(data, null);
                res.json(rpTree);
            })
        }
    })

}

exports.getData = function(req, res, next) {
    jwt.verify(req.token,'secret',(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else{
            var id = req.params.id;
            Cate.findById(id).then(data => {
                res.json(data);
            })
        }
    })

}

exports.login=function(req,res,next){
    const user={
        id  : 1,
        name: 'cms',
   
        password: '123456'
    };
    jwt.sign({user},'secret',(err,token)=>{
       res.json({token});
    });
};