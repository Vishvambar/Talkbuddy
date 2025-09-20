import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Secret key for JWT signing - should be in .env file
const JWT_SECRET = process.env.JWT_SECRET || 'talkbuddy-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Extract token from request
export const getTokenFromRequest = (req) => {
  // Check for token in cookies first (more secure)
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  
  return null;
};