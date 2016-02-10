var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

module.exports = function(passport){

   /* GET home page. */
   router.get('/', function(req, res, next) {
     res.render('index', {message: req.flash('error')[0], title: "hey"});
   });

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? {id: req.user.id, username: req.user.username, following: req.user.following} : ""});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message:req.flash('error')[0]});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/success',
        failureRedirect: '/failure',
        failureFlash: true
    }));

    //Facebook
    router.post('/facebook', passport.authenticate('facebook', {
       successRedirect: '/success',
       failureRedirect: '/failure'
    }));

    router.get('/facebook/callback',
     passport.authenticate('facebook', { failureRedirect: '/failure' }),
     function(req, res) {
       // Successful authentication, redirect home.
       res.redirect('/#');
     });

     // Google
     router.get('/google',
       passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));

     router.get('/google/callback',
       passport.authenticate('google', { failureRedirect: '/login' }),
       function(req, res) {
         // Successful authentication, redirect home.
         res.redirect('/');
       });


    //Twitter
    router.get('/twitter',
      passport.authenticate('twitter'));

    router.get('/twitter/callback',
      passport.authenticate('twitter', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      });

    //Register
    router.post('/register', passport.authenticate('register', {
        successRedirect: '/success',
        failureRedirect: '/failure',
        failureFlash: true
    }));

    //log out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;

}
