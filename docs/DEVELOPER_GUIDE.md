# TalkBuddy Developer Guide

## Introduction

This guide is intended for developers who want to contribute to or extend the TalkBuddy project. It provides detailed information about the codebase structure, development workflow, and best practices.

## Development Environment Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB (optional, falls back to file storage)
- Git
- Code editor (VS Code recommended)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/talkbuddy.git
   cd talkbuddy
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory with the following variables:
   ```
   GROQ_API_KEY=your_groq_api_key
   MONGODB_URI=mongodb://localhost:27017/talkbuddy
   PORT=5000
   ```

3. **Install dependencies**
   
   Backend:
   ```bash
   cd backend
   npm install
   ```
   
   Frontend:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start development servers**
   
   Backend (in the `backend` directory):
   ```bash
   npm run dev
   ```
   
   Frontend (in the `frontend` directory):
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal)

## Project Structure

### Backend Structure

```
backend/
├── data/                  # File storage fallback
│   └── sessions.json      # Session data when MongoDB is unavailable
├── models/                # MongoDB schemas
│   ├── Session.js         # Conversation session schema
│   └── UserProgress.js    # User progress and gamification schema
├── routes/                # API endpoints
│   └── groq.js            # All API routes
├── services/              # Business logic
│   ├── gamificationService.js  # User progress and rewards
│   └── sessionService.js       # Session management
├── utils/                 # Helper functions
│   ├── database.js        # Database connection and file storage
│   ├── fluencyAnalyzer.js # Language analysis
│   ├── gamificationEngine.js # XP and rewards calculation
│   ├── groqClient.js      # Groq API client
│   └── groqWhisper.js     # Speech recognition
├── index.js               # Entry point
└── package.json           # Dependencies
```

### Frontend Structure

```
frontend/
├── public/                # Static assets
│   ├── _redirects         # Netlify redirects
│   └── vite.svg           # Vite logo
├── src/
│   ├── assets/            # Images and resources
│   ├── components/        # React components
│   │   ├── ChatScreen.jsx # Main conversation interface
│   │   ├── Navigation.jsx # App navigation
│   │   └── SessionHistory.jsx # History view
│   ├── config/            # Configuration
│   │   └── api.js         # API endpoints and fetch utilities
│   ├── redux/             # State management
│   │   ├── slices/        # Redux slices
│   │   └── store.js       # Redux store
│   ├── App.css            # Main styles
│   ├── App.jsx            # Main component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── eslint.config.js       # ESLint configuration
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## Key Components and Services

### Backend Components

#### API Routes (groq.js)

The main API routes file contains all endpoints:

- `POST /api/chat`: Process text messages and return AI responses
- `POST /api/transcribe`: Transcribe audio files to text
- `GET /api/sessions/:userId`: Get user's conversation history
- `GET /api/progress/:userId`: Get user's progress and gamification data
- `GET /api/leaderboard`: Get top users by XP
- `GET /api/weekly-summary/:userId`: Get weekly performance summary

#### Fluency Analyzer (fluencyAnalyzer.js)

The core language processing component:

- `analyzeTextFluency(userText)`: Analyzes text for errors and provides corrections
- `getEnhancedSystemPrompt()`: Generates prompts for the AI model

#### Gamification Engine (gamificationEngine.js)

Handles user progression and rewards:

- `calculateXP(fluencyScore)`: Calculates XP based on performance
- `calculateLevel(totalXP)`: Determines user level
- `updateGamificationData(userData, sessionData)`: Updates user progress
- `BADGES`: Defines available achievements and conditions

#### Session Service (sessionService.js)

Manages conversation data:

- `saveSession(sessionData)`: Stores conversation in database or file
- `getUserSessions(userId)`: Retrieves user's conversation history
- `getWeeklySummary(userId)`: Generates weekly performance report

### Frontend Components

#### ChatScreen

The main conversation interface:

- Displays conversation history
- Handles text input and submission
- Manages audio recording for voice input
- Shows corrections and feedback

#### SessionHistory

Displays past conversations:

- Lists sessions by date
- Shows fluency scores and corrections
- Provides filtering and sorting options

#### Navigation

Application navigation and status display:

- Tab navigation between screens
- Shows current level and XP
- Displays active streak
- Shows notification badges

## Data Flow

### Text Conversation Flow

1. User enters text in ChatScreen component
2. Frontend sends POST request to `/api/chat` with message and userId
3. Backend processes request in groq.js route handler
4. fluencyAnalyzer.js analyzes text for errors
5. groqClient.js sends prompt to Groq API
6. Response is processed and returned to frontend
7. sessionService.js saves the conversation
8. gamificationService.js updates user progress
9. Frontend displays response, corrections, and updated progress

### Voice Conversation Flow

1. User records audio in ChatScreen component
2. Frontend sends audio file to `/api/transcribe`
3. Backend processes audio with groqWhisper.js
4. Transcribed text follows the same flow as text conversations

## Development Workflow

### Adding New Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement your changes**
   - Follow the existing code style and patterns
   - Add appropriate error handling
   - Update documentation as needed

3. **Test your changes**
   - Test locally with various inputs
   - Verify both MongoDB and file storage fallback

4. **Submit a pull request**
   - Provide a clear description of your changes
   - Reference any related issues

### Common Development Tasks

#### Adding a New API Endpoint

1. Add the route handler in `backend/routes/groq.js`
2. Implement any required service functions
3. Add the endpoint URL in `frontend/src/config/api.js`
4. Create frontend components to use the new endpoint

#### Modifying the Database Schema

1. Update the schema in `backend/models/`
2. Update corresponding service functions
3. Test with both MongoDB and file storage

#### Adding a New Badge

1. Add the badge definition in `backend/utils/gamificationEngine.js`
2. Implement the condition function
3. Add badge display in the frontend

## Testing

### Backend Testing

Use the provided test scripts for database and API testing:

```bash
# Test database operations
node comprehensive-database-test.js

