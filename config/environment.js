const production = {
  name: "production",
  asset_path: process.env.asset_path,
  session_cookie_key: process.env.session_cookie_key,
  db: process.env.db,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    auth: {
      user: process.env.user,
      pass: process.env.pass,
    },
  },
  jwtKey: process.env.jwtKey,
};

module.exports =production;
