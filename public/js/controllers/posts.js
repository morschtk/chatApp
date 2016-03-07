var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postController', function($scope, $rootScope, postService, followService, unfollowService, getFeed, currentUserService){
  $scope.newPost = {created_by: '', text: ''};
  $scope.currUserId = currentUserService.getUserId;
  $scope.currAvatar = currentUserService.getAvatar;
  $scope.currDisplayName = currentUserService.getDisplayName;
  $scope.currFollowing = [];

  getFeed.get({id: $scope.currUserId()}, function(result) {
    currentUserService.setFollowing(result.current_user.following);
    $scope.currFollowing = currentUserService.getFollowing;

    currentUserService.setFollowers(result.current_user.followers);
    $scope.currFollowers = currentUserService.getFollowers;

    currentUserService.setPosts(result.allPosts);
    $scope.posts = currentUserService.getPosts();
  });

  $scope.post = function() {
    $scope.newPost.created_by = $scope.currUserId();
    postService.save($scope.newPost, function(){
      $scope.newPost = {created_by: '', text: ''};
    });
    getFeed.get({id: $scope.currUserId()}, function(result) {
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  };

  $scope.getAllPosts = function() {
    $scope.posts = postService.query();
  };

  $scope.checkFollows = function(id){
    var checkedOut = true;
    for(var i = 0; i < $scope.currFollowing().length; i++){
      if(id == $scope.currFollowing()[i]._id){
        checkedOut = false;
      }
    }
    return checkedOut;
  };

  $scope.followUser = function(userId) {
    var userToFollow = {_id: userId};
    followService.update({id: $scope.currUserId()}, userToFollow);
    getFeed.get({id: $scope.currUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      $scope.currFollowing = currentUserService.getFollowing;
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  };

  $scope.unfollowUser = function(userId) {
    var userToUnfollow = {_id: userId};
    unfollowService.update({id: $scope.currUserId()}, userToUnfollow);
    getFeed.get({id: $scope.currUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      $scope.currFollowing = currentUserService.getFollowing;
      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  };
});
