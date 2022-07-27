const Message = require("../models/message");

module.exports.chatSockets = function (socketServer) {
  let io = require("socket.io")(socketServer);

  io.sockets.on("connection", function (socket) {
    Message.find().then((result) => {
      // emiting to client, not all
      socket.emit("output-messages", result);
    });
    console.log("new connection received", socket.id);

    socket.on("disconnect", function () {
      console.log("socket disconnected...");
    });

    socket.on("join_room", function (data) {
      console.log("joining request received ", data);

      socket.join(data.chatroom);

      //emit in specific chat room, user_joined = event name should have space in them
      io.in(data.chatroom).emit("user_joined", data);
    });

    // get the send message event and broadcast
    socket.on("send_message", async function (data) {
      console.log("-=================", data);
      await Message.create({
        msg: data.message,
        user: data.user_name,
        userEmail: data.user_email,
      });
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
