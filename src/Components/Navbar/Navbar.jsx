// src/Components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'law-sections', label: 'Law Sections Info' },
    { id: 'predict-bail', label: 'Predict Your Bail' },
    { id: 'my-collection', label: 'My Collection' },
    { id: 'find-lawyer', label: 'Find a Lawyer' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About Us' }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;