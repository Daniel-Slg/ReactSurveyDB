// import React from 'react';
// import { Button, Typography } from '@mui/material';
// import './App.css'; // Import CSS

// src/App.js
import React from 'react';
import { Button, Typography } from '@mui/material';
import './App.css'; // Import CSS

function App() {
  return (
    <div className="app-background">
      <div>
        <Typography variant="h4" gutterBottom>
          Welcome to My React App with MUI!
        </Typography>
        <Button variant="contained" color="primary">
          Click Me
        </Button>
      </div>
    </div>
  );
}

export default App;
