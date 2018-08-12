const express = require('express');
const auth = require('basic-auth');
const User = require('../../models/user');

const authenticate = (req, res, next) => {
  const credentials = auth(req)
  if (credentials) {
    User.authenticate(credentials.name, credentials.pass, (error, user) => {
      if(error) {
        next(error);
      }
      req.authenticated = true;
      req.user = user;
      next();
    });
  } else {
    req.authenticated = false
    next();    
  }
}

module.exports = authenticate;