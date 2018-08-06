/* User document schema for MongoDB/Mongoose */

// load vendor modules
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// other globals
const Schema = mongoose.Schema;

// create User schema
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

// hash password before saving to DB
// must use traditional function syntax here so that `this` is bound to current user
UserSchema.pre('save', function (next) {
  const user = this;

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
