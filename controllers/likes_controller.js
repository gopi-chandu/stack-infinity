const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");
const Like = require("../models/like");
var ObjectId = require("mongodb").ObjectId;
module.exports.toggleLike = async function (req, res) {
  try {
    // our post looks like this
    // likes/toggle/?id=11232&type=Post or Comment
    console.log(req.query);
    let likeable;
    let deleted = false;

    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    // check for existing likes- check for the like on that post/comment from user- as it can be only one time
    console.log(req.query);
    console.log(req.user);
    let existingLike = await Like.findOne({
      likeable: new ObjectId(req.query.id),
      onModel: req.query.type,
      user: req.user._id,
    });

    // let existingLike = await Like.findOne({
    //   // likeable: req.query.id,
    //   user: req.user._id,
    //   onModel: req.query.type,
    // });
    console.log(existingLike);
    // if a like exists then delete it

    
    //doc._id = new ObjectId(doc._id); 
    // wrap in ObjectID

    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();

      existingLike.remove();
      deleted = true;
    } else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: new ObjectId(req.query.id),
        onModel: req.query.type,
      });
      console.log("Created Like-----------");
      console.log(newLike);
      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.json(200, {
      message: "Request successful",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
