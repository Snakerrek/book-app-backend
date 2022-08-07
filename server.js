const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const app = express();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

connectDB();

// routes
const booksRoutes = require("./routes/books");
app.use("/", booksRoutes);

const port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log("Server started on port 8080");
});
