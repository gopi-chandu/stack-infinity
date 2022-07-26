const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");

// date formatting package
const moment = require("moment");
module.exports.home = async function (req, res) {
  try {
    let posts = await Post.find({})
      .sort("-createdAt")
      .populate("user")
      .populate({
        //populating comment and the author of the comment
        path: "comments",
        populate: {
          path: "user",
        },
        // populate: {
        //   path: "likes",
        // },
      })
      .populate("likes");

    // .sort({ updatedAt: -1 });

    let users = await User.find({});
    console.log(posts)
    // console.log("1111111111111111111111111",posts[0]);
    // return res.send("<h1>heyyy</h1>");
    return res.render("home", {
      title: "Stack Infinity | Home",
      posts: posts,
      all_users: users,
      moment: moment,
    });
  } catch (err) {
    console.log(`error : ${err}`);
    return;
  }
};
