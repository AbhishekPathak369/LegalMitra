import React from 'react';
import './AdminSidebar.css';

const AdminSidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'dashboard', title: 'Dashboard Overview', icon: '📊' },
    { id: 'users', title: 'User Management', icon: '👥' },
    { id: 'verification', title: 'Content & Verification', icon: '⚖️' },
    { id: 'analytics', title: 'Analytics & Settings', icon: '📈' }
  ];

  return (
    <div className="admin-sidebar">
      
      
      <nav className="admin-nav">
        {sections.map(section => (
          <div 
            key={section.id}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span>{section.title}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;