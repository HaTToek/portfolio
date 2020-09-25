var express = require('express');
var router = express.Router();
var passport = require('../config/passport');

// Home
router.get('/', function(req, res){
    if(req.isAuthenticated()){
        res.render('home/one');
      }else {
        res.redirect('/login');
      }
});
router.get('/mypage', function(req, res){
    if(req.isAuthenticated()){
        res.render('home/two');
      }else {
        res.redirect('/login');
      }
})

// Login
router.get('/login', function(req, res){
    var username = req.flash('username')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('home/login',{ username:username, errors:errors });
});

// Post Login
router.post('/login',function(req, res, next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
        isvalid = false;
        errors.username = '사용자의 이름이 입력되지 않았습니다.';
    }
    if(!req.body.password){
        isValid = false;
        errors.password = '비밀번호가 입력되지 않았습니다.';
    }

    if(isValid){ next(); }
    else {
        req.flash('errors', errors);
        res.redirect('/login');
    }
},
    passport.authenticate('local-login',{
        successRedirect : '/',
        failureRedirect : '/login'
    }
));

// Logout
router.get('/logout', function(req, res) {
    res.logout();
    res.redirect('/');
});

module.exports = router;