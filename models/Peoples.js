// Dependencies
const mongoose = require("mongoose");

// Create Schema
const peopleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      require: true,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

// Create Model
const People = mongoose.model("People", peopleSchema);

// export module
module.exports = People;
