import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logoImage from '../../assets/logo.png'; 
const API_BASE_URL = import.meta.env.VITE_API_URL;
import userAvatar from '../../assets/default-avatar.png';
import './NewHeader.css';

const NewHeader = () => {
  const { user, logout, updateProfilePicture, refreshUserWithProfile } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB');
      return;
    }

    try {
      setUploading(true);
      await updateProfilePicture(file);
      await refreshUserWithProfile();
      setDropdownOpen(false);
    } catch (error) {
      alert('Failed to upload image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleProfilePicClick = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAdminLoginClick = () => {
    navigate('/admin-login');
  };
  
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const handleAdminDashboardClick = () => {
    setDropdownOpen(false);
    navigate('/admin-dashboard');
  };

  return (
    <header className="new-header">
      <div className="header-content">
        <div className="logo-wrapper" onClick={handleLogoClick}>
          <img 
            src={logoImage} 
            alt="Judicial Scale Logo" 
            className="header-logo" 
          />
          <span className="brand-name">
            Legal<span className="brand-highlight">Mitra</span>
          </span>
        </div>
        
        <div className="auth-buttons">
          {user ? (
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                className="user-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img 
                  src={user?.profilePicture || userAvatar} 
                  alt="Profile" 
                  className="profile-avatar"
                  style={{ opacity: uploading ? 0.7 : 1 }}
                  onError={(e) => {
                    e.target.src = userAvatar;
                  }}
                />
                <span className="user-display-name">{user.name}</span>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden-file-input"
                />
              </button>
              
              {dropdownOpen && (
                <div className="dropdown-panel">
                  <button 
                    className="dropdown-option"
                    onClick={handleProfileClick}
                  >
                    My Profile
                  </button>
                  
                  <button 
                    className="dropdown-option"
                    onClick={handleProfilePicClick}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </button>
                  
                  {user.role === 'admin' && (
                    <button 
                      className="dropdown-option"
                      onClick={handleAdminDashboardClick}
                    >
                      🛠️ Admin Dashboard
                    </button>
                  )}
                  
                  <button 
                    className="dropdown-option"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={handleLoginClick}>Login</button>
              <button className="btn-signup" onClick={handleSignUpClick}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NewHeader;