var LocalStrategy   = require('passport-local').Strategy;
var FacebookStrategy   = require('passport-facebook').Strategy;
var TwitterStrategy   = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var keys = require("./keys.js");
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var search = function (nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}
module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
   	console.log('serializing user:',user.username);
   	done(null, user._id);
   });

    passport.deserializeUser(function(id, done) {
   	User.findById(id, function(err, user) {
   		// console.log('deserializing user:', user.username);
   		done(err, user);
   	});
   });

 passport.use('login', new LocalStrategy({
         passReqToCallback : true
     },
     function(req, username, password, done) {
      console.log('YOOOOO', username);
        if (!req.user) {
          // Check if user exists
          console.log(username);
          User.findOne({"email": username}, function(err, user){
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
       } else {
          User.findOneAndUpdate({
              _id: req.user._id
            },{
              $push: {loginMethods: {provider: "Local",id: profile.id, password: createHash(password)}}
            },
            function(err){
              if(err){
                return done(err, false);
              }
                console.log('Successfully connected local to ' + req.user.displayName);

                return done(null, req.user);
          });
       }
     }
 ));

 passport.use('register', new LocalStrategy({
         passReqToCallback : true // allows us to pass back the entire request to the callback
     },
     function(req, username, password, done) {
         // Check if the user already exists
         User.findOne({"email": username}, function(err, user){
            if (err){
               return done(err);
            }

            if(user){
               // We have already signed this user up
               return done(null, false, { message: 'username already taken' })
            }
            // Add user to database
            var user = new User();

            user.password = createHash(password);
            user.displayName = username;
            user.email = username;
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

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
      clientID: keys.facebook.FACEBOOK_APP_ID,
      clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/facebook/callback",
      enableProof: false,
      passReqToCallback : true
    },
    function(req,accessToken, refreshToken, profile, done) {
      if (!req.user) {
        User.findOrCreate({ "loginMethods.id": profile.id }, {displayName: profile.displayName, loginMethods: {provider: "Facebook",id: profile.id}}, function (err, user) {
          if (err) { return done(err); }

          return done(err, user);

        });
      } else {
         User.findOne({ "loginMethods.id": profile.id }, function (err, user) {
           if (err) { return done(err); }

           if(user){
             // We have already signed this user up with this login method
             return done(null, false, { message: 'already connected' })
           }

             User.findOneAndUpdate({
                 _id: req.user._id
               },{
                 $push: {loginMethods: {provider: "Facebook",id: profile.id}}
               },
               function(err){
                 if(err){
                   return done(err, false);
                 }
                  console.log('Successfully connected facebook to ' + req.user.displayName);

                  return done(null, req.user);
           })

         });
      }
    }
    ));

    // =========================================================================
    // Twitter ================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({
      consumerKey: keys.twitter.TWITTER_CONSUMER_KEY,
      consumerSecret: keys.twitter.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:3000/twitter/callback",
      passReqToCallback : true
    },
    function(req, token, tokenSecret, profile, done) {
      if (!req.user) {
        User.findOrCreate({ "loginMethods.id": profile.id }, {displayName: profile.displayName, loginMethods: {provider: "Twitter",id: profile.id}}, function (err, user) {
          if (err) { return done(err); }

          return done(err, user);

        });
      } else {
        User.findOneAndUpdate({
            _id: req.user._id
          },{
            $push: {loginMethods: {provider: "Twitter",id: profile.id}}
          },
          function(err){
            if(err){
              return done(err, false);
            }
              console.log('Successfully connected twitter to ' + req.user.displayName);

              return done(null, req.user);
        });
      }
    }
    ));

    // =========================================================================
    // GOOGLE ================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
      clientID: keys.google.GOOGLE_CLIENT_ID,
      clientSecret: keys.google.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback : true
    },
    function(req,accessToken, refreshToken, profile, done) {
      if (!req.user) {
        User.findOrCreate({ "loginMethods.id": profile.id }, {
           displayName: profile.displayName,
           firstName: profile.name.givenName,
           lastName: profile.name.familyName,
           avatar: profile.photo.value,
           loginMethods: {provider: "Google",id: profile.id}
        }, function (err, user) {
          if (err) { return done(err); }

          return done(err, user);

        });
      } else {
        User.findOneAndUpdate({
            _id: req.user._id
          },{
            $push: {loginMethods: {provider: "Google",id: profile.id}}
          },
          function(err){
            if(err){
              return done(err, false);
            }
              console.log('Successfully connected google to ' + req.user.displayName);

              return done(null, req.user);
        });
      }
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
