const Book = require("../models/Book");
const googleBooksService = require("../services/googleBooksService");

const getBooks = (req, res) => {
  Book.find((err, books) => {
    if (err) {
      console.log(err);
    } else {
      res.json(books);
    }
  });
};

const searchBooks = async (req, res) => {
  const searchParams = req.params.searchParams;
  const searchBooksResult = await googleBooksService.searchBooks(searchParams);
  res.json(searchBooksResult);
};

exports.getBooks = getBooks;
exports.searchBooks = searchBooks;
