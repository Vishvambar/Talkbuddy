# TalkBuddy - AI-Powered English Conversation Coach

## Overview

TalkBuddy is an interactive language learning application designed to help non-native English speakers improve their fluency through AI-powered conversations. The application provides real-time feedback, corrections, and scoring while maintaining an engaging, conversational experience.

## Features

- **Conversational AI Coach**: Natural dialogue with an AI tutor that responds like a supportive friend
- **Real-time Fluency Analysis**: Grammar, vocabulary, and sentence structure feedback
- **Voice Recognition**: Practice speaking with audio transcription
- **Gamification**: XP, levels, streaks, and badges to motivate consistent practice
- **Progress Tracking**: Session history and performance analytics
- **Personalized Feedback**: Tailored suggestions based on your specific language patterns

## Architecture

TalkBuddy follows a modern client-server architecture:

### Frontend
- React application with Redux for state management
- Tailwind CSS for responsive UI
- Audio recording capabilities for speech practice

### Backend
- Node.js with Express.js REST API
- MongoDB for data persistence (with file-based fallback)
- Integration with Groq AI for language model capabilities
- Whisper API integration for speech-to-text

## Technical Components

### Backend Services

#### API Endpoints
- `/api/chat`: Text-based conversation with fluency analysis
- `/api/transcribe`: Audio transcription for spoken practice
- `/api/sessions`: User session history and analytics
- `/api/progress`: Gamification and user progress tracking

#### Core Modules

1. **Fluency Analyzer**
   - Analyzes user text for grammatical errors
   - Provides corrections and improvement suggestions
   - Scores fluency on a 1-10 scale

2. **Gamification Engine**
   - XP calculation based on performance
   - Level progression system
   - Streak tracking for consistent usage
   - Badge system for achievements

3. **Session Management**
   - Stores conversation history
   - Tracks improvement over time
   - Provides analytics on common errors

4. **AI Integration**
   - Groq API for natural language processing
   - Whisper API for speech recognition

### Data Models

1. **Session**
   - User identifier
   - Timestamp
   - Original transcript
   - Corrected text
   - Fluency score (1-10)
   - AI response
   - Feedback and corrections

2. **UserProgress**
   - User identifier
   - Total XP
   - Current level
   - Streak count
   - Last active date
   - Earned badges
   - Weekly statistics
   - Recent session history

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (optional, falls back to file storage)
- Groq API key

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/talkbuddy.git
   cd talkbuddy
   ```

2. Install backend dependencies
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with your API keys
   ```
   GROQ_API_KEY=your_groq_api_key
   MONGODB_URI=your_mongodb_connection_string (optional)
   PORT=5000
   ```

5. Start the development servers
   
   Backend:
   ```
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```
   cd frontend
   npm run dev
   ```

6. Open your browser to the URL shown in the frontend terminal (typically http://localhost:5173)

## Development

### Backend Structure

```
backend/
├── data/                  # File storage fallback
├── models/                # MongoDB schemas
├── routes/                # API endpoints
├── services/              # Business logic
├── utils/                 # Helper functions
├── index.js               # Entry point
└── package.json           # Dependencies
```

### Frontend Structure

```
frontend/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images and resources
│   ├── components/        # React components
│   ├── config/            # Configuration
│   ├── redux/             # State management
│   ├── App.jsx            # Main application
│   └── main.jsx           # Entry point
└── package.json           # Dependencies
```

## Deployment

The application can be deployed to various platforms:

1. **Backend**: Deploy to Node.js hosting services like Heroku, Render, or Railway
2. **Frontend**: Deploy to static hosting services like Netlify, Vercel, or GitHub Pages
3. **Database**: Use MongoDB Atlas for cloud database hosting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.