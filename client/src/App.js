import React from 'react';
import { Button, Typography } from '@mui/material';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './SignIn.tsx'; 
import Dashboard from './Dashboard'; 
import Homepage from './Homepage.js'; 
import Survey from './Survey';
import Answering from './Answering'; 
import Graphs from './Graph.js';  

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/answering" element={<Answering />} />
        <Route path="/graphs" element={<Graphs />} /> 
      </Routes>
    </Router>
  );
}


export default App;
