var appPosts = angular.module('appPosts', ['appServices']);

appPosts.controller('postController', function($scope, $rootScope, postService, followService, unfollowService, getFeed, currentUserService){
  $scope.newPost = {created_by: '', text: ''};
  $scope.currUserId = currentUserService.getUserId;
  $scope.currAvatar = currentUserService.getAvatar;
  $scope.currDisplayName = currentUserService.getDisplayName;
  $scope.currFollowing = [];
  $scope.editingPost = {};
  var oldPostText = "";

  function getCurrUserInfo() {
    getFeed.get({id: $scope.currUserId()}, function(result) {
      currentUserService.setFollowing(result.current_user.following);
      $scope.currFollowing = currentUserService.getFollowing;

      currentUserService.setFollowers(result.current_user.followers);
      $scope.currFollowers = currentUserService.getFollowers;

      currentUserService.setCurrUserPosts(result.current_user.posts);
      $scope.currUserPosts = currentUserService.getCurrUserPosts;

      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts;
    });
  }
  getCurrUserInfo();

  $scope.post = function() {
    $scope.newPost.created_by = $scope.currUserId();
    postService.save($scope.newPost, function(){
      $scope.newPost = {created_by: '', text: ''};
    });
    getCurrUserInfo();
  };

  $scope.edit = function(post) {
    $scope.editingPost = post;
    oldPostText = post.text;
  };

  $scope.save = function(post) {
    $scope.editingPost = {};
    postService.update({id: post._id}, post);
  };

  $scope.cancel = function(post) {
    var index = $scope.posts().indexOf(post);
    $scope.posts()[index].text = oldPostText;
    $scope.editingPost = {};
  };

  $scope.delete = function(post) {
    $scope.posts().splice($scope.posts().indexOf(post), 1);
    $scope.currUserPosts().splice($scope.currUserPosts().indexOf(post), 1);
    $scope.editingPost = {};
    getFeed.update({id: post.user_id}, post);
  };

  $scope.getAllPosts = function() {
    currentUserService.setPosts(postService.query());
    $scope.posts = currentUserService.getPosts;
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
    getCurrUserInfo();
  };

  $scope.unfollowUser = function(userId) {
    var userToUnfollow = {_id: userId};
    unfollowService.update({id: $scope.currUserId()}, userToUnfollow);
    getCurrUserInfo();
  };
});
