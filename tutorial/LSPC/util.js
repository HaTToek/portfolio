var util = {};

util.parseError = function(errors){
    var parsed = {};
    if(errors.name = 'ValidationError'){
        for(var name in errors.errors){
            var validationError = errors.errors[name];
            parsed[name] = { message:validationError.message };
        }
    }else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0){
        parsed.username = { message:'이미 존재하는 이름입니다' };
    }else {
        parsed.unhandled = JSON.stringify(errors);
    }
    return parsed;
}

util.isLoggedin = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else {
        req.flash('errors', { login:' Please login first '});
        res.redirect('/login');
    }
}

util.noPermission = function(req, res){
    req.flash('errors', { login:"You don't have permission" });
    req.logout();
    res.redirect('/login');
}

// 이 함수는 res.locals에 getPostQuryString 함수를 추가하는 middleware이다
// res.locals에 추가된 변수나 함수는 view에서 바로 사용할 수 있고, res.locals.getPostQueryString의 형식으로 route에서도 사용할 수 있다
// 기본역활은 req.query로 전달 받은 query에서 page, limit을 추출하여 다시 한줄의 문자열로 만들어 반환하는 것이다
// 2개의 파라메터를 optional로 받는데, 첫번째로 파라메터는 생설할 query string이 기존의 query string에 추가되는 (appended) query인지 아닌지를 boolean으로 받는다. 추가되는 query라면 '&'로 받고 아니라면 '?'로 시작하는 query string을 만든다
// 두 번째 파라메터는 req.query의 page나 limit을 overwrite하는 파라메터입니다. 예를들어 req.query.page의 값을 무시하고 page를 무조건 1로 하는 query를 만들고 싶다면 {page:1}을 전달하면 된다
util.getPostQueryString = function(req, res, next){
    res.locals.getPostQueryString = function(isAppended = false, overwrites={}){
      var queryString = '';
      var queryArray = [];
      var page = overwrites.page?overwrites.page:(req.query.page?req.query.page:'');
      var limit = overwrites.limit?overwrites.limit:(req.query.limit?req.query.limit:'');
      var searchType = overwrites.searchType?overwrites.searchType:(req.query.searchType?req.query.searchType:'');
      var searchText = overwrites.searchText?overwrites.searchText:(req.query.searchText?req.query.searchText:'');
  
      // 페이지와 관련
      if(page) queryArray.push('page='+page);
      if(limit) queryArray.push('limit='+limit);
      // 검색과 관련
      if(searchType) queryArray.push('searchType=' + searchType);
      if(searchText) queryArray.push('searchText=' + searchText);
  
      if(queryArray.length>0)queryString = (isAppended?'&':'?') + queryArray.join('&');
  
      return queryString;
    }
    next();
  }
  
  // flat 배열을 tree 구조로 변경하기
  // array: tree 구조로 변경할 array를 받는다
  // idFieldName: array의 member에서 id를 가지는 field의 이름을 받는다
  // parentidFieldName: array의 member에서 부모 id를 가지는 field의 이름을 받는다
  // childrenFieldName: 생성된 자식들을 넣을 field의 이름을 정하여 넣는다
  util.convertToTrees = function(array, idFieldName, parentIdFieldName, childrenFieldName){
    var cloned = array.slice();
  
    for(var i=cloned.length-1; i>-1; i--){
      var parentId = cloned[i][parentIdFieldName];
  
      if(parentId){
        var filtered = array.filter(function(elem){
          return elem[idFieldName].toString() == parentId.toString();
        });
  
        if(filtered.length){
          var parent = filtered[0];
  
          if(parent[childrenFieldName]){
            parent[childrenFieldName].push(cloned[i]);
          }
          else {
            parent[childrenFieldName] = [cloned[i]];
          }
  
        }
        cloned.splice(i,1);
      }
    }
  
    return cloned;
  }
  
module.exports = util;