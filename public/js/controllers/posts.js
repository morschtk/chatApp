var appPosts = angular.module('appPosts', []);

appPosts.controller('postController', function($scope, $rootScope, postService){
  $scope.posts = getFeed.query({id: $rootScope.current_user.id});
  $scope.newPost = {created_by: '', text: ''};

  $scope.post = function() {
    $scope.newPost.created_by = $rootScope.current_user.id;
    postService.save($scope.newPost, function(){
      // $scope.posts = getFeed.query({id: $rootScope.current_user.id});
      // Delete this lower line of code and uncomment above when search functionality.
      $scope.posts = postService.query();
      $scope.newPost = {created_by: '', text: ''};
    });
  };

  $scope.checkFollows = function(name){
    var checkedOut = true;
    for(var i = 0; i < $rootScope.current_user.following.length; i++){
      //If current user doesn't follow name then checked out equals true
      if(name == $rootScope.current_user.following[i]){
        checkedOut = false;
      }
    }
    return checkedOut;
  };

  $scope.followUser = function(userId) {
    var userToFollow = {_id: userId};
    followService.update({id: $rootScope.current_user.id}, userToFollow);
    $scope.posts = getFeed.query({id: $rootScope.current_user.id});
  };

  $scope.unfollowUser = function(userId) {
    var userToUnfollow = {_id: userId};
    unfollowService.update({id: $rootScope.current_user.id}, userToUnfollow);
    $scope.posts = getFeed.query({id: $rootScope.current_user.id});
  };
});

appPosts.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});