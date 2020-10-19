var mongoose  = require('mongoose');
var bcrypt = require('bcryptjs');

// schema // 1
var userSchema = mongoose.Schema({
    //[ ... ] 첫번째 값은 true false 값 두번째는 에러메세지이다
  username:{
    type:String,
    required:[true,'Username is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    trim:true,//문자열 앞뒤에 빈칸이 있는 경우 빈칸을 제거해 주는 옵션
    unique:true
  },
    //selet:false로 설정하면 DB에서 헤당 모델을 읽어 올때 해당 항목 값을 읽어오지 않는다
  password:{
    type:String, 
    required:[true,'Password is required!'], 
    select:false
  },
  name:{
    type:String, 
    required:[true,'Name is required!'],
    match:[/^.{4,12}$/,'Should be 4-12 characters!'],
    trim:true
  },
  email:{
    type:String,
    match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Should be a vaild email address!'],
    trim:true
  }
},{
  toObject:{virtuals:true}
});

// virtuals
//DB에 저장되는 값 이외의 항목이 필요할 때 virtual 항목을 만든다
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; });

// password validation 
// Password를 DB에 생성, 수정하기 전에 값이 유효 한지 확인을 하는 코드
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';//에러메세지가 반복
userSchema.path('password').validate(function(v) {
  var user = this; //함수 속에서 this는 user model이다

  // create user
  //회원가입의 경우 password confirmation 값이 업는 경우 와 password값이 password confirmation 값과 다른 경우에 유효하지 않음 처리를 하게 된다
  //회원가입인지 회원 수정인지 판단
  if(user.isNew){
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }

    if(!passwordRegex.test(user.password)){
      user.invalidate('password', passwordRegexErrorMessage);
    }
    else if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }

  // update user 
  //회원 정보 수정의 경우 curren password값이 없는 경우와, curren password 값이 original password 값과 다른 경우
  //new password 값과 password confirmation 값이 다른 경우 invalidate 한다
  
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword && !passwordRegex.test(user.newPassword)){
      user.invalidate("newPassword", passwordRegexErrorMessage);
    }
    else if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

// hash password
// event가 일어나기 전 함수를 먼저 실행
  userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')){// 해당 값이 DB에 기록된 값과 비교해서 변경된 경우 true를, 그렇지 않은 경우 false를 반환
      return next();
    }
    else{
      user.password = bcrypt.hashSync(user.password);// user를 생성하거나 user수정시 user.password의 변경이 있는 경우에는 bcrypt.hashSync함수로 password를 hash값으로 바꾼다
      return next();
    }
  });

//model method
// usermodel의 password hash와 입력받은 password text를 비교하는 method를 추가합니다.
userSchema.methods.authenticate = function(password){
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
var User = mongoose.model('user',userSchema);
module.exports = User;