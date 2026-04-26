// Dependencies
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/userRouter");
const inboxRouter = require("./router/inboxRouter");

// Initialize app
const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;

if (!MONGO_CONNECTION_STRING) {
  throw new Error("MONGO_CONNECTION_STRING is missing in .env");
}

// Request parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// 404 not found handling
app.use(notFoundHandler);

// Common error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING);
    console.log("Database Connection Successful...");

    app.listen(PORT, () => {
      console.log(`App listening to port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start app:", err.message);
    process.exit(1);
  }
};

startServer();
