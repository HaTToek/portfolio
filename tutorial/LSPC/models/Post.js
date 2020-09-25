var mongoose = require('mongoose');
var Counter = require('./Counter'); //Counter 모델을 사용하기 위해 require한다

// schema
var postSchema = mongoose.Schema({
  title:{type:String, required:[true,'Title is required!']},
  body:{type:String, required:[true,'Body is required!']},
  // ref:'user'를 통해 이 항목의 데이터가 user collection의 id와 연결됨을 mongoose에 알림
  author:{type:mongoose.Schema.Types.ObjectId, ref:'user',required:true},
  views:{type:Number, default:0}, // 조회수를 위한 view항목을 추가 
  numId:{type:Number}, // 글번호를 위한 numId항목을 추가
  createdAt:{type:Date, default:Date.now}, 
  updatedAt:{type:Date},
});

postSchema.pre('save', async function(next){ //Schema.pre함수는 첫번째 파라밈터로 설정된 event가 일어나기 전에 먼저 callvack 함수를 실행시킨다
  var post = this;
  if(post.isNew){
    counter = await Counter.findOne({name:'posts'}).exec();
    if(!counter) counter = await Counter.create({name:'posts'});
    counter.count++;
    counter.save();
    post.numId = counter.count;
  }
  return next();
})

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;