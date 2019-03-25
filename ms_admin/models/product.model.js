const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
var moment = require('moment'); //引入分页模块
var Schema = new mongoose.Schema({
    cateId: String,
    name: String,
    desc: String,
    retailPrice: Number, //零售价
    purchasePrice: Number, //进价
    unit: String, //单位
    date: String,

});
Schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Products', Schema, 'products');