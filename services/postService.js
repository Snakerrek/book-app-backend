const DatabaseService = require("./databaseService");

const getUserEnhancedPosts = (user, allBooks, allUsers) => {
  if (!user) {
    return [];
  }
  const posts = user.posts;
  const enhancedPosts = posts.map((post) => {
    let enhancedPost = {
      ...post._doc,
      author: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
      },
    };
    if (post.bookID) {
      const book = allBooks.find((book) => {
        return book._id.toString() === post.bookID.toString();
      });
      if (book) {
        enhancedPost = {
          ...enhancedPost,
          book: {
            _id: book._id,
            title: book.title,
            authors: book.authors,
            cover: book.cover,
          },
        };
      }
    }
    if (post.followedUserID) {
      const followedUser = allUsers.find((user) => {
        return user._id.toString() === post.followedUserID.toString();
      });
      if (followedUser) {
        enhancedPost = {
          ...enhancedPost,
          followedUser: {
            _id: followedUser._id,
            username: followedUser.username,
            avatar: followedUser.avatar,
          },
        };
      }
    }
    return enhancedPost;
  });
  return enhancedPosts;
};

const getUserPosts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await DatabaseService.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const allBooks = await DatabaseService.getAllBooks();
    const allUsers = await DatabaseService.getAllUsers();
    const posts = getUserEnhancedPosts(user, allBooks, allUsers);
    posts.sort((a, b) => {
      return new Date(b.datetime) - new Date(a.datetime);
    });
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllFollowedUsersPosts = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await DatabaseService.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const allUsers = await DatabaseService.getAllUsers();
    const allBooks = await DatabaseService.getAllBooks();
    const posts = [];
    user.following.forEach((followedUser) => {
      allUsers.forEach((user) => {
        if (user._id.toString() === followedUser._id.toString()) {
          if (user.posts && user.posts.length > 0) {
            const enhancedPosts = getUserEnhancedPosts(
              user,
              allBooks,
              allUsers
            );
            posts.push(...enhancedPosts);
          }
        }
      });
    });

    posts.sort((a, b) => {
      return new Date(b.datetime) - new Date(a.datetime);
    });
    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addPost = async (userId, post) => {
  const user = await DatabaseService.getUser(userId);
  if (user) {
    if (!user.posts) {
      user.posts = [];
    }
    user.posts.push(post);
    await user.save();
  }
};

const addReviewPost = (userId, bookId, reviewText) => {
  const post = {
    bookID: bookId,
    datetime: new Date(),
    reviewText,
  };
  addPost(userId, post);
};

const addStarRatingPost = (userId, bookId, starRating) => {
  const post = {
    bookID: bookId,
    datetime: new Date(),
    starRating,
  };
  addPost(userId, post);
};

const addShelvingPost = (userId, bookId, shelfName) => {
  const post = {
    bookID: bookId,
    datetime: new Date(),
    shelfName,
  };
  addPost(userId, post);
};

const addFollowPost = (userId, followedUserId) => {
  const post = {
    followedUserID: followedUserId,
    datetime: new Date(),
  };
  addPost(userId, post);
};

exports.getUserPosts = getUserPosts;
exports.getAllFollowedUsersPosts = getAllFollowedUsersPosts;
exports.addReviewPost = addReviewPost;
exports.addStarRatingPost = addStarRatingPost;
exports.addShelvingPost = addShelvingPost;
exports.addFollowPost = addFollowPost;
