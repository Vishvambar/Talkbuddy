import { getUserProgress } from '../../backend/services/gamificationService.js';

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Extract userId from path: /.netlify/functions/user-progress/userId
    const pathParts = event.path.split('/');
    const userId = pathParts[pathParts.length - 1];
    
    if (!userId || userId === 'user-progress') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }
    
    const progress = await getUserProgress(userId);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        progress
      })
    };

  } catch (error) {
    console.error('User progress function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch user progress',
        details: error.message 
      })
    };
  }
};
