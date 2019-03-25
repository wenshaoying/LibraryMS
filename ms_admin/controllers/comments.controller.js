var mongoose = require('mongoose');
const Comments = require('../models/comments.model');
const moment = require('moment');

// 新增
exports.create = function(req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    const comments = new Comments(req.body);
    comments.date = date;
    comments.save().then((data) => {
        res.json(data);
    });
}



exports.update = function(req, res, next) {
    const id = req.params.id;
    Comments.findByIdAndUpdate(id, { $set: req.body }, { new: false })
        .then(data => {
            res.json(data); // 这里返回的数据是修改之前的数据，不是修改之后的数据
        })
}

exports.remove = function(req, res, next) {
    const id = req.params.id;
    Comments.findByIdAndDelete(id, (err, data) => {
        res.json(data);
    })
}

exports.list = function(req, res, next) {
    var page = req.body.page ? req.body.page : 1;
    var rows = req.body.rows ? req.body.rows : 5;

    var queryCondition = {}; //查询条件
    if (req.body.title && req.body.title.trim().length > 0) {
        title = req.body.title;
        queryCondition = {
            title: new RegExp(title, 'i')
        }
    }

    if (req.body.cateId && req.body.cateId.trim().length > 0) {
        cateId = req.body.cateId;
        queryCondition = Object.assign(queryCondition, {
            cateId: cateId
        });
    }

    if (req.body.userId && req.body.userId.trim().length > 0) {
        userId = req.body.userId;
        queryCondition = Object.assign(queryCondition, {
            userId: userId
        });
    }

    if (req.body.newsId && req.body.newsId.trim().length > 0) {
        newsId = req.body.newsId;
        queryCondition = Object.assign(queryCondition, {
            newsId: newsId
        });
    }



    Comments.paginate(queryCondition, { page: +page, limit: +rows }, function(err, result) {
        result.rows = result.docs;
        delete result.docs;
        res.json(result);
    });

}

exports.getData = function(req, res, next) {
    var id = req.params.id;
    Comments.findById(id).then(data => {
        res.json(data);
    })

}

exports.removes = function(req, res, next) {
    var ids = req.body.ids.split(',');
    if (ids.length > 0) {
        Comments.remove({ _id: { $in: ids } }).then(data => {
            res.json({ 'message': 'delete ok', status: 200 })
        })
    }
}