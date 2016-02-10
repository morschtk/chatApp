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

      User.find({}, {posts: 1},function(err, data){
         if (err){
            res.send(500, err);
         }

         return res.send(data.posts);
      })
   })

   //Create a new post
   .post(function(req, res){
    // Update the current post
      User.findOneAndUpdate({
        _id: req.body.created_by
      },{
        $push: {posts: { text: req.body.text}}
      },
      function(err){
        if(err){
          return res.send(err);
        }
        res.json(User);
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

module.exports = router;
