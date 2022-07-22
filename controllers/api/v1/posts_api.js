const Post = require("../../../models/post");
const Comment=require("../../../models/comment")
module.exports.index = async function (req, res) {
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
  return res.json(200, { message: "List of posts", posts: posts });
};

module.exports.destroy = async function (req, res) {
  // console.log(req.params.id);
  try {
    let post = await Post.findById(req.params.id);
    // here .id means the object id is converted to string, makes it easy for comparison
    //   if (post.user == req.user.id) {
    await post.remove();
    //deleting all the comments of the posts
    await Comment.deleteMany({ post: req.params._id });

    return res.json(200, { message: "Post deleted successfully ." });
    //   } else {
    //     return res.redirect("back");
    //   }
  } catch (err) {
    return res.json(500, { message: "Internal Server error" });
  }
};
