const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const UserOTPVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    otp: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
);

const UserOTPVerification = mongoose.model(
  "UserOTPVerification",
  UserOTPVerificationSchema
);
module.exports = UserOTPVerification;
