const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:'arman',password:1234}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.includes(username);
}

const authenticatedUser = (username,password)=>{ 
 const user = users.find((user) => user.username === username);
 if (user) {
   return user.password == password;
 }
 return false;
//  return user && user.password === password;
}


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({message: "Fill Both the password and username field!"});
  }
  // Check if the provided username and password are valid
  const isValidUser = authenticatedUser(username, password);

  if (isValidUser) { 
    req.session.authorization = req.session.authorization || {};    
    accessToken = jwt.sign({ username,password }, 'secret_key', { expiresIn:60*60 });
    req.session.authorization = {accessToken}   
    return res.status(200).json({ message: "Login successful"});
  } else {
    return res.status(401).json({ message: "Invalid username or password"});
  }
});



// regd_users.post('/auth/test',(req,res)=>{
//   return res.status(200).send('test function');
//   const token=req.session.authorization['accessToken']
//   jwt.verify(token, "secret_key",(err,data)=>{
//     if(!err){
//        console.log(`this is the decrypted password = ${data['data']}`);        
//     }
//     else{
//         return res.status(403).json({message: "err"})
//     }
//  }); 
//   console.log(req.session.authorization);
//   console.log(`this is the token ${token}`);
//   return res.status(200).send(req.session);
// })





// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review; // Assuming the review is sent as a query parameter
  const username = req.session?.username; // I added the username as a session in the auth middle ware in index.js 

  if (!username) {return res.status(401).json({ message: "User not logged in" });}
  
  const book = Object.values(books).find((book) => book.isbn == isbn);// Find the book by ISBN 

  if (!book) {return res.status(404).json({ message: "Book not found" });}//Check if the book is found  

  book.reviews[username]=reviewText  

  return res.status(200).json({ message: "Review added or modified successfully" });
});



// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session?.username; // I added the username as a session in the auth middle ware in index.js 

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Find the book by ISBN
  const book = Object.values(books).find((book) => book.isbn == isbn);// Find the book by ISBN 

  if(!book) {return res.status(404).json({ message: "Book not found" });}

  // Find the user's review index on the same ISBN
  const userReview = book.reviews?.[username]

  if (userReview) {
    // Delete the user's review 
    delete book.reviews[username];   
    return res.status(200).json({ message: "Review deleted successfully" });
  } else {
    return res.status(404).json({ message: "Review not found for this user and ISBN" });
  }
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
