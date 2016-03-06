var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postController', function($scope, $rootScope, postService, followService, unfollowService, getFeed, currentUserService){
  $scope.newPost = {created_by: '', text: ''};
console.log('hey');
  if (currentUserService.getAuthenticated()) {
    console.log(currentUserService.getUserId());
    getFeed.get({id: currentUserService.getUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  }

  $scope.post = function() {
    $scope.newPost.created_by = currentUserService.getUserId();
    postService.save($scope.newPost, function(){
      $scope.newPost = {created_by: '', text: ''};
    });
    getFeed.get({id: currentUserService.getUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  };

  $scope.getAllPosts = function() {
    $scope.posts = postService.query();
  };

  $scope.checkFollows = function(id){
    var checkedOut = true;
    for(var i = 0; i < currentUserService.getFollowing().length; i++){
      if(id == currentUserService.getFollowing()[i]._id){
        checkedOut = false;
      }
    }
    return checkedOut;
  };

  $scope.followUser = function(userId) {
    var userToFollow = {_id: userId};
    followService.update({id: currentUserService.getUserId()}, userToFollow);
    getFeed.get({id: currentUserService.getUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  };

  $scope.unfollowUser = function(userId) {
    var userToUnfollow = {_id: userId};
    unfollowService.update({id: currentUserService.getUserId()}, userToUnfollow);
    getFeed.get({id: currentUserService.getUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  };
});
