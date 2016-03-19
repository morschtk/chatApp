var app = angular.module('chat-app', ['ngRoute', 'ngResource', 'appServices', 'appSettings', 'appAuthentication', 'appPosts']);

app.config(function($routeProvider, $interpolateProvider){
  $routeProvider
    //the home page
    .when('/', {
      templateUrl: '/home.html',
    })
    //The settings page
    .when('/settings', {
      templateUrl: 'settings.html',
      controller: 'settingsController'
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
    //friend Page
    .when('/:userName', {
      templateUrl: '/friendPage.html',
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
    templateUrl: '/partials/userInfoBox.html'
  };
});

app.directive('chatFeed', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/chatFeed.html'
  };
});

app.directive('userInfoAnChatFeed', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/userInfoAnChatFeed.html',
    controller: 'postController'
  };
});
