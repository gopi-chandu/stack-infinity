
module.exports.error404 = async function (req, res) {
  try {

    return res.render("error", {
      title: "Error 404",
    });
  } catch (err) {
    console.log(`error : ${err}`);
    return;
  }
};
