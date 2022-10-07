const databaseService = require("./databaseService");

const rateBook = async (req, res) => {
  try {
    const book = await databaseService.rateBook(req.body);
    if (book) {
      res.status(200).json({
        message: "Rated book succesfully",
        updatedBook: book,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.rateBook = rateBook;
