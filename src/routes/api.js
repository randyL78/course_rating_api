/* Router for all API routes */
const express = require('express');
const router = express.Router();


router.get('/users', (req, res) => {
  res.send("<h1>Get current user</h1>");
}) 

router.post('/users', (req, res) => {
  res.send("<h1>Create a new user</h1>");
}) 

router.get('/', (req, res) => {
  res.send("<h1>Generic API route</h1>")
})

module.exports = router;