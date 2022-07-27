const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
    },
    userEmail :{
        type:String,
    },
    msg: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
