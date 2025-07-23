// API configuration for different environments
const isDevelopment = import.meta.env.MODE === 'development';
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Base URL for API calls
export const API_BASE_URL = isDevelopment || isLocal 
  ? 'http://localhost:5000/api'  // Local development
  : '/.netlify/functions';        // Production Netlify

// API endpoints
export const ENDPOINTS = {
  CHAT: `${API_BASE_URL}/chat`,
  TRANSCRIBE: `${API_BASE_URL}/transcribe`,
  AUDIO_CHAT: `${API_BASE_URL}/audio-chat`,
  USER_PROGRESS: (userId) => `${API_BASE_URL}/user-progress/${userId}`,
  LEADERBOARD: `${API_BASE_URL}/leaderboard`,
  SESSIONS: (userId) => `${API_BASE_URL}/sessions/${userId}`,
  WEEK_SUMMARY: (userId) => `${API_BASE_URL}/sessions/${userId}/week-summary`
};

// Helper function to make API calls with proper error handling
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
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
    const response = await fetch(url, {
      method: 'POST',
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
