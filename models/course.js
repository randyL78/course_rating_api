const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const CourseSchema = new Schema({
  _id : {
    type    : Schema.ObjectId,
    auto    : true
  }, 
  user: {
    type    : Schema.ObjectId
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
  reviews: [Schema.ObjectId]
})

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;