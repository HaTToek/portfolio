var mongoose = require('mongoose');

// Schema
var commentSchema = mongoose.Schema({
    post:{type:mongoose.Schema.Types.ObjectId, ref:'post', required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'user', require:true},
    parentComment:{type:mongoose.Schema.Types.ObjectId, ref:'comment'},// 대댓글 기능
    text:{type:String, required:[true, 'text is required!']},
    isDeleted:{type:Boolean},// 댓글이 삭제 되어 대댓글이 표시는 되지 않지만 DB에는 저장
    createdAt:{type:Date, default:Date.now},
    updateAt:{type:Date},
},{
    toObjeck:{virtuals:true}
});

// 자식 댓글들의 정보를 가지는 가상항목 
commentSchema.virtual('childComments')
   .get(function(){ return this._childComments; })
   .set(function(value){ this._childComments=value; });

// model & export
var Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;