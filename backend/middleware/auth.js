const jwt = require('jsonwebtoken');
const User = require('../models/User');

// FIX: Better JWT secret handling
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET is not defined in environment variables');
  // Don't use fallback in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is required in production');
  }
}

exports.protect = async (req, res, next) => {
  let token;

  // FIX: Better token extraction
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  console.log('🔐 Auth Debug - Token:', token ? `Present (${token.substring(0, 20)}...)` : 'Missing');
  console.log('🔐 Auth Debug - Headers:', req.headers);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route - No token provided'
    });
  }

  try {
    // FIX: Add token validation before verification
    if (typeof token !== 'string' || token.length < 10) {
      throw new Error('Invalid token format');
    }

    // FIX: Clean the token
    const cleanToken = token.trim();
    
    console.log('🔐 Verifying token with secret:', JWT_SECRET ? 'Present' : 'Missing');
    
    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    console.log('✅ Token decoded successfully for user:', decoded.id);
    
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found - Please login again'
      });
    }
    
    console.log('✅ User authenticated:', req.user.email, 'Role:', req.user.role);
    next();
  } catch (error) {
    console.error('❌ JWT Error:', error.message);
    
    // FIX: Better error responses
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - Please login again'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired - Please login again'
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  }
};

exports.generateToken = (id) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};