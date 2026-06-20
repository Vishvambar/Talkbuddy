# TalkBuddy Agent Documentation

## Overview

TalkBuddy is an AI-powered language learning application designed to help non-native English speakers improve their fluency through interactive conversations. The system provides real-time feedback, corrections, and gamification elements to make language learning engaging and effective.

## System Architecture

TalkBuddy follows a client-server architecture with these main components:

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

### Key Components

1. **Frontend (React)**: User interface for conversations and progress tracking
2. **Backend (Express)**: API server handling business logic and data processing
3. **Database (MongoDB)**: Persistent storage with file-based fallback
4. **AI Services (Groq)**: Language model and speech recognition APIs

## Agent Capabilities

The TalkBuddy agent provides these core capabilities:

### 1. Conversational Language Learning

- **Natural Dialogue**: Engages users in natural, flowing conversations
- **Contextual Responses**: Maintains conversation context and provides relevant replies
- **Follow-up Questions**: Asks engaging questions to keep conversations going
- **Personality**: Friendly, encouraging, and supportive tone

### 2. Language Correction and Feedback

- **Grammar Correction**: Identifies and corrects grammatical errors
- **Vocabulary Enhancement**: Suggests better word choices and expressions
- **Sentence Structure**: Improves awkward or incorrect sentence patterns
- **Fluency Scoring**: Rates user's language proficiency on a 1-10 scale
- **Detailed Feedback**: Provides specific, actionable improvement suggestions

### 3. Voice Interaction

- **Speech Recognition**: Transcribes user's spoken English
- **Pronunciation Feedback**: Identifies pronunciation issues
- **Voice Response**: Supports both text and voice input modes

### 4. Gamification and Progress Tracking

- **XP and Levels**: Rewards users with experience points and level progression
- **Streaks**: Tracks consecutive days of practice
- **Badges**: Awards achievements for specific milestones
- **Leaderboards**: Compares progress with other learners
- **Weekly Summaries**: Provides periodic progress reports

## Technical Implementation

### Agent Prompt Engineering

The TalkBuddy agent uses carefully crafted prompts to guide the AI model's behavior:

```javascript
const analysisPrompt = `You are TalkBuddy, a friendly and enthusiastic English conversation coach! You're like a supportive friend who loves helping people improve their English through engaging conversations.

Text to analyze: "${userText}"

Your personality:

You are TalkBuddy, an AI-powered spoken English coach helping non-native learners improve their fluency.

Your job is to help the user speak English more fluently and confidently. Every time the user sends a message, follow these exact steps:

1. Understand the message and reply naturally in correct, simple English (1–3 short sentences).
2. If the message contains any grammar, sentence structure, pronunciation, or vocabulary issues, point them out politely and clearly.
3. Suggest the corrected version of the user's sentence, even if the original was understandable.
4. Give a fluency score from 1 to 10 based on the message's grammar, clarity, completeness, and fluency.
5. Ask a friendly, relevant follow-up question to keep the conversation going.
6. Force to Structure every time 

Please respond with a JSON object in this exact format:
{
  "score": 8,
  "corrected": "The corrected version of the text",
  "feedback": "Brief, encouraging explanation of improvements",
  "corrections": [
    {
      "original": "incorrect phrase",
      "corrected": "correct phrase", 
      "type": "grammar"
    }
  ],
  "reply": "Engaging, conversational response that responds to their message AND asks an interesting follow-up question"
}

Scoring guidelines:
- 9-10: Excellent! Near-native fluency
- 7-8: Great job! Minor tweaks needed
- 5-6: Good progress! Some areas to improve
- 3-4: Nice try! Let's work on structure
- 1-2: Great start! Keep practicing

