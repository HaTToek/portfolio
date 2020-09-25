var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var userSchema = mongoose.Schema({
    username:{
        type:String,
        required:[true, "사용자의 이름이 입력되지 않았습니다"],
        match:[/^.{3,12}$/, '3~12글자를 입력해주세요'],
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:[true, '비밀번호가 입력되지 않았습니다'],
        select:false
    },
    name:{
        type:String,
        required:[true,'이름이 입력되지 않았습니다'],
        match:[/^.{2,12}$/, '2~12글자를 입력해주세요'],
        trim:true
    },
    email:{
        type:String,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'유효한 이메일주소를 입력해주세요'],
        trim:true
    }
},{
    toObject:{virtuals:true}
});

// virtuals
userSchema.virtual('originalPassword')
    .get(function(){ return this._originalPassword; })
    .set(function(value){ this._originalPassword });
    
userSchema.virtual('currentPassword')
    .get(function(){ return this._currentPassword; })
    .set(function(value){ this._currentPassword });
    
userSchema.virtual('newPassword')
    .get(function(){ return this._newPassword; })
    .set(function(value){ this._newPassword });
// password vlidation
var passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
var passwordRegexErrorMessage = '최소 8자리의 알파벳과 숫자 조합이여야 합니다.';
userSchema.path('password').validate(function(v){
    var user = this;

    //create user
    if(user.isNew){
        if(!passwordRegex.test(user.password)){
            user.invalidate('password', passwordRegexErrorMessage);
        }
    }

    // update user
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate('currentPssword', 'Current Password is required!');
        }else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
            user.invalidate('currentPassword', 'Current Password is invlid');
        }
        if(user.newPassword && !passwordRegex.test(user.newPassword)){
            user.invalidate('newPassword', passwordRegexErrorMessage);
        }
    }
});

// hash password
userSchema.pre('save', function(next){
    var user = this;
    if(!user.isModified('password')){
        return next();
    }else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

// model method
userSchema.methods.authenticate = function(password){
    var user = this;
    return bcrypt.compareSync(password, user.password);
};

// model &export
var User = mongoose.model('user', userSchema);
module.exports = User;