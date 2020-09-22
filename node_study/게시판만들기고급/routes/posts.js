var express     =   require('express')
var router      =   express.Router()
var Post        =   require('../models/Post')
var User        =   require('../models/User')
var Comment     =   require('../models/Comment')
var util        =   require('../util')

// index 
router.get('/', async function(req, res){ //async는 await 키워드를 사용가능하게 한다
    // parseInt : Query string은 문자열로 전달되기 때문에 숫자가 아닐 수도 있고 정수를 읽어내기 위함
    // Math.max : page, limit은 양수여야 한다 최소 1이상 
    var page = Math.max(1, parseInt(req.query.page));
    var limit = Math.max(1, parseInt(req.query.limit));
    // 만약 정수로 변환될 수 없는 갓이 page, limit에 오는 경우 기본값으로 설정해 준다
    page = !isNaN(page)?page:1 ;
    limit = !isNaN(limit)?limit:10;

    var searchQuery = await createSearchQuery(req.query); 
    var skip = (page-1)*limit; // 무시할 게시물의 수를 담는 변수
    var maxPage = 0;
    var posts = [];

    if(searchQuery){
        // var count = await Post.countDocuments({}); // 완료할 때까지 다음 코드를 진행하지 않고 기다리는 함수 // ({})은 모든 post의 수를 DB에 읽어 온후 count변수에 담는다
        var count = await Post.countDocuments(searchQuery);
        maxPage = Math.ceil(count/limit); // 전체 페이지수를 위한 변수
        posts = await Post.aggregate([  //aggregate을 mongodb로 전달할 수 있습니다.
            { $match: searchQuery },//  Post.find(searchQuery).exec();와 Post.aggregate([{ $match: searchQuery }]).exec();
            //위에 저 두개는 기능적으로는 같은 역할을 하지만 aggregation으로만 할 수 있는 일이 있다
            { $lookup: { // 한 collection과 다른 collection을 이어주는 역할
                from:'users',// 다른 collection의 이름을 적는다
                localField: 'author',// 현재 collection의 항목을 적는다
                foreignField: '_id', // 다른 collection의 항목을 적는다
                as: 'author' // 다른 collection을 담을 항목의 이름을 적는다 이 항목의 이름으로 다른 collection의 데이터가 생성된다.
            } },
            { $unwind: '$author' }, // 배열을 flat하게 풀어주는 역할을 한다.
            { $sort: {createdAt: -1} }, // 기존의 있던 함수와 같은 기능(정렬)
            { $skip: skip },// 기존의 있던 함수와 같은 기능
            { $limit: limit },// 기존의 있던 함수와 같은 기능
            { $lookup: { // post._id와 comment.post를 연결한다. 하나의 post에 여러개의 comments가 생길 수 있으므로 $unwind를 사용하지 않는다
                from: 'comments',
                localField: '_id',
                foreignField: 'post',
                as: 'comments'
            } },
            { $project: {// 데이터를 원하는 형태로 가공하기 위해 사용된다. $project: 바로 다음에 원하는 schema를 넣어주면 된다.
                title:1, //데이터의 title항목을 보여준다
                author: {
                    username: 1,
                },
                views:1, 
                numId: 1,
                createdAt: 1,
                commentCount: { $size: '$comments'}
            } },
        ]).exec();
        //   .populate('author')
        //   .sort('-createdAt')
        //   .skip(skip) // 일정한 수만큼 검색된 결과를 무시하는 함수
        //   .limit(limit) // 일정한 수만큼만 검색된 결과를 보여주는 함수
        //   .exec()
    }

    return res.render('posts/index', { 
        posts:posts,
        currentPage:page, // 현재 페이지 번호
        maxPage:maxPage, // 마지막 페이지 번호
        limit:limit, //페이지당 보여줄 게시물 수
        // view에서 검색 form에 현재 검색에 사용한 검색타입과 검색어를 보여줄 수 있게 해당 데이터를 view에 보낸다
        searchType:req.query.searchType,
        searchText:req.query.searchText
    })
})

// New
router.get('/new', util.isLoggedin, function(req, res){
    var post = req.flash('post')[0] || {};
    var errors = req.flash('errors')[0] || {};
    res.render('posts/new', { post:post, errors:errors });
});
  
// create
router.post('/', util.isLoggedin, function(req, res){
    req.body.author = req.user._id;
    Post.create(req.body, function(err, post){
        if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        // post의 routes에서 redirect가 있는 경우 res.loals.getPostQueryString 함수를 사용하여 query string을 계속 유지하도록 합니다.
        return res.redirect('/posts/new' + res.locals.getPostQueryString());
        }
        // 새 글을 작성한 후에는 무조건 첫번째 page를 보여주도록 apge query를 1로 overwrite해줍니다.
        res.redirect('/posts' + res.locals.getPostQueryString(false, {page:1, searchText:''})); // 새 글을 작성하면 검색 결과를 query string에서 제거하여 전체 게시물이 보이도록 합니다
    });
});

// show
// DB에서 두개 이상의 데이터를 가져와야 하는 경우 Promise.all 함수를 사용 가능
// Promise.all 함수는 Promise 배열을 인자로 받고, 전달 받은 모든 Promise들이 resolve될 때까지 기다렸다가 resolve된 데이터들을 같은 순서의 배열로 만들어 다음 callback 으로 전달한다.
// post 하나와 해당 post에 관련된 comment 들 전부를 찾아서 'posts/show' view를 render한다
router.get('/:id', function(req, res){
    var commentForm = req.flash('commentForm')[0] || { _id: null, form: {} };
    var commentError = req.flash('commentError')[0] || { _id:null, parentComment: null, errors:{}}; //1
  
    Promise.all([
        Post.findOne({_id:req.params.id}).populate({ path: 'author', select: 'username' }),
        Comment.find({post:req.params.id}).sort('createdAt').populate({ path: 'author', select: 'username' })
      ])
      .then(([post, comments]) => {
        // 게시물이 조회될 때마다 post.views를 1 증가시키고, 저장한다
        post.views++;
        post.save();
        var commentTrees = util.convertToTrees(comments, '_id','parentComment','childComments');
        res.render('posts/show', { post:post, commentTrees:commentTrees, commentForm:commentForm, commentError:commentError});
      })
      .catch((err) => {
        return res.json(err);
      });
  });

// edit
router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res){
    var post = req.flash('post')[0];
    var errors = req.flash('errors')[0] || {};
    if(!post){
        Post.findOne({_id:req.params.id}, function(err, post){
            if(err) return res.json(err);
            res.render('posts/edit', { post:post, errors:errors });
        });
    }
    else {
        post._id = req.params.id;
        res.render('posts/edit', { post:post, errors:errors });
    }
});

// update
router.put('/:id', util.isLoggedin, checkPermission, function(req, res){
    req.body.updatedAt = Date.now();
    Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
        if(err){
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/posts/'+req.params.id+'/edit'+res.locals.getPostQueryString());
        }
        res.redirect('/posts/'+req.params.id + res.locals.getPostQueryString());
    });
});

// destroy
router.delete('/:id', util.isLoggedin, checkPermission, function(req, res){
    Post.deleteOne({_id:req.params.id}, function(err){
        if(err) return res.json(err);
        res.redirect('/posts'+res.locals.getPostQueryString());
    });
});

module.exports = router;

// private functions
// 해당 게시물에 기록된 author와 로그인된 user.id를 비교해서 같은 경우에만 계속 진행(next())하고
// 만략 다르다면 util.noPermission함수를 호출하여 login화면으로 보낸다
function checkPermission(req, res, next){
    Post.findOne({_id:req.params.id}, function(err, post){
        if(err) return res.json(err);
        if(post.author != req.user.id) return util.noPermission(req,res);

        next();
    })
}

 // 실제 게시물 검색은 post.find(검색_퀴리_오브제트)에 어떤 검색_...가 들어가는지에 따라 결정된다.
    // {title: "test title"}이라는 object가 들어가면 title이 정확히 "test title"인 게시물이 검색 되고
    // {body: "test body"}라는 object가 들어가면 body가 정확히 "test body"인 게시물이 검색됩니다.
async function createSearchQuery(queries){ 
    var searchQuery = {};
    if(queries.searchType && queries.searchText && queries.searchText.length >= 3){ // query에 searchType, searchText가 존재하고, searchText가 3글자 이상인 경우에만 search query를 만들고, 이외의 경우에는 {}를 전달하여 모든 게시물이 검색되도록 한다.
        var searchTypes = queries.searchType.toLowerCase().split(',');
        var postQueries = [];
        if(searchTypes.indexOf('title')>=0){
            postQueries.push({ title: { $regex: new RegExp(queries.searchText, 'i') } }); // regex 검색을 할 수 있다. 'i'는 대소문자를 수별하지 않는다는 regex의 옵션이다 
        }
        if(searchTypes.indexOf('body')>=0){
            postQueries.push({ body: { $regex: new RegExp(queries.searchText, 'i') } });
        }
        if(postQueries.length >0) searchQuery = {$or:postQueries}; // or 검색을 사용할 수 있다.
        if(searchTypes.indexOf('author!')>=0){ // 검색 쿼리에 추가
            var user = await User.findOne({ username : queries.searchText }).exec();
            if(user) postQueries.push({ author:user._id });
        }else if(searchTypes.indexOf('author')>=0){// 검색쿼리를 만든다
            var users = await User.find({ username: { $regex: new RegExp(queries.searchText, 'i') } }).exec();
            var userIds = [];
            for(var user of users){
                userIds.push(user._id);
            }
            if(userIds.length>0) postQueries.push({author:{$in:userIds}});
        }
        // 작성자 검색의 경우
        if(postQueries.length>0) searchQuery = {$or:postQueries}; 
        else searchQuery = null;
    }
    return searchQuery;
}
