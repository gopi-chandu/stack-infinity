const express = require("express");
const router = express.Router();
const passport = require("passport");

const usersController = require("../controllers/users_controller");

// to see each individual profile
router.get(
  "/profile/:id",
  passport.checkAuthentication,
  usersController.profile
);
//to update our current profile
router.post(
  "/update/:id",
  passport.checkAuthentication,
  usersController.update
);

router.get("/sign-in", usersController.signIn);
router.get("/sign-up", usersController.signUp);

router.post("/create", usersController.create);

router.get("/send-otp", usersController.sendOTP);
// using passport as middleware
router.post(
  "/create-session",
  passport.authenticate("local", { failureRedirect: "/users/sign-in" }),
  usersController.createSession
);

// router.post(
//   "/create-session",
//   passport.authenticate("local", { failureRedirect: "/users/sign-in",function(req,res){
//     console.log('call back======================');
//     return;
//   } }),
//   usersController.createSession
// );

router.post("/get-otp", usersController.getOTP);
router.post("/verifyOTP", usersController.verifyOTP);
router.get("/sign-out", usersController.destroySession);
router.post('/resend-otp-verification',usersController.resendOTPVerification)
module.exports = router;
