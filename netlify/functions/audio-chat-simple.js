// Simple audio-chat function - returns mock data for now
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
    console.log('Audio chat function started (simple version)');
    
    // For now, return a message indicating audio features are being set up
    const mockResponse = {
      transcription: 'Audio transcription is being set up. Please use text messages for now.',
      reply: 'I heard your voice message! Audio features are currently being configured. In the meantime, please use text messages and I\'ll help you practice your English.',
      score: 7,
      corrected: 'Audio transcription is being set up. Please use text messages for now.',
      corrections: [],
      feedback: 'Voice features are coming soon! Keep practicing with text messages.',
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

    console.log('Returning mock audio response');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mockResponse)
    };

  } catch (error) {
    console.error('Audio chat function error:', error);
    console.error('Error stack:', error.stack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Audio chat processing failed',
        details: error.message 
      })
    };
  }
};
