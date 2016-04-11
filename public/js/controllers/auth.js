var appAuthentication = angular.module("appAuthentication", ['appServices']);

appAuthentication.controller('authController', function($scope, $rootScope,$http, $location, $route, currentUserService){
   $scope.user = {username: '', password: ''};
   $scope.error_message = '';
   $scope.authenticated = currentUserService.getAuthenticated;
   $scope.uniqueName = '';

   $('.ui.modal').modal('hide');

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

           $('.ui.modal')
           .modal({
             onDeny: function(){
               $scope.uniqueUser = {
                 userId: data.user.id,
                 uniqueName: data.user.id
               }
               $http.put('/assignUniqueName', $scope.uniqueUser).success(function(data) {
                 console.log(data);
                 if(data.state == 'success'){
                   currentUserService.setUserName(data.userName);
                   $location.path('/');
                 } else {
                   $scope.error_message = data.msg;
                 }
               });
            },
            onApprove : function() {
              $scope.uniqueUser = {
                userId: data.user.id,
                uniqueName: data.user.id
              }
              $http.put('/assignUniqueName', $scope.uniqueUser).success(function(data) {
                console.log(data);
                if(data.state == 'success'){
                  currentUserService.setUserName(data.userName);
                  $location.path('/');
                } else {
                  $scope.error_message = data.msg;
                }
              });
            }
           })
           .modal('show');
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
