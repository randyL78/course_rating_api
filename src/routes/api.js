/* Router for all API routes */

// load vendor modules
const express = require('express');

// load custom modules
const User = require('../../models/user');
const Course = require('../../models/course');
const Review = require('../../models/review');
const authenticate = require('../middleware/authenticate');

// other global variables
const router = express.Router();


// Check if user is logged in
router.use(authenticate);

/* ++++++++++++++++++ 
     User routes      
   ++++++++++++++++++ */

// GET the current user
router.get('/users', (req, res, next) => {
  if (req.authenticated) {
    res.send(req.user)
  } else {
    const err = new Error("No credentials sent, user not logged in");
    err.status = 401;
    next(err);
  }
})

// POST a new user to database
router.post('/users', (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    const err = new Error("Passwords don't match.");
    err.status = 400;
    return next(err);
  }

  // use mongoose schema create method to insert user into database
  User.create(req.body, (error, user) => {
    if (error) {
      const err = new Error(error.message)
      err.status = 400;
      next(err);
    } else {
      res
        .status(201)
        .location("/")
        .send();
    }
  })
}); 

// PUT update existing users to have hashed passwords
// Run once and then keep code block commented out as it does not require user auth
router.put('/users', (req, res, next) => {
  User
    .find({password: 'password'})
    .exec( (error, users) => {
      if(error) {
        const err = new Error(error.message)
        err.status = 400;
        next(err);
      }   
      users.forEach(user => {
        user.password = 'password';
        user.save();
      })
      res.send(users)
    })
})

/* ++++++++++++++++++ 
     Courses routes      
   ++++++++++++++++++ */


// GET all courses
router.get('/courses', (req, res, next) => {
  Course.findAllTitles((error, courses) => {
    if(error) {
      const err = new Error(error.message)
      err.status = 400;
      next(err);
    }
    res.send(courses);
  })
}) 

// GET a specific course
router.get('/courses/:courseId', (req, res, next) => {
  Course.findSpecificCourse(req.params.courseId, (error, course) => {
    if(error) {
      next(error);
    }
    res.send(course)
  })
});

// POST a new course to database
router.post('/courses', (req, res, next) => {
  if (req.authenticated) {
    // use mongoose schema create method to insert user into database
    // TODO: add model validation to course
    Course.create(req.body, (error) => {
      if (error) {
        const err = new Error(error.message)
        err.status = 400;
        next(err);
      } else {
        res
          .status(201)
          .location("/")
          .send();
      }
    });
  } else {
    const err = new Error("No credentials sent, user not logged in");
    err.status = 401;
    return next(err);    
  }
});


// PUT changes to a course in database
router.put('/courses/:courseId', (req, res, next) => {
  if (req.authenticated) {
    // Find the course by it's id and then update it
    Course.findByIdAndUpdate(req.body._id, req.body, {new: true}, error => {
      if (error) {
        const err = new Error(error.message)
        err.status = 400;
        next(err);
      }
      res
        .status(204)
        .send();
    })
  } else {
    const err = new Error("No credentials sent, user not logged in");
    err.status = 401;
    return next(err);    
  }
});

// POST a new review to a course
router.post('/courses/:courseId/reviews', (req, res, next) => {

  if (req.authenticated) {
    // Get the document for the current course
    Course
      .findById(req.params.courseId, (error, course) => {
        if (error) {
          next(error);
        } else if (course.user === req.user._id) {
          const err = new Error("User can't review own course");
          err.status(400)
          next(error);
        }

        // Build the new review object
        const review = req.body;
        review.user = req.user._id;
        
        // Create new entry in review model
        Review
          .create(review)
          .then( review => {
            // Update the course to show review id
            course
              .update({$push: {reviews: review._id }})
              .then( () => {
                res
                  .status(201)
                  .location("/")
                  .send();
                })
          }) 
      }) 
  } else {
    const err = new Error("No credentials sent, user not logged in");
    err.status = 400;
    return next(err);    
  }
});

module.exports = router;