var app = angular.module('chat-app', ['ngRoute']).run(function($rootScope, $http){

});

app.config(function($routeProvider){
  $routeProvider
    //the home page
    .when('/', {
      templateUrl: '/home.html',
    })
});

app.controller('postController', function($scope){
   $scope.posts = [];
   $scope.newPost = {created_by: '', text: '', created_at:''};

   $scope.post= function(){
      $scope.newPost.created_at = Date.now();
      $scope.posts.push($scope.newPost);
      $scope.newPost = {created_by: '', text: '', created_at:''};
   };
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
