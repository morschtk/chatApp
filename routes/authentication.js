var express = require('express');
var router = express.Router();

module.exports = function(passport){

   /* GET home page. */
   router.get('/', function(req, res, next) {
     res.render('index');
   });

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? {id: req.user.id, username: req.user.username} : ""});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
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

    //Register
    router.post('/register', passport.authenticate('register', {
        successRedirect: '/success',
        failureRedirect: '/failure'
    }));

    //log out
    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //Custom error page
    router.get('*', function(req, res) {
        res.redirect('/#/error');
    });

    return router;

}
