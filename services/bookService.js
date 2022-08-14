const databaseService = require("./databaseService");

const getAllBooks = async (req, res) => {
  const allBooks = await databaseService.getAllBooks();
  res.json(allBooks);
};

const removeDuplicatedBooks = (books) => {
  const booksWithoutDuplicates = [];
  books.forEach((book) => {
    let addBook = true;
    booksWithoutDuplicates.forEach((uniqueBook) => {
      if (uniqueBook._id === book._id) {
        addBook = false;
      }
    });
    if (addBook) {
      booksWithoutDuplicates.push(book);
    }
  });
  return booksWithoutDuplicates;
};

const filterBooksForAuthor = (author, allBooks) => {
  const authorByWords = author.split(" ");
  const foundBooks = allBooks.filter((book) => {
    let bookResult = null;
    book.authors.forEach((author) => {
      authorByWords.forEach((word) => {
        if (author.toLowerCase().includes(word.toLowerCase())) {
          bookResult = book;
        }
      });
    });
    if (bookResult) {
      return bookResult;
    }
  });
  return removeDuplicatedBooks(foundBooks);
};

const filterBooksForTitle = (title, allBooks) => {
  const titleByWords = title.split(" ");
  const foundBooks = allBooks.filter((book) => {
    let bookResult = null;
    titleByWords.forEach((word) => {
      if (book.title && book.title.toLowerCase().includes(word.toLowerCase())) {
        bookResult = book;
      }
    });
    if (bookResult) {
      return bookResult;
    }
  });
  return removeDuplicatedBooks(foundBooks);
};

const filterBooksForISBN = (isbn, allBooks) => {
  const foundBooks = allBooks.filter((book) => {
    if (book.isbn && book.isbn == isbn) {
      return book;
    }
  });
  return removeDuplicatedBooks(foundBooks);
};

const searchByAuthor = async (req, res) => {
  try {
    const author = req.params.author;
    const allBooks = await databaseService.getAllBooks();

    res.status(200).json(filterBooksForAuthor(author, allBooks));
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const allBooks = await databaseService.getAllBooks();

    res.status(200).json(filterBooksForTitle(title, allBooks));
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchByISBN = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const allBooks = await databaseService.getAllBooks();
    res.status(200).json(filterBooksForISBN(isbn, allBooks));
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchBooks = async (req, res) => {
  try {
    const searchParams = req.params.searchParams;
    const allBooks = await databaseService.getAllBooks();

    const searchByISBNResult = filterBooksForISBN(searchParams, allBooks);
    const searchByTitleResult = filterBooksForTitle(searchParams, allBooks);
    const searchByAuthorResult = filterBooksForAuthor(searchParams, allBooks);

    const foundBooks = [
      ...searchByISBNResult,
      ...searchByTitleResult,
      ...searchByAuthorResult,
    ];
    res.status(200).json(removeDuplicatedBooks(foundBooks));
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getAllBooks = getAllBooks;
exports.searchBooks = searchBooks;
exports.searchByAuthor = searchByAuthor;
exports.searchByTitle = searchByTitle;
exports.searchByISBN = searchByISBN;
