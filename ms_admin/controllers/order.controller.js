var mongoose = require('mongoose'); //引用mongoose
const Order = require('../models/order.model');
const moment = require('moment');
//新增
exports.create = function(req, res, next) {
    //将时间戳转换为日期
    var date = moment().format("YYYY-MM-DD HH:mm").toString().slice(0, 16);
    //订单号生成
    var oId = 'userid' + (new Date()).getTime();
    req.body.orderId = oId;
    req.body.creatTime = date;
    const order = new Order(req.body); //获取 资源
    order.save().then((data) => {
        res.json(data); //转换data格式
    });
}

exports.update = function(req, res, next) { //修改数据
        const id = req.params.id;
        Order.findByIdAndUpdate(id, { $set: req.body }, { new: false })
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
    Order.findByIdAndDelete(id, (err, data) => {
        res.json(data); //修改data格式
    })
}
exports.removes = function(req, res, next) {
    const ids = req.body.ids.split(',');
    if (ids.length > 0) {
        Order.remove({ _id: { $in: ids } }).then(data => {
            res.json({ message: 'delete ok', status: 200 });
        });
    }
};


exports.list = function(req, res, next) { //分页操作
        var page = req.body.page ? req.body.page : 1; //显示内容的页数
        var rows = req.body.rows ? req.body.rows : 5; //每页限制显示的内容
        var queryCondition = {}; //查询条件
        if (req.body.name && req.body.name.trim().length > 0) { //获取名字
            name = req.body.name; //将获取的名字赋给name
            var str = '(.*)' + name + '(.*)';
            // console.log(str);
            queryCondition = {
                "orderId": new RegExp(str)
            }
        } else {
            //显示全部数据
            name = req.body.name;
            queryCondition = {
                "orderId": new RegExp(name, 'i')
            }
        }

        if (req.body.cateId && req.body.cateId.trim().length > 0) {
            cateId = req.body.cateId;
            queryCondition = Object.assign(queryCondition, {
                cateId: cateId
            });
        }
        Order.paginate(queryCondition, { page: +page, limit: +rows }, function(err, result) {
            result.rows = result.docs;
            delete result.docs;
            res.json(result);
        });

    }
    //获取数据

exports.getData = function(req, res, next) {
    var id = req.params.id;
    Order.findById(id).then(data => {
        res.json(data);
    })
}