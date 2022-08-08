const express = require("express");
const router = express.Router();

const bookService = require("../services/bookService");

router.get("/books/getAllBooks", bookService.getAllBooks);
router.get("/books/searchBooks/:searchParams", bookService.searchBooks);
router.get("/books/searchBooksByTitle/:title", bookService.searchByTitle);
router.get("/books/searchBooksByISBN/:isbn", bookService.searchByISBN);
router.get("/books/searchBooksByAuthor/:author", bookService.searchByAuthor);

module.exports = router;
