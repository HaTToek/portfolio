var express     =   require('express');
var router      =   express.Router();
var passport    =   require('../config/passport');
var Post        =   require('../models/Post');
var File = require('../models/File');

// Home 
router.get('/', async function(req, res){
    let posts = await Post.find({})
          .sort('-createAt')
          .populate('attachment')
    res.render('main/home', { posts });
});

// Login
// login view
router.get('/login', function (req,res) {
    var username = req.flash('username')[0];
    var errors = req.flash('errors')[0] || {};
    res.render('manager/login', {
      username:username,
      errors:errors
    });
});
  
  // Post Login // 3
router.post('/login',
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.username){
      isValid = false;
      errors.username = 'Username is required!';
    }
    if(!req.body.password){
      isValid = false;
      errors.password = 'Password is required!';
    }

    if(isValid){
      next();
    }
    else {
      req.flash('errors',errors);
      res.redirect('/login');
    }
  },
  passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login'
  }
));

  // Logout // 4
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  

module.exports  =   router;