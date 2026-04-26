// Dependencies
const express = require("express");

const { getUsers } = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

const router = express.Router();

// Users page
router.get("/", decorateHtmlResponse("Users"), getUsers);

// Export module
module.exports = router;
