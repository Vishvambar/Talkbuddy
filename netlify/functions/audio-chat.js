import { transcribeAudio } from '../utils/groqWhisper.js';
import { analyzeTextFluency } from '../utils/fluencyAnalyzer.js';
import { saveSession } from '../services/sessionService.js';
import { updateUserProgress } from '../services/gamificationService.js';
import multiparty from 'multiparty';
import fs from 'fs';

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
    // Parse multipart form data
    const form = new multiparty.Form();
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(event, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    if (!files.audio || !files.audio[0]) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No audio file uploaded' })
      };
    }

    const audioFile = files.audio[0];
    const filePath = audioFile.path;
    const userId = fields.userId?.[0] || 'anonymous';

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Uploaded file not found or corrupted' })
      };
    }

    let transcription;
    let analysis;
    
    try {
      // First transcribe the audio
      const options = {};
      if (fields.response_format) options.response_format = fields.response_format[0];
      if (fields.prompt) options.prompt = fields.prompt[0];

      transcription = await transcribeAudio(
        filePath,
        fields.model?.[0],
        fields.language?.[0],
        options
      );
      
      // Then analyze for fluency
      analysis = await analyzeTextFluency(transcription);
      
      // Save session data
      try {
        await saveSession({
          user: userId,
          transcript: transcription,
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
      
      // Update gamification progress for voice message
      try {
        const progressUpdate = await updateUserProgress(userId, {
          score: analysis.score,
          isVoiceMessage: true
        });
        analysis.gamificationData = progressUpdate;
      } catch (gamificationError) {
        console.error('Failed to update gamification:', gamificationError);
        // Don't fail the request if gamification fails
      }
      
    } catch (err) {
      console.error('Audio-chat processing error:', err);

      // Handle specific Groq API errors
      if (err.response?.status === 400) {
        const errorData = err.response?.data;
        if (errorData?.error?.message?.includes('file must be one of the following types')) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({
              error: 'Invalid file format',
              details: 'Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm'
            })
          };
        }
      }

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Audio-chat processing failed', 
          details: err.message || err 
        })
      };
    } finally {
      // Clean up uploaded file
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupErr) {
        console.error('Failed to delete uploaded file:', cleanupErr);
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        transcription,
        reply: analysis.reply,
        score: analysis.score,
        corrected: analysis.corrected,
        corrections: analysis.corrections,
        feedback: analysis.feedback,
        // Include gamification data if available
        ...(analysis.gamificationData || {})
      })
    };

  } catch (error) {
    console.error('Audio-chat function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Audio-chat processing failed',
        details: error.message 
      })
    };
  }
};
