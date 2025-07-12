import express from 'express';
import { chatWithGroq } from '../utils/groqClient.js';
import { transcribeAudio } from '../utils/groqWhisper.js';
import { analyzeTextFluency, getEnhancedSystemPrompt } from '../utils/fluencyAnalyzer.js';
import { saveSession, getUserSessions, getWeeklySummary } from '../services/sessionService.js';
import { updateUserProgress, getUserProgress, getLeaderboard, getWeeklyProgress } from '../services/gamificationService.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 25 * 1024 * 1024 // 25MB limit (free tier)
  },
  fileFilter: (req, file, cb) => {
    // Groq Whisper API supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm
    const supportedExtensions = ['flac', 'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'ogg', 'opus', 'wav', 'webm'];

    // Get file extension from original filename
    const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);

    if (supportedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format: ${fileExtension || 'unknown'}. Supported formats: ${supportedExtensions.join(', ')}`));
    }
  }
});

// Enhanced chat endpoint with fluency analysis
router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const userId = req.body.userId || 'anonymous';
    
    // Analyze user's text for fluency
    const analysis = await analyzeTextFluency(userMessage);
    
    // Save session data
    try {
      await saveSession({
        user: userId,
        transcript: userMessage,
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
    
    res.json({
      reply: analysis.reply,
      score: analysis.score,
      corrected: analysis.corrected,
      corrections: analysis.corrections,
      feedback: analysis.feedback,
      // Gamification data
      ...gamificationData
    });
  } catch (err) {
    console.error('Chat error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  console.log('Received file:', req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded or unsupported file type.' });
    }

    // Validate file exists and is readable
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ error: 'Uploaded file not found or corrupted.' });
    }

    const filePath = req.file.path;
    const { model, language, response_format, prompt } = req.body;
    const options = {};
    if (response_format) options.response_format = response_format;
    if (prompt) options.prompt = prompt;

    let transcription;
    try {
      transcription = await transcribeAudio(filePath, model || undefined, language || undefined, options);
    } catch (apiErr) {
      console.error('Groq Whisper API error:', apiErr.response?.data || apiErr.message || apiErr);

      // Handle specific Groq API errors
      if (apiErr.response?.status === 400) {
        const errorData = apiErr.response?.data;
        if (errorData?.error?.message?.includes('file must be one of the following types')) {
          return res.status(400).json({
            error: 'Invalid file format',
            details: 'Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm'
          });
        }
      }

      return res.status(500).json({
        error: 'Groq Whisper API failed',
        details: apiErr.response?.data || apiErr.message || apiErr
      });
    } finally {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', filePath, err);
      });
    }
    res.json({ transcription });
  } catch (err) {
    console.error('Transcription route error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 25MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Invalid file format. Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm' });
    }
    res.status(500).json({ error: 'Internal server error', details: err.message || err });
  }
});

// Enhanced audio-chat endpoint with fluency analysis
router.post('/audio-chat', upload.single('audio'), async (req, res) => {
  console.log('Received file:', req.file);
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded or unsupported file type.' });
    }

    // Validate file exists and is readable
    if (!fs.existsSync(req.file.path)) {
      return res.status(400).json({ error: 'Uploaded file not found or corrupted.' });
    }

    const filePath = req.file.path;
    const { model, language, response_format, prompt, userId } = req.body;
    const options = {};
    if (response_format) options.response_format = response_format;
    if (prompt) options.prompt = prompt;

    let transcription;
    let analysis;
    try {
      // First transcribe the audio
      transcription = await transcribeAudio(filePath, model || undefined, language || undefined, options);
      
      // Then analyze for fluency
      analysis = await analyzeTextFluency(transcription);
      
      // Save session data
      try {
        await saveSession({
          user: userId || 'anonymous',
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
        const progressUpdate = await updateUserProgress(userId || 'anonymous', {
          score: analysis.score,
          isVoiceMessage: true
        });
        analysis.gamificationData = progressUpdate;
      } catch (gamificationError) {
        console.error('Failed to update gamification:', gamificationError);
        // Don't fail the request if gamification fails
      }
    } catch (err) {
      console.error('Audio-chat route error:', err);

      // Handle specific Groq API errors
      if (err.response?.status === 400) {
        const errorData = err.response?.data;
        if (errorData?.error?.message?.includes('file must be one of the following types')) {
          return res.status(400).json({
            error: 'Invalid file format',
            details: 'Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm'
          });
        }
      }

      return res.status(500).json({ error: 'Audio-chat processing failed', details: err.message || err });
    } finally {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', filePath, err);
      });
    }
    
    res.json({
      transcription,
      reply: analysis.reply,
      score: analysis.score,
      corrected: analysis.corrected,
      corrections: analysis.corrections,
      feedback: analysis.feedback,
      // Include gamification data if available
      ...(analysis.gamificationData || {})
    });
  } catch (err) {
    console.error('Audio-chat route error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 25MB.' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: 'Invalid file format. Supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm' });
    }
    res.status(500).json({ error: 'Internal server error', details: err.message || err });
  }
});

// Get user sessions
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    
    const sessions = await getUserSessions(userId, limit);
    res.json({
      success: true,
      sessions,
      total: sessions.length
    });
  } catch (err) {
    console.error('Sessions route error:', err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Get weekly summary
router.get('/week-summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const summary = await getWeeklySummary(userId);
    res.json({
      success: true,
      ...summary
    });
  } catch (err) {
    console.error('Weekly summary route error:', err);
    res.status(500).json({ error: 'Failed to generate weekly summary' });
  }
});

// Get user progress (gamification)
router.get('/user-progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const progress = await getUserProgress(userId);
    res.json({
      success: true,
      progress
    });
  } catch (err) {
    console.error('User progress route error:', err);
    res.status(500).json({ error: 'Failed to fetch user progress' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10, type = 'xp' } = req.query;
    
    const leaderboard = await getLeaderboard(parseInt(limit), type);
    res.json({
      success: true,
      leaderboard,
      type
    });
  } catch (err) {
    console.error('Leaderboard route error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get weekly progress
router.get('/weekly-progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const weeklyProgress = await getWeeklyProgress(userId);
    res.json({
      success: true,
      weeklyProgress
    });
  } catch (err) {
    console.error('Weekly progress route error:', err);
    res.status(500).json({ error: 'Failed to fetch weekly progress' });
  }
});

export default router;
