const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    // function details send from website
    function (req, email, password, done) {
      // find a user and establish the identity
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          req.flash("error", err);
          return done(err);
        }

        if (!user || user.password != password) {
          req.flash("error", "Invalid Username/Password");
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }

        return done(null, user);
      });
    }
  )
);

// serializer to set the cookies when user signs in

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

// deserializer to see the data send from the user and find user

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log("Error in finding ...");
      return done(err);
    }
    return done(null, user);
  });
});

// check if the user is authenticated or not
passport.checkAuthentication = function (req, res, next) {
  console.log(res.locals);
  //if the user is authenticated then go to next function
  if (req.isAuthenticated()) {
    return next();
  }

  //if the user is not signed  in
  return res.redirect("/users/sign-in");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we need to send this to locals for the views
    res.locals.user = req.user;
    console.log("user is set");
  }
  next();
};

module.exports = passport;
