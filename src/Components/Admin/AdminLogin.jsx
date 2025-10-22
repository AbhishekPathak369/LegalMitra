import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios'; // ⚠️ You will need to install and import axios
import './AdminLogin.css';

// Set your base URL. This assumes your backend is running here.
// You should use an environment variable (e.g., process.env.REACT_APP_API_URL) in a real project.
const API_URL = 'http://localhost:5000/api/auth'; 

const AdminLogin = ({ setCurrentPage }) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // Assumes useAuth has a function to save user and token

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
const email = 'admin@lawconnect.com'; // Use the exact email from the DB
    const password = 'admin123';         // Use the exact clear-text password

    console.log('Attempting login with:', email, password);
    try {
      // 2. Call the backend /api/auth/login endpoint
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });

      // 3. Destructure response data
      const { user, token } = response.data;
      
      // 4. Client-side check for admin role
      if (user.role !== 'admin') {
        // Even if login succeeded, the user isn't an admin
        setError('Login successful, but this user is not an administrator.');
        // You might want to automatically logout the non-admin here, depending on your AuthContext
        setIsLoading(false);
        return;
      }

      // 5. Save the authenticated admin user and token
      login(user, token); 

      // 6. Navigate to the admin dashboard
      setCurrentPage('admin-dashboard');

    } catch (err) {
      console.error('Admin Login Error:', err.response ? err.response.data : err.message);
      // Display the specific error message from the backend (e.g., "Invalid credentials")
      setError(err.response?.data?.msg || err.response?.data?.error || 'Login failed. Server unreachable or invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {/* ⚠️ Changed 'username' to 'email' to match backend logic */}
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="Enter admin email (e.g., admin@lawconnect.com)"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="admin-login-btn" disabled={isLoading}>
            {isLoading ? 'Logging In...' : 'Login as Admin'}
          </button>
        </form>
        
        <div className="admin-credentials">
          <strong>Backend Credentials:</strong><br />
          Email: <code>admin@lawconnect.com</code><br />
          Password: <code>admin123</code>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;