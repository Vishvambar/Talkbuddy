# TalkBuddy Developer Reference

## Introduction

This guide provides detailed information for developers who want to extend, modify, or contribute to the TalkBuddy project. It covers the codebase structure, development workflows, and best practices.

## Development Environment Setup

### Prerequisites

- Node.js (v14.x or higher)
- npm (v7.x or higher)
- MongoDB (optional, file-based fallback available)
- Git

### Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/talkbuddy.git
   cd talkbuddy
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the backend directory
   ```
   GROQ_API_KEY=your_groq_api_key
   MONGODB_URI=your_mongodb_connection_string (optional)
   PORT=5000
   ```

5. Start the development servers
   
   Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

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
│   │   ├── ChatScreen.css # Component-specific styles
│   │   ├── dashboard.css  # Dashboard styles
│   │   ├── landing.css    # Landing page styles
│   │   └── modern-chat.css # Modern UI styles
│   ├── components/        # React components
│   │   ├── AuthScreen.jsx # Authentication screen
│   │   ├── ChatScreen.jsx # Main conversation interface
│   │   ├── Dashboard.jsx  # User dashboard
│   │   ├── HomeScreen.jsx # Home screen
│   │   ├── LandingPage.jsx # Landing page
│   │   ├── MessageBubble.jsx # Chat message component
│   │   ├── MessageInput.jsx # Text/voice input component
│   │   ├── Navbar.jsx     # Navigation bar
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

The main API routes file contains all endpoints. To add a new endpoint:

1. Add the route handler in `backend/routes/groq.js`
   ```javascript
   router.post('/new-endpoint', async (req, res) => {
     try {
       // Implementation
       res.json({ success: true, data: result });
     } catch (err) {
       console.error('Error:', err);
       res.status(500).json({ error: 'Processing failed' });
     }
   });
   ```

2. Export the route in `index.js`

#### Fluency Analyzer (fluencyAnalyzer.js)

The core language processing component. To modify the analysis logic:

1. Update the prompt in `analyzeTextFluency()` function
2. Adjust the response parsing and validation
3. Modify the fallback analysis if needed

#### Gamification Engine (gamificationEngine.js)

Handles user progression and rewards. To add new gamification features:

1. Add new badge types in the `BADGES` constant
2. Update the badge awarding logic in `updateGamificationData()`
3. Modify XP calculation in `calculateXP()` if needed

### Frontend Components

#### Adding a New Component

1. Create a new component file in `frontend/src/components/`
   ```jsx
   import React from 'react';
   import '../assets/your-component.css';
   
   const YourComponent = ({ props }) => {
     return (
       <div className="your-component">
         {/* Implementation */}
       </div>
     );
   };
   
   export default YourComponent;
   ```

2. Import and use the component in the appropriate parent component

#### State Management with Redux

To add a new state slice:

1. Create a new slice file in `frontend/src/redux/slices/`
   ```javascript
   import { createSlice } from '@reduxjs/toolkit';
   
   const initialState = {
     // Initial state
   };
   
   const yourSlice = createSlice({
     name: 'yourFeature',
     initialState,
     reducers: {
       // Reducers
     },
   });
   
   export const { actions } = yourSlice;
   export default yourSlice.reducer;
   ```

2. Add the slice to the store in `frontend/src/redux/store.js`

## Development Workflows

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

### Modifying the AI Prompt

The AI prompt is defined in `backend/utils/fluencyAnalyzer.js`. To modify it:

1. Update the `analysisPrompt` template string
2. Test with various user inputs to ensure proper responses
3. Verify that the JSON parsing still works correctly

### Adding New Gamification Features

1. Define new badge types in `backend/utils/gamificationEngine.js`
2. Add logic to award the badges in the `updateGamificationData()` function
3. Update the frontend to display the new badges in the Dashboard component

## Testing

### Manual Testing

1. **Chat Functionality**
   - Test with various text inputs (short, long, with errors, without errors)
   - Test voice input with different audio files
   - Verify corrections and feedback are appropriate

2. **User Progress**
   - Verify XP calculation and level progression
   - Test streak counting and badge awarding
   - Check leaderboard functionality

3. **Error Handling**
   - Test with invalid inputs
   - Simulate API failures
   - Verify fallback mechanisms

### Automated Testing (Future)

Planned automated testing includes:

- Unit tests for utility functions
- Integration tests for API endpoints
- End-to-end tests for user flows

## Performance Optimization

### Backend Optimization

1. **Database Queries**
   - Use indexes for frequently queried fields
   - Limit returned fields to necessary data
   - Implement pagination for large result sets

2. **API Response Time**
   - Cache frequently accessed data
   - Optimize AI prompt length and complexity
   - Use streaming responses for large payloads

### Frontend Optimization

1. **React Component Optimization**
   - Use React.memo for pure components
   - Implement useMemo and useCallback for expensive calculations
   - Lazy load components when appropriate

2. **Asset Optimization**
   - Compress images and other assets
   - Use code splitting to reduce initial load time
   - Implement proper caching strategies

## Deployment

### Backend Deployment

1. **Prepare for production**
   - Set environment variables
   - Configure CORS for production domains
   - Set up proper logging

2. **Deployment options**
   - Heroku: Easy deployment with MongoDB Atlas
   - AWS: More control with EC2 or Lambda
   - Netlify Functions: Serverless option for simple deployments

### Frontend Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deployment options**
   - Netlify: Easy deployment with CI/CD
   - Vercel: Good for React applications
   - GitHub Pages: Simple static hosting

## Contributing Guidelines

### Code Style

- Follow the existing code style and patterns
- Use ESLint and Prettier for code formatting
- Write clear, descriptive comments

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test thoroughly
5. Submit a pull request with a clear description

### Documentation

- Update relevant documentation for your changes
- Add inline comments for complex logic
- Include examples for API changes

## Troubleshooting

### Common Development Issues

1. **MongoDB Connection Issues**
   - Verify MongoDB is running
   - Check connection string in .env file
   - Ensure network connectivity

2. **API Errors**
   - Check server logs for detailed error messages
   - Verify request format and parameters
   - Test endpoints with Postman or similar tools

3. **Frontend Build Issues**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts in package.json
   - Verify Vite configuration

## Future Development Roadmap

### Planned Features

1. **Authentication System**
   - User registration and login
   - Social media authentication
   - Role-based access control

2. **Enhanced AI Capabilities**
   - Topic-based conversations
   - Personalized difficulty adjustment
   - Advanced pronunciation feedback

3. **Social Features**
   - User-to-user messaging
   - Group practice sessions
   - Community challenges

4. **Mobile Applications**
   - React Native mobile app
   - Offline mode support
   - Push notifications

### Architecture Evolution

1. **Microservices**
   - Split monolithic backend into specialized services
   - Implement service discovery and API gateway
   - Use message queues for asynchronous processing

2. **Real-time Features**
   - Implement WebSockets for live interactions
   - Add real-time notifications
   - Enable collaborative features

## Conclusion

This developer reference provides the information needed to understand, extend, and contribute to the TalkBuddy project. By following these guidelines and best practices, you can help improve the application and add new features that enhance the language learning experience for users.