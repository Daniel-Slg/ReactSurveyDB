const express = require('express');
const { getUserByUsername } = require('../models/users');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;  // Benutzernamen und Passwort aus dem Request-Body

  // Hole den Benutzer basierend auf dem Benutzernamen aus der Datenbank
  const user = await getUserByUsername(username);

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });  // Benutzer nicht gefunden
  }

  // Vergleiche das eingegebene Passwort mit dem in der Datenbank gespeicherten Passwort
  if (user.password_hash === password) {
    return res.status(200).json({ success: true, message: 'Login successful' });
  } else {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
