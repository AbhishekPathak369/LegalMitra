import React from 'react';
// import './Header.css';

const Header = () => {
  return (
    <header className="header" style={{
      width: '100%',
      background: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
      padding: 0
    }}>
      <div className="header-content" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        height: '70px'
      }}>
        <div className="logo-section">
          <div className="logo" style={{
            fontSize: '2rem',
            fontWeight: '800',
            color: '#2563eb'
          }}>
            Legal<span style={{ color: '#dc2626' }}> Mitra</span>
          </div>
        </div>
        <div className="auth-section" style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <button className="auth-btn login" style={{
            padding: '0.6rem 1.5rem',
            border: '2px solid #2563eb',
            background: 'transparent',
            color: '#2563eb',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>Login</button>
          <button className="auth-btn signup" style={{
            padding: '0.6rem 1.5rem',
            border: 'none',
            background: '#dc2626',
            color: 'white',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>Sign Up</button>
        </div>
      </div>
    </header>
  );
};

export default Header;