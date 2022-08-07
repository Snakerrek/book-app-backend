const Book = require("../models/Book");

const getBooks = (req, res) => {
  Book.find((err, books) => {
    if (err) {
      console.log(err);
    } else {
      res.json(books);
    }
  });
};

exports.getBooks = getBooks;
