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
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);
