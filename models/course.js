const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO: Add validation to schema for items that must be unique
const CourseSchema = new Schema({
  _id : {
    type    : Schema.ObjectId,
    auto    : true
  }, 
  user: {
    type    : Schema.ObjectId,
    ref     : 'User'
  },
  title: {
    type    : String,
    required: true
  },
  description: {
    type    : String,
    required: true
  },
  estimatedTime   : String,
  materialsNeeded : String,
  steps: [{ 
      stepNumber: Number,
      title: {
        type    : String,
        required: true
      },
      description: {
        type    : String,
        required: true        
      }
    }],
  reviews: [{
    type  : Schema.ObjectId,
    ref   : 'Review'
  }]
})

CourseSchema.statics.findAllTitles = callback => {
  Course
    .find()
    .select('_id title')
    .exec( (error, courses) => {
      if (error) {
        return callback(error);
      } else if (!courses) {
        const err = new Error("No courses found");
        err.status = 401;
        return callback(err);
      }
      return callback(null, courses);
      
    })
}

CourseSchema.statics.findSpecificCourse = (courseId, callback) => {
  Course
    .findById(courseId)
    // Get related data from User and Review models
    .populate('user')
    .populate('reviews')
    .exec ( (error, course) => {
      if (error) {
        return callback(error);
      } else if (!course) {
        const err = new Error("Course not found");
        err.status = 401;
        return callback(err);
      }
      return callback(null, course);
    })
}


const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;