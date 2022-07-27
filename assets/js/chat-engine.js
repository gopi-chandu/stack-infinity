// client side sockets io configuration

class ChatEngine {
  constructor(chatBoxId, userEmail, userName) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;
    this.userName = userName;

    // the io is a global object - comes from the cdn of socket included in layout.ejs
    // this.socket = io.connect("http://localhost:3000");

    this.socket = io.connect("http://localhost:3000");

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;
    console.log("self --->", self);
    this.socket.on("connect", function () {
      console.log("connection established using sockets...");

      // use the same room on server side too
      self.socket.emit("join_room", {
        user_email: self.userEmail,
        user_name: self.userName,
        chatroom: "stack-infinity",
      });

      self.socket.on("user_joined", function (data) {
        console.log("a user joined", data);
      });
      function appendMessages(data) {
        let newMessage = $("<li>");
        let messageType = "friend";
        if (data. userEmail == self.userEmail) {
          messageType = "our";
        }
        newMessage.append(
          $("<p>", {
            html: data.msg,
          })
        );

        // subscript
        newMessage.append(
          $("<sub>", {
            html: data.user,
          })
        );

        newMessage.addClass(messageType);

        $("#chat-messages").append(newMessage);
        // const html = `<div>${message}</div>`;
      }
      self.socket.on("output-messages", function (data) {
        console.log("output-messages", data);
        if (data.length) {
          data.forEach((element) => {
            appendMessages(element);
          });
        }
      });

      $("#send-message").click(function () {
        let msg = $("#chat-message-input").val();
        console.log(msg);
        if (msg != "") {
          console.log("message : ------------->", msg);
          self.socket.emit("send_message", {
            message: msg,
            user_email: self.userEmail,
            user_name: self.userName,
            chatroom: "stack-infinity",
          });
        }
      });

      self.socket.on("receive_message", function (data) {
        console.log("message received ", data.message);

        let newMessage = $("<li>");

        let messageType = "friend";

        if (data.user_email == self.userEmail) {
          messageType = "our";
        }
        newMessage.append(
          $("<p>", {
            html: data.message,
          })
        );

        // subscript
        newMessage.append(
          $("<sub>", {
            html: data.user_name,
          })
        );

        newMessage.addClass(messageType);

        $("#chat-messages").append(newMessage);
      });
    });
  }
}
