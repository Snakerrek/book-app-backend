const Book = require("../models/Book");
const User = require("../models/User");
const fetch = require("node-fetch");

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

const fetchFromGoogleAndAddBook = async (isbn) => {
  const bookTempData = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
  );
  const bookTempDataFromJson = await bookTempData.json();
  if (bookTempDataFromJson.items.length > 0) {
    const bookPureData = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookTempDataFromJson.items[0].id}`
    );
    const bookData = await bookPureData.json();
    if (bookData) {
      const newBook = {
        isbn: isbn,
        title: bookData.volumeInfo.title,
        publisher: bookData.volumeInfo.publisher,
        publishedDate: bookData.volumeInfo.publishedDate,
        authors: bookData.volumeInfo.authors,
        description: bookData.volumeInfo.description,
        pageCount: bookData.volumeInfo.pageCount,
        categories: bookData.volumeInfo.categories,
        cover: bookData.volumeInfo.imageLinks?.thumbnail
          ? bookData.volumeInfo.imageLinks.thumbnail
          : "",
      };
      await addBook(newBook);
    }
  }
};
const arrayOfIsbns = [];
// arrayOfIsbns.forEach(async (isbn) => {
//   await fetchFromGoogleAndAddBook(isbn);
// });

exports.getAllBooks = getAllBooks;
exports.getBookFullInfo = getBookFullInfo;
exports.addBook = addBook;
exports.rateBook = rateBook;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
