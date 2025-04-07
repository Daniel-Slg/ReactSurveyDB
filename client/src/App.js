// import React from 'react';
// import { Button, Typography } from '@mui/material';
// import './App.css'; // Import CSS

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Survey from './Survey';  // Import Survey.js component
import Answering from './Answering';  // Import Answering.js component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/answering" element={<Answering />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h1>Welcome</h1>
      <button onClick={() => window.location.href = "/survey"}>Create Survey</button>
      <button onClick={() => window.location.href = "/answering"}>Do Survey</button>
    </div>
  );
}

export default App;
