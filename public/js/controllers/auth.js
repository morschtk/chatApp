var appAuthentication = angular.module("appAuthentication", []);

appAuthentication.controller('authController', function($scope, $rootScope,$http, $location){
   $scope.user = {username: '', password: ''};
   $scope.error_message = '';

   $scope.login = function() {
      console.log('logging in');
      $http.post('/login', $scope.user).success(function(data){
        if(data.state == 'success'){
          $rootScope.authenticated = true;
          $rootScope.current_user = {
             id: data.user.id,
             username: data.user.username
          }
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
           $rootScope.authenticated = true;
           $rootScope.current_user = data.user.username;
           $location.path('/');
         }
         else{
           $scope.error_message = data.message;
         }
      })
   };

   $scope.logout=  function(){
      $http.get('/logout', $scope.user).success(function(data){
         $rootScope.authenticated = false;
         $rootScope.current_user = '';
         $location.path('/');
      })
   };

   $scope.checkSession = function() {
      $http.get('/success', $scope.user).success(function(data){
        if(data.state == 'success' && data.user){
          $rootScope.authenticated = true;
          $rootScope.current_user = {
             id: data.user.id,
             displayName: data.user.displayName
          }
        }
      });
   };

   $scope.checkSession();
});