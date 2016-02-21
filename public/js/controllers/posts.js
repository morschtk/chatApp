var appPosts = angular.module('appPosts', []);

appPosts.controller('postController', function($scope, $rootScope, postService){
   $scope.posts = postService.query();
   $scope.newPost = {created_by: '', text: ''};

   $scope.post = function() {
     $scope.newPost.created_by = $rootScope.current_user.id;
     postService.save($scope.newPost, function(){
       $scope.posts = postService.query();
       $scope.newPost = {created_by: '', text: ''};
     });
   };
});

appPosts.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});