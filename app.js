const express = require('express');
const app = express();  
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./config/passport');

// DB setting
mongoose.set('useNewUrlParser', true);    
mongoose.set('useFindAndModify', false);  
mongoose.set('useCreateIndex', true);     
mongoose.set('useUnifiedTopology', true);
const url = "mongodb://localhost:27017/portfolio";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection; 
db.once('open', function(){
  console.log('DB connected');
});
db.on('error', function(err){
  console.log('DB ERROR : ', err);
});

// Other settings
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
  secret:'MySecret',
  resave:true,
  saveUninitialized:true
})); 

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Router
app.use('/', require('./routes/manager'));
app.use('/posts', require('./routes/posts'));

// Port setting
let port = process.env.PORT || 3000;
app.listen(port, function(){ 
    console.log('server on! http://localhost:'+port);
});