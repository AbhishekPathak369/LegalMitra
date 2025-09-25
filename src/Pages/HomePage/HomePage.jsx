// src/Pages/HomePage/HomePage.jsx
import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">
            Welcome to <span className="highlight">LegalMitra</span>
          </h1>
          <p className="hero-description">
            Your trusted partner for all legal queries, providing clarity and assistance in complex legal matters.
          </p>
          <div className="hero-buttons">
            <button className="btn primary-btn">Predict Your Bail</button>
            <button className="btn secondary-btn">Find a Lawyer</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;