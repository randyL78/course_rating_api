/* Router for all API routes */

// load vendor modules
const express = require('express');
const auth = require('basic-auth');

// load custom modules
const User = require('../../models/user');


// other global variables
const router = express.Router();

/* ++++++++++++++++++ 
     User routes      
   ++++++++++++++++++ */

// GET the current user
router.get('/users', (req, res, next) => {
  const credentials = auth(req)
  if (credentials) {
    // res.send(credentials);
    User.authenticate(credentials.name, credentials.pass, (error, user) => {
      if (error || !user) {
        const err = new Error("Wrong email or password");
        err.status = 401;
        next(err);
      }
      res.send(user);
    });
  } else {
    const err = new Error("No credentials sent.");
    err.status = 400;
    return next(err);    
  }
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
      res
        .status(201)
        .location("/")
        .send();
    }
  })
}); 

/* ++++++++++++++++++ 
     Courses routes      
   ++++++++++++++++++ */


// GET all courses
router.get('/course', (req, res) => {
  res.send("<h1>Get all courses</h1>");
}) 

// GET a specific course

// POST a new course to database

// PUT changes to a course in database

// POST a new review to a course

module.exports = router;