var mongoose = require('mongoose'); //引用mongoose
const User = require('../models/user.model');
var jwt = require('jsonwebtoken');
//新增
exports.create = function(req, res, next) {
    const user = new User(req.body); //获取资源
    user.save().then((data) => {
        res.json(data); //转换data格式
    });
}

exports.update = function(req, res, next) { //修改数据
        const id = req.params.id;
        User.findByIdAndUpdate(id, { $set: req.body }, { new: false })
            .then(data => {
                res.json(data); // 这里返回的数据是修改之前的数据，不是修改之后的数据
            })
    }
    // exports.search = function(req,res,next){
    //     const pk  = req.body.keys;
    //     const value = req.body.value;
    //     User.find({ pk: value }).pretty().then(data =>{
    //         if (err) {
    //             res.json({ err });
    //           }
    //         res.json(data);//修改data格式
    //     })
    // }
    //删除
exports.remove = function(req, res, next) {
    const id = req.params.id;
    User.findByIdAndDelete(id, (err, data) => {
        res.json(data); //修改data格式
    })
}

exports.removes = function(req, res, next) {
    const ids = req.body.ids.split(',');
    if (ids.length > 0) {
        User.remove({ _id: { $in: ids } }).then(data => {
            res.json({ message: 'delete ok', status: 200 });
        });
    }
};


exports.list = function(req, res, next) {   //分页操作
       jwt.verify(req.token,'secret',(err,authData)=>{
           if(err){
               res.sendStatus(403);
           }else{
            var page = req.body.page ? req.body.page : 1; //显示内容的页数
            var limit = req.body.limit ? req.body.limit : 5; //每页限制显示的内容

            var queryCondition = {}; //查询条件

            // if(req.body.name && req.body.name.trim().length>0){//获取名字
            //     name           = req.body.name;//将获取的名字赋给name
            //     queryCondition = {
            //         "name": new RegExp(name,'i')
            //     }
            // }
            if (req.body.name && req.body.name.trim().length > 0) {
                //根据查询条件搜索记录
                name = req.body.name;
                var str = '(.*)' + name + '(.*)';
                queryCondition = {
                    "name": new RegExp(str, 'g')
                }
            } else {
                //显示全部数据
                name = req.body.name;
                queryCondition = {
                    "name": new RegExp(name, 'i')
                }
            }

            User.paginate(queryCondition, { page: +page, limit: +limit }, function(err, result) {
                result.rows = result.docs;
                delete result.docs;
                res.json(result);
            });

           }
       });


    }
    //获取数据

exports.getData = function(req, res, next) {
    var id = req.params.id;
    User.findById(id).then(data => {
        res.json(data);
    })

}
exports.login=function(req,res,next){
 const user={
     id:1,
     name:'cms',

     password:'123456'
 };
 jwt.sign({user},'secret',(err,token)=>{
    res.json({token});
 });
};
