var express     =   require('express');
var router      =   express.Router();
var Post        =   require('../models/Post');
var util        =   require('../util');

// index 
router.get('/', function(req, res){
    Post.find({})
    .populate('author')
    .sort('-createAt')//String or object 를 받아서 데이터 정렬방법을 정의 -를 붙히면 내림차순
    .exec(function(err, posts){
        if(err) return res.json(err);
        res.render('posts/index',{posts:posts});
    });
});

// New
router.get('/new',util.isLoggedin, function(req, res){ // util.isLoggedin를 사용해서 로그인이 된 경우에만 해당 route을 사용할 수 있다. 게시물 본문을 보는 것 외의 행동은 login이 되어야만 할 수 있다 
    var post    =   req.flash('post')[0] || {};
    var errors  =   req.flash('errors')[0] || {};
    res.render('posts/new', {post:post, errors:errors});
});

// create
router.post('/',util.isLoggedin, function(req, res){
    req.body.author = req.user._id; // 글을 작성할 때 req.user._id를 가져와 post의 author에 기록한다
    Post.create(req.body, function(err, post){
        if(err) {
            req.flash('post',req.body);
            req.flash('errors', util.parseError(err));
            return res.redirect('/posts/new');
        }
        res.redirect('/posts');
    });
});

// show
router.get('/:id', function(req, res){
    Post.findOne({_id:req.params.id}) 
      .populate('author')             
      .exec(function(err, post){      
        if(err) return res.json(err);
        res.render('posts/show', {post:post});
      });
  });

// edit
router.get('/:id/edit',util.isLoggedin,checkPermission, function(req, res){ // chechPermission를 사용해서 본인이 작성한 post인 경우에만 계속 해당 route을 사용할 수 있다.
    var post = req.flash('post')[0];
    var errors  =   req.flash('errors')[0] || {};
    if(!post){
        Post.findOne({_id:req.params.id}, function(err, post){
            if(err) return res.json(err);
            res.render('posts/edit', {post:post, errors:errors});
        });
    }
    else {
        post._id = req.params.id;
        res.render('posts/edit', {post:post, errors:errors});
    }
});

// update
router.put('/:id',util.isLoggedin,checkPermission, function(req, res){
    req.body.updatedAt = Date.now(); //2
    Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true},function(err, post){
      if(err){
          req.flash('post',req.body);
          req.flash('errors', util.parseError(err));
          return res.redirect('/posts/'+req.param.id+'/edit');
      }
      res.redirect("/posts/"+req.params.id);
    });
  });

// destroy
router.delete('/:id',util.isLoggedin,checkPermission, function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return req.json(err);
        res.redirect('/posts');
    });
});


module.exports  =   router;

// private functions
// 해당 게시물에 기록된 author와 로그인된 user.id를 비교해서 같은 경우에만 계속 진행(next())하고
// 만략 다르다면 util.noPermission함수를 호출하여 login화면으로 보낸다
function checkPermission(req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        if(post.author != req.user.id) return util.noPermission(req,res);

        next();
    });
}