const Post = require("../models/post");
const User = require("../models/user");

// date formatting package
const moment = require("moment");
module.exports.home = async function (req, res) {
  
  try {
    
    let posts = await Post.find({})
      .populate("user")
      .populate({
        //populating comment and the author of the comment
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .sort("-createdAt");
    // .sort({ updatedAt: -1 });

    let users = await User.find({});
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
