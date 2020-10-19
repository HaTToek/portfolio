// models/Post.js
var mongoose = require('mongoose');

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true,'Body is required!']},
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user',required:true},
  attachment:{type:mongoose.Schema.Types.ObjectId, ref:'file'},
  period:{type:String, required:[true, 'period is required!']}
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;