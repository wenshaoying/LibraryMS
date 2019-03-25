var mongoose = require('mongoose');//引用mongoose
const Help = require('../models/help.model');
var   moment = require('moment');
//新增
exports.create = function(req,res,next){
     var   date             = moment().format().toString().slice(0, 10);
           req.body.date    = date;
    const help = new Help(req.body);//获取资源
    help.save().then((data) =>{
      res.json(data);//转换data格式
    });
}

exports.update = function(req,res,next){//修改数据
    const id = req.params.id;
    Help.findByIdAndUpdate(id,{$set: req.body},{new:false})
    .then(data=>{
        res.json(data); // 这里返回的数据是修改之前的数据，不是修改之后的数据
    })
}
// exports.search = function(req,res,next){
//     const pk  = req.body.keys;
//     const value = req.body.value;
//     User.find({ pk: value }).pretty().then(data =>{
//         if (err) {
//             res.json({ err });
//           }
//         res.json(data);//修改data格式
//     })
// }
//删除
exports.remove = function(req,res,next){
    const id = req.params.id;
   Help.findByIdAndDelete(id,(err,data)=>{
        res.json(data);//修改data格式
    })
}

exports.removes = function(req, res, next) {

    const ids = req.body.ids.split(',');
    if (ids.length > 0) {
       Help.remove({ _id: { $in: ids } }).then(data => {
        res.json({ message: 'delete ok', status: 200 });
      });
    }
  };

//   exports.search=function(req,res,next){
//       const question=req.params.question;
//       const value = req.body.value;
//       Help.find({ question: value }).pretty().then(data =>{
//         res.json(data);
//       })
//   }

exports.list = function(req,res,next){//分页操作
    var page  = req.body.page ? req.body.page : 1;//显示内容的页数
    var rows = req.body.rows ? req.body.rows :5;//每页限制显示的内容

    var queryCondition = {};  //查询条件

    if(req.body.question && req.body.question.trim().length>0){//获取名字
        question          = req.body.question;//将获取的名字赋给name
        var str='(.*)'+question+'(.*)';

        queryCondition = {
            "question": new RegExp(question,'i')
        }
    }else{
        //显示全部数据
        question=req.body.question;
        queryCondition={
            "question":new RegExp(question,'i')
        }
    }

   Help.paginate(queryCondition, { page: +page, limit: +rows }, function(err, result) {
        result.rows = result.docs;
        delete result.docs;
        res.json(result);

      });

}
//获取数据

exports.getData = function(req,res,next){
    var id = req.params.id;
    Help.findById(id).then(data=>{
        res.json(data);
    })

}