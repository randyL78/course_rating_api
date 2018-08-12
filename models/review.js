const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  _id : {
    type    : Schema.ObjectId,
    auto    : true,
  },
  user: {
    type    : Schema.ObjectId
  },
  postedOn: {
    type    : Date,
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