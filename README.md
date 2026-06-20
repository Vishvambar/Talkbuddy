# TalkBuddy - AI-Powered English Conversation Coach

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-56.7%25-f7df1e?logo=javascript)](https://github.com/Vishvambar/Talkbuddy)
[![CSS](https://img.shields.io/badge/CSS-26.9%25-1572b6?logo=css3)](https://github.com/Vishvambar/Talkbuddy)
[![HTML](https://img.shields.io/badge/HTML-16.4%25-e34c26?logo=html5)](https://github.com/Vishvambar/Talkbuddy)

**Website**: [https://talkbuddy-ashy.vercel.app](https://talkbuddy-ashy.vercel.app)

## 📋 Overview

TalkBuddy is an interactive language learning application designed to help non-native English speakers improve their fluency through AI-powered conversations. The application provides real-time feedback on grammar, vocabulary, and sentence structure while gamifying the learning experience to keep users motivated and engaged.

Whether you're a beginner or advanced learner, TalkBuddy adapts to your needs and helps you practice English in a natural, conversational way.

## ✨ Key Features

- **🤖 Conversational AI Coach**: Natural dialogue with an AI tutor that responds like a supportive friend
- **📊 Real-time Fluency Analysis**: Instant feedback on grammar, vocabulary, and sentence structure
- **🎤 Voice Recognition**: Practice speaking with audio transcription using Whisper API
- **🎮 Gamification System**: Earn XP, level up, maintain streaks, and unlock badges
- **📈 Progress Tracking**: Comprehensive session history and performance analytics
- **🎯 Personalized Feedback**: Tailored suggestions based on your specific language patterns

## 🏗️ Architecture

TalkBuddy follows a modern full-stack architecture with separate frontend and backend applications:

### Frontend Stack
- **Framework**: React 19 with Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS for responsive UI
- **Audio**: Audio recording capabilities for speech practice
- **Build Tool**: Vite for fast development and optimized builds

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js REST API
- **Database**: MongoDB with file-based fallback
- **AI Integration**: Groq API for language model capabilities
- **Speech-to-Text**: Whisper API for audio transcription
- **Authentication**: JWT with bcrypt password hashing

## 🔧 Technical Components

### Backend Services

#### API Endpoints
- `POST /api/chat` - Text-based conversation with fluency analysis
- `POST /api/transcribe` - Audio transcription for spoken practice
- `GET /api/sessions` - User session history and analytics
- `GET /api/progress` - Gamification and user progress tracking

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

**Session**
- User identifier
- Timestamp
- Original transcript
- Corrected text
- Fluency score (1-10)
- AI response
- Feedback and corrections

**UserProgress**
- User identifier
- Total XP
- Current level
- Streak count
- Last active date
- Earned badges
- Weekly statistics
- Recent session history

## 📦 Tech Stack Summary

| Layer | Technology | Percentage |
|-------|-----------|-----------|
| **Frontend** | JavaScript/React, HTML, CSS | 56.7% JS, 16.4% HTML, 26.9% CSS |
| **Backend** | Node.js, Express.js | JavaScript |
| **Database** | MongoDB | NoSQL |
| **AI/ML** | Groq API, Whisper API | Third-party services |
| **Deployment** | Vercel (Frontend) | Serverless |

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16 or higher
- **npm**: v8 or higher
- **MongoDB**: Optional (falls back to file storage if not available)
- **API Keys**: 
  - Groq API key (for AI conversations)
  - Whisper API access (for speech-to-text)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vishvambar/Talkbuddy.git
   cd Talkbuddy
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   MONGODB_URI=your_mongodb_connection_string (optional)
   PORT=5000
   JWT_SECRET=your_jwt_secret
   ```

5. **Start the development servers**
   
   **Backend** (in `backend` directory):
   ```bash
   npm run dev
   ```
   
   **Frontend** (in `frontend` directory):
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Open your browser and navigate to: `http://localhost:5173`
   
   The backend will be running on: `http://localhost:5000`

## 📁 Project Structure

```text
Talkbuddy/
├── backend/                  # Node.js Express API
│   ├── data/                 # File storage fallback
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── services/             # Business logic
│   ├── utils/                # Helper functions
│   ├── index.js              # Entry point
│   ├── package.json          # Dependencies
│   └── .env                  # Environment variables (create locally)
│
├── frontend/                 # React UI Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/           # Images and resources
│   │   ├── components/       # React components
│   │   ├── config/           # Configuration
│   │   ├── redux/            # State management
│   │   ├── App.jsx           # Main application
│   │   └── main.jsx          # Entry point
│   ├── package.json          # Dependencies
│   ├── vite.config.js        # Vite configuration
│   └── tailwind.config.js    # Tailwind CSS config
│
├── docs/                     # Detailed technical documentation
│   ├── ARCHITECTURE.md       # System architecture design
│   ├── API_DOCUMENTATION.md  # Detailed API specifications
│   ├── AGENT_DOCUMENTATION.md# AI Agent behaviors
│   ├── DEVELOPER_GUIDE.md    # Developer setup & guidelines
│   └── USER_GUIDE.md         # End-user manual
│
└── README.md                 # This file
```

## 🔄 Development Workflow

### Backend Development
- Run `npm run dev` to start the development server with hot reload
- API endpoints are available at `http://localhost:5000`
- Use `nodemon` for automatic restart on file changes

### Frontend Development
- Run `npm run dev` to start Vite development server
- Hot Module Replacement (HMR) enabled for instant updates
- Build optimized production bundle with `npm run build`

### Building for Production

**Frontend**:
```bash
cd frontend
npm run build
npm run preview
```

**Backend**: 
Deploy to Node.js hosting services using `npm start` or equivalent commands.

## 🌐 Deployment

### Frontend Deployment
- Currently deployed on **Vercel**
- Automatic deployments on push to main branch
- Visit: [https://talkbuddy-ashy.vercel.app](https://talkbuddy-ashy.vercel.app)

### Backend Deployment Options
- **Heroku**: Classic Node.js hosting
- **Render**: Modern serverless Node.js deployment
- **Railway**: Developer-friendly Node.js hosting
- **AWS/GCP/Azure**: Full-stack cloud deployment

### Database Deployment
- **MongoDB Atlas**: Cloud-hosted MongoDB service
- **File Storage**: Built-in fallback for local development

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the project's style guide and includes appropriate comments.

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/Vishvambar/Talkbuddy/issues) on GitHub
- Check existing issues for solutions
- Provide detailed information about your problem

## 🎯 Roadmap

Future enhancements may include:
- [ ] Video conversation support
- [ ] Advanced pronunciation analysis
- [ ] Additional language support
- [ ] Mobile app (React Native)
- [ ] Collaborative learning features
- [ ] AI-powered learning paths

---

<div align="center">

**Made with ❤️ by [Vishvambar](https://github.com/Vishvambar)**

⭐ If you find this project helpful, please consider giving it a star!

</div>
