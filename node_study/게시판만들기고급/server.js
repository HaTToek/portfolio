var express         =   require('express'); // 설치한 express module을 불러와서 변수(express)에 담습니다.
var app             =   express(); //express를 실행하여 app object를 초기화 합니다.
var mongoose        =   require('mongoose');
var bodyParser      =   require('body-parser');
var methodOverride  =   require('method-override');//method-override module을 변수에 담는다
var flash           =   require('connect-flash');
var session         =   require('express-session');
var passport        =   require('./config/passport');
var util            =   require('./util');

// DB setting
mongoose.set('useNewUrlParser', true);    
mongoose.set('useFindAndModify', false);  
mongoose.set('useCreateIndex', true);     
mongoose.set('useUnifiedTopology', true);
const url         =  "mongodb://localhost:27017/node_stu";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection; 
db.once('open', function(){//db가 연결이 된 경우
  console.log('DB connected');
});
db.on('error', function(err){//db 연결 중 에러가 발생한 경우 
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride('_method')); //query로 들어오는 값으로 HTTP method를 바꾼다
app.use(flash());//초기화 한다 req.flash사용 가능
app.use(session({
  secret:'MySecret',
  resave:true,
  saveUninitialized:true
})); 

// Passport
// passport를 초기화 시켜주는 함수 
app.use(passport.initialize());
// passport와 session과 연결해 주는 함수 
app.use(passport.session());

// Custom Middlewares
// passport에서 제공하는 함수로 현재 로그인이 되어있는지 아닌지를 true, flase로 return한다
app.use(function(req, res, next){
  // 로그인이 되어있는지 아닌지 확인
  res.locals.isAuthenticated  =   req.isAuthenticated();
  // 로그인된 user의 정보를 불러온다
  res.locals.currentUser      =   req.user;
  next();
})

// Router
app.use('/',require('./routes/home'));
app.use('/posts', util.getPostQueryString, require('./routes/posts'));
app.use('/users',require('./routes/users'));
app.use('/comments', util.getPostQueryString, require('./routes/comments'));

// Port setting
var port = 3000; // 사용할 포트 번호를 port 변수에 넣습니다. 
app.listen(port, function(){ // port변수를 이용하여 3000번 포트에 node.js 서버를 연결합니다.
  console.log('server on! http://localhost:'+port); //서버가 실행되면 콘솔창에 표시될 메세지입니다.
});