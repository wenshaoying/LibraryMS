const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    cateId: String,
    title: String, //标题
    source: String, //来源
    cate: String, //分类
    author: String, //作者
    date: String, //发布时间
    // publishDate: { type: Date, default: moment().format("YYYY-MM-DD HH-mm") }, //发布时间

    isPublish: Boolean, //是否发布
    isTop: Boolean, //是否置顶
    isHot: Boolean, //是否热搜
    content: String, //内容
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('News', schema, 'news');