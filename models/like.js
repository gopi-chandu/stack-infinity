const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    // object id of liked object
    likeable: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      refPath: "onModel",
    },
    //type of liked object ->dynamic reference
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
