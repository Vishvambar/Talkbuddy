import { verifyToken, getTokenFromRequest } from '../utils/authUtils.js';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  try {
    // Get token from request
    const token = getTokenFromRequest(req);
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Not authorized, invalid token' });
    }
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Set user in request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Not authorized' });
  }
};

// Optional auth middleware - doesn't require authentication but attaches user if token is valid
export const optionalAuth = async (req, res, next) => {
  try {
    // Get token from request
    const token = getTokenFromRequest(req);
    
    // If no token, continue without user
    if (!token) {
      return next();
    }
    
    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return next();
    }
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // Continue without user on error
    next();
  }
};