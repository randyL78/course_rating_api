/* Router for all API routes */

// load vendor modules
const express = require('express');
const auth = require('basic-auth');

// load custom modules
const User = require('../../models/user');
const Course = require('../../models/course');
const Review = require('../../models/review');


// other global variables
const router = express.Router();

/* ++++++++++++++++++ 
     User routes      
   ++++++++++++++++++ */

// GET the current user
router.get('/users', (req, res, next) => {
  const credentials = auth(req)
  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (error, user) => {
      if(error) {
        next(error);
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

  // use mongoose schema create method to insert user into database
  User.create(req.body, (error, user) => {
    if (error) {
      return next(error);
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
        next(error);
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
      next(error);
    }
    res.send(courses);
  })
  
}) 

// GET a specific course
router.get('/courses/:courseId', (req, res, next) => {
  // TODO: Get related data from user and review documents
  Course.findSpecificCourse(req.params.courseId, (error, course) => {
    if(error) {
      next(error);
    }
    res.send(course)
  })
});

// POST a new course to database
router.post('/courses', (req, res, next) => {
  const credentials = auth(req)
  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (error) => {
      if (error) {
        next(error);
      }
      // use mongoose schema create method to insert user into database
      Course.create(req.body, (err, course) => {
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
  } else {
    const err = new Error("No credentials sent.");
    err.status = 400;
    return next(err);    
  }
});


// PUT changes to a course in database
router.put('/courses/:courseId', (req, res, next) => {
  const credentials = auth(req)
  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (error, user) => {
      res
      .status(204)
      .send();
    });
  } else {
    const err = new Error("No credentials sent.");
    err.status = 400;
    return next(err);    
  }
});

// POST a new review to a course
router.post('/courses/:courseId/reviews', (req, res, next) => {
  const credentials = auth(req)
  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (error, user) => {

      // Get the document for the current course
      Course
        .findById(req.params.courseId, (error, course) => {
          if (error) {
            next(error);
          } else if (course.user === user._id) {
            const err = new Error("User can't review own course");
            err.status(400)
            next(error);
          }

          // Build the new review object
          const review = req.body;
          review.user = user._id;
          
          // Create new entry in review model
          Review
            .create(review)
            .then( review => {
              // Update the course to show review id
              console.log(review._id)
              course
                .update({$push: {reviews: review._id }})
              res
                .status(201)
                .location("/")
                .send();
            }) 
        }) 
    });
  } else {
    const err = new Error("No credentials sent.");
    err.status = 400;
    return next(err);    
  }
});

module.exports = router;