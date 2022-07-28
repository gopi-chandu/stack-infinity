const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const flash = require("connect-flash");
const custom_flash_middleware = require("./config/custom-flash-middleware");
// for the session cookie
const session = require("express-session");
const passport = require("passport");
const passportJWT = require("./config/passport-jwt-strategy");
const passportLocal = require("./config/passport-local-strategy");
// for storing cookie session persistently in database
const MongoStore = require("connect-mongo");

// **********************
//for chats , socket io
const chatServer = require("http").Server(app); //passing express app
// pass chat sockets to chat server
const chatSocket = require("./config/chat-sockets").chatSockets(chatServer);
chatServer.listen(process.env.PORT || 3000);
console.log("chat server is listening on port @@@@@@@ ... ");
// **********************

const env = require("./config/environment");

//for scss
const sassMiddleware = require("node-sass-middleware");
const path = require("path");

if (env.name == "development") {
  app.use(
    sassMiddleware({
      // current path , ./assets/
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css", // in templates we have used the "/css" as the prefix so we use it here
    })
  );
}



app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(env.asset_path));
// to access avatars from browser
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// set up view engine
app.set("view engine", "ejs");
app.set("views", "./views"); // without using path module we can do ./view here

//mongoStore is used for storing session cookie in database
app.use(
  session({
    name: "stack_infinity",
    //change the secret key value before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // session cookie expires after this time
    },
    store: MongoStore.create(
      {
        mongoUrl: env.db,
        mongoConnection: db,
        autoRemove: "disabled",
      },
      function (err) {
        //callback function
        console.log(err || "connect-mongodb setup is working...");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use((req, res, next) => {
  // console.log(req.session)
  // console.log(req.user)
  next();
});

app.use(flash());
app.use(custom_flash_middleware.setFlash);
// use express router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }
  console.log(`Server is running on port ${port}`);
});
