const express = require("express");
const passport = require("passport");

const router = express.Router();
const homeController = require("../controllers/home_controller");

console.log("Router loaded ... ");

router.get("/",passport.checkAuthentication, homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
//for any further routes from here , we use router.use()
module.exports = router;
