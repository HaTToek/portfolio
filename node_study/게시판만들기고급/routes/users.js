var express     = require('express');
var router      = express.Router();
var User        = require('../models/User');
var util        = require('../util');

// // Index
// // sort가 없을 때는 find함수에 인자로 들어 간다
// // sort가 있을때 callback 함수가 exec함수에 인자로 들어간다
// router.get('/', function(req, res){
//   User.find({})
//     .sort({username:1})
//     .exec(function(err, users){
//       if(err) return res.json(err);
//       res.render('users/index', {users:users});
//     });
// });

// New
// user 생성시 에러가 있는 경우 new 페이지에 에러와 기존에 입력했던 값들을 보여주게 되는데
// 이 값들은 create route에서 갱성된 flash로 받아 온다
router.get('/new', function(req, res){
  var user = req.flash('user')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('users/new', { user:user, errors:errors });
});

// create
// user 생성시에 오류가 있다면 user, error flash를 만들고 new페이지로 refirect한다
router.post('/', function(req, res){
  User.create(req.body, function(err, user){
    if(err){
      req.flash('user', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/login');
  });
});

// show
router.get('/:username',util.isLoggedin,checkPermission, function(req, res){
  User.findOne({username:req.params.username}, function(err, user){
    if(err) return res.json(err);
    res.render('users/show', {user:user});
  });
});

// edit
// 처음 접속하는 경우에는 DB에서 값을 찾아 form에 기본 값을 생성하고, update에서 오류가 발생해 돌아는 경우에는 기존에 입력했던 값으로 form에 값들을 생성해야 한다
router.get('/:username/edit',util.isLoggedin,checkPermission, function(req, res){
    var user = req.flash('user')[0];
    var errors = req.flash('errors')[0] || {};
    if(!user){
      User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        res.render('users/edit', { username:req.params.username, user:user, errors:errors });
      });
    }
    else {
      res.render('users/edit', { username:req.params.username, user:user, errors:errors });
    }
  });
  
// update
router.put('/:username',util.isLoggedin,checkPermission, function(req, res, next){
    User.findOne({username:req.params.username})
      .select('password')
      .exec(function(err, user){
        if(err) return res.json(err);
  
        // update user object
        user.originalPassword = user.password;
        user.password = req.body.newPassword? req.body.newPassword : user.password;
        for(var p in req.body){
          user[p] = req.body[p];
        }
  
        // save updated user
        user.save(function(err, user){
          if(err){
            req.flash('user', req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/users/'+req.params.username+'/edit');
          }
          res.redirect('/users/'+user.username);
        });
    });
});
  
// // destroy
// router.delete('/:username', function(req, res){
//   User.deleteOne({username:req.params.username}, function(err){
//     if(err) return res.json(err);
//     res.redirect('/users');
//   });
// });

module.exports = router;

// functions
//mongoose 와 mongoDB에서 나오는 에러의 형태가 다르기 때문에 이 함수를 통해 에러의 형태를 통일 시켜준다.
function parseError(errors){
  var parsed = {};
  if(errors.name == 'ValidationError'){
    for(var name in errors.errors){
      var validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

// private function
function checkPermission(req, res, next){
    User.findOne({username:req.params.username}, function(err, user){
        if(err) return res.json(err);
        if(user.id != req.user.id) return util.noPermission(req.res);

        next();
    });
}



//처음 만든 모듈
// // New
// router.get('/new', function(req, res){
//   res.render('users/new');
// });

// // create
// router.post('/', function(req, res){
//   User.create(req.body, function(err, user){
//     if(err) return res.json(err);
//     res.redirect('/users');
//   });
// });

// // show
// router.get('/:username', function(req, res){
//   User.findOne({username:req.params.username}, function(err, user){
//     if(err) return res.json(err);
//     res.render('users/show', {user:user});
//   });
// });

// // edit
// router.get('/:username/edit', function(req, res){
//   User.findOne({username:req.params.username}, function(err, user){
//     if(err) return res.json(err);
//     res.render('users/edit', {user:user});
//   });
// });

// // update // 2
// router.put('/:username', function(req, res, next){
//     //findOne 함수로 값을 찾은 후에 값을 수정하고 user.save함수로 값을 저장한다
//   User.findOne({username:req.params.username}) // 2-1
//   //select 함수를 이용하면 DB에서 어떤 항목을 선택할지 안할지를 정할 수 있다
//   //기본적으로 읽어오는 항목이 있는데 그걸 안읽게 하려면 항목 이름에 -를 붙히면 된다
//     .select('password') // 2-2
//     .exec(function(err, user){
//       if(err) return res.json(err);

//       // update user object
//       user.originalPassword = user.password;
//       // user의 update(회원 정보 수정)은 password를 업데이트 하는 경우와, password를 업데이트 하지 않는 경우로 나눌 수 있는데 user.password의 값이 바뀐다
//       user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
//       //user는 DB에서 읽어온 data이고, req.body가 실제 form으로 입력된 값이므로 각 항목을 덮어 쓰는 부분
//       for(var p in req.body){ // 2-4
//         user[p] = req.body[p];
//       }

//       // save updated user
//       user.save(function(err, user){
//         if(err) return res.json(err);
//         res.redirect('/users/'+user.username);
//       });
//   });
// });

// // destroy
// router.delete('/:username', function(req, res){
//   User.deleteOne({username:req.params.username}, function(err){
//     if(err) return res.json(err);
//     res.redirect('/users');
//   });
// });

// module.exports = router;

