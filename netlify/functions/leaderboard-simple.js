// Simple leaderboard function with no external dependencies
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
    console.log('Leaderboard function started');
    
    const queryParams = event.queryStringParameters || {};
    const limit = parseInt(queryParams.limit) || 10;
    const type = queryParams.type || 'xp';
    
    console.log('Query params:', { limit, type });
    
    // Mock leaderboard data
    const mockLeaderboard = [
      {
        rank: 1,
        user: 'EnglishMaster2024',
        totalXP: 1250,
        level: 12,
        streak: 15,
        badgeCount: 8,
        totalSessions: 45,
        weeklyXP: 180
      },
      {
        rank: 2,
        user: 'demo-user',
        totalXP: 850,
        level: 8,
        streak: 7,
        badgeCount: 5,
        totalSessions: 32,
        weeklyXP: 120
      },
      {
        rank: 3,
        user: 'StudyBuddy123',
        totalXP: 720,
        level: 7,
        streak: 12,
        badgeCount: 6,
        totalSessions: 28,
        weeklyXP: 95
      },
      {
        rank: 4,
        user: 'LanguageLover',
        totalXP: 650,
        level: 6,
        streak: 5,
        badgeCount: 4,
        totalSessions: 25,
        weeklyXP: 85
      },
      {
        rank: 5,
        user: 'PracticeDaily',
        totalXP: 520,
        level: 5,
        streak: 20,
        badgeCount: 7,
        totalSessions: 22,
        weeklyXP: 110
      }
    ];
    
    // Limit results
    const limitedResults = mockLeaderboard.slice(0, limit);
    
    console.log('Returning leaderboard with', limitedResults.length, 'entries');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        leaderboard: limitedResults,
        type: type
      })
    };

  } catch (error) {
    console.error('Leaderboard function error:', error);
    console.error('Error stack:', error.stack);
    
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
