const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  isbn: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
  },
  publishedDate: {
    type: String,
  },
  authors: [
    {
      type: String,
      required: true,
    },
  ],
  description: {
    type: String,
  },
  pageCount: {
    type: Number,
  },
  categories: [
    {
      type: String,
    },
  ],
  cover: {
    type: String,
  },
  reviews: [
    {
      starRating: { type: Number, min: 1, max: 10 },
      review: { type: String },
      authorID: { type: String },
    },
  ],
});

module.exports = Book = mongoose.model("book", BookSchema);
