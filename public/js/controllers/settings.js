var appSettings = angular.module("appSettings", ['appServices']);

appSettings.controller('settingsController', [ '$scope', '$rootScope', '$http', '$location', 'currentUserService', function($scope, $rootScope, $http, $location, currentUserService) {
  $scope.tab = "personal";
  $scope.currUserPosts = currentUserService.getCurrUserPosts;
  $scope.currFollowing = currentUserService.getFollowing;
  $scope.currFollowers = currentUserService.getFollowers;
  $scope.currDisplayName = currentUserService.getDisplayName;
  $scope.currAvatar = currentUserService.getAvatar;
  $scope.currFirstName = currentUserService.getFirstName;
  $scope.currLastName = currentUserService.getLastName;

  $scope.selectTab = function(currentTab){
    $scope.tab = currentTab;
  };

  $scope.selectImg = function(currentImg){
    $scope.avatar = currentImg;
  };

  $scope.isSelected = function(currentTab){
    return $scope.tab === currentTab;
  };

  $scope.imgSelected = function(currentAvatar){
    return $scope.avatar === currentAvatar;
  };

  $scope.connectTwitter = function() {
    console.log('running this');
    $http.get('/connect/twitter', $rootScope.id).success(function(data) {
      $location.path('.');
      //TODO: add toggles and checks for which accounts are connected
    });
  };
}]);
