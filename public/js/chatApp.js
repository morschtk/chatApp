var app = angular.module('chat-app', ['ngRoute']).run(function($rootScope, $http){
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

app.controller('postController', function($scope, $rootScope){
   $scope.posts = [];
   $scope.newPost = {created_by: '', text: '', created_at:''};

   $scope.post = function(){
      $scope.newPost.created_by = $rootScope.current_user;
      $scope.newPost.created_at = Date.now();
      $scope.posts.push($scope.newPost);
      $scope.newPost = {created_by: '', text: '', created_at:''};
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
          $rootScope.current_user = data.user.username;
          $location.path('/');
        }
        else{
          $scope.error_message = data.message;
        }
      });
   };

   $scope.facebook = function() {
      console.log('logging in');
      $http.post('/facebook', $scope.user).success(function(data){
         console.log("trying");
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
          $rootScope.current_user = data.user.username;
          console.log()
        }
      });
   };

   $scope.checkSession();
});

$('.field.example form')
  .form({
    on: 'blur',
    fields: {
      empty: {
        identifier  : 'empty',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please enter a value'
          }
        ]
      },
      dropdown: {
        identifier  : 'dropdown',
        rules: [
          {
            type   : 'empty',
            prompt : 'Please select a dropdown value'
          }
        ]
      },
      checkbox: {
        identifier  : 'checkbox',
        rules: [
          {
            type   : 'checked',
            prompt : 'Please check the checkbox'
          }
        ]
      }
    }
  })
;
