const User = require("../models/User");
const databaseService = require("../services/databaseService");
const bcrypt = require("bcrypt");
const { isPasswordCorrect } = require("../services/authService");

const enhanceUserBooks = async (user) => {
  const { password, ...others } = user._doc;
  const allBooks = await databaseService.getAllBooks();
  const enhancedBooks = [];
  others.books.forEach((book, index) => {
    const bookDetails = allBooks.filter((b) => b._id.equals(book.bookId));
    if (bookDetails && bookDetails.length > 0) {
      enhancedBooks.push({ ...book._doc, bookDetails: bookDetails[0] });
    }
  });
  const enhancedUser = { ...others, books: enhancedBooks };
  return enhancedUser;
};

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

const updateUserAvatar = async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      user.avatar = req.body.avatar;
      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
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
    const enhancedUser = await enhanceUserBooks(user);
    res.status(200).json(enhancedUser);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const allBooks = await databaseService.getAllBooksGenres();
    const usersRes = [];
    users.forEach((user) => {
      const enhancedBooks = [];
      user.books.forEach((book, index) => {
        const bookDetails = allBooks.filter((b) => b._id.equals(book.bookId));
        if (bookDetails && bookDetails.length > 0) {
          enhancedBooks.push({ ...book._doc, bookDetails: bookDetails[0] });
        }
      });
      const { password, createdAt, updatedAt, ...others } = user._doc;
      usersRes.push({ ...others, books: enhancedBooks });
    });
    res.status(200).json(usersRes);
  } catch (err) {
    res.status(500).json(err);
  }
};

const followUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userToFollowId = req.body.userToFollowId;
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId);
    if (
      user.following.filter((followedUser) =>
        followedUser._id.equals(userToFollowId)
      ).length > 0
    ) {
      res.status(403).json("You already follow this user");
    } else {
      user.following.push({
        _id: userToFollowId,
        username: userToFollow.username,
        avatar: userToFollow.avatar,
      });
      if (!userToFollow.followers) userToFollow.followers = [];
      userToFollow.followers.push({
        _id: userId,
        username: user.username,
        avatar: user.avatar,
      });
      await user.save();
      await userToFollow.save();
      const enhancedUser = await enhanceUserBooks(user);
      res
        .status(200)
        .json({ message: "User has been followed", updatedUser: userToFollow });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const unfollowUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const userToUnfollowId = req.body.userToUnfollowId;
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (
      user.following.filter((followedUser) =>
        followedUser._id.equals(userToUnfollowId)
      ).length === 0
    ) {
      res.status(403).json("You don't follow this user");
    } else {
      user.following = user.following.filter(
        (followedUser) => !followedUser._id.equals(userToUnfollowId)
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (follower) => !follower._id.equals(userId)
      );
      await user.save();
      await userToUnfollow.save();
      const enhancedUser = await enhanceUserBooks(userToUnfollow);
      res.status(200).json({
        message: "User has been unfollowed",
        updatedUser: enhancedUser,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.updateUserAvatar = updateUserAvatar;
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
