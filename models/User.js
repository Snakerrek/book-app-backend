const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    books: [
      {
        bookId: { type: String },
        shelf: { type: String },
        progress: { type: Number },
      },
    ],
    followers: [
      {
        userId: { type: String },
        username: { type: String },
        avatar: { type: String },
      },
    ],
    following: [
      {
        userId: { type: String },
        username: { type: String },
        avatar: { type: String },
      },
    ],
    posts: [
      {
        bookID: { type: String },
        datetime: { type: Date },
        reviewText: { type: String },
        starRating: { type: Number },
        shelfName: { type: String },
        followedUserID: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
