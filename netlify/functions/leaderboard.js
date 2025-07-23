import { getLeaderboard } from '../../backend/services/gamificationService.js';

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
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const type = queryParams.type || 'xp';
    
    const leaderboard = await getLeaderboard(limit, type);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        leaderboard,
        type
      })
    };

  } catch (error) {
    console.error('Leaderboard function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch leaderboard',
        details: error.message 
      })
    };
  }
};
