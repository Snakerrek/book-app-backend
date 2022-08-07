const fetch = require("node-fetch");

const googleBooksApiUrl = "https://www.googleapis.com/books/v1/";

const searchBooks = async (searchParams) => {
  const searchParamsForRequest = searchParams.replace(" ", "+");

  let searchBooksResult;

  await fetch(googleBooksApiUrl + "volumes?q=" + searchParamsForRequest)
    .then((response) => response.json())
    .then((result) => {
      searchBooksResult = result;
    });
  return searchBooksResult;
};

exports.searchBooks = searchBooks;
