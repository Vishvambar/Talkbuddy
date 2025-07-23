# TalkBuddy - Comprehensive Agent Documentation

## Project Overview
TalkBuddy is an AI-powered English conversation coach that helps users improve their spoken English fluency through interactive text and voice conversations. The application uses Groq's Llama models for intelligent conversation analysis, Whisper for speech-to-text transcription, and includes a comprehensive gamification system to drive user engagement and retention.

## Commands

### Development
- **Backend dev**: `cd backend && npm run dev` - Starts nodemon server on port 5000
- **Frontend dev**: `cd frontend && npm run dev` - Starts Vite dev server (usually port 5173)
- **Frontend build**: `cd frontend && npm run build` - Production build
- **Frontend lint**: `cd frontend && npm run lint` - ESLint code quality check
- **Frontend preview**: `cd frontend && npm run preview` - Preview production build

### Database/Services
- **MongoDB connection**: Automatic on server start (MongoDB Atlas or local)
- **Gamification test**: `node test-gamification.js` - Test XP/badges/streaks system
- **Database test**: `node comprehensive-database-test.js` - Full database validation

### Installation
- **Root install**: `npm install` - Install root dependencies
- **Backend install**: `cd backend && npm install` - Backend dependencies
- **Frontend install**: `cd frontend && npm install` - Frontend dependencies
- **Full setup**: Run all three install commands

## Architecture

### Tech Stack
- **Frontend**: React 19 + Vite 7.0
- **Backend**: Node.js + Express 5.1 (ES6 modules)
- **Database**: MongoDB + Mongoose 8.16
- **State Management**: Redux Toolkit 2.8
- **Styling**: TailwindCSS 3.4 with PostCSS + Autoprefixer
- **AI Services**: Groq SDK 0.26 (Llama 3.1 + Whisper)
- **Audio Processing**: Multer 2.0 + RecorderJS 1.0
- **Build Tool**: Vite 7.0
- **Package Manager**: npm
- **CORS**: Enabled for cross-origin requests

### Directory Structure
```
TalkBuddy/
├── backend/
│   ├── data/                     # File storage fallback (JSON files)
│   ├── models/                   # MongoDB schemas
│   │   ├── Session.js            # Conversation session model
│   │   └── UserProgress.js       # Gamification progress model
│   ├── routes/
│   │   └── groq.js               # Main API routes (chat, transcribe, progress)
│   ├── services/
│   │   ├── sessionService.js     # Session management & analytics
│   │   └── gamificationService.js # XP, levels, badges, leaderboards
│   ├── utils/                    # Core utilities
│   │   ├── database.js           # MongoDB + file fallback
│   │   ├── fluencyAnalyzer.js    # AI fluency analysis
│   │   ├── gamificationEngine.js # XP calculation & badge logic
│   │   ├── groqClient.js         # Groq chat API client
│   │   └── groqWhisper.js        # Groq speech-to-text client
│   ├── uploads/                  # Temporary audio file storage
│   ├── index.js                  # Express server entry point
│   └── .env                      # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── ChatScreen.jsx    # Main conversation interface
│   │   │   ├── MessageBubble.jsx # Individual message display
│   │   │   ├── MessageInput.jsx  # Text/voice input component
│   │   │   ├── Navigation.jsx    # App navigation
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   └── SessionHistory.jsx # Conversation history view
│   │   ├── redux/                # Redux store and slices
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # React entry point
│   ├── public/                   # Static assets
│   ├── tailwind.config.js        # TailwindCSS configuration
│   ├── vite.config.js            # Vite build configuration
│   └── package.json              # Frontend dependencies
├── test-gamification.js          # Gamification system test script
├── AGENT.md                      # Agent instructions (current)
└── COMPREHENSIVE_AGENT_DOCUMENTATION.md # This file
```

