import React from 'react';
import ReactDOM from 'react-dom/client';  // Import the createRoot method
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Create a custom theme for MUI (optional)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Custom primary color
    },
    secondary: {
      main: '#ff4081', // Custom secondary color
    },
  },
});

// Use createRoot instead of render for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
);
