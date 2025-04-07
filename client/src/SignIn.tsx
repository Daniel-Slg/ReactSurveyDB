import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';  // Für Weiterleitung nach dem Login

export default function SignIn() {
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const response = await fetch('http://localhost:5000/api/login', {  // Backend-Route anpassen
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }), // Ändern von 'email' zu 'username'
      });

      const data = await response.json();
      if (data.success) {
        navigate('/dashboard');  // Weiterleitung, wenn Login erfolgreich
      } else {
        // Fehlerbehandlung
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed!');
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!username || username.length < 1) { // Anpassung von 'email' zu 'username'
      setUsernameError(true);
      isValid = false;
    } else {
      setUsernameError(false);
    }
    if (!password || password.length < 6) {
      setPasswordError(true);
      isValid = false;
    } else {
      setPasswordError(false);
    }
    return isValid;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Typography variant="h4">Sign In</Typography>
      <TextField
        error={usernameError}
        helperText={usernameError ? 'Please enter a valid username.' : ''} // Anpassung von 'email' zu 'username'
        label="Username" // Anpassung des Texts von 'Email' zu 'Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)} // 'email' zu 'username'
        fullWidth
        required
      />
      <TextField
        error={passwordError}
        helperText={passwordError ? 'Password must be at least 6 characters.' : ''}
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
      />
      <Button type="submit" variant="contained" fullWidth>
        Sign In
      </Button>
    </Box>
  );
}