# Debug session issues
node debug-session-issue.js

# Test MongoDB connection
node test-mongodb.js
```

### Frontend Testing

Use Vite's built-in testing capabilities:

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Best Practices

### Code Style

- Follow ESLint rules defined in the project
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Use meaningful variable and function names

### Error Handling

- Use try/catch blocks for async operations
- Implement fallback mechanisms where appropriate
- Log errors with meaningful context
- Return appropriate HTTP status codes

### Performance Considerations

- Minimize API calls to external services
- Implement caching where appropriate
- Optimize database queries
- Lazy load components when possible

## Extending the AI Capabilities

### Customizing the Language Model

To modify how TalkBuddy analyzes and responds to user input:

1. Update the system prompt in `backend/utils/fluencyAnalyzer.js`
2. Adjust the scoring algorithm as needed
3. Modify the correction format for different feedback styles

### Adding New Language Features

To add support for new language learning features:

1. Implement the analysis logic in `fluencyAnalyzer.js`
2. Update the API response format in `routes/groq.js`
3. Add UI components to display the new features

## Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Build and deploy the Node.js application
3. Configure MongoDB connection or ensure file storage permissions

### Frontend Deployment

1. Build the frontend application:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your hosting service

3. Configure redirects for SPA routing (see `_redirects` file)

## Troubleshooting

### Common Issues

**MongoDB Connection Failures**

- Verify MongoDB is running
- Check connection string in `.env`
- Ensure network connectivity
- The application will fall back to file storage

**API Key Issues**

- Verify Groq API key in `.env`
- Check for API usage limits
- Look for error messages in the console

**Frontend Build Problems**

- Clear node_modules and reinstall dependencies
- Check for version conflicts in package.json
- Verify Vite configuration

## Contributing Guidelines

1. Follow the code style and best practices
2. Write clear commit messages
3. Document your changes
4. Test thoroughly before submitting pull requests
5. Be respectful and constructive in discussions

---

Thank you for contributing to TalkBuddy! If you have any questions or need assistance, please reach out to the project maintainers.