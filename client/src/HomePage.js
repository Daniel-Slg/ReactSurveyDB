// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom

function HomePage() {
  return (
    <div className="home-page">
      <h1>Welcome to the Survey App</h1>
      <div className="buttons-container">
        <Link to="/create-survey">
          <button className="survey-button">Create a Survey</button>
        </Link>
        <Link to="/answer-survey">
          <button className="survey-button">Answer a Survey</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
