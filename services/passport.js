const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
const localOptions = { usernameField: 'email' };
const localLogIn = new LocalStrategy(localOptions, function(email, password, done){
  // verify this email and password and call done
  // if it is the correct creds
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user){
    if(err) { return done(err); }
    if(!user) { return done(null, false); }

    // compare passwords
    user.comparePassword(password, function(err, isMatch){
      if(err) { return done(err) };
      if(!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

// setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done){
  // see if user ID in database exists
  // if it does, call 'done' with user
  // otherwise, call done without a user obj
  User.findById(payload.sub, function(err, user){
      if(err) { return done(err, false); }

      if(user) {
        done(null, user);
      } else {
        done(null, false);
      }
    });
  });

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogIn);
