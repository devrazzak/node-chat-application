// Dependencies
const createError = require("http-errors");

// 404 not found handler
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Not Found"));
};

// Default error handler

const errorHandler = (err, req, res, next) => {
  res.locals.error =
    process.env.NODE_ENV === "development" ? err : { message: err.message };

  res.status(err.status || 500);

  if (res.locals.html) {
    // Html response
    res.render("error", {
      title: "Error Page",
    });
  } else {
    // JSON response
    res.json(res.locals.error);
  }
};

// Export module
module.exports = {
  notFoundHandler,
  errorHandler,
};
