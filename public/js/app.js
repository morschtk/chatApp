var app = angular.module('chat-app', ['ngRoute', 'ngResource', 'appSettings', 'appAuthentication', 'appPosts']).run(function($rootScope, $http){
   $rootScope.authenticated = false;
   $rootScope.current_user = "";
   $rootScope.id = "";
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
    //The settings page
    .when('/settings', {
      templateUrl: 'settings.html',
      controller: 'settingsController'
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

app.directive('userInfoBox', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/userInfoBox.html',
    controller: '',
    controllerAs: ''
  };
});

app.directive('chatFeed', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/chatFeed.html',
    controller: 'postsController',
    controllerAs: 'postCtrl',
  };
});