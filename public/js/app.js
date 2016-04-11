var app = angular.module('chat-app', ['ngRoute', 'ngResource', 'appServices', 'appSettings', 'appAuthentication', 'appPosts', 'appSearch']);

app.config(function($routeProvider, $interpolateProvider){
  $routeProvider
    //the home page
    .when('/', {
      templateUrl: '/home.html'
    })
    //The settings page
    .when('/settings', {
      templateUrl: 'settings.html',
      controller: 'settingsController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html'
    })
    //the signup display
    .when('/register', {
      templateUrl: 'register.html'
    })
    //the error page
    .when('/error', {
      templateUrl: 'error.html'
    })
    //Search page
    .when('/search/:query', {
      templateUrl: '/search.html',
      controller: 'searchController'
    })
    //friend Page
    .when('/:userName', {
      templateUrl: '/friendPage.html'
    })
});

app.controller('navController', function($scope, getUsers, currentUserService, $location) {
	$scope.page = "index";
  $scope.authenticated = currentUserService.getAuthenticated;
  $scope.searchText = '';

  $scope.searchedUsers = [];

  $('.ui.search.selection.dropdown')
    .dropdown({
      className: {
        filtered: null
      }
  });

  $scope.searchPage = function(query) {
    currentUserService.setSearchResults($scope.searchedUsers);
    $location.path('/search/' + query);
  };

  $scope.friendPage = function(friendId) {
    $location.path('/' + friendId);
  };

  $scope.displaySearch = function(theQuery) {
    getUsers.query({searchText: theQuery}, function(users) {
      $scope.searchedUsers = users;
    });
  };

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

app.directive('mainNav', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/mainNav.html',
    controller: 'navController'
  };
});

app.directive('userInfoAnChatFeed', function(){
  return {
    restrict: 'E',
    templateUrl: '/partials/userInfoAnChatFeed.html',
    controller: 'postController'
  };
});
