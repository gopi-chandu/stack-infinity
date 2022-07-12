const express = require("express");
const app = express();
const port = 8000;
// const path=require('path')

// use express router
app.use("/", require("./routes"));

// set up view engine
app.set('view engine','ejs')
app.set('views','./views') // without using path module we can do ./view here

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running the server ${err}`);
  }
  console.log(`Server is running on port ${port}`);
});
