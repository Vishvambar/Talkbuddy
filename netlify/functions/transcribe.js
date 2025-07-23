import { transcribeAudio } from '../utils/groqWhisper.js';
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';

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

    // Validate file exists
    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Uploaded file not found or corrupted' })
      };
    }

    let transcription;
    try {
      const options = {};
      if (fields.response_format) options.response_format = fields.response_format[0];
      if (fields.prompt) options.prompt = fields.prompt[0];

      transcription = await transcribeAudio(
        filePath, 
        fields.model?.[0], 
        fields.language?.[0], 
        options
      );
    } catch (apiErr) {
      console.error('Groq Whisper API error:', apiErr);
      
      if (apiErr.response?.status === 400) {
        const errorData = apiErr.response?.data;
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
          error: 'Groq Whisper API failed',
          details: apiErr.response?.data || apiErr.message || apiErr
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
      body: JSON.stringify({ transcription })
    };

  } catch (error) {
    console.error('Transcription function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Transcription processing failed',
        details: error.message 
      })
    };
  }
};
