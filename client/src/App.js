import React from 'react';
 import { Button, Typography } from '@mui/material';
 import './App.css'; // Import CSS
 import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
 import SignIn from './SignIn.tsx'; // Dein SignIn Component
 import Dashboard from './Dashboard'; // Ein Beispiel für eine Seite nach dem Login
 import Homepage from './Homepage.js'; // Ein Beispiel für eine Homepage
 import Survey from './Survey'; // Dein Survey Component
 import Answering from './Answering'; // Dein Answering Component
 
 function App() {
   return (
     <Router>
       <Routes>
         <Route path="/" element={<SignIn />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/home" element={<Homepage />} />
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
