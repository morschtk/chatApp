var appSearch = angular.module('appSearch', ['appServices']);

appSearch.controller('searchController', function($scope, followService, unfollowService, currentUserService, $routeParams, $location){
  $scope.users = currentUserService.getSearchResults();
});
