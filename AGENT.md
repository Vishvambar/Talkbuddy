# TalkBuddy - Comprehensive Agent Documentation

## Project Overview
TalkBuddy is an AI-powered English conversation coach that helps users improve their spoken English fluency through interactive chat and voice conversations. The application uses Groq's Llama for text conversations and Whisper for speech-to-text transcription.

## Commands

### Development
- **Backend dev**: `cd backend && npm run dev` (starts nodemon on port 5000)
- **Frontend dev**: `cd frontend && npm run dev` (starts Vite dev server)
- **Frontend build**: `cd frontend && npm run build`
- **Frontend lint**: `cd frontend && npm run lint`
- **Frontend preview**: `cd frontend && npm run preview`

### Testing
- **Tests**: No tests configured yet (backend shows "Error: no test specified")
- **Backend test**: `cd backend && npm test` (currently not implemented)

### Installation
- **Root install**: `npm install` (install root dependencies)
- **Backend install**: `cd backend && npm install`
- **Frontend install**: `cd frontend && npm install`

## Architecture

### Tech Stack
- **Backend**: Node.js + Express.js (ES6 modules)
- **Frontend**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Styling**: TailwindCSS with PostCSS
- **AI Services**: Groq SDK (Llama 3.1 + Whisper)
- **File Upload**: Multer middleware
- **CORS**: Enabled for cross-origin requests

### Directory Structure
```
TalkBuddy/
├── backend/
│   ├── routes/
│   │   └── groq.js           # API routes for chat, transcribe, audio-chat
│   ├── utils/                # Utility functions for Groq integration
│   ├── uploads/              # Temporary audio file storage
│   ├── index.js              # Express server entry point
│   └── package.json          # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChatScreen.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Navbar.jsx
│   │   ├── redux/            # Redux store and slices
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # React entry point
│   ├── public/               # Static assets
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
└── AGENT.md                  # This documentation file
```

### Key APIs
- **POST `/api/chat`**: Text-based conversation with TalkBuddy
- **POST `/api/transcribe`**: Audio-to-text transcription using Whisper
- **POST `/api/audio-chat`**: Combined audio transcription + chat response

### Dependencies

#### Backend
- **express**: ^5.1.0 - Web server framework
- **groq-sdk**: ^0.26.0 - Groq AI API client
- **multer**: ^2.0.1 - File upload middleware
- **cors**: ^2.8.5 - Cross-origin resource sharing
- **dotenv**: ^17.0.1 - Environment variable loading
- **nodemon**: ^3.1.10 - Development auto-restart

#### Frontend
- **react**: ^19.1.0 - UI library
- **@reduxjs/toolkit**: ^2.8.2 - State management
- **axios**: ^1.10.0 - HTTP client
- **recorder-js**: ^1.0.7 - Audio recording
- **tailwindcss**: ^3.4.17 - CSS framework
- **vite**: ^7.0.0 - Build tool

## Code Style & Conventions

### Backend
- **Module System**: ES6 modules (`type: "module"` in package.json)
- **Async Patterns**: async/await for all asynchronous operations
- **Error Handling**: Try-catch blocks with global error middleware
- **API Structure**: RESTful endpoints with Express Router
- **File Handling**: Multer for audio uploads with automatic cleanup
- **Environment**: `.env` files for sensitive configuration

### Frontend
- **Component Style**: React functional components with hooks
- **State Management**: Redux Toolkit with slices
- **Imports**: ES6 import/export syntax
- **Styling**: TailwindCSS utility classes
- **File Organization**: Component-based structure in `/src/components/`

### Naming Conventions
- **Variables/Functions**: camelCase (`userMessage`, `transcribeAudio`)
- **Components**: PascalCase (`ChatScreen`, `MessageBubble`)
- **Files**: PascalCase for components, camelCase for utilities
- **Constants**: UPPER_SNAKE_CASE for environment variables

### TalkBuddy AI Personality
The AI coach has a specific system prompt that defines its behavior:
- Responds in simple, correct English
- Asks friendly follow-up questions
- Politely corrects grammar/pronunciation
- Encouraging and confidence-building tone
- Keeps responses conversational (2-4 sentences max)
- Acts like a patient teacher

## Environment Configuration

### Required Environment Variables
- **GROQ_API_KEY**: API key for Groq services
- **PORT**: Server port (defaults to 5000)

### Audio File Support
Groq Whisper API supports these formats:
- flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm
- Maximum file size: 25MB (free tier limit)

## Development Workflow

### Starting Development
1. Ensure environment variables are set in `backend/.env`
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm run dev`
4. Backend runs on http://localhost:5000
5. Frontend runs on Vite's default port (usually 5173)

### Making Changes
1. Backend changes auto-restart via nodemon
2. Frontend changes hot-reload via Vite
3. Run linting: `cd frontend && npm run lint`
4. Build for production: `cd frontend && npm run build`

### Error Handling
- Global Express error middleware catches unhandled errors
- Specific error codes for file upload limits and format validation
- Groq API errors are caught and returned with appropriate HTTP status codes
- Audio files are automatically cleaned up after processing

## API Endpoint Details

### POST /api/chat
- **Body**: `{ message: string }`
- **Response**: `{ reply: string }`
- **Purpose**: Text-based conversation with TalkBuddy AI

### POST /api/transcribe
- **Body**: FormData with `audio` file + optional parameters
- **Response**: `{ transcription: string }`
- **Purpose**: Convert audio to text using Whisper

### POST /api/audio-chat
- **Body**: FormData with `audio` file + optional parameters
- **Response**: `{ transcription: string, reply: string }`
- **Purpose**: Full voice conversation (audio → text → AI response)

## Troubleshooting

### Common Issues
- **CORS errors**: Backend includes CORS middleware for cross-origin requests
- **File upload failures**: Check file format and size (25MB limit)
- **Groq API errors**: Verify GROQ_API_KEY in environment variables
- **Port conflicts**: Change PORT in environment or stop conflicting services

### Debugging
- Backend logs errors to console with detailed Groq API responses
- Upload files are logged and automatically cleaned up
- Global error handler catches and returns formatted error responses

## Future Enhancements
- Add comprehensive test suite (currently not implemented)
- Implement conversation history persistence
- Add user authentication and profiles
- Expand audio format support
- Add pronunciation feedback features
- Implement conversation analytics
