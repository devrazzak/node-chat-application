//Get login page
function getInbox(req, res, next) {
  res.render("inbox");
}

// Export module
module.exports = {
  getInbox,
};
