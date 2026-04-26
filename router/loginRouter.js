// Dependencies
const express = require("express");

const { getLogin } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

const router = express.Router();

// Login page
router.get("/", decorateHtmlResponse("Login"), getLogin);

// Export module
module.exports = router;
