//Get login page
function getUsers(req, res, next) {
  res.render("users");
}

// Export module
module.exports = {
  getUsers,
};
