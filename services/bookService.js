const databaseService = require("./databaseService");

const getAllBooks = async (req, res) => {
  const allBooks = await databaseService.getAllBooks();
  res.json(allBooks);
};

const filterBooksForAuthor = (author, allBooks) => {
  const authorByWords = author.split(" ");
  return allBooks.filter((book) => {
    let bookResult = null;
    book.authors.forEach((author) => {
      authorByWords.forEach((word) => {
        if (author.includes(word)) {
          bookResult = book;
        }
      });
    });
    if (bookResult) {
      return bookResult;
    }
  });
};

const filterBooksForTitle = (title, allBooks) => {
  const titleByWords = title.split(" ");
  return allBooks.filter((book) => {
    let bookResult = null;
    titleByWords.forEach((word) => {
      if (book.title.includes(word)) {
        bookResult = book;
      }
    });
    if (bookResult) {
      return bookResult;
    }
  });
};

const filterBooksForISBN = (isbn, allBooks) => {
  return allBooks.filter((book) => {
    if (book.isbn == isbn) {
      return book;
    }
  });
};

const searchByAuthor = async (req, res) => {
  const author = req.params.author;
  const allBooks = await databaseService.getAllBooks();

  res.json(filterBooksForAuthor(author, allBooks));
};

const searchByTitle = async (req, res) => {
  const title = req.params.title;
  const allBooks = await databaseService.getAllBooks();

  res.json(filterBooksForTitle(title, allBooks));
};

const searchByISBN = async (req, res) => {
  const isbn = req.params.isbn;
  const allBooks = await databaseService.getAllBooks();
  console.log(filterBooksForISBN(isbn, allBooks));
  res.json(filterBooksForISBN(isbn, allBooks));
};

const searchBooks = async (req, res) => {
  const searchParams = req.params.searchParams;
  const allBooks = await databaseService.getAllBooks();

  const searchByISBNResult = filterBooksForISBN(searchParams, allBooks);
  const searchByTitleResult = filterBooksForTitle(searchParams, allBooks);
  const searchByAuthorResult = filterBooksForAuthor(searchParams, allBooks);

  res.json([
    ...searchByISBNResult,
    ...searchByTitleResult,
    ...searchByAuthorResult,
  ]);
};

exports.getAllBooks = getAllBooks;
exports.searchBooks = searchBooks;
exports.searchByAuthor = searchByAuthor;
exports.searchByTitle = searchByTitle;
exports.searchByISBN = searchByISBN;
