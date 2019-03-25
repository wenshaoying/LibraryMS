const mongoose = require('mongoose'); //引用mongoose

var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    cateId: mongoose.Schema.ObjectId,
    name: {
        type: String,
        unique: true, //判断数据是否必须（如果存在一条数据）
        required: true, //是否为不可重复
        trim: true,
        default: '',
    },
    password: {

        type: String,
    },
    age: {

        type: Number,

    },
    sex: {
        type: String,


    },
    hobby: String,
    height: Number,
    weight: Number,
    hometown: String,
    address: String,
    brief: String,
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('user', schema, 'user');