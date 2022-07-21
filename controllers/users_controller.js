const User = require("../models/user");
module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);
    return res.render("user_profile", {
      title: "User Profile",
      profile_user: user,
    });
  } catch (err) {
    console.log(`Error ${err}`);
  }

  // User.findById(req.params.id, function (err, user) {
  //   if (err) {
  //     console.log("error in signing up...");
  //     return;
  //   }
  //   //console.log('user =',user);
  //   return res.render("user_profile", {
  //     title: "User Profile",
  //     profile_user: user,
  //   });
  // });
};
//render sign in page
module.exports.signIn = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

  return res.render("user_sign_in", {
    title: "Sign In",
  });
};
// render sign up page
module.exports.signUp = function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/profile");
  }

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
        return res.redirect("/users/sign-in");
      });
    } else {
      console.log("else part");
      return res.redirect("back");
    }
  });
};

// sign in and create a session
module.exports.createSession = function (req, res) {
  console.log("locals---", res.locals);
  req.flash("success", "Logged In Successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  // this is given by passport
  // req.logout(function (err) {
  //   if (err) {
  //     console.log(err);
  //     console.log("error =====================");
  //     return res.redirect("back");
  //   }
  // });
  //req.session.destroy();
  try {
    req.logout();
    req.flash("success", "Successfully logged out");
    return res.redirect("/");
  } catch (err) {
    console.log(err);
    console.log("error =====================");
  }
  

  // req.logout(function (err) {
  //   if (err) {
  //     console.log(err);
  //     console.log("error =====================");
  //     // return res.redirect("back");
      
  //   }
  // });
  
};

module.exports.update = async function (req, res) {
  console.log("req body ===================", req.body);
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findByIdAndUpdate(req.params.id, req.body);
      return res.redirect("back");
    } catch (err) {
      console.log(`Error ${err}`);
      // return res.redirect("back");
    }
  } else {
    return res.status(401).send("unauthorized");
  }
};
