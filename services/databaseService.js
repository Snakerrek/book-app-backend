const Book = require("../models/Book");

const getAllBooks = async () => {
  return await Book.find({}, { description: 0, pageCount: 0, categories: 0 });
};

const getBookFullInfo = async (id) => {
  return await Book.findById(id);
};

exports.getAllBooks = getAllBooks;
exports.getBookFullInfo = getBookFullInfo;
