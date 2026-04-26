//Get login page
function getLogin(req, res, next) {
  res.render("index");
}

// Export module
module.exports = {
  getLogin,
};
