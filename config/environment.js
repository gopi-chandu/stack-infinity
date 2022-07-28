const development = {
  name: "development",
  asset_path: "./assets",
  session_cookie_key: "gopi",
  db: "mongodb+srv://gopichandu:DoneForMe@cluster0.yqqybxx.mongodb.net/stack_infinity",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: 587,
    auth: {
      user: "development.illuminati@gmail.com",
      // password : ujyvkqzbazbjjwro
      pass: "ujyvkqzbazbjjwro",
    },
  },
  jwtKey: "gopi",
};
const production = {
  name: "production",
  asset_path: process.env.asset_path,
  session_cookie_key: process.env.session_cookie_key,
  db: process.env.db,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port: process.env.port,
    auth: {
      user: process.env.user,
      // password : ujyvkqzbazbjjwro
      pass: process.env.password,
    },
  },
  jwtKey: process.env.jwtKey,
};

module.exports =production;
