const jwt = require("jsonwebtoken");

function decorateHtmlResponse(pageTitle) {
  return function (req, res, next) {
    res.locals.html = true;
    res.locals.title = `${pageTitle} -  ${process.env.APP_NAME}`;
    res.locals.loggedInUser = {};
    res.locals.errors = {};
    res.locals.data = {};

    const token = req.signedCookies[process.env.COOKIE_NAME];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.loggedInUser = decoded;
      } catch (error) {
        res.locals.loggedInUser = {};
      }
    }

    next();
  };
}

module.exports = decorateHtmlResponse;
