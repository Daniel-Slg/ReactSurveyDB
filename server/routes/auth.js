const express = require('express');
const router = express.Router();
const { getUserByUsername } = require('../models/users');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    //TODO allow hashing at some point
    console.log('DB password:', user.password_hash);
    console.log('Entered password:', password);

    if (user.password_hash === password) {
      return res.status(200).json({ success: true, message: 'Login successful', user });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
