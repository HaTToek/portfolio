//여러 곳에서 공통으로 쓰게 될 함수
var util    =   {};

util.parseError =   function(errors){
    var parsed  =   {};
    if(errors.name  ==  'ValidationError'){
        for(var name in errors.errors){
            var ValidationError =   errors.errors[name];
            parsed[name]    =   { message:ValidationError.message};
        }
    }
    else if(errors.code ==  '11000' && errors.errmsg.indexOf('username') > 0){
        parsed.username =   {message:'This username already exists!'};
    }
    else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

// 사용자가 로그인 되었는지 아닌지를 판독하여 로그인이 되지 않을 경우 사용자를 에러 메세지와 함께 로그인 페이지로 보내는 함수
util.isLoggedin =   function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash('errors',{login:'Please login first'});
        res.redirect('/login');
    }
}

util.noPermission   =   function(req,res){
    req.flash('errors',{login:"You don't have permission"});
    req.logout();
    res.redirect('/login');
}

module.exports  =   util;