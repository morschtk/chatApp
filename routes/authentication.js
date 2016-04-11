var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

   /* GET home page. */
   router.get('/', function(req, res, next) {
     res.render('index', {message: req.flash('error')[0], title: "hey"});
   });

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? {
           id: req.user.id,
           displayName: req.user.displayName,
           following: req.user.following,
           followers: req.user.followers,
           posts: req.user.posts,
           firstName: req.user.firstName,
           lastName: req.user.lastName,
           avatar: req.user.avatar
        } : ""});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message:req.flash('error')[0]});
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    //Register
    router.post('/register', passport.authenticate('register', {
        successRedirect: '/success',
        failureRedirect: '/failure',
        failureFlash: true
    }));

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/success',
        failureRedirect: '/failure',
        failureFlash: true
    }));

    router.route('/assignUniqueName')
      .put(function(req, res) {
        User.findOneAndUpdate({
          _id: req.body.userId
        },{
          $set: {
            uniqueName: req.body.uniqueName
          }
        },{
          new: true,
        }, function(err, user) {
            if(err) {
              console.log('Error: Creating Unique Name.')
              res.send({state: 'failure', msg: 'That name has already been taken, please choose another.'});
            }
            res.send({state: 'success', userName: user.uniqueName});
        });
      });

    //Facebook
    router.get('/facebook', passport.authenticate('facebook'));

    router.get('/facebook/callback',
     passport.authenticate('facebook', {
                successRedirect : '/#',
                failureRedirect : '/'
     }));

    //Twitter
    router.get('/twitter', passport.authenticate('twitter'));

    router.get('/twitter/callback',
     passport.authenticate('twitter', {
                successRedirect : '/#',
                failureRedirect : '/'
     }));

     // Google
    router.get('/google', passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

    router.get('/google/callback',
     passport.authenticate('google', {
                successRedirect : '/#',
                failureRedirect : '/'
     }));




    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

        // locally --------------------------------
        router.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        router.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/#', // redirect to the secure # section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        router.get('/connect/facebook', passport.authorize('facebook'));

        // handle the callback after facebook has authorized the user
        router.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/#',
                failureRedirect : '/#'
            }));

    // twitter --------------------------------

        // send to facebook to do the authentication
        router.get('/connect/twitter', passport.authorize('twitter'));

        // handle the callback after facebook has authorized the user
        router.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to facebook to do the authentication
        router.get('/connect/google', passport.authorize('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

        // handle the callback after facebook has authorized the user
        router.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/#',
                failureRedirect : '/'
            }));

        // =============================================================================
        // UNLINK ACCOUNTS =============================================================
        // =============================================================================
        // used to unlink accounts. for social accounts, just remove the token
        // for local account, remove email and password
        // user account will stay active in case they want to reconnect in the future

            // local -----------------------------------
            router.get('/unlink/local', function(req, res) {
              User.findOneAndUpdate({
                  _id: req.user._id
                },{
                  $pull: {"loginMethods": {provider: "Local"}}
                },
                function(err){
                  if(err){
                    return done(err, false);
                  }
                    console.log('Successfully connected local to ' + req.user.displayName);

                    res.redirect('/');
              });
            });

            // facebook -------------------------------
            router.get('/unlink/facebook', function(req, res) {
              User.findOneAndUpdate({
                  _id: req.user._id
                },{
                  $pull: {"loginMethods": {provider: "Facebook"}}
                },
                function(err){
                  if(err){
                    return done(err, false);
                  }
                    console.log('Successfully connected facebook to ' + req.user.displayName);

                    res.redirect('/');
              });
            });

            // twitter --------------------------------
            router.get('/unlink/twitter', function(req, res) {
              User.findOneAndUpdate({
                  _id: req.user._id
                },{
                  $pull: {"loginMethods": {provider: "Twitter"}}
                },
                function(err){
                  if(err){
                    return done(err, false);
                  }
                    console.log('Successfully connected twitter to ' + req.user.displayName);

                    res.redirect('/');
              });
            });

            // google ---------------------------------
            router.get('/unlink/google', function(req, res) {
              User.findOneAndUpdate({
                  _id: req.user._id
                },{
                  $pull: {"loginMethods": {provider: "Google"}}
                },
                function(err){
                  if(err){
                    return done(err, false);
                  }
                    console.log('Successfully connected google to ' + req.user.displayName);

                    res.redirect('/');
              });
            });

    //log out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;

}
