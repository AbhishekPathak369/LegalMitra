import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { user } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'law-sections', label: 'Law Sections Info' },
    { id: 'predict-bail', label: 'Predict Bail' },
    { id: 'my-collection', label: 'My Collection' },
    { id: 'find-lawyer', label: 'Find a Lawyer' },
    { id: 'faq', label: 'FAQ' },
    { id: 'about', label: 'About Us' }
  ];

  const handleMyCollectionClick = () => {
    if (!user) {
      setCurrentPage('login');
    } else {
      setCurrentPage('my-collection');
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={item.id === 'my-collection' ? handleMyCollectionClick : () => setCurrentPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;