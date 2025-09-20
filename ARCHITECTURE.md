# TalkBuddy Technical Architecture

## System Overview

TalkBuddy is built on a modern web application architecture with a clear separation between frontend and backend components. The system leverages AI services for natural language processing and speech recognition to provide an interactive language learning experience.

## Architecture Diagram

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React Frontend │◄────►│  Express Backend│◄────►│  MongoDB        │
│                 │      │                 │      │                 │
└────────┬────────┘      └────────┬────────┘      └─────────────────┘
         │                        │
         │                        ▼
         │               ┌─────────────────┐
         │               │                 │
         └──────────────►│  Groq AI API    │
                         │  - LLM          │
                         │  - Whisper      │
                         │                 │
                         └─────────────────┘
```

## Component Details

### Frontend

The frontend is a React application that provides the user interface for interacting with the TalkBuddy system.

#### Key Technologies

- **React**: UI library for building the interface
- **Redux**: State management for the application
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests
- **Audio Recording**: Browser APIs for capturing user speech

#### Core Components

- **ChatScreen**: Main conversation interface
- **SessionHistory**: View past conversations and progress
- **Navigation**: Application navigation and user status

### Backend

The backend is a Node.js application built with Express that handles API requests, business logic, and data persistence.

#### Key Technologies

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: Primary database (with file-based fallback)
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling for audio files

#### Core Modules

#### API Routes (`/routes`)

- **groq.js**: Handles all API endpoints
  - `/api/chat`: Text-based conversation
  - `/api/transcribe`: Audio transcription
  - `/api/sessions`: Session history
  - `/api/progress`: User progress and gamification
  - `/api/leaderboard`: Competitive rankings
  - `/api/weekly-summary`: Weekly performance reports

#### Services (`/services`)

- **sessionService.js**: Manages conversation sessions
  - `saveSession()`: Stores conversation data
  - `getUserSessions()`: Retrieves user history
  - `getWeeklySummary()`: Generates weekly reports

- **gamificationService.js**: Handles user progress and rewards
  - `updateUserProgress()`: Updates XP, level, and streaks
  - `getUserProgress()`: Retrieves current progress
  - `getLeaderboard()`: Generates competitive rankings
  - `getWeeklyProgress()`: Tracks weekly improvement

#### Utilities (`/utils`)

- **database.js**: Database connection and file storage fallback
  - `connectDB()`: Establishes MongoDB connection
  - `loadSessions()`: Loads sessions from file storage
  - `saveSessions()`: Saves sessions to file storage

- **fluencyAnalyzer.js**: Language analysis engine
  - `analyzeTextFluency()`: Evaluates user text
  - `getEnhancedSystemPrompt()`: Generates AI prompts

- **gamificationEngine.js**: Reward and progression system
  - `calculateXP()`: Determines experience points
  - `calculateLevel()`: Computes user level
  - `updateGamificationData()`: Updates user progress

- **groqClient.js**: Interface to Groq LLM API
  - `chatWithGroq()`: Sends messages to AI model

- **groqWhisper.js**: Speech recognition integration
  - `transcribeAudio()`: Converts speech to text

#### Data Models (`/models`)

- **Session.js**: Conversation data schema
  - User identifier
  - Timestamp
  - Original and corrected text
  - Fluency score and feedback

- **UserProgress.js**: User progression schema
  - Gamification metrics (XP, level, streak)
  - Achievement badges
  - Historical performance data

### External Services

#### Groq AI

TalkBuddy integrates with Groq's AI services:

- **Language Models**: For natural conversation and language correction
  - Default model: llama3-8b-8192

- **Whisper API**: For speech-to-text transcription
  - Default model: whisper-large-v3-turbo

## Data Flow

### Text Conversation Flow

1. User sends text message from frontend
2. Backend receives message via `/api/chat` endpoint
3. `fluencyAnalyzer.js` processes text for language errors
4. `groqClient.js` sends prompt to Groq API for response
5. Response and analysis are returned to frontend
6. Session data is saved via `sessionService.js`
7. User progress is updated via `gamificationService.js`

### Voice Conversation Flow

1. User records audio on frontend
2. Audio file is sent to `/api/transcribe` endpoint
3. `groqWhisper.js` sends audio to Whisper API
4. Transcribed text is processed by `fluencyAnalyzer.js`
5. Response and analysis are returned to frontend
6. Session and progress data are saved

## Database Schema

### Session Collection

```javascript
{
  user: String,          // User identifier
  timestamp: Date,        // When the session occurred
  transcript: String,     // Original user message
  corrected: String,      // Corrected version
  score: Number,          // Fluency score (1-10)
  reply: String,          // AI response
  feedback: String,       // Learning feedback
  corrections: [          // Specific corrections
    {
      original: String,   // Original text
      corrected: String,   // Corrected text
      type: String         // Error type
    }
  ]
}
```

### UserProgress Collection

```javascript
{
  user: String,           // User identifier
  totalXP: Number,         // Experience points
  level: Number,           // Current level
  streak: Number,          // Consecutive days
  lastActive: String,      // Last activity date
  badges: [String],        // Earned achievements
  totalSessions: Number,   // Session count
  weeklyStats: {           // Weekly performance
    weekStartDate: String, // Start of week
    sessionsCompleted: Number,
    averageScore: Number,
    xpEarned: Number
  },
  recentSessions: [        // Recent activity
    {
      score: Number,      // Session score
      date: String,        // Session date
      timestamp: Date      // Exact time
    }
  ]
}
```

## Fallback Mechanisms

TalkBuddy includes robust fallback mechanisms to ensure reliability:

1. **Database Fallback**: If MongoDB connection fails, the system automatically falls back to file-based storage
2. **Error Handling**: Comprehensive error handling throughout the application prevents cascading failures
3. **Partial Success**: Even if certain components fail (e.g., gamification), the core conversation functionality continues to work

## Security Considerations

- API keys are stored in environment variables, not in code
- User data is pseudonymized with user IDs rather than personal information
- File uploads are validated and restricted to prevent abuse

## Scalability

The architecture supports horizontal scaling:

- Stateless backend can be deployed across multiple instances
- MongoDB can be scaled with sharding and replication
- File storage can be migrated to cloud storage solutions

## Future Architectural Considerations

1. **Microservices**: Split the monolithic backend into specialized services
2. **Real-time Features**: Add WebSocket support for live interactions
3. **Caching Layer**: Implement Redis for performance optimization
4. **Authentication**: Add user authentication and personalization
5. **Analytics Pipeline**: Implement advanced analytics for learning insights