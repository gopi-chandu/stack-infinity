const mongoose = require("mongoose");

const friendshipSchema = new mongoose.Schema(
  {
    //user who sent the request
    from_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    //the user who accepts request
  },
  {
    timestamps: true,
  }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
