const Comment = require("../models/comment");
const Post = require("../models/post");
const Like = require("../models/like");
const nodemailer = require("../config/nodemailer");
const commentsMailer = require("../mailers/comments_mailer");
const postCommentsMailer = require("../mailers/post_comment_mailer");
// const commentsMailer = require("../mailers/comments_mailer");

// for using the queue -> workers
// for using emails queue created ,so we include the below link

module.exports.create = async function (req, res) {
  try {
    // here post is the name of the post_id coming from form
    let post = await Post.findById(req.body.post).populate(
      "user",
      "name email"
    );
    let comment = await Comment.create({
      content: req.body.content,
      post: req.body.post, // here post is the id of the post
      user: req.user._id,
    });
    // updating the post
    // here push method puts the id of the comment
    await post.comments.push(comment); //pushing comment_id
    await post.save();
    // let job1 = queue.create("post-comment-emails", post).save(function (err) {
    //   if (err) {
    //     console.log("error in creating a queue", err);
    //     return;
    //   }

    //   console.log("job id -> -> ", job1.id);
    // },);
    let comments = await Comment.findById(comment._id).populate(
      "user",
      "name email"
    );
    console.log('hai')
    postCommentsMailer.newPostComment(post);
    // commentsMailer.newComment(comments);
    // let job = queue.create("emails", comments).save(function (err) {
    //   if (err) {
    //     console.log("error in creating a queue", err);
    //     return;
    //   }

    //   console.log('job id -> -> ',job.id);
    // });

    console.log("post ---- ", comments);
    if (req.xhr) {
      return res.status(200).json({
        data: {
          comment: comments,
        },
        message: "comment is created.",
      });
    }

    req.flash("success", "comment created");
    return res.redirect("/");
  } catch (err) {
    console.log(`Error ${err}`);
    return;
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.params.id);
    let postId = await comment.post._id;
    await comment.remove();
    let post = Post.findByIdAndUpdate(postId, {
      $pull: { comments: req.params._id },
    });

    await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

    if (req.xhr) {
      return res.status(200).json({
        data: {
          comment: req.params.id,
        },
        message: "comment is created.",
      });
    }

    req.flash("success", "comment deleted");
    return res.redirect("back");
  } catch (err) {
    console.log(`Error ${err}`);
    return;
  }
};