Reply guidelines:
1. ALWAYS respond to what they actually said (show you're listening!)
2. Give gentle corrections naturally in conversation
3. Ask engaging follow-up questions like:
   - "What's your favorite part about...?"
   - "How did that make you feel?"
   - "Have you ever tried...?"
   - "What do you think about...?"
   - "Tell me more about..."
4. Keep it conversational, not academic
5. Show genuine curiosity about their thoughts and experiences
6. Make them want to continue the conversation!
Also give:
- 1 sentence explanation
- Corrected version
Examples of engaging responses:
- If they mention food: "That sounds delicious! What's your favorite dish to cook at home?"
- If they talk about work: "That must be interesting! What's the best part of your job?"
- If they share an experience: "Wow, that sounds exciting! How did you feel when that happened?"

Make every conversation feel like talking to an interested friend who wants to help them improve!`;
```

### Fluency Analysis Process

1. User sends text or voice message
2. Backend processes input (transcribes audio if needed)
3. Fluency analyzer sends prompt to Groq LLM
4. AI model analyzes text and returns structured feedback
5. Backend processes response and returns to frontend
6. Frontend displays conversation with corrections and feedback
7. Session data is saved and gamification progress updated

### Gamification Engine

The gamification system uses these mechanics to motivate users:

- **XP Calculation**: Based on message length, complexity, and fluency score
- **Level Progression**: Increasing XP thresholds for each level
- **Streak Tracking**: Consecutive days with at least one conversation
- **Badge System**: Achievements for specific milestones (first voice message, reaching fluency thresholds, etc.)

## API Endpoints

### Chat Endpoints

- `POST /api/chat`: Process text messages
  - Request: `{ message: string, userId: string }`
  - Response: `{ reply: string, score: number, corrected: string, corrections: array, feedback: string, ...gamificationData }`

- `POST /api/transcribe`: Process voice messages
  - Request: FormData with audio file
  - Response: Same as text chat endpoint

### User Progress Endpoints

- `GET /api/user-progress/:userId`: Get user's progress data
  - Response: `{ totalXP: number, level: number, streak: number, badges: array, ... }`

- `GET /api/leaderboard`: Get top users by XP
  - Response: `{ leaderboard: array of user progress objects }`

- `GET /api/sessions/:userId`: Get user's conversation history
  - Response: `{ sessions: array of session objects }`

- `GET /api/sessions/:userId/week-summary`: Get weekly performance summary
  - Response: `{ weeklyStats: object with performance metrics }`

## Data Models

### Session Model

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

### UserProgress Model

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

## User Interface Components

### ChatScreen

The main conversation interface where users interact with the TalkBuddy agent:

- Message history display
- Text input field
- Voice recording button
- Correction and feedback display
- Fluency score indicator

### Dashboard

User progress tracking and statistics:

- XP and level display
- Streak counter
- Recent sessions summary
- Performance graphs
- Badges and achievements

### SessionHistory

Review of past conversations:

- Chronological list of sessions
- Fluency scores for each session
- Ability to review corrections and feedback

## Error Handling and Fallbacks

TalkBuddy implements robust error handling:

1. **Database Fallback**: If MongoDB connection fails, the system falls back to file-based storage
2. **AI Service Fallback**: If AI analysis fails, a basic response is generated
3. **Network Error Handling**: Graceful handling of API failures with user-friendly messages
4. **Partial Success**: Core functionality continues even if secondary features (like gamification) fail

## Configuration

The system uses environment variables for configuration:

```
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=your_mongodb_connection_string (optional)
PORT=5000
```

## Deployment

TalkBuddy can be deployed in various environments:

- **Development**: Local Node.js and React development servers
- **Production**: Netlify for frontend, Node.js server for backend
- **Database**: MongoDB Atlas or local MongoDB instance

## Future Enhancements

Planned improvements to the TalkBuddy agent:

1. **Topic-based Learning**: Structured conversations around specific topics
2. **Personalized Learning Path**: Adaptive difficulty based on user progress
3. **Enhanced Voice Interaction**: More detailed pronunciation feedback
4. **Multi-language Support**: Expand beyond English to other languages
5. **Social Features**: Conversation practice with other learners
6. **Mobile Application**: Native mobile apps for iOS and Android

## Conclusion

TalkBuddy provides an engaging, AI-powered language learning experience with real-time feedback and gamification elements. The architecture is designed for reliability, scalability, and extensibility, making it a powerful tool for language learners worldwide.