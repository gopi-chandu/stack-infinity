const passport = require("passport");

const JWTStrategy = require("passport-jwt").Strategy;
//to extract token from header , header-payload-s
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/user");

var options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  // decryption takes place using the key below
  secretOrKey: "gopi",
};

passport.use(
  new JWTStrategy(options, async function (jwtPayLoad, done) {
    console.log("jwt payload", jwtPayLoad);
    let user = await User.findOne({ email: jwtPayLoad.email });
    console.log('user------------->',user);
    if (user) {
      return done(null, user);
    } else {
      //user not found
      return done(null, false);
    }
  })
);

module.exports = passport;
