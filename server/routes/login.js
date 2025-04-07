const express = require('express');
const { getUserByUsername } = require('../models/users');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;  // Get username and password from request body

  // Fetch user by username
  const user = await getUserByUsername(username);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare password directly (no hashing involved)
  if (user.password === password) { // Assuming 'password' is the plain text password in DB
    res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
