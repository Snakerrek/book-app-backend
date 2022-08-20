const express = require("express");
const router = express.Router();

const bookService = require("../services/bookService");

router.get("/getAllBooks", bookService.getAllBooks);
router.get("/searchBooks/:searchParams", bookService.searchBooks);
router.get("/searchBooksByTitle/:title", bookService.searchByTitle);
router.get("/searchBooksByISBN/:isbn", bookService.searchByISBN);
router.get("/searchBooksByAuthor/:author", bookService.searchByAuthor);
router.get("/getDetails/:id", bookService.getDetails);

module.exports = router;
