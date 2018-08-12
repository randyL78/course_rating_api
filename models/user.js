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
    unique  : true,
    validate: {
      validator: v => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message  : props => `${props.value} is not a valid email address`
    }
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


UserSchema.statics.authenticate = (emailAddress, password, callback) => {
  User
    .findOne({emailAddress})
    .exec( (err, user) => {
      if (err) {
        return callback(err);
      } else if ( !user ) {

        const err = new Error("User not found");
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (result === true) {
          return callback(null, user);
        } else {
          const err = new Error("Incorrect username or password");
          err.status = 401;
          return callback(err);
        }
      })
    })
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
