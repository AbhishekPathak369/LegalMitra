import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import defaultAvatar from '../../../assets/default-avatar.png';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading } = useAuth();

  // Loading state
  if (loading) {
    return (
      <div className="profile-page-dark">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <h3>Loading Your Profile</h3>
          <p>Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  // Show message if no user is logged in
  if (!user) {
    return (
      <div className="profile-page-dark">
        <div className="no-user">
          <div className="no-user-icon">👤</div>
          <h3>No User Found</h3>
          <p>Please log in to view your profile information</p>
          <button className="login-btn" onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-dark">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account information and preferences</p>
        </div>

        <div className="profile-card">
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-glow"></div>
              <img 
                src={user?.profilePicture || defaultAvatar} 
                alt="Profile" 
                className="profile-avatar"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
            <div className="user-type-badge">
              {user?.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1) : 'User'}
            </div>
          </div>

          {/* Details Section */}
          <div className="details-section">
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">
                  <span className="label-icon">👤</span>
                  Full Name
                </span>
                <span className="detail-value">{user?.name || 'Not provided'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">
                  <span className="label-icon">📧</span>
                  Email Address
                </span>
                <span className="detail-value">{user?.email || 'Not provided'}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">
                  <span className="label-icon">🎯</span>
                  User Type
                </span>
                <span className="detail-value">
                  {user?.userType ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1) : 'Not specified'}
                </span>
              </div>
              
              {user?.phone && (
                <div className="detail-row">
                  <span className="detail-label">
                    <span className="label-icon">📱</span>
                    Phone Number
                  </span>
                  <span className="detail-value">{user.phone}</span>
                </div>
              )}
              
              {user?.address && (
                <div className="detail-row">
                  <span className="detail-label">
                    <span className="label-icon">📍</span>
                    Address
                  </span>
                  <span className="detail-value">{user.address}</span>
                </div>
              )}
              
              <div className="detail-row">
                <span className="detail-label">
                  <span className="label-icon">📅</span>
                  Member Since
                </span>
                <span className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </span>
              </div>
            </div>

            {/* Specialized Fields for Lawyers */}
            {(user?.barCouncilNumber || user?.specialization || user?.experience) && (
              <div className="specialized-fields">
                <h3 className="section-title">Professional Information</h3>
                <div className="tags-container">
                  {user?.barCouncilNumber && (
                    <div className="specialty-tag">Bar Council: {user.barCouncilNumber}</div>
                  )}
                  {user?.specialization && (
                    <div className="specialty-tag">{user.specialization}</div>
                  )}
                  {user?.experience && (
                    <div className="specialty-tag experience-tag">
                      {user.experience} {user.experience === 1 ? 'Year' : 'Years'} Experience
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;