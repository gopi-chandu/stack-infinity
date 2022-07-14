const User = require("../models/user");
module.exports.profile = function (req, res) {
  return res.render("user_profile", {
    title: "User Profile",
  });
};
//render sign in page
module.exports.signIn = function (req, res) {
  return res.render("user_sign_in", {
    title: "Sign In",
  });
};
// render sign up page
module.exports.signUp = function (req, res) {
  return res.render("user_sign_up", {
    title: "Sign Up",
  });
};

// get the sign up data
module.exports.create = function (req, res) {
  //console.log(req.body);
  if (req.body.password != req.body.confirm_password) {
    return res.redirect("back");
  }
  // check if user exists or not
  User.findOne({ email: req.body.email }, function (err, user) {
    // random error
    if (err) {
      console.log("error in signing up...");
      return;
    }
    // user not found
    if (!user) {
      User.create(req.body, function (err, user) {
        console.log("user created");
        return res.send("/users/sign-in");
      });
    } else {
      console.log("else part");
      return res.redirect("back");
    }
  });
};

// sign in and create a session
module.exports.createSession = function (req, res) {
  //TODO later
};
