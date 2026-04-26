// Dependencies
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const { unlink } = require("fs");
const path = require("path");

const User = require("../../models/Peoples");

// Add user
const addUserValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other then alphabet")
    .trim(),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (user) {
          throw createError("Email already exists!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),

  check("phone")
    .isMobilePhone("bn-BD", {
      strictMode: true,
    })
    .withMessage("Phone number must be a valid Bangladeshi number")
    .custom(async (value) => {
      const user = await User.findOne({ phone: value });

      if (user) {
        throw createError("Phone number already exists!");
      }

      return true;
    }),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be 8 char & should contain at least 1 uppercase, lowercase, number & symbol",
    ),
];

const addUserValidationHandler = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // Remove uploaded files
    if (req.files.length > 0) {
      const filename = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${filename}`),
        (err) => {
          if (err) console.log(err);
        },
      );
    }

    // Response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

// export module
module.exports = {
  addUserValidators,
  addUserValidationHandler,
};
