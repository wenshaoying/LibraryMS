const mongoose = require('mongoose'); //引用mongoose

var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    cateId: mongoose.Schema.ObjectId,

    answer:{
        type:String
    },

   question:{
       type:String
   },
   date:{
       type:String
   }


});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('help', schema, 'helps');