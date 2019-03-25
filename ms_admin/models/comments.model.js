const mongoose = require('mongoose');
const moment = require('moment');
var mongoosePaginate = require('mongoose-paginate');
var schema           = new mongoose.Schema( { 
    newsId:mongoose.Schema.ObjectId,   
    title   : String,
    content: String,
    author : String,
    date: String,
    isTop:Number

    
  
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model('Comments',schema,'comments');