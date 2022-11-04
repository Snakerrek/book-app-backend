const Book = require("../models/Book");
const User = require("../models/User");

const getAllBooks = async () => {
  return await Book.find(
    {},
    { description: 0, pageCount: 0, categories: 0, reviews: 0 }
  );
};

const getBookFullInfo = async (id) => {
  return await Book.findById(id);
};

const addBook = async (newBook) => {
  const book = new Book(newBook);
  return await book.save();
};

const rateBook = async (data) => {
  const book = await getBookFullInfo(data.bookID);
  let updated = false;
  if (!book.reviews) {
    book.reviews = [];
  }
  book.reviews.forEach((review) => {
    if (review.authorID === data.authorID) {
      if (data.starRating) review.starRating = data.starRating;
      if (data.reviewText) review.review = data.reviewText;
      updated = true;
    }
  });
  if (!updated) {
    book.reviews.push({
      starRating: data.starRating,
      authorID: data.authorID,
      review: data.reviewText,
    });
  }
  return await book.save();
};

// get user by id from mongodb database using mongoose
const getUser = async (id) => {
  return await User.findById(id);
};

const getAllUsers = async () => {
  return await User.find({});
};

exports.getAllBooks = getAllBooks;
exports.getBookFullInfo = getBookFullInfo;
exports.addBook = addBook;
exports.rateBook = rateBook;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
