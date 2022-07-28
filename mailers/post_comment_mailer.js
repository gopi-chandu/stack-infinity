const nodemailer = require("../config/nodemailer");
const env = require("../config/environment");

exports.newPostComment = (post) => {
  console.log(post)
  console.log(env.smtp)
  let htmlString = nodemailer.renderTemplate(
    { comment: post },
    "/comments/newPostComment.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: "developer.illuminati@gmail.com",
      to: post.user.email,
      subject: "someone commented on your post",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("error in sending mail", err);
        return;
      }

      console.log("mail sent", info);
      return;
    }
  );
};
