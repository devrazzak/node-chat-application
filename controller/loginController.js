// Dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const User = require("../models/Peoples");

//Get login page
function getLogin(req, res, next) {
  res.render("index");
}

// Do login
const login = async (req, res, next) => {
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { phone: req.body.username }],
    });
    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          username: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        // set logged in user local identifier
        res.locals.loggedInUser = userObject;

        res.redirect("/inbox");
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (error) {
    res.render("index", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
};

// Do logout
const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("Logged Out.  ");
};

// Export module
module.exports = {
  getLogin,
  login,
  logout,
};
