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
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// Users page
router.get("/", decorateHtmlResponse("Users"), checkLogin, getUsers);

// Create User
router.post(
  "/",
  checkLogin,
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser,
);

// Delete User
router.delete("/:id", deleteUser);

// Export module
module.exports = router;
