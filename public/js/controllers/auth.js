var appAuthentication = angular.module("appAuthentication", ['appServices']);

appAuthentication.controller('authController', function($scope, $rootScope,$http, $location, currentUserService){
   $scope.user = {username: '', password: ''};
   $scope.error_message = '';

   $scope.login = function() {
      $http.post('/login', $scope.user).success(function(data){
        if(data.state == 'success'){
          $scope.user = {username: '', password: ''};
          currentUserService.setAuthenticated(true);
          currentUserService.setUserId(data.user.id);
          currentUserService.setDisplayName(data.user.displayName);
          currentUserService.setFollowing(data.user.following);

          $scope.authenticated = currentUserService.getAuthenticated;
          $scope.currUserId = currentUserService.getUserId;
          $scope.currDisplayName = currentUserService.getDisplayName;
          $scope.currFollowing = currentUserService.getFollowing;
          // $rootScope.current_user.following.push($rootScope.current_user.id);
          $scope.checkSession();
          $location.path('/');
        }
        else{
          $scope.error_message = data.message;
        }
      });
   };

   $scope.register =  function(){
      $http.post('/register', $scope.user).success(function(data){
         if(data.state == 'success'){
          $scope.user = {username: '', password: ''};
            console.log(data.user);
            currentUserService.setAuthenticated(true);
            currentUserService.setUserId(data.user.id);
            currentUserService.setDisplayName(data.user.displayName);
            currentUserService.setFollowing(data.user.following);

            $scope.authenticated = currentUserService.getAuthenticated;
            $scope.currUserId = currentUserService.getUserId;
            $scope.currDisplayName = currentUserService.getDisplayName;
            $scope.currFollowing = currentUserService.getFollowing;
            // $rootScope.current_user.following.push($rootScope.current_user.id);
            $scope.checkSession();
            // var intID = window.setInterval(function() {
            //   console.log('interval');
            //   $location.path('/');
            // }, 3000);
            $location.path('/');
         }
         else{
           $scope.error_message = data.message;
         }
      });
   };

   $scope.logout=  function(){
      $http.get('/logout', $scope.user).success(function(data){
        currentUserService.setAuthenticated(false);
        currentUserService.setUserId('');
        currentUserService.setDisplayName('');
        currentUserService.setFollowing([]);

        $scope.authenticated = currentUserService.getAuthenticated;
        $scope.currUserId = currentUserService.getUserId;
        $scope.currDisplayName = currentUserService.getDisplayName;
        $scope.currFollowing = currentUserService.getFollowing;
        $location.path('/');
      });
   };

   $scope.checkSession = function() {
      $http.get('/success', $scope.user).success(function(data){
        if(data.state == 'success' && data.user){
          console.log(data);
          currentUserService.setAuthenticated(true);
          $scope.authenticated = currentUserService.getAuthenticated;
          console.log(currentUserService.getUserId());
          currentUserService.setUserId(data.user.id);
          $scope.currUserId = currentUserService.getUserId;
          currentUserService.setDisplayName(data.user.displayName);
          $scope.currDisplayName = currentUserService.getDisplayName;

          // currentUserService.setFollowing(data.user.following);
          // $scope.currFollowing = currentUserService.getFollowing;

          // $rootScope.current_user.following.push($rootScope.current_user.id);
        }
      });
   };

   $scope.checkSession();
});