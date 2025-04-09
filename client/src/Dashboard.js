import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // neue CSS-Datei

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="buttons-container">
        <Link to="/survey" className="dashboard-button-link">
          <div className="dashboard-button-box">📝 Create a Survey</div>
        </Link>
        <Link to="/answering" className="dashboard-button-link">
          <div className="dashboard-button-box">📋 Answer a Survey</div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
