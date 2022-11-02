const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

connectDB();

// controllers
const bookController = require("./controllers/bookController");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const shelfController = require("./controllers/shelfController");

app.use("/api/books", bookController);
app.use("/api/auth", authController);
app.use("/api/user", userController);
app.use("/api/shelf", shelfController);

const port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log("Server started on port 8080");
});
