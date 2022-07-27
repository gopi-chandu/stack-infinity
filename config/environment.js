
const production = {
  name: "production",
  asset_path: "./assets",
  session_cookie_key: process.env.secret,
  db: process.env.db,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: process.env.port,
    auth: {
      user: process.env.email,
      // password : ujyvkqzbazbjjwro
      pass: process.env.password,
    },
  },
  jwtKey: process.env.secret,
};

module.exports =production;
