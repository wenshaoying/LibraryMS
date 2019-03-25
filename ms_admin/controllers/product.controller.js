var mngoose = require('mongoose');
const Products = require('../models/product.model');
var moment = require('moment');

exports.create = function(req, res, next) {
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    const products = new Products(req.body);
    products.date = date;
    products.save().then(data => {
        res.json(data);
    });
};

//


exports.update = function(req, res, next) {
    const id = req.params.id;
    Products.findByIdAndUpdate(id, { $set: req.body }, { new: false }).then(data => {
        res.json(data);
    });
};


exports.remove = function(req, res, next) {
    var id = req.params.id;
    Products.findByIdAndRemove(id, function(err, data) {
        res.json({ message: '删除成功' });
    });
};

exports.removes = function(req, res, next) {
    var ids = req.body.ids;
    ids = ids.split(',')
    Products.remove({ _id: { $in: ids } }).then(() => {
        res.json({ message: '多条删除成功' })
    })
}
exports.getData = function(req, res, next) {
    var id = req.params.id;
    Products.findById(id).then(data => {
        res.json(data);
    })
}
exports.list = function(req, res, next) {
    // res.send(('1'));

    var page = req.body.page ? req.body.page : 1;
    var rows = req.body.rows ? req.body.rows : 5;
    var queryCondition = {};

    if (req.body.name && req.body.name.trim().length > 0) {
        name = req.body.name;
        queryCondition = {
            name: new RegExp(name, 'i')
        };
    }
    if (req.body.cateId && req.body.cateId.trim().length > 0) {
        cateId = req.body.cateId;
        queryCondition = Object.assign(queryCondition, {
            cateId: cateId
        });
    }
    //console.log(queryCondition)
    Products.paginate(queryCondition, { page: +page, limit: +rows }, function(err, result) {
        //console.log(err);


        result.rows = result.docs;
        delete result.docs;
        //console.log(result)
        res.json(result);
    });
}