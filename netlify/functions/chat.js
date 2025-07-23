import { analyzeTextFluency } from '../utils/fluencyAnalyzer.js';
import { saveSession } from '../services/sessionService.js';
import { updateUserProgress } from '../services/gamificationService.js';
import { validateEnvironment, createErrorResponse, createSuccessResponse, handleCORS } from '../utils/config.js';

export const handler = async (event, context) => {
  // Handle CORS
  const corsResponse = handleCORS(event);
  if (corsResponse) return corsResponse;

  if (event.httpMethod !== 'POST') {
    return createErrorResponse(405, 'Method not allowed');
  }

  try {
    // Validate environment variables
    validateEnvironment();
    
    // Basic validation
    if (!event.body) {
      return createErrorResponse(400, 'Request body is required');
    }

    const { message, userId = 'anonymous' } = JSON.parse(event.body);
    
    if (!message || typeof message !== 'string') {
      return createErrorResponse(400, 'Valid message is required');
    }

    console.log('Processing chat request for user:', userId);

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
    
    return createSuccessResponse({
      reply: analysis.reply,
      score: analysis.score,
      corrected: analysis.corrected,
      corrections: analysis.corrections,
      feedback: analysis.feedback,
      // Gamification data
      ...gamificationData
    });

  } catch (error) {
    console.error('Chat function error:', error);
    console.error('Error stack:', error.stack);
    
    // Handle specific error types
    if (error.code === 'MISSING_ENV_VARS') {
      return createErrorResponse(500, error);
    }
    
    if (error instanceof SyntaxError) {
      return createErrorResponse(400, 'Invalid JSON in request body: ' + error.message);
    }
    
    return createErrorResponse(500, error.message || 'Chat processing failed');
  }
};
