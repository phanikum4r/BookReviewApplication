const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.body.username
  const password=req.body.password
  if (!username || !password){
    return res.status(400).json({message: "Error"});
  }
  if (authenticatedUser(username,password)){
    let accessToken=jwt.sign(
        {data:password}, 
        'access', 
        {expiresIn: 60*60})
    req.session.authorization={
        accessToken,username
    }
    return res.status(200).json({message: "Successful"});
  }
  return res.status(208).json({message: "Ivalid Credentials"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
    const review = req.body.review;
    books[isbn].reviews[username] = review;

    res.send('Review submitted successfully');
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn=req.params.isbn
    if(books[isbn]){
        delete books[isbn]
        return res.send("Deleted")
    }
    return res.send("Cannot Find isbn");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
