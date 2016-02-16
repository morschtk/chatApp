var app = angular.module('chat-app', ['ngRoute', 'ngResource']).run(function($rootScope, $http){
   $rootScope.authenticated = false;
   $rootScope.current_user = "";
});

app.config(function($routeProvider, $interpolateProvider){
  $routeProvider
    //the home page
    .when('/', {
      templateUrl: '/home.html',
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html',
    })
    //the error page
    .when('/error', {
      templateUrl: 'error.html',
    })
});

app.controller('navController', function($scope) {
  	$scope.page = "index";

	$scope.selectedPage = function(currentPage) {
		$scope.page = currentPage;
	};

	$scope.isSelected = function(currentPage) {
		return $scope.page === currentPage;
	};
});

app.controller('postController', function($scope, $rootScope, postService, followService, unfollowService, getFeed){
  // $scope.posts = postService.query();
  $scope.newPost = {created_by: '', text: ''};

  $scope.getUserFeed = function(userId) {
    console.log(userId);
    // getFeed.get({id: userId}, function(usersFeed) {
    //   console.log(usersFeed);
    // });
    getFeed.query({id: userId}, function(results) {
      $scope.posts = results;
      console.log(results);
    });
    // console.log($scope.posts);
  }

  // $scope.getUserFeed($rootScope.current_user.id);

  $scope.post = function() {
    $scope.newPost.created_by = $rootScope.current_user.id;
    postService.save($scope.newPost, function(){
      $scope.posts = postService.query();
      $scope.newPost = {created_by: '', text: ''};
    });
  };

  $scope.followUser = function(userId) {
    console.log(userId);
    console.log($rootScope.current_user.following)
   var userToFollow = {_id: userId};
   followService.update({id: $rootScope.current_user.id}, userToFollow);
   // Call function to query current users posts
  };

  $scope.unfollowUser = function(userId) {
   var userToUnfollow = {_id: userId};
   unfollowService.update({id: $rootScope.current_user.id}, userToUnfollow);
   // Call function to query current users posts
  };
});

app.controller('authController', function($scope, $rootScope,$http, $location){
   $scope.user = {username: 'morschtk@gmail.com', password: 'pass'};
   $scope.error_message = '';

   $scope.login = function() {
      $http.post('/login', $scope.user).success(function(data){
        if(data.state == 'success'){
          $rootScope.authenticated = true;
          $rootScope.current_user = {
             id: data.user.id,
             username: data.user.displayName,
             following: data.user.following
          };
          $location.path('/');
        }
        else{
          $scope.error_message = data.message;
        }
      });
   };

   $scope.register =  function(){
      $http.post('/register', $scope.user).success(function(data){
         if(data.state == 'success'){
            $rootScope.authenticated = true;
            $rootScope.current_user = {
              id: data.user.id,
              username: data.user.displayName,
              following: data.user.following
            };
           $location.path('/');
         }
         else{
           $scope.error_message = data.message;
         }
      })
   };

   $scope.logout=  function(){
      $http.get('/logout', $scope.user).success(function(data){
         $rootScope.authenticated = false;
         $rootScope.current_user = '';
         $location.path('/');
      })
   };

   $scope.checkSession = function() {
      $http.get('/success', $scope.user).success(function(data){
        if(data.state == 'success' && data.user){
          $rootScope.authenticated = true;
          $rootScope.current_user = {
             id: data.user.id,
             username: data.user.username,
             following: data.user.following
          }
        }
      });
   };

   $scope.checkSession();
});

app.factory('postService', function($resource){
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
