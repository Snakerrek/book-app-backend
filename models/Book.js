const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  isbn: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
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
});

module.exports = Book = mongoose.model("book", BookSchema);
