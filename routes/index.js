const express = require("express");
const passport = require("passport");

const router = express.Router();
const homeController = require("../controllers/home_controller");
const errorController = require("../controllers/error_controller");
console.log("Router loaded ... ");

router.get("/", passport.checkAuthentication, homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comments"));
router.use("/likes", require("./likes"));
// router.use("/api", require("./api"));

router.use("*", errorController.error404);
//for any further routes from here , we use router.use()
module.exports = router;
