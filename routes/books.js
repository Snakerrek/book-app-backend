const express = require("express");
const router = express.Router();

const bookService = require("../services/bookService");

router.get("/books/getBooks", bookService.getBooks);
router.get("/books/searchBooks/:searchParams", bookService.searchBooks);

module.exports = router;
