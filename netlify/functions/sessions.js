import { getUserSessions, getWeeklySummary } from '../../backend/services/sessionService.js';

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
    // Extract userId from path: /.netlify/functions/sessions/userId or userId/week-summary
    const pathParts = event.path.split('/').filter(part => part);
    const userId = pathParts[pathParts.length - 1];
    const isWeeklySummary = pathParts.includes('week-summary');
    
    if (!userId || userId === 'sessions') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }

    if (isWeeklySummary) {
      // Handle weekly summary request
      const summary = await getWeeklySummary(userId);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          ...summary
        })
      };
    } else {
      // Handle regular sessions request
      const queryParams = event.queryStringParameters || {};
      const limit = parseInt(queryParams.limit) || 50;
      
      const sessions = await getUserSessions(userId, limit);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          sessions,
          total: sessions.length
        })
      };
    }

  } catch (error) {
    console.error('Sessions function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch sessions',
        details: error.message 
      })
    };
  }
};
