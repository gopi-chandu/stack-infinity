const User = require("../models/user");
const fs = require("fs");
const path = require("path");

// for otp encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

//otp mailer
const OTPMailer = require("../mailers/otp_mailer");

const UserOTPVerification = require("../models/userOTPVerification");
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

  //call back function def
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

module.exports.resendOTPVerification = async function (req, res) {
  try {
    let { userID, email } = req.body;
  } catch (err) {}
  return;
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
        console.log("user verified : ", user);
        sendOTPVerificationEmail(user, req, res);

        //return res.redirect("/users/sign-in");
      });
    } else {
      req.flash("error", "User Already exists , please sign in");
      console.log("user already exists");
      return res.redirect("/users/sign-in");
    }
  });
};
//send otp verification email
const sendOTPVerificationEmail = async function (user, req, res) {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    UserOTPVerification.create({
      userId: user._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    OTPMailer.OTPMail(user, otp);
    req.flash("success", "OTP sent");
    return res.render("user_otp", {
      title: "Enter otp to verify email",
      userID: user._id,
    });
  } catch (err) {
    req.flash("error", "error 123");
    console.log(err);
    console.log("error =====================");
  }
};
module.exports.getOTP = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("user not found");
    }
    sendOTPVerificationEmail(user, req, res);
    return res.render("user_otp", {
      title: "enter otp ",
      userID: user.id,
    });
  } catch (err) {}
};
//verify otp
module.exports.verifyOTP = async function (req, res) {
  try {
    console.log(req.body);
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      console.log("empty otp details -> ");
    } else {
      const UserOTPVerificationRecord = await UserOTPVerification.find({
        userId,
      }).sort({ createdAt: -1 });
      
      if (UserOTPVerificationRecord.length <= 0) {
        // no record
        // throw error
        console.log("No record found");
      } else {
        const { expiresAt } = UserOTPVerificationRecord[0];
        const hashedOTP = UserOTPVerificationRecord[0].otp;
        console.log("Hashed otp :", hashedOTP);
        if (expiresAt < Date.now()) {
          console.log("otp expired");
          await UserOTPVerification.deleteMany({ userId });
          // tell the user otp expired , so create a new otp and send
          req.flash("error", "otp expired , new otp is sent");
          let user = await User.findById(userId);
          sendOTPVerificationEmail(user, req, res);
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          console.log("valid otp", validOTP);
          if (!validOTP) {
            // otp is wrong
            console.log("wrong otp ... ");
          } else {
            console.log("else part lo unnam", validOTP);
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            req.flash("success", "verified !!!");
            return res.redirect("/users/sign-in");
          }
        }
      }
    }
  } catch (err) {}
};

module.exports.sendOTP = async function (req, res) {
  // console.log(req.body)
  // let user = await User.findOne({ email: req.body.email });
  // console.log('user ===================>>>>>',user);
  return res.render("user_send_otp", {
    title: "Enter email to send otp",
    // userID: user.id,
  });
};
// sign in and create a session
module.exports.createSession = function (req, res) {
  console.log("locals---", res.locals);
  //  do this part
  // if(user.verified)
  // {
  //   req.flash("error", "User Already exists , please sign in");
  //   console.log("user already exists");
  //   return res.redirect("/users/sign-in");
  // }
  // else{
  //   console.log("user already exists");
  //   return res.render("user_otp", {
  //     title: "Enter otp to verify email",
  //     userID: user._id,
  //   });
  // }

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
  if (req.user.id == req.params.id) {
    try {
      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {
        if (err) console.log("***** Multer error ", err);

        user.name = req.body.name;
        user.email = req.body.email;
        console.log(req.body);
        if (req.file) {
          console.log(req.file);

          if (user.avatar) {
            if (fs.existsSync(path.join(__dirname, "..", user.avatar))) {
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
            }
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }
        user.save();
        return res.redirect("back");
      });
    } catch (err) {
      console.log(`Error ${err}`);
      // return res.redirect("back");
    }
  } else {
    return res.status(401).send("unauthorized");
  }
};
