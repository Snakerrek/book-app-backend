const Book = require("../models/Book");

const getAllBooks = async () => {
  return await Book.find({});
};

exports.getAllBooks = getAllBooks;
