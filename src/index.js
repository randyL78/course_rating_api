'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// custom modules
const api = require('./routes/api');

// Other globals
const app = express();

// Parse incoming request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/course-api", { useNewUrlParser: true });
const db = mongoose.connection;

// Mongo error or success message
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => { console.log("Successfully connected to DataBase") });


// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// TODO add additional routes here
/* Api routes */
app.use('/api', api);

// send a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Course Review API'
  });
});


// uncomment this route in order to test the global error handler
// app.get('/error', function (req, res) {
//   throw new Error('Test error');
// });

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
