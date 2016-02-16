var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy   = require('passport-facebook').Strategy;
var TwitterStrategy   = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var keys = require("./keys.js");
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
   	console.log('serializing user:',user.username);
   	done(null, user._id);
   });

    passport.deserializeUser(function(id, done) {
   	User.findById(id, function(err, user) {
   		console.log('deserializing user:', user.username);
   		done(err, user);
   	});
   });

 passport.use('login', new LocalStrategy({
         passReqToCallback : true
     },
     function(req, username, password, done) {

        // Check if user exists
        User.findOne({_id: username}, function(err, user){
          if(err){
             return done(err);
          }

          if(!user) {
             return done(null, false, { message: "Incorrect Username." });
          }

          if(!isValidPassword(user, password)){
             // wrong password
             return done(null, false, { message: 'Incorrect Password' });
          }
          //Successfully logged in
         console.log('Successfully signed in');
          return done(null, user);
       });
     }
 ));

 passport.use('register', new LocalStrategy({
         passReqToCallback : true // allows us to pass back the entire request to the callback
     },
     function(req, username, password, done) {
         // Check if the user already exists
         User.findOne({_id: username}, function(err, user){
            if (err){
               return done(err);
            }

            if(user){
               // We have already signed this user up
               return done(null, false, { message: 'username already taken' })
            }
            // Add user to database
            var user = new User();

            user._id = username;
            user.password = createHash(password);
            user.displayName = username;
            user.posts = [];

            user.save(function(err, user){
               if(err){
                  return done(err, false);
               }

               console.log('Successfully signed up user ' + username);

               return done(null, user);
            })
         });
   }));

    passport.use(new FacebookStrategy({
       clientID: keys.facebook.FACEBOOK_APP_ID,
       clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
       callbackURL: "http://localhost:3000/facebook/callback",
       enableProof: false
     },
     function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ username: profile.id }, {displayName: profile.displayName, provider: "Facebook"}, function (err, user) {
         return done(err, user);
       });
     }
   ));

   passport.use(new TwitterStrategy({
       consumerKey: keys.twitter.TWITTER_CONSUMER_KEY,
       consumerSecret: keys.twitter.TWITTER_CONSUMER_SECRET,
       callbackURL: "http://localhost:3000/twitter/callback"
     },
     function(token, tokenSecret, profile, done) {
        console.log(profile.name);
       User.findOrCreate({ username: profile.id }, {displayName: profile.displayName, provider: "Twitter", posts: []}, function (err, user) {
          user.username = profile.screen_name;
         return done(err, user);
       });
     }
   ));

   passport.use(new GoogleStrategy({
       clientID: keys.google.GOOGLE_CLIENT_ID,
       clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
       callbackURL: "http://localhost:3000/google/callback"
     },
     function(accessToken, refreshToken, profile, done) {
        console.log(profile);
       User.findOrCreate({ username: profile.id }, {displayName: profile.displayName, provider: "Google"}, function (err, user) {
         return done(err, user);
       });
     }
   ));

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

};
