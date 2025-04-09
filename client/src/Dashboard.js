import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const role = localStorage.getItem('userRole');

  return (
    <div className="dashboard-page">
      {/* Feste Rolle-Box oben rechts */}
      <div className="role-floating-box">👤 {role}</div>

      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <div className="buttons-container">
        {role === 'admin' && (
          <Link to="/survey" className="dashboard-button-link">
            <div className="dashboard-button-box">📝 Create a Survey</div>
          </Link>
        )}

        <Link to="/answering" className="dashboard-button-link">
          <div className="dashboard-button-box">📋 Answer a Survey</div>
        </Link>

        <Link to="/graphs" className="dashboard-button-link">
          <div className="dashboard-button-box">📈 Graphs</div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
