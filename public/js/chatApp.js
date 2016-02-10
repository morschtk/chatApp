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

app.controller('postController', function($scope, $rootScope, postService){
   $scope.posts = postService.query();
   $scope.newPost = {created_by: '', text: '', created_at: ''};

   $scope.post = function() {
     $scope.newPost.created_by = $rootScope.current_user.username;
     $scope.newPost.created_at = Date.now();
     postService.save($scope.newPost, function(){
       $scope.posts = postService.query();
       $scope.newPost = {created_by: '', text: '', created_at: ''};
     });
   };
});

app.controller('authController', function($scope, $rootScope,$http, $location){
   $scope.user = {username: '', password: ''};
   $scope.error_message = '';

   $scope.login = function() {
      console.log('logging in');
      $http.post('/login', $scope.user).success(function(data){
        if(data.state == 'success'){
          $rootScope.authenticated = true;
          $rootScope.current_user = {
             id: data.user.id,
             username: data.user.username
          }
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
           $rootScope.current_user = data.user.username;
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
             username: data.user.username
          }
        }
      });
   };

   $scope.checkSession();
});

app.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

app.factory('followService', function($resource){
  return $resource('/api/follow/:id');
});

app.factory('unfollowService', function($resource){
  return $resource('/api/unfollow/:id');
});
