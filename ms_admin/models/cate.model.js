const mongoose = require('mongoose');
var materializedPlugin = require('mongoose-materialized');
var Cate               = new mongoose.Schema({
    type : Number,
    title: String
});
Cate.plugin(materializedPlugin);
module.exports = mongoose.model('Cate',Cate);