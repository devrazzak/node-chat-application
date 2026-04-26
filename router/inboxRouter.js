// Dependencies
const express = require("express");
const { getInbox } = require("../controller/inboxController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

const router = express.Router();

// Inbox page
router.get("/", decorateHtmlResponse("Inbox"), getInbox);

// Export module
module.exports = router;
