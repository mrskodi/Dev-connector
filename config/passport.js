const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const User = require('../models/User');
const mongoose = require('mongoose');

const opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secret;

module.exports = passport => {
    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
      
      User.findById(jwt_payload.id)
          .then(user => {
            if(user){
              // User exists. Pass the control to the callback function
              return done(null, user);
            }else{
              // User does not exist. Pass the control to the callback function stating that user wasn't found
              return done(null, false);
            }
          })
          .catch(err => console.log(err));
    }))
}


