// Simple chat function with minimal dependencies
export const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Function started');
    console.log('Environment check:', {
      hasGroqKey: !!process.env.GROQ_API_KEY,
      hasMongoUri: !!process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV
    });

    if (!process.env.GROQ_API_KEY) {
      console.error('Missing GROQ_API_KEY');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Missing GROQ_API_KEY environment variable',
          details: 'Please set GROQ_API_KEY in Netlify environment variables'
        })
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }

    const { message, userId = 'anonymous' } = JSON.parse(event.body);
    
    if (!message || typeof message !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid message is required' })
      };
    }

    console.log('Processing message for user:', userId);

    // Simple response for now - just echo back with a mock score
    const mockResponse = {
      reply: `Hello! You said: "${message}". This is a test response from TalkBuddy.`,
      score: Math.floor(Math.random() * 5) + 6, // Random score 6-10
      corrected: message,
      corrections: [],
      feedback: "This is a test response. Your English looks good!",
      // Mock gamification data
      success: true,
      progress: {
        totalXP: 10,
        level: 1,
        xpForNextLevel: 90,
        streak: 1,
        badges: [],
        totalSessions: 1,
        lastActive: new Date().toISOString().split('T')[0],
        newBadges: []
      },
      xpGained: 10,
      newBadges: []
    };

    console.log('Returning successful response');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockResponse)
    };

  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    
    if (error instanceof SyntaxError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON in request body',
          details: error.message 
        })
      };
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        type: error.constructor.name
      })
    };
  }
};
