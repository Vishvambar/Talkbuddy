// Simple sessions function with no external dependencies
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
    console.log('Sessions function started');
    console.log('Event path:', event.path);
    
    // Extract userId from path
    const pathParts = event.path.split('/').filter(part => part);
    const userId = pathParts[pathParts.length - 1];
    const isWeeklySummary = pathParts.includes('week-summary');
    
    console.log('User ID:', userId, 'Weekly summary:', isWeeklySummary);
    
    if (!userId || userId === 'sessions') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'User ID is required' })
      };
    }

    if (isWeeklySummary) {
      // Mock weekly summary
      const mockSummary = {
        averageScore: 7.5,
        activeDays: 3,
        totalSessions: 5,
        improvementTrend: 'Improving',
        weeklyGoal: 'Practice 5 days this week'
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          ...mockSummary
        })
      };
    } else {
      // Mock sessions data
      const mockSessions = [
        {
          _id: '1',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          transcript: 'Hello, I want to practice my English',
          corrected: 'Hello, I would like to practice my English',
          score: 8,
          reply: 'Great! Let\'s practice together. What would you like to talk about?',
          feedback: 'Good sentence structure! Try using "would like" instead of "want" for more formal speech.',
          corrections: [
            {
              original: 'I want to practice',
              corrected: 'I would like to practice',
              type: 'formality'
            }
          ]
        },
        {
          _id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          transcript: 'I am learning English every day',
          corrected: 'I am learning English every day',
          score: 9,
          reply: 'That\'s wonderful! Consistency is key to improving your English.',
          feedback: 'Excellent sentence! Your grammar and word choice are perfect.',
          corrections: []
        }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          sessions: mockSessions,
          total: mockSessions.length
        })
      };
    }

  } catch (error) {
    console.error('Sessions function error:', error);
    console.error('Error stack:', error.stack);
    
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
