import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './login.css';

const Login = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  const handleGoToRegister = () => {
    setCurrentPage('registration');
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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext to update global state
        login(data.user, data.token);
        
        // Redirect to my-collection
        setCurrentPage('my-collection');
      } else {
        setErrors({ submit: data.msg || 'Login failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-welcome">
          <div className="welcome-content">
            <h1>Welcome Back</h1>
            <p>Sign in to continue your legal journey with LegalMitra</p>
            <div className="benefits">
              <div className="benefit">
                <span className="benefit-icon">⚡</span>
                Quick Access to Your Cases
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔐</span>
                Secure Legal Documents
              </div>
              <div className="benefit">
                <span className="benefit-icon">💼</span>
                Professional Network
              </div>
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <button className="back-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>

          <div className="form-container">
            <div className="form-header" style={{ display: 'block' }}>
  <h2 style={{ display: 'block' }}>Sign In</h2>
  <p style={{ display: 'block' }}>Enter your credentials to access your account</p>
</div>


            {errors.submit && (
              <div className="error-message">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  Remember me
                </label>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button 
                type="submit" 
                className="login-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="divider">
              <span>Or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-btn google-btn">
                <span>Google</span>
              </button>
              <button className="social-btn linkedin-btn">
                <span>LinkedIn</span>
              </button>
            </div>

            <div className="signup-link">
              Don't have an account?{' '}
              <button onClick={handleGoToRegister} className="link-btn">
                Sign up here
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;