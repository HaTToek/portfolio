var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy; // 1
var User = require('../models/User');

// serialize & deserialize User
// login시에 DB에서 발견한 user를 어떻게 session에 저장할지를 정하는 부분
// user의 id만 저장한다
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
// user정보를 db에서 새로 읽어 오는데 user가 변경되면 바로 변경된 정보를 반영한다
passport.deserializeUser(function(id, done) {
    User.findOne({_id:id}, function(err, user) {
      done(err, user);
    });
  });

// local strategy
passport.use('local-login',
    new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },
    // 로그인 시에 함수가 호출된다 DB에서 해당 user를 찾는다
    function(req, username, password, done) { 
        User.findOne({username:username})
          .select({password:1})
          .exec(function(err, user) {
            if (err) return done(err);
  
            if (user && user.authenticate(password)){
              return done(null, user);
            }
            else {
              req.flash('username', username);
              req.flash('errors', {login:'The username or password is incorrect.'});
              return done(null, false);
            }
          });
        }
    )
);

module.exports  =   passport;