const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

let transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false,
  port: 587,
  auth: {
    user: "development.illuminati@gmail.com",
    // password : ujyvkqzbazbjjwro
    pass: "ujyvkqzbazbjjwro",
  },
});

let renderTemplate = (data, relativePath) => {
  let mailHTML;

  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    data,
    function (err, template) {
      if (err) {
        console.log("error in rendering template");
        return;
      }

      mailHTML = template;
    }
  );

  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
