const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type    : ObjectId
  },
  postedOn: {
    type    : Date,
    required: true,
    default : Date.now
  },
  rating: {
    type    : Number,
    min     : 1,
    max     : 5,
    required: true
  },
  review    : String

})

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;