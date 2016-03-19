var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');


//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/posts', isAuthenticated);

// Api for all posts
router.route('/posts')

   // Get all posts
   .get(function(req, res){
      posts = [];
      User.find({}, {posts: 1, displayName: 1},function(err, data){
         if (err){
            res.send(500, err);
         }
         for (i = 0; i < data.length; i++){
            for (j = 0; j < data[i].posts.length; j++) {
              post = {
                user_id: data[i]._id,
                created_by: data[i].displayName,
                text: data[i].posts[j].text,
                created_at: data[i].posts[j].created_at,
                _id: data[i].posts[j]._id
              }
              posts.push(post);
            }
         }
         return res.send(posts);
      })
   })

   //Create a new post
   .post(function(req, res){
    // Update the current post
      User.findOneAndUpdate({
        _id: req.body.created_by
      },{
        $push: {posts: { text: req.body.text}}
      },{
        new: true
      },
      function(err, user){
        if(err){
          return res.send(err);
        }
        var newPost = {
          text : user.posts[user.posts.length - 1].text,
          created_at : user.posts[user.posts.length - 1].created_at,
          _id : user.posts[user.posts.length - 1]._id,
          user_id : user._id,
          created_by : user.displayName
        };
        return res.json(newPost);
      });
   });

// Gets all the posts from who the current user is following including themself.
router.route('/theFeed/:id')
   .get(function(req, res) {
    User.findOne({ _id: req.params.id }, { password: 0})
      .populate('following')
      .exec(function(err, current_user) {
        if (err) {
          console.log('Error getting users feed. ', err);
          return res.json(err);
        }
        var allPosts = [];

        for (var i = 0; i < current_user.posts.length; i++) {
          var post = {
            user_id: current_user._id,
            created_by: current_user.displayName,
            text: current_user.posts[i].text,
            created_at: current_user.posts[i].created_at,
            _id: current_user.posts[i]._id
          };
          allPosts.push(post);
        }

        for (var i = 0; i < current_user.following.length; i++) {
          for (var n = 0; n < current_user.following[i].posts.length; n++) {
            var post = {
              user_id: current_user.following[i]._id,
              created_by: current_user.following[i].displayName,
              text: current_user.following[i].posts[n].text,
              created_at: current_user.following[i].posts[n].created_at,
              _id: current_user.following[i].posts[n]._id
            };
            allPosts.push(post);
          }
          current_user.following[i] = current_user.following[i]._id;
        }
        var user_allPosts = {
          current_user: current_user,
          allPosts: allPosts
        };
        res.json(user_allPosts);
      });
   })
   //deletes specified post
	.put(function(req, res) {
		User.update({
			"_id": req.params.id
		}, {
      $pull: {
        "posts": { "_id": req.body._id }
      }
    }, function(err) {
			if (err)
				return res.send(err);
			res.json("deleted :(");
		});
	});

// Get a specific users info
router.route('/theDisplayFeed/:id')
  .get(function(req, res) {
    User.findOne({ _id: req.params.id }, { password: 0}, function(err, display_user) {
        if (err) {
          console.log('Error getting display feed. ', err);
          return res.json(err);
        }

        var allPosts = [];

        for (var i = 0; i < display_user.posts.length; i++) {
          var post = {
            user_id: display_user._id,
            created_by: display_user.displayName,
            text: display_user.posts[i].text,
            created_at: display_user.posts[i].created_at,
            _id: display_user.posts[i]._id
          };
          allPosts.push(post);
        }

        var user_allPosts = {
          display_user: display_user,
          allPosts: allPosts
        };
        res.json(user_allPosts);
      });
  });

// Api for a specfic post
router.route('/posts/:id')
   // Get the current post
   .get(function(req,res){
      User.findById(req.params.id, function(err, post){
         if(err)
             res.send(err);
         res.json(post);
      });
   })

    // Update the current post
    .post(function(req,res){
      User.findOneAndUpdate({
        username: req.body.created_by
      },{
        $push: {posts: req.body.text}
      },{
        upsert: true
      },
      function(err){
        if(err){
          return res.send(err);
        }
          res.json(User);
      });
    })

    //updates specified post
	.put(function(req, res){
		User.update({
			"posts._id": req.params.id
		},{
			$set: {
				"posts.$.text": req.body.text
				// "posts.$.likes": req.body.likes
			}
		},
			function(err, numAffected){
				if(err)
					return res.send(err);

				res.json(numAffected);
		});
	})

    // Delete the current post
    .delete(function(req,res){
      User.remove({
           _id: req.params.id
      }, function(err) {
           if (err)
               res.send(err);
           res.json("deleted :(");
      });
    });

//current_user follows a new user
router.route('/follow/:id')
  .put(function(req, res) {
    User.findOneAndUpdate({
      _id: req.params.id
    },{
      $push: { following: req.body._id }
    },{
      upsert: true
    }, function(err) {
      if (err) {
        console.log('Error when current_user follows new user.');
        console.log(err);
        return res.send(err);
      }

      User.findOneAndUpdate({
        _id: req.body._id
      },{
        $push: { followers: req.params.id }
      },{
        upsert: true
      }, function(err) {
        if (err) {
          console.log('Error when new user is followed by current_user.');
          return res.send(err);
        }
        res.json('You are now following');
      });
    });
  });

//current_user unfollows a new user
router.route('/unfollow/:id')
  .put(function(req, res) {
    User.update({
      _id: req.params.id
    },{
      $pull: { following: req.body._id }
    },{
      upsert: true
    }, function(err) {
      if (err) {
        console.log('Error when current_user follows new user.');
        return res.send(err);
      }

      User.update({
        _id: req.body._id
      },{
        $pull: { followers: req.params.id }
      },{
        upsert: true
      }, function(err) {
        if (err) {
          console.log('Error when new user is followed by current_user.');
          return res.send(err);
        }
        res.json('You are not following anymore!');
      });
    });
  });

module.exports = router;
