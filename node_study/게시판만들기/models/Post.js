// models/Post.js

var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({ // 1
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true,'Body is required!']},
  // ref:'user'를 통해 이 항목의 데이터가 user collection의 id와 연결됨을 mongoose에 알임
  author:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
  createdAt:{type:Date, default:Date.now}, // 2
  updatedAt:{type:Date},
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;