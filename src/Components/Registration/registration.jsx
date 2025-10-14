import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './registration.css';

const Registration = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prevState => ({
        ...prevState,
        [id]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Registration successful! Redirecting to login...');
        // Redirect to login page instead of auto-login
        setTimeout(() => {
          setCurrentPage('login');
        }, 2000);
      } else {
        setMessage(data.msg || 'Registration failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="registration-hero">
          <div className="hero-content">
            <h1>Join LegalMitra</h1>
            <p>Your trusted legal partner for comprehensive legal solutions</p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">⚖️</span>
                Legal Expertise
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                Secure & Private
              </div>
              <div className="feature">
                <span className="feature-icon">🚀</span>
                Fast & Efficient
              </div>
            </div>
          </div>
        </div>
        
        <div className="registration-form">
          <button className="back-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          
          
          <div className="form-header" style={{ display: 'block' }}>
  <h2 style={{ display: 'block' }}>Create Account</h2>
  <p style={{ display: 'block' }}>Sign up to get started with LegalMitra</p>
</div>

          {message && (
            <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="role">User Role</label>
              <select 
                id="role" 
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="client">Client</option>
                <option value="lawyer">Lawyer</option>
                <option value="student">Law Student</option>
              </select>
              {errors.role && <span className="error-text">{errors.role}</span>}
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
              
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="login-link">
            Already have an account?{' '}
            <button 
              onClick={() => setCurrentPage('login')} 
              className="link-btn"
            >
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;