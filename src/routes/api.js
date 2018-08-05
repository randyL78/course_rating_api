/* Router for all API routes */

// load vendor modules
const express = require('express');
const router = express.Router();

// load custom modules
const User = require('../../models/user');


/* ++++++++++++++++++ 
     User routes      
   ++++++++++++++++++ */

// GET the current user
router.get('/users', (req, res) => {
  res.send("<h1>Get current user</h1>");
}) 

// POST a new user to database
router.post('/users', (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    const err = new Error("Passwords don't match.");
    err.status = 400;
    return next(err);
  }

  // build a user object from the request body
  const userData = {
    fullName: req.body.fullName,
    emailAddress: req.body.emailAddress,
    password: req.body.password
  }

  // use mongoose schema create method to insert user into database
  User.create(userData, (err, user) => {
    if (err) {
      return next(err);
    } else {
      res.send(
        `<h1>New user created</h1>`);
    }
  })
}); 

/* ++++++++++++++++++ 
     Courses routes      
   ++++++++++++++++++ */


// GET all courses
router.get('/course', (req, res) => {
  res.send("<h1>Get current user</h1>");
}) 

// GET a specific course

// POST a new course to database

// PUT changes to a course in database

// POST a new review to a course

module.exports = router;