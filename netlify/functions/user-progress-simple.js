// Simple user progress function with no external dependencies
export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('User progress function started');
    console.log('Event path:', event.path);
    
    // Extract userId from path
    const pathParts = event.path.split('/').filter(part => part);
    const userId = pathParts[pathParts.length - 1];
    
    console.log('User ID:', userId);
    
    if (!userId || userId === 'user-progress') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }
    
    // Mock progress data
    const mockProgress = {
      totalXP: 50,
      level: 1,
      xpForNextLevel: 50,
      streak: 2,
      badges: [
        {
          id: 'first_message',
          name: '💬 First Message',
          description: 'Sent your first message'
        }
      ],
      totalSessions: 3,
      lastActive: new Date().toISOString().split('T')[0],
      newBadges: []
    };
    
    console.log('Returning mock progress for user:', userId);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        progress: mockProgress
      })
    };

  } catch (error) {
    console.error('User progress function error:', error);
    console.error('Error stack:', error.stack);
    
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
