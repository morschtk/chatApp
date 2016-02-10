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

      User.find({},function(err, data){
         if (err){
            res.send(500, err);
         }

         return res.send(data);
      })
   })

   //Create a new post
   .post(function(req, res){
      var post = new User();
      post.text = req.body.text;
      post.created_by = req.body.created_by;
      post.save(function(err, post) {
          if (err){
             return res.send(500, err);
          }
          return res.json(post);
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
    .put(function(req,res){
      User.findById(req.params.id, function(err, post){
           if(err)
               res.send(err);

           post.created_by = req.body.created_by;
           post.text = req.body.text;

           post.save(function(err, post){
               if(err)
                   res.send(err);

               res.json(post);
           });
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
        return res.send(err);
      }

      User.findOneAndUpdate({
        _id: req.body._id
      },{
        $push: { followers: req.params._id }
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
          $pull: { followers: req.params._id }
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
