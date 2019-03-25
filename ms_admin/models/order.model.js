const mongoose = require('mongoose'); //引用mongoose
// const moment = require('moment');

var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    cateId: mongoose.Schema.ObjectId,
    //订单号 用户id+时间戳
    orderId: {
        type: String,
        // unique: true, //判断数据是否必须（如果存在一条数据）
        // required: true, //是否为不可重复
        // trim: true,
    },
    //用户ID
    userId: {
        type: Number
    },
    //收件人
    recipient: {
        type: String
    },
    //物品名称
    goodsName: {
        type: String
    },
    //订单状态
    orderStatus: {
        type: String
    },
    //订单总价
    price: {
        type: Number
    },
    //创建时间
    creatTime: {
        type: String
            // default: moment().format("YYYY-MM-DD HH:mm")
    }
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('order', schema, 'order');