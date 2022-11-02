const databaseService = require("./databaseService");

const shelveBook = async (req, res) => {
  try {
    const user = await databaseService.getUser(req.body.userId);
    const bookId = req.body.bookId;
    const shelf = req.body.shelf;
    if (user && bookId && shelf) {
      const book = {
        bookId: bookId,
        shelf: shelf,
        progress: 0,
      };
      user.books.push(book);
      await user.save();
      res.status(200).json({
        message: `Book added to ${shelf} shelf.`,
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
      user.books.forEach((book) => {
        console.log(book.bookId);
        if (book.bookId === bookId) {
          console.log("found!");
          book.progress = progress;
        }
      });
      await user.save();
      res.status(200).json({
        message: `Progress updated.`,
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
      const book = user.books.filter((book) => book.bookId === bookId);
      res.status(200).json(book);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//method that will return all users books
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
