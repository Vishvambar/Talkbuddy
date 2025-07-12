import fs from "fs";
import Groq, { toFile } from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

// Initialize the Groq client (uses GROQ_API_KEY from .env)
const groq = new Groq();

/**
 * Transcribe an audio file using Groq Whisper API.
 * @param {string} filePath - Path to the audio file.
 * @param {string} model - Whisper model to use (default: whisper-large-v3-turbo).
 * @param {string} language - Language code (default: 'en').
 * @param {object} options - Additional options (prompt, response_format, etc).
 * @returns {Promise<string|object>} - Transcription text or full response object.
 */
export async function transcribeAudio(filePath, model = "whisper-large-v3-turbo", language = "en", options = {}) {
  try {
    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Get the file extension to help Groq identify the format
    const path = await import('path');
    const extension = path.extname(filePath).toLowerCase();
    
    // Set a proper filename based on the extension
    let filename = 'audio';
    if (extension === '.mp3') filename = 'audio.mp3';
    else if (extension === '.wav') filename = 'audio.wav';
    else if (extension === '.webm') filename = 'audio.webm';
    else if (extension === '.ogg') filename = 'audio.ogg';
    else if (extension === '.m4a') filename = 'audio.m4a';
    else if (extension === '.flac') filename = 'audio.flac';
    else if (extension === '.mp4') filename = 'audio.mp4';
    else if (extension === '.mpeg') filename = 'audio.mpeg';
    else if (extension === '.mpga') filename = 'audio.mpga';
    else if (extension === '.opus') filename = 'audio.opus';
    else filename = 'audio.mp3'; // default fallback
    
    // Use toFile to create a proper file object
    const file = await toFile(fileBuffer, filename);
    
    const params = {
      file: file,
      model,
      language,
      ...options
    };
    
    const transcription = await groq.audio.transcriptions.create(params);
    if (!options.response_format || options.response_format === 'json') {
      return transcription.text;
    }
    return transcription;
  } catch (err) {
    console.error('Groq SDK transcription error:', err.response?.data || err.message || err);
    throw err;
  }
} 