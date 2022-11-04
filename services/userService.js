const User = require("../models/User");
const databaseService = require("../services/databaseService");
const bcrypt = require("bcrypt");
const { isPasswordCorrect } = require("../services/authService");

const updateUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password && req.body.oldPassword) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const isOldPasswordCorrect = await isPasswordCorrect(
        req.body.userId,
        req.body.oldPassword
      );
      if (isOldPasswordCorrect) {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedUser);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
};

const deleteUser = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    const allBooks = await databaseService.getAllBooks();
    const enhancedBooks = [];
    others.books.forEach((book, index) => {
      const bookDetails = allBooks.filter((b) => b._id.equals(book.bookId));
      if (bookDetails && bookDetails.length > 0) {
        enhancedBooks.push({ ...book._doc, bookDetails: bookDetails[0] });
      }
    });
    const randomObject = { ...others, books: enhancedBooks };
    res.status(200).json(randomObject);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUser = getUser;
