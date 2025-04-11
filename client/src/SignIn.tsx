import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      if (response.data.success) {
        console.log("Login erfolgreich!");
        const { role } = response.data.user;
        const { id } = response.data.user;
        localStorage.setItem('userRole', role); // saves role in brower as well as id
        localStorage.setItem('userId', id);
        navigate('/dashboard'); // send to dashboard homepage
      } else {
        alert(response.data.message || 'Login fehlgeschlagen');
      }
    } catch (error: any) {
      console.error("Fehler beim Login:", error.response?.data || error.message);
      alert(error.response?.data?.message || 'Login fehlgeschlagen');
    }
  };

  return (
    <form onSubmit={handleLogin} className="signin-form">
      <input
        type="text"
        placeholder="Benutzername"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log in</button>
    </form>
  );
};

export default SignIn;
