var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy   = require('passport-facebook').Strategy;
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
           User.findOne({username: username}, function(err, user){
             if(err){
                return done(err, false);
             }

             if(!user) {
                return done("User " + username + " doesn't exists", false);
             }

             if(!isValidPassword(user, password)){
                // wrong password
                return done('Incorrect Password', false);
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
            User.findOne({username: username}, function(err, user){
               if (err){
                  return done(err, false);
               }

               if(user){
                  // We have already signed this user up
                  return done(new Error('username already taken'), false)
               }
            });

            // Add user to database
            var user = new User();

            user.username = username;
            user.password = createHash(password);
            user.displayName = username;

            user.save(function(err, user){
               if(err){
                  return done(err, false);
               }

               console.log('Successfully signed up user ' + username);

               return done(null, user);
            })


        })
    );

    passport.use(new FacebookStrategy({
       clientID: keys.facebook.FACEBOOK_APP_ID,
       clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
       callbackURL: "http://localhost:3000/facebook/callback",
       enableProof: false
     },
     function(accessToken, refreshToken, profile, done) {
        console.log(profile.id);

       // Add user to database
       var user = new User();

       user.username = profile.displayName;
       user.password = "";
       user.displayName = profile.displayName;

       user.save(function(err, user){
          if(err){
             return done(err, false);
          }

          console.log('Successfully signed up user ' + user.username);

          return done(null, user);
       })
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
