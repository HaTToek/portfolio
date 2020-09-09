const express = require('express');
const app = express();
const PORT= process.env.PORT || 3000;
const bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Session = require('express-session');
const flash = require('connect-flash');
var MongoDBStore = require('connect-mongodb-session')(Session);

app.use(bodyParser.urlencoded({extended: true}));
// routes
const indexRoute      = require("./routes/index");

// 뷰엔진 설정
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

// Mongoose & Passport
app.use(flash());
app.use(Session({
    secret:'dalhav', //세션 암호화 key
    resave:false,//세션 재저장 여부
    saveUninitialized:true,
    rolling:true,//로그인 상태에서 페이지 이동 시마다 세션값 변경 여부
    cookie:{maxAge:1000*60*60},//유효시간
    store: store
}));

app.use(passport.initialize());
app.use(passport.session());

const mongoose = require('mongoose');
// DB연결
let url =  "mongodb://localhost:27017/dalhav";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});


// use routes
app.use("/", indexRoute);

//listen
app.listen(PORT, function () {
    console.log('Example app listening on port',PORT);
});


//세션
var store = new MongoDBStore({//세션을 저장할 공간
    url: 'url',//db url
    collection: 'sessions'//콜렉션 이름
});

store.on('error', function(error) {//에러처리
    console.log(error);
});
