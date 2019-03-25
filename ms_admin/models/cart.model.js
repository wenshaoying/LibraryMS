const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema           = new mongoose.Schema( { 
    name  : String,
    cart  : String,
    title : String,
    number: Number,
    price : Number,
    email : String,
    date  : String
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Cart',schema,'cart');