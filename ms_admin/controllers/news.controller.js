var mongoose = require('mongoose');
const News = require('../models/news.model');
const moment = require('moment');
// 新增
exports.create = function(req, res, next) {
    //获取时间戳
    var date = moment().format("YYYY-MM-DD HH:mm").toString().slice(0, 16);
    req.body.date = date;
    const news = new News(req.body);
    // console.log(req.body);
    news.save().then(data => {
        res.json(data);
    });
};
//修改
exports.update = function(req, res, next) {
    const id = req.params.id;
    News.findByIdAndUpdate(id, { $set: req.body }, { new: false }).then(data => {
        res.json(data); // 这里返回的数据是修改之前的数据，不是修改之后的数据
    });
};

//删除单个
exports.remove = function(req, res, next) {
    const id = req.params.id;
    News.findByIdAndDelete(id, (err, data) => {
        res.json(data); //修改data格式
    });
};

//删除多个
exports.removes = function(req, res, next) {
    const ids = req.body.ids.split(',');
    if (ids.length > 0) {
        News.remove({ _id: { $in: ids } }).then(data => {
            res.json({ message: 'delete ok', status: 200 });
        });
    }
};
//获取单个信息
exports.getData = function(req, res, next) {
    var id = req.params.id;
    News.findById(id).then(data => {
        res.json(data);
    });
};
//跳转到评论页面

//分页
exports.list = function(req, res, next) { //分页操作
    var page = req.body.page ? req.body.page : 1; //显示内容的页数
    var rows = req.body.rows ? req.body.rows : 5; //每页限制显示的内容

    var queryCondition = {}; //查询条件

    if (req.body.name && req.body.name.trim().length > 0) {
        name = req.body.name;
        queryCondition = {
            "title": new RegExp(name, 'i')
        };
    }
    if (req.body.cateId && req.body.cateId.trim().length > 0) {
        cateId = req.body.cateId;
        queryCondition = Object.assign(queryCondition, {
            cateId: cateId
        });
    }

    News.paginate(queryCondition, { page: +page, limit: +rows }, function(err, result) {
        result.rows = result.docs;
        delete result.docs;
        res.json(result);
    });
};