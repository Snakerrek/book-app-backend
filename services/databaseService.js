const Book = require("../models/Book");

const getAllBooks = async () => {
  return await Book.find(
    {},
    { description: 0, isbn: 0, pageCount: 0, categories: 0 }
  );
};

exports.getAllBooks = getAllBooks;
