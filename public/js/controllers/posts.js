var appPosts = angular.module('appPosts', ['appServices', 'ngSanitize']);

appPosts.controller('postController', function($scope, $rootScope, postService, followService, unfollowService, getFeed, getDisplayFeed, currentUserService, $routeParams, $location){
  $scope.paramName = $routeParams.userName;
  $scope.currUserId = currentUserService.getUserId();
  $scope.currFollowing = currentUserService.getFollowing();
  $scope.newPost = {created_by: '', text: ''};
  $scope.editingPost = {};
  var oldPostText = "";

  function getCurrUserInfo(userId) {
    getFeed.get({id: userId}, function(result) {
      $scope.displayUserId = currentUserService.getUserId;
      currentUserService.setFollowing(result.current_user.following);
      $scope.displayFollowing = currentUserService.getFollowing();

      currentUserService.setFollowers(result.current_user.followers);
      $scope.displayFollowers = currentUserService.getFollowers();

      currentUserService.setCurrUserPosts(result.current_user.posts);
      $scope.displayUserPosts = currentUserService.getCurrUserPosts();

      currentUserService.setAvatar(result.current_user.avatar);
      $scope.displayAvatar = currentUserService.getAvatar();

      currentUserService.setDisplayName(result.current_user.displayName);
      $scope.displayDisplayName = currentUserService.getDisplayName();

      currentUserService.setPosts(result.allPosts);
      $scope.posts = currentUserService.getPosts();
    });
  }

  function getDisplay_UserInfo(userId) {
    getDisplayFeed.get({id: userId}, function(result) {
      $scope.displayUserId = result.display_user._id;
      $scope.displayFollowing = result.display_user.following;
      $scope.displayFollowers = result.display_user.followers;
      $scope.posts = result.allPosts;
      $scope.displayUserPosts = result.allPosts;
      $scope.displayAvatar = result.display_user.avatar;
      $scope.displayDisplayName = result.display_user.displayName;
    });
  }

  function whosInfo() {
    if ($scope.paramName) {
      getDisplay_UserInfo($scope.paramName);
    } else {
      getCurrUserInfo($scope.currUserId);
    }
  }
  whosInfo();

  $scope.post = function() {
    $scope.newPost.created_by = $scope.currUserId;
    postService.save($scope.newPost, function(post){
        if (post.text === $scope.newPost.text) {
          $scope.posts.push(post);
          $scope.displayUserPosts.push(post);
        } else {
          whosInfo();
        }
        $scope.newPost = {created_by: '', text: ''};
    });
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
    var index = $scope.posts.indexOf(post);
    $scope.posts[index].text = oldPostText;
    $scope.editingPost = {};
  };

  $scope.delete = function(post) {
    $scope.posts.splice($scope.posts.indexOf(post), 1);
    $scope.displayUserPosts.splice($scope.displayUserPosts.indexOf(post), 1);
    $scope.editingPost = {};
    getFeed.update({id: post.user_id}, post);
  };

  $scope.getAllPosts = function() {
    $scope.posts = postService.query();
  };

  $scope.checkFollows = function(id){
    var checkedOut = true;
    for(var i = 0; i < $scope.currFollowing.length; i++){
      if(id == $scope.currFollowing[i]){
        checkedOut = false;
      }
    }
    return checkedOut;
  };

  $scope.followUser = function(userId) {
    var userToFollow = {_id: userId};
    followService.update({id: $scope.currUserId}, userToFollow);
    $scope.currFollowing.push(userId);
    whosInfo();
  };

  $scope.unfollowUser = function(userId) {
    var userToUnfollow = {_id: userId};
    unfollowService.update({id: $scope.currUserId}, userToUnfollow);
    $scope.currFollowing.splice($scope.currFollowing.indexOf(userId), 1);
    whosInfo();
  };

  $scope.friendPage = function(friendId) {
    $location.path('/' + friendId);
  };
});
