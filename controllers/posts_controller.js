const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.create = async function (req, res) {
  console.log("req body : ", req.body.content);
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    
    let posts = await Post.findById(post._id).populate("user")
      console.log('post ---- ',posts)
    // check if the req is ajax
    if (req.xhr) {
      
      return res.status(200).json({
        data: {
          post: posts,
        },
        message: "post is created.",
      });
    }

    req.flash("success", "Post created");
    return res.redirect("back");
  } catch (err) {
    console.log(`Error ${err}`);
  }
};

module.exports.destroy = async function (req, res) {
  // console.log(req.params.id);
  try {
    let post = await Post.findById(req.params.id);
    // here .id means the object id is converted to string, makes it easy for comparison
    if (post.user == req.user.id) {
      await post.remove();
      //deleting all the comments of the posts
      await Comment.deleteMany({ post: req.params._id });


      if (req.xhr) {
      
        return res.status(200).json({
          data: {
            post_id:req.params.id,
          },
          message: "post deleted.",
        });
      }

      req.flash("success", "Post deleted");



      return res.redirect("back");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log(`Error ${err}`);
  }
};

module.exports.posts = function (req, res) {
  return res.render("user_profile", {
    title: "posts",
  });
};
