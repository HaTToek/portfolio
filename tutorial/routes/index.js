const express = require("express");
const router = express.Router();
const User = require("../models/user");
const mongoose = require("mongoose");
const crypto = require("crypto");
const passport = require('passport');
var flash = require('connect-flash');
const user = require("../models/user");
const LocalStrategy = require('passport-local').Strategy;

router.get('/', (req, res) => res.render('index',{name: req.flash('name')}));
router.get("/login", (req, res) => res.render("login", {message: req.flash('login_message')}));
router.get("/signup", (req, res) => res.render("signup", {page: "signup"}));
router.get('/home',(req,res) => res.render("home",{name: req.flash('name')}));
router.post("/signup", async (req, res, next) => { // async
    const { email, password, name } = req.body

    if(!email || !password || !name) return res.status(400).json({ msg: '입력값이 올바르지 않습니다' });
    console.log(req.body);

    let chkUserExist = await User.find({ email }).exec() // await. 이거 수행 끝날때까지 붙잡고 있음    
    if (!chkUserExist) return res.send('<script type="text/javascript">alert("이미 존재하는 이메일입니다."); window.location="/signup"; </script>');
    new User({
        name, email,
        password: crypto.createHash('sha512').update(password).digest('base64')
    }).save()
    .then(result => {
        console.log(result);
        res.redirect("/");
    })
    .catch(err => {
        console.log(err);
    });
});
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField : 'password',
    passReqToCallback : true//request callback 여부
    }, function (req, email, password, done) {
    User.findOne({email: email, password: crypto.createHash('sha512').update(password).digest('base64')}, function(err, user){
        if (err) {
            throw err;
        } else if (!user) {
            return done(null, false, req.flash('login_message','이메일 또는 비밀번호를 확인하세요.')); // 로그인 실패
        } else {
            return done(null, user,req.flash("name",user.name)); // 로그인 성공
        }
    });
    })
);

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 '/login'으로 이동
function (req, res) {
    res.redirect('/home');
    //로그인 성공 시 '/'으로 이동
});

//로그인에 성공할 시 serializeUser 메서드를 통해서 사용자 정보를 세션에 저장
passport.serializeUser(function (user, done) {
    console.log(user.name);
    done(null, user);
});

//사용자 인증 후 요청이 있을 때마다 호출
passport.deserializeUser(function (user, done) {
    done(null, user);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/'); //로그아웃 후 '/'로 이동
});


module.exports = router;