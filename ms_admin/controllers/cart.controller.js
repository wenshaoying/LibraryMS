var mongoose = require('mongoose');
const Cart = require('../models/cart.model');

// 新增
exports.create = function(req,res,next){
    const cart = new Cart(req.body);
    cart.save().then((data) =>{
      res.json(data);
    });
}

exports.update = function(req,res,next){
    const id = req.params.id;
    Cart.findByIdAndUpdate(id,{$set: req.body},{new:false})
    .then(data=>{
        res.json(data); // 这里返回的数据是修改之前的数据，不是修改之后的数据
    })
}

exports.remove = function(req,res,next){
    const id = req.params.id;
    Cart.findByIdAndDelete(id,(err,data)=>{
        res.json(data);
    })
}

exports.list = function(req,res,next){
    var page = req.body.page ? req.body.page : 1;
    var rows = req.body.rows ? req.body.rows :5;

    var queryCondition = {};  //查询条件
    if(req.body.name && req.body.name.trim().length>0){
        name           = req.body.name;
        queryCondition = {
            name: new RegExp(name,'i')
        }
    }

    Cart.paginate(queryCondition, { page: +page, limit: +rows }, function(err, result) {
        result.rows = result.docs;
        delete result.docs;
        res.json(result);
      });

}

exports.getData = function(req,res,next){
    var id = req.params.id;
    Cart.findById(id).then(data=>{
        res.json(data);
    })

}

exports.removes=function(req,res,next){
    var ids = req.body.ids.split(',');
if(ids.length>0){
    Cart.remove({_id:{$in:ids}}).then(data=>{
        res.json({'message':'delete ok',status:200})
    })
}
}