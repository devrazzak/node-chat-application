// Dependencies
const express = require("express");

const { getLogin, login, logout } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidators");

const router = express.Router();

// set page title
const pageTitle = "Login";

// Login page
router.get("/", decorateHtmlResponse(pageTitle), getLogin);

// process login
router.post(
  "/",
  decorateHtmlResponse(pageTitle),
  doLoginValidators,
  doLoginValidationHandler,
  login,
);

// logout
router.delete("/", logout);

// Export module
module.exports = router;
