const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }  
  // Add new user to the 'users' array
  users.push({ username, password });
  
  return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
  const bookList = JSON.stringify(books);
  return res.status(200).send(bookList);
});

// public_users.get('/', async function (req, res) {
//   try {
//     const response = await axios.get(`api_endpoint/books`);
//     const books = response.data;
    
//     res.status(200).json({ message: 'success', books });
//   } catch (error) {
//     console.error('Error fetching books:', error.message);
//     res.status(500).json({ message: 'The Book Service has encountered a problem!' });
//   }
// });


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find((book) => book.isbn == isbn);

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// public_users.get('/isbn/:isbn',async function (req,res){
//   try{
//     const isbn = req.query.isbn;
//     const result = axios.get(`api_endpoin/isbn/${isbn}`);
//     const book = result.data;    
//     res.status(200).json({ message: 'success', bookDetails });
//   }catch(err){
//     console.log('Error fetching the book:'+err.message)
//     res.status(404).json({message:'book not found !!!'});
//   }
// });



  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter((book) => book.author === author);

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// public_users.get('/author/:author', async function (req, res) {
//   const author = req.params.author;

//   try {
//     const response = await axios.get(`api_endpoint/books?author=${author}`);
//     const booksByAuthor = response.data;

//     res.status(200).json({ message: 'success', booksByAuthor });
//   } catch (error) {
//     console.error('Error fetching books by author:', error.message);
//     res.status(404).json({ message: 'No books found by this author' });
//   }
// });



// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter((book) => book.title === title);

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// public_users.get('/title/:title', async function (req, res) {
//   const title = req.params.title;

//   try {
//     const response = await axios.get(`api_endpoint/books?title=${title}`);
//     const booksByTitle = response.data;

//     res.status(200).json({ message: 'success', booksByTitle });
//   } catch (error) {
//     console.error('Error fetching books by title:', error.message);
//     res.status(404).json({ message: 'No books found with this title' });
//   }
// });



//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find((book) => book.isbn == isbn);

  if (book && book.reviews) {
    return res.status(200).json({ reviews: book.reviews });
  } else {
    return res.status(404).json({ message: "Reviews not found for this book" });
  }
});


module.exports.general = public_users;
