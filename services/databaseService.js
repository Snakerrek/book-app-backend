const Book = require("../models/Book");

const getAllBooks = async () => {
  return await Book.find({}, { description: 0, pageCount: 0, categories: 0 });
};

const getBookFullInfo = async (id) => {
  return await Book.findById(id);
};

const addBook = async (newBook) => {
  const book = new Book(newBook);
  return await book.save();
};

exports.getAllBooks = getAllBooks;
exports.getBookFullInfo = getBookFullInfo;
exports.addBook = addBook;
