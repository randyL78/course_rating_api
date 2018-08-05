const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  user: {
    type    : ObjectId
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
  reviews: [ObjectId]
})

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;