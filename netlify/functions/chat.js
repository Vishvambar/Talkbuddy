import { analyzeTextFluency } from '../../backend/utils/fluencyAnalyzer.js';
import { saveSession } from '../../backend/services/sessionService.js';
import { updateUserProgress } from '../../backend/services/gamificationService.js';

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message, userId = 'anonymous' } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    // Analyze user's text for fluency
    const analysis = await analyzeTextFluency(message);
    
    // Save session data
    try {
      await saveSession({
        user: userId,
        transcript: message,
        corrected: analysis.corrected,
        score: analysis.score,
        reply: analysis.reply,
        feedback: analysis.feedback || '',
        corrections: analysis.corrections || []
      });
    } catch (saveError) {
      console.error('Failed to save session:', saveError);
      // Don't fail the request if saving fails
    }
    
    // Update gamification progress
    let gamificationData = {};
    try {
      const progressUpdate = await updateUserProgress(userId, {
        score: analysis.score,
        isVoiceMessage: false
      });
      gamificationData = progressUpdate;
    } catch (gamificationError) {
      console.error('Failed to update gamification:', gamificationError);
      // Don't fail the request if gamification fails
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: analysis.reply,
        score: analysis.score,
        corrected: analysis.corrected,
        corrections: analysis.corrections,
        feedback: analysis.feedback,
        // Gamification data
        ...gamificationData
      })
    };

  } catch (error) {
    console.error('Chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Chat processing failed',
        details: error.message 
      })
    };
  }
};
