// Environment configuration for Netlify Functions
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const validateEnvironment = () => {
  const requiredVars = ['GROQ_API_KEY', 'MONGODB_URI'];
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    const error = new Error(`Missing required environment variables: ${missing.join(', ')}`);
    error.code = 'MISSING_ENV_VARS';
    throw error;
  }
  
  return {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    NODE_ENV: process.env.NODE_ENV || 'production'
  };
};

export const createErrorResponse = (statusCode, error, headers = {}) => {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  return {
    statusCode,
    headers: { ...defaultHeaders, ...headers },
    body: JSON.stringify({
      error: error.message || error,
      details: error.details || 'No additional details available',
      type: error.constructor?.name || 'Error'
    })
  };
};

export const createSuccessResponse = (data, headers = {}) => {
  const defaultHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  return {
    statusCode: 200,
    headers: { ...defaultHeaders, ...headers },
    body: JSON.stringify(data)
  };
};

export const handleCORS = (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  return null; // Continue processing
};
