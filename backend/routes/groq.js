import express from 'express';
import { chatWithGroq } from '../utils/groqClient.js';
import { transcribeAudio } from '../utils/groqWhisper.js';
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

router.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const messages = [
      {
        role: 'system',
        content: `You are TalkBuddy, a friendly and intelligent English-speaking coach. 
Your job is to help the user improve spoken English fluency through daily conversation.

Here’s how you behave:
- Always respond in simple, correct English.
- Ask friendly, relevant follow-up questions to keep the conversation going.
- Correct the user's grammar, sentence structure, or pronunciation (if needed), but do it politely and briefly.
- Encourage the user and make them feel confident.
- Never use complex or technical vocabulary unless asked.
- Your tone is like a patient teacher who genuinely wants the student to speak more.
- Do not generate long lectures. Keep replies conversational — 2 to 4 short sentences max.
- If the user says something unclear or incomplete, ask them to clarify politely.`
      },
      { role: 'user', content: userMessage }
    ];
    const reply = await chatWithGroq(messages);
    res.json({ reply });
  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Groq API failed' });
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

// New endpoint: audio to chat (Whisper -> Llama)
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
    const { model, language, response_format, prompt } = req.body;
    const options = {};
    if (response_format) options.response_format = response_format;
    if (prompt) options.prompt = prompt;

    let transcription;
    let chatReply;
    try {
      transcription = await transcribeAudio(filePath, model || undefined, language || undefined, options);
      chatReply = await chatWithGroq([
        {
          role: 'system',
          content: `You are TalkBuddy, a friendly and intelligent English-speaking coach. 
Your job is to help the user improve spoken English fluency through daily conversation.

Here’s how you behave:
- Always respond in simple, correct English.
- Ask friendly, relevant follow-up questions to keep the conversation going.
- Correct the user's grammar, sentence structure, or pronunciation (if needed), but do it politely and briefly.
- Encourage the user and make them feel confident.
- Never use complex or technical vocabulary unless asked.
- Your tone is like a patient teacher who genuinely wants the student to speak more.
- Do not generate long lectures. Keep replies conversational — 2 to 4 short sentences max.
- If the user says something unclear or incomplete, ask them to clarify politely.`
        },
        { role: 'user', content: transcription }
      ]);
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
    res.json({ transcription, reply: chatReply });
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

export default router;
