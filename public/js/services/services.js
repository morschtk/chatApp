var appServices = angular.module("appServices", ['ngResource']);

appServices.factory('postService', function($resource){
  return $resource('/api/posts/:id');
});

appServices.factory('followService', function($resource) {
  return $resource('/api/follow/:id', null,
    {
      'update': {method: 'put' }
    });
});

appServices.factory('unfollowService', function($resource) {
  return $resource('/api/unfollow/:id', null,
    {
       'update': {method: 'put' }
     });
 });

appServices.factory('getFeed', function($resource) {
  return $resource('/api/theFeed/:id', null,
    {
      'update': {method: 'put' }
    });
});

appServices.factory('currentUserService', function() {
    var authenticated = false;
    var userId = "";
    var displayName = "";
    var following = [];
    var followers = [];
    var posts = [];
    var avatar = "";
    var firstName = "";
    var lastName = "";
    var currUserPosts = [];

    return {
    	getAuthenticated: function() {
    	    return authenticated;
    	},
    	setAuthenticated: function(value) {
    	    authenticated = value;
    	},
        getUserId: function() {
            return userId;
        },
        setUserId: function(value) {
            userId = value;
        },
        getDisplayName: function() {
            return displayName;
        },
        setDisplayName: function(value) {
            displayName = value;
        },
        getFollowing: function() {
            return following;
        },
        setFollowing: function(value) {
            following = value;
        },
        getFollowers: function() {
            return followers;
        },
        setFollowers: function(value) {
            followers = value;
        },
        getPosts: function() {
            return posts;
        },
        setPosts: function(value) {
            posts = value;
        },
        getAvatar: function() {
            return avatar;
        },
        setAvatar: function(value) {
            avatar = value;
        },
        getFirstName: function() {
            return firstName;
        },
        setFirstName: function(value) {
            firstName = value;
        },
        getLastName: function() {
            return lastName;
        },
        setLastName: function(value) {
            lastName = value;
        },
        getCurrUserPosts: function() {
            return currUserPosts;
        },
        setCurrUserPosts: function(value) {
            currUserPosts = value;
        }
    };
});
