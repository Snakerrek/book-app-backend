const databaseService = require("./databaseService");

const rateBook = async (req, res) => {
  try {
    const book = await databaseService.rateBook(req.body);
    const enhancedReviews = [];
    const users = await databaseService.getAllUsers();
    book.reviews.forEach((review) => {
      const user = users.filter((user) => {
        return user._id.equals(review.authorID);
      });
      enhancedReviews.push({
        review: review.review,
        starRating: review.starRating,
        author: {
          authorID: review.authorID,
          authorName: user[0].username,
          authorAvatar: user[0].avatar,
        },
      });
    });
    if (book) {
      res.status(200).json({
        message: "Rated book succesfully",
        updatedBook: { ...book._doc, reviews: enhancedReviews },
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.rateBook = rateBook;
