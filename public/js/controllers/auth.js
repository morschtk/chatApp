var appAuthentication = angular.module("appAuthentication", ['appServices']);

appAuthentication.controller('authController', function($scope, $rootScope,$http, $location, $route, currentUserService){
   $scope.user = {username: '', password: ''};
   $scope.error_message = '';
   $scope.authenticated = currentUserService.getAuthenticated;

   $scope.login = function() {
      $http.post('/login', $scope.user).success(function(data){
        if(data.state == 'success'){
          $scope.user = {username: '', password: ''};
          currentUserService.setAuthenticated(true);
          currentUserService.setUserId(data.user.id);
          currentUserService.setFollowing(data.user.following);
          currentUserService.setCurrUserPosts(data.user.posts);

          $scope.authenticated = currentUserService.getAuthenticated;
          $scope.currUserId = currentUserService.getUserId();
          $scope.currFollowing = currentUserService.getFollowing();
          $scope.currUserPosts = currentUserService.getCurrUserPosts();

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
            currentUserService.setAuthenticated(true);
            currentUserService.setUserId(data.user.id);
            currentUserService.setFollowing(data.user.following);
            currentUserService.setCurrUserPosts(data.user.posts);

            $scope.authenticated = currentUserService.getAuthenticated;
            $scope.currUserId = currentUserService.getUserId();
            $scope.currFollowing = currentUserService.getFollowing();
            $scope.currUserPosts = currentUserService.getCurrUserPosts();

            $location.path('/');
         }
         else{
           $scope.error_message = data.message;
         }
      });
   };

   $scope.logout =  function(){
      $http.get('/logout', $scope.user).success(function(data){
        currentUserService.setAuthenticated(false);
        currentUserService.setUserId('');
        currentUserService.setDisplayName('');
        currentUserService.setFollowing([]);

        $scope.authenticated = currentUserService.getAuthenticated;
        $scope.currUserId = currentUserService.getUserId();
        $scope.currDisplayName = currentUserService.getDisplayName();
        $scope.currFollowing = currentUserService.getFollowing();
        $location.path('/');
        $route.reload();
      });
   };

   $scope.checkSession = function() {
      $http.get('/success', $scope.user).success(function(data){
        if(data.state == 'success' && data.user){
          currentUserService.setAuthenticated(true);
          currentUserService.setUserId(data.user.id);
          currentUserService.setFollowing(data.user.following);
          currentUserService.setCurrUserPosts(data.user.posts);

          $scope.authenticated = currentUserService.getAuthenticated;
          $scope.currUserId = currentUserService.getUserId();
          $scope.currFollowing = currentUserService.getFollowing();
          $scope.currUserPosts = currentUserService.getCurrUserPosts();
        }
      });
   };

   $scope.checkSession();
});
