// Dependencies
const bcrypt = require("bcrypt");
const { unlink } = require("fs");
const path = require("path");

const User = require("../models/Peoples");

//Get login page
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.render("users", {
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

// Add user
const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // Save user or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User created successfully!",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      error: {
        common: {
          msg: "Internal server Error!",
        },
      },
    });
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        errors: {
          common: {
            msg: "User not found!",
          },
        },
      });
    }

    // Remove user avatar
    if (user.avatar) {
      // call unlink
      unlink(
        path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
        (err) => {
          if (err) console.log(err);
        },
      );
    }
    res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
};

// Export module
module.exports = {
  getUsers,
  addUser,
  deleteUser,
};
