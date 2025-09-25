// src/Components/Header/Header.jsx
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          Legal<span className="logo-highlight">Mitra</span>
        </div>
        <div className="header-actions">
          <button className="btn login-btn">Login</button>
          <button className="btn signup-btn">Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;