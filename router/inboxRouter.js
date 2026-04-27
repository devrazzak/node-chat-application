// Dependencies
const express = require("express");
const { getInbox } = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// Inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// Export module
module.exports = router;
