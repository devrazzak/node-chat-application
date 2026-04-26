// Dependencies
const express = require("express");

const {
  getUsers,
  addUser,
  deleteUser,
} = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const avatarUpload = require("../middlewares/users/avatarUploads");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidator");

const router = express.Router();

// Users page
router.get("/", decorateHtmlResponse("Users"), getUsers);

// Create User
router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser,
);

// Delete User
router.delete("/:id", deleteUser);

// Export module
module.exports = router;
