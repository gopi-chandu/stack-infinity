const nodemailer = require("../config/nodemailer");

exports.newComment = (comment) => {
  console.log(comment.user.email)
  let htmlString = nodemailer.renderTemplate(
    { comment: comment },
    "/comments/newcomment.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: "developer.illuminati@gmail.com",
      to: comment.user.email,
      subject: "comment published successfully",
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
