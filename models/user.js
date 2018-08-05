const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id : {
    type    : Schema.ObjectId,
    auto    : true
  }, 
  fullName : {
    type    : String,
    required: true
  },
  emailAddress : {
    type    : String,
    required: true,
    unique  : true
  },
  password: {
    type    : String,
    required: true
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
