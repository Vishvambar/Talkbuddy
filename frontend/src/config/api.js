// API configuration for different environments
const isDevelopment = import.meta.env.MODE === 'development';
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Base URL for API calls
export const API_BASE_URL = isDevelopment || isLocal 
  ? 'http://localhost:5000/api'  // Local development
  : '/.netlify/functions';        // Production Netlify

// API endpoints
export const ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  CURRENT_USER: `${API_BASE_URL}/auth/me`,
  
  // Chat endpoints
  CHAT: `${API_BASE_URL}/chat`,
  TRANSCRIBE: `${API_BASE_URL}/transcribe`,
  AUDIO_CHAT: `${API_BASE_URL}/audio-chat`,
  
  // User data endpoints
  USER_PROGRESS: (userId) => `${API_BASE_URL}/user-progress/${userId}`,
  LEADERBOARD: `${API_BASE_URL}/leaderboard`,
  SESSIONS: (userId) => `${API_BASE_URL}/sessions/${userId}`,
  WEEK_SUMMARY: (userId) => `${API_BASE_URL}/sessions/${userId}/week-summary`
};

// Get auth token from localStorage
export const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('talkbuddy_user') || '{}');
  return user.token || null;
};

// Helper function to make API calls with proper error handling and authentication
export const apiCall = async (url, options = {}) => {
  try {
    // Add auth token to headers if available
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      headers,
      credentials: 'include', // Include cookies for JWT in httpOnly cookie
      ...options
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Helper for form data uploads (audio files)
export const uploadFile = async (url, formData) => {
  try {
    // Add auth token to headers if available
    const token = getAuthToken();
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include', // Include cookies for JWT in httpOnly cookie
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};
