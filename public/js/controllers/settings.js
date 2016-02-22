var appSettings = angular.module("appSettings", []);

appSettings.controller('settingsController', [ '$scope', '$rootScope', '$http', '$location',
    function($scope, $rootScope, $http, $location) {

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

	$scope.connectTwitter = function() {
		console.log('running this');
		$http.get('/connect/twitter', $rootScope.id).success(function(data) {
			$location.path('.');
			//TODO: add toggles and checks for which accounts are connected
		});
	};
}]);