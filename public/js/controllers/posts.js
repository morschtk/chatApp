var appPosts = angular.module('appPosts', []);

appPosts.controller('postController', function($scope, $rootScope, postService, followService, unfollowService, getFeed){
  // getFeed.get({id: $rootScope.current_user.id}, function(result) {
  //   $rootScope.current_user = result.current_user;
  //   $scope.posts = result.allPosts;
  // });
  $scope.newPost = {created_by: '', text: ''};

  $scope.post = function() {
    $scope.newPost.created_by = $rootScope.current_user.id;
    postService.save($scope.newPost, function(){
      $scope.newPost = {created_by: '', text: ''};
    });
    getFeed.get({id: $rootScope.current_user.id}, function(result) {
      $rootScope.current_user = result.current_user;
      $rootScope.current_user.id = $rootScope.current_user._id;
      delete $rootScope.current_user._id;
      $scope.posts = result.allPosts;
    });
  };

  $scope.getAllPosts = function() {
    $scope.posts = postService.query();
  };

  $scope.checkFollows = function(id){
    var checkedOut = true;
    for(var i = 0; i < $rootScope.current_user.following.length; i++){
      //If current user doesn't follow id then checked out equals true
      if(id == $rootScope.current_user.following[i]._id){
        checkedOut = false;
      }
    }
    return checkedOut;
  };

  $scope.followUser = function(userId) {
    var userToFollow = {_id: userId};
    followService.update({id: $rootScope.current_user.id}, userToFollow);
    // $rootScope.current_user.following.push(userId);
    // $scope.posts = getFeed.query({id: $rootScope.current_user.id});
    getFeed.get({id: $rootScope.current_user.id}, function(result) {
      $rootScope.current_user = result.current_user;
      $rootScope.current_user.id = $rootScope.current_user._id;
      delete $rootScope.current_user._id;
      $scope.posts = result.allPosts;
    });
  };

  $scope.unfollowUser = function(userId) {
    var userToUnfollow = {_id: userId};
    unfollowService.update({id: $rootScope.current_user.id}, userToUnfollow);
    // var index = $rootScope.current_user.following.indexOf(userId);
    // if (index > -1) {
    //   $rootScope.current_user.following.splice(index, 1);
    // }
    // $scope.posts = getFeed.query({id: $rootScope.current_user.id});
    getFeed.get({id: $rootScope.current_user.id}, function(result) {
      $rootScope.current_user = result.current_user;
      $rootScope.current_user.id = $rootScope.current_user._id;
      delete $rootScope.current_user._id;
      $scope.posts = result.allPosts;
    });
  };
});

appPosts.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

app.factory('followService', function($resource) {
  return $resource('/api/follow/:id', null,
    {
      'update': {method: 'put' }
    });
});

app.factory('unfollowService', function($resource) {
  return $resource('/api/unfollow/:id', null,
    {
       'update': {method: 'put' }
     });
 });

app.factory('getFeed', function($resource) {
  return $resource('/api/theFeed/:id', null,
    {
      'update': {method: 'put' }
    });
});