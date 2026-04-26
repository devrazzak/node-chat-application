// Dependencies
const { check, validationResult } = require("express-validator");

// login validations
const doLoginValidators = [
  check("username")
    .isLength({
      min: 1,
    })
    .withMessage("Email or phone number is required"),

  check("password")
    .isLength({
      min: 1,
    })
    .withMessage("Password is required"),
];

// login validation handler
const doLoginValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.render("index", {
      username: req.body.username,
      errors: mappedErrors,
    });
  }
};

// export module
module.exports = {
  doLoginValidators,
  doLoginValidationHandler,
};