### Key APIs/Endpoints
- **POST `/api/chat`**: Text conversation with fluency analysis + gamification
- **POST `/api/transcribe`**: Audio-to-text using Whisper
- **POST `/api/audio-chat`**: Combined audio transcription + conversation + gamification
- **GET `/api/sessions/:userId`**: User conversation history
- **GET `/api/week-summary/:userId`**: Weekly learning analytics
- **GET `/api/user-progress/:userId`**: Gamification progress (XP, level, badges, streak)
- **GET `/api/leaderboard`**: Rankings by XP, level, streak, or weekly performance
- **GET `/api/weekly-progress/:userId`**: Current week statistics

### Dependencies

#### Backend Core Dependencies
- **express**: ^5.1.0 - Web server framework
- **groq-sdk**: ^0.26.0 - Groq AI API client (Llama + Whisper)
- **mongoose**: ^8.16.3 - MongoDB ODM
- **multer**: ^2.0.1 - File upload middleware for audio files
- **cors**: ^2.8.5 - Cross-origin resource sharing
- **dotenv**: ^17.0.1 - Environment variable management
- **axios**: ^1.10.0 - HTTP client
- **nodemon**: ^3.1.10 - Development auto-restart

#### Frontend Core Dependencies
- **react**: ^19.1.0 - UI library
- **@reduxjs/toolkit**: ^2.8.2 - State management
- **react-redux**: ^9.2.0 - React Redux bindings
- **axios**: ^1.10.0 - HTTP client for API calls
- **recorder-js**: ^1.0.7 - Audio recording functionality
- **audio-recorder-polyfill**: ^0.4.1 - Audio recording compatibility
- **tailwindcss**: ^3.4.17 - CSS framework
- **vite**: ^7.0.0 - Build tool and dev server

## Code Style & Conventions

### Language/Framework Patterns
- **Module System**: ES6 modules (`type: "module"` in package.json)
- **Async Patterns**: async/await for all asynchronous operations
- **Error Handling**: Try-catch blocks with comprehensive error logging
- **API Structure**: RESTful endpoints with Express Router
- **Component Style**: React functional components with hooks
- **State Management**: Redux Toolkit slices with async thunks

### Naming Conventions
- **Variables/Functions**: camelCase (`userMessage`, `transcribeAudio`, `calculateXP`)
- **Components**: PascalCase (`ChatScreen`, `MessageBubble`, `SessionHistory`)
- **Files**: PascalCase for components, camelCase for utilities
- **Constants**: UPPER_SNAKE_CASE for environment variables
- **Database**: camelCase for fields, PascalCase for models

### File Organization
- **Components**: `/src/components/` - All React UI components
- **Utilities**: `/backend/utils/` - Core business logic and API clients
- **Services**: `/backend/services/` - Database operations and business services
- **Models**: `/backend/models/` - MongoDB schemas
- **Routes**: `/backend/routes/` - Express API endpoints

### TalkBuddy AI Personality
The AI coach has a specific system prompt that defines its behavior:
- Responds in simple, correct English suitable for learners
- Asks friendly follow-up questions to continue conversation
- Politely corrects grammar and pronunciation errors
- Uses encouraging and confidence-building tone
- Keeps responses conversational (2-4 sentences max)
- Acts like a patient, supportive teacher

## Environment Configuration

### Required Environment Variables
- **GROQ_API_KEY**: API key for Groq services (Llama + Whisper)
- **MONGODB_URI**: MongoDB connection string (Atlas or local)
- **PORT**: Server port (defaults to 5000)

### Optional Environment Variables
- **NODE_ENV**: Environment mode (development/production)
- **DB_FALLBACK**: Enable file storage fallback when MongoDB unavailable

### Configuration Files
- **backend/.env**: Environment variables
- **frontend/vite.config.js**: Vite build configuration
- **frontend/tailwind.config.js**: TailwindCSS styling configuration
- **frontend/postcss.config.js**: PostCSS processing

## Database Schema

### Tables/Collections

#### Session Model
- **user**: String - User identifier (defaults to 'anonymous')
- **timestamp**: Date - Session creation time
- **transcript**: String - User's original message
- **corrected**: String - AI-corrected version
- **score**: Number - Fluency score (1-10)
- **reply**: String - AI coach response
- **feedback**: String - Specific learning feedback
- **corrections**: Array - Grammar/vocabulary corrections
  - `original`: String, `corrected`: String, `type`: String

#### UserProgress Model
- **user**: String - User identifier (unique)
- **totalXP**: Number - Total experience points earned
- **level**: Number - Current level (every 100 XP = 1 level)
- **streak**: Number - Consecutive practice days
- **lastActive**: String - Last activity date (YYYY-MM-DD)
- **badges**: Array - Earned badge IDs
- **totalSessions**: Number - Total practice sessions completed
- **hadVoiceMessage**: Boolean - Has used voice feature
- **recentSessions**: Array - Last 10 session scores and dates
- **weeklyStats**: Object - Current week XP and session counts

### Relationships
- **Session** → **UserProgress**: Sessions update user progress via gamification engine
- **UserProgress**: Self-contained with embedded session history

## Gamification System

### XP Formula
- **Score 9-10**: 15 XP (Excellent fluency)
- **Score 7-8**: 10 XP (Good fluency) 
- **Score 5-6**: 7 XP (Fair fluency)
- **Score 1-4**: 3 XP (Basic fluency)

### Level System
- **Progression**: Every 100 XP = 1 level
- **Display**: Level 1, 2, 3... with XP progress bar
- **Benefits**: Status symbol in leaderboards

### Badge System (10 Badges)
- **🧠 10/10 Master**: Get a perfect fluency score
- **💯 First 100 XP**: Earn your first 100 XP  
- **🔥 3-Day Streak**: Practice 3 consecutive days
- **🔥 Week Warrior**: Practice 7 consecutive days
- **🔥 Month Master**: Practice 30 consecutive days
- **🗣️ First Voice Message**: Complete first audio session
- **⭐ 500 XP Master**: Earn 500 total XP
- **🌟 1000 XP Legend**: Earn 1000 total XP
- **🎯 High Scorer**: Score 8+ on 5 consecutive messages
- **📚 Consistent Learner**: Complete 50 practice sessions

### Streak Tracking
- **Logic**: Increment for consecutive days, reset if gap > 1 day
- **Same Day**: Multiple sessions same day don't increment streak
- **Persistence**: Survives app restarts, stored in database

## Development Workflow

### Getting Started
1. Clone repository and install dependencies (`npm install` in root, backend, frontend)
2. Set up environment variables in `backend/.env` (GROQ_API_KEY, MONGODB_URI)
3. Start backend: `cd backend && npm run dev` (port 5000)
4. Start frontend: `cd frontend && npm run dev` (usually port 5173)
5. Test gamification: `node test-gamification.js`

### Making Changes
1. Backend changes auto-restart via nodemon
2. Frontend changes hot-reload via Vite
3. Run linting: `cd frontend && npm run lint`
4. Test specific features using provided test scripts

### Audio File Support
- **Supported Formats**: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm
- **Size Limit**: 25MB (Groq free tier limit)
- **Processing**: Automatic cleanup after transcription
- **Storage**: Temporary in `/uploads` directory

## Testing

### Test Types
- **Integration Tests**: `test-gamification.js` - Full gamification flow
- **Database Tests**: `comprehensive-database-test.js` - MongoDB operations
- **Manual Testing**: curl commands for API endpoints

### Running Tests
- **Gamification**: `node test-gamification.js`
- **Database**: `node comprehensive-database-test.js`
- **API**: Use curl or Postman for endpoint testing

### Test Conventions
- **User IDs**: Use `test_` prefix for test users
- **Cleanup**: Tests create real database records
- **Dependencies**: Ensure backend server running on localhost:5000

## API Documentation

### Authentication
- **Method**: User ID based (no passwords currently)
- **Headers**: Standard JSON Content-Type
- **Users**: Defaults to 'anonymous' if no userId provided

### Error Handling
- **Format**: `{ error: "message", details?: "additional info" }`
- **Status Codes**: 400 (client error), 500 (server error), 200 (success)
- **Logging**: Console logs with detailed error information

### Audio Processing
- **Upload**: Multipart form data with `audio` field
- **Validation**: File type and size checking
- **Cleanup**: Automatic file deletion after processing

## Performance

### Optimization Strategies
- **Database**: Indexed queries on user, timestamp, and leaderboard fields
- **Audio**: Automatic cleanup prevents storage bloat
- **Sessions**: Limited to last 10 sessions per user in memory
- **Fallback**: File storage when database unavailable

### Monitoring
- **Logs**: Comprehensive console logging for debugging
- **Errors**: Try-catch with graceful degradation
- **Gamification**: Non-blocking - doesn't fail main conversation flow

## Third-Party Integrations

### Groq AI Platform
- **Purpose**: Text analysis (Llama 3.1) and speech transcription (Whisper)
- **Configuration**: GROQ_API_KEY environment variable
- **Models**: llama3-8b-8192 (default), whisper-large-v3-turbo
- **Limits**: Free tier has rate limits and file size restrictions

### MongoDB Atlas
- **Purpose**: Primary data storage for sessions and user progress
- **Configuration**: MONGODB_URI environment variable
- **Fallback**: JSON file storage if MongoDB unavailable

## Troubleshooting

### Common Issues
- **CORS errors**: Backend includes CORS middleware for development
- **File upload failures**: Check format (must be audio) and size (25MB max)
- **Groq API errors**: Verify GROQ_API_KEY and check rate limits
- **MongoDB connection**: Check MONGODB_URI and network connectivity
- **Port conflicts**: Change PORT environment variable or stop conflicting services

### Debugging
- **Backend logs**: Detailed console output with error traces
- **File uploads**: Logged with automatic cleanup status
- **Gamification**: Non-blocking with separate error handling
- **Database**: Graceful fallback to file storage

### Known Limitations
- **No user authentication**: Uses simple user IDs
- **File storage**: Audio files stored temporarily only
- **Rate limits**: Groq free tier has usage restrictions
- **Test coverage**: Limited automated testing

## Security

### Data Protection
- **User data**: No passwords or sensitive personal information stored
- **API keys**: Environment variables only, never committed to git
- **File uploads**: Validated and automatically cleaned up
- **CORS**: Configured for development (adjust for production)

### Audio Processing
- **Validation**: File type and size checking before processing
- **Storage**: Temporary only, automatic deletion
- **Processing**: Server-side only, never stored permanently

## Future Roadmap

### Planned Features
- **User Authentication**: Proper login system with accounts
- **Advanced Analytics**: Detailed learning progress reports
- **Social Features**: Friend leaderboards and challenges
- **Content Library**: Structured lessons and topics
- **Mobile App**: React Native or PWA implementation

### Technical Debt
- **Test Coverage**: Implement comprehensive unit and integration tests
- **Production Config**: Environment-specific configurations
- **Caching**: Redis for session and leaderboard caching
- **Security**: Rate limiting and input validation hardening

---

## Agent-Specific Notes

### Frequently Searched Patterns
- **Gamification**: Search for "XP", "badge", "level", "streak" in gamificationEngine.js
- **AI Analysis**: Look in fluencyAnalyzer.js for scoring and correction logic
- **Database Operations**: Check sessionService.js and gamificationService.js
- **API Endpoints**: All routes defined in backend/routes/groq.js

### Common Tasks
- **Add new badge**: Update BADGES object in gamificationEngine.js + condition logic
- **Modify XP formula**: Change calculateXP function in gamificationEngine.js
- **New API endpoint**: Add route in backend/routes/groq.js + service function
- **UI changes**: React components in frontend/src/components/

### Project-Specific Gotchas
- **ES6 modules**: Both backend and frontend use "type": "module"
- **File cleanup**: Audio files auto-delete, don't rely on persistence
- **Gamification**: Non-blocking design - failures don't break chat
- **MongoDB fallback**: App works with file storage if database unavailable
- **CORS**: Enabled for development, adjust for production deployment
