import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import logoImage from '../../assets/logo.png'; 
import userAvatar from '../../assets/default-avatar.png';

const NewHeader = ({ setCurrentPage }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const NAVY_BLUE = '#1b2d48'; 
  const VIBRANT_RED = 'red'; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const headerStyle = {
    width: '100%',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '15px 40px', 
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box'
  };

  const combinedLogoStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '8px',
  };

  const logoImageStyle = {
    height: '35px', 
    width: 'auto', 
  };
  
  const logoTextStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2563eb',
  };

  const buttonsStyle = {
    display: 'flex',
    gap: '15px'
  };

  const buttonStyle = {
    padding: '8px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600'
  };

  const loginStyle = {
    ...buttonStyle,
    backgroundColor: VIBRANT_RED,
    color: 'white',
    border: 'none' 
  };

  const signupStyle = {
    ...buttonStyle,
    backgroundColor: 'white',
    color: NAVY_BLUE,
    border: `2px solid ${NAVY_BLUE}`,
  };

  const userMenuStyle = {
    position: 'relative',
  };

  const userProfileBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
  };

  const profilePicStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
  };

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    minWidth: '150px',
    zIndex: 1000,
  };

  const dropdownItemStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const handleSignUpClick = () => {
    setCurrentPage('registration');
  };

  const handleLoginClick = () => {
    setCurrentPage('login');
  };
  
  const handleLogoClick = () => {
    setCurrentPage('home'); 
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setCurrentPage('home');
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    setCurrentPage('my-collection');
  };

  return (
    <div style={headerStyle}>
      <div style={combinedLogoStyle} onClick={handleLogoClick}>
        <img 
          src={logoImage} 
          alt="Judicial Scale Logo" 
          style={logoImageStyle} 
        />
        <div style={logoTextStyle}>
          Legal<span style={{color: VIBRANT_RED}}>Mitra</span>
        </div>
      </div>
      
      <div style={buttonsStyle}>
        {user ? (
          <div style={userMenuStyle} ref={dropdownRef}>
            <button 
              style={userProfileBtnStyle}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img 
                src={userAvatar} 
                alt="Profile" 
                style={profilePicStyle}
              />
              <span>{user.name}</span>
            </button>
            
            {dropdownOpen && (
              <div style={dropdownMenuStyle}>
                <button 
                  style={dropdownItemStyle}
                  onClick={handleProfileClick}
                >
                  My Profile
                </button>
                <button 
                  style={dropdownItemStyle}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button style={loginStyle} onClick={handleLoginClick}>Login</button>
            <button style={signupStyle} onClick={handleSignUpClick}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default NewHeader;