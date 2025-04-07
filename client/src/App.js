import React from 'react';
import { Button, Typography } from '@mui/material';
import './App.css'; // Import CSS
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn.tsx'; // Dein SignIn Component
import Dashboard from './Dashboard'; // Ein Beispiel für eine Seite nach dem Login

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
