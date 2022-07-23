const nodemailer = require("../config/nodemailer");

exports.OTPMail = (user, otp) => {
  console.log(user);
  let htmlString = nodemailer.renderTemplate(
    { name: user.name, otp: otp },
    "/otp/otpmail.ejs"
  );

  nodemailer.transporter.sendMail(
    {
      from: "developer.illuminati@gmail.com",
      to: user.email,
      subject: "OTP",
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
