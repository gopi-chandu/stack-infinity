const User = require("../../../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const env=require('../../../config/environment')

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!user || !match) {
      return res.json(422, { message: "Invalid Username password" });
    }

    return res.json(200, {
      message: "User Signed in successfully , please save this token",
      data: {
        // here second argument is secret key, here encryption using key takes place
        token: jwt.sign(user.toJSON(),env.jwtKey, { expiresIn: "1000000" }),
      },
    });
  } catch (err) {
    return res.json(500, { message: "Internal Server error" });
  }
};
