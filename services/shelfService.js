const databaseService = require("./databaseService");

const shelveBook = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    const bookId = req.body.bookId;
    const shelf = req.body.shelf;
    let progress = 0;
    if (shelf === "READ") {
      const book = await databaseService.getBookFullInfo(bookId);
      progress = book.pageCount;
    }

    let bookData = {
      bookId: bookId,
      shelf: shelf,
      progress: progress,
    };

    if (user && bookId && shelf) {
      if (user.books.filter((book) => book.bookId === bookId).length > 0) {
        user.books.forEach((book, index) => {
          if (book.bookId === bookId) {
            user.books[index].shelf = shelf;
            bookData = user.books[index];
            bookData.progress = progress;
          }
        });
      } else {
        user.books.push(bookData);
      }
      await user.save();
      res.status(200).json({
        message: `Book added to ${shelf} shelf.`,
        book: bookData,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const unshelveBook = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    const bookId = req.body.bookId;
    if (user && bookId) {
      user.books = user.books.filter((book) => book.bookId !== bookId);
      await user.save();
      res.status(200).json({
        message: `Book removed from shelves.`,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const updateProgress = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    const bookId = req.body.bookId;
    const progress = req.body.progress;
    if (user && bookId && progress) {
      let updatedBook = {};
      user.books.forEach((book) => {
        if (book.bookId === bookId) {
          book.progress = progress;
          updatedBook = book;
        }
      });
      await user.save();
      res.status(200).json({
        message: `Progress updated.`,
        book: updatedBook,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getShelf = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    const shelf = req.body.shelf;
    if (user && shelf) {
      const books = user.books.filter((book) => book.shelf === shelf);
      res.status(200).json(books);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getUserBookData = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    const bookId = req.body.bookId;
    if (user && bookId) {
      const book = user.books.filter((book) => book.bookId === bookId)[0];
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ message: "Book not found." });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllUserBooks = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    if (user) {
      res.status(200).json(user.books);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.shelveBook = shelveBook;
exports.unshelveBook = unshelveBook;
exports.updateProgress = updateProgress;
exports.getUserBookData = getUserBookData;
exports.getShelf = getShelf;
exports.getAllUserBooks = getAllUserBooks;
