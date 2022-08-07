const express = require("express");
const router = express.Router();

const bookService = require("../services/bookService");

router.get("/books/getBooks", bookService.getBooks);

module.exports = router;
