var appSettings = angular.module("appSettings", []);

appSettings.controller('settingsController', [ '$scope', '$rootScope', '$http', '$location',
   function($scope, $rootScope, $http, $location) {

   if (!$rootScope.authenticated) {
      $location.path('/');
   } else {
      $scope.tab = "personal";

      $scope.selectTab = function(currentTab){
   		$scope.tab = currentTab;
   	};

   	$scope.selectImg = function(currentImg){
   		$scope.avatar = currentImg;
   	};

   	$scope.isSelected = function(currentTab){
   		return $scope.tab === currentTab;
   	};

      $scope.update = function(personal) {
         console.log(personal);
         // userService.save($rootScope.current_user, function(){
         // });
      };
   }
}]);

appPosts.factory('userService', function($resource){
  return $resource('/api/user/:id');
});
