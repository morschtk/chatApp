var appSettings = angular.module("appSettings", []);

appSettings.controller('settingsController', [ '$scope', '$rootScope',
    function($scope, $rootScope) {

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

	$scope.imgSelected = function(currentAvatar){
		return $scope.avatar === currentAvatar;
	};
}]);