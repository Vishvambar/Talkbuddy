# 🎯 TalkBuddy - AI English Conversation Coach

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)

> **Transform your English fluency with AI-powered conversation coaching and gamification!**

TalkBuddy is an intelligent English conversation coach that provides real-time fluency analysis, personalized feedback, and engaging gamification to help learners improve their spoken English skills.

## ✨ Features

### 🤖 AI-Powered Coaching
- **Smart Conversation Analysis**: Groq Llama 3.1 analyzes your English fluency in real-time
- **Personalized Feedback**: Get specific grammar, vocabulary, and pronunciation suggestions
- **Natural Conversations**: Engaging dialogue that feels like chatting with a friendly tutor

### 🎙️ Voice & Text Support  
- **Speech-to-Text**: Record voice messages using Groq Whisper transcription
- **Multi-Format Audio**: Supports MP3, WAV, WebM, OGG, M4A, and more
- **Text Chat**: Type messages for instant analysis and feedback

### 🎮 Gamification System
- **XP & Levels**: Earn experience points based on fluency scores (15/10/7/3 XP)
- **Achievement Badges**: 10 different badges for milestones and streaks
- **Daily Streaks**: Track consecutive practice days for motivation
- **Leaderboards**: Compete with other learners by XP, level, or weekly progress

### 📊 Progress Tracking
- **Session History**: Review all conversations with scores and corrections
- **Weekly Analytics**: Track improvement trends and goal progress
- **Score Distribution**: Visualize your fluency progress over time
- **Detailed Feedback**: Learn from specific grammar and vocabulary corrections

## 🚀 Live Demo

🌐 **[Try TalkBuddy Live](https://your-app-name.netlify.app)**

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 7.0** - Modern UI framework with fast build tools
- **TailwindCSS 3.4** - Responsive, utility-first styling
- **Redux Toolkit** - Predictable state management
- **RecorderJS** - Client-side audio recording

### Backend (Serverless)
- **Netlify Functions** - Serverless Node.js functions
- **Groq AI SDK** - Llama 3.1 chat + Whisper speech-to-text
- **MongoDB Atlas** - Cloud database with local file fallback
- **Mongoose** - MongoDB ODM for schema management

### Infrastructure
- **Netlify** - Hosting, CDN, and serverless functions
- **MongoDB Atlas** - Managed cloud database
- **GitHub** - Version control and CI/CD

## 📁 Project Structure

```
TalkBuddy/
├── 🌐 frontend/                 # React application
│   ├── src/
│   │   ├── components/          # UI components
│   │   ├── config/api.js        # Environment-aware API configuration
│   │   └── redux/               # State management
│   └── dist/                    # Built static files
├── ⚡ netlify/
│   └── functions/               # Serverless backend functions
├── 🗄️ backend/                  # Original Express code (used by functions)
│   ├── models/                  # MongoDB schemas
│   ├── services/                # Business logic
│   └── utils/                   # AI clients & gamification engine
├── 📄 netlify.toml              # Netlify configuration
├── 🔀 _redirects               # API routing rules
└── 🔧 .env.example             # Environment variables template
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier available)
- Groq API key (free tier available)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/talkbuddy.git
cd TalkBuddy
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Add your API keys to .env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string
```

### 3. Development
```bash
# Terminal 1: Backend (for local development)
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 4. Production Build
```bash
npm run build
```

## 🌐 Deploy to Netlify

### Option A: One-Click Deploy
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/talkbuddy)

### Option B: Manual Deploy
1. **Fork this repository**
2. **Connect to Netlify**: Link your GitHub repo
3. **Environment Variables**: Add `GROQ_API_KEY` and `MONGODB_URI`
4. **Deploy**: Netlify automatically builds and deploys

### Build Settings
- **Build command**: `cd frontend && npm run build && cp ../_redirects frontend/dist/`
- **Publish directory**: `frontend/dist`
- **Functions directory**: `netlify/functions`

## 🎮 Gamification Details

### XP System
| Fluency Score | XP Earned | Description |
|---------------|-----------|-------------|
| 9-10         | 15 XP     | Excellent fluency |
| 7-8          | 10 XP     | Good fluency |
| 5-6          | 7 XP      | Fair fluency |
| 1-4          | 3 XP      | Basic fluency |

### Achievement Badges
- 🧠 **10/10 Master** - Get a perfect fluency score
- 💯 **First 100 XP** - Earn your first 100 XP
- 🔥 **3-Day Streak** - Practice 3 consecutive days
- 🗣️ **First Voice Message** - Complete first audio session
- ⭐ **500 XP Master** - Earn 500 total XP
- 🌟 **1000 XP Legend** - Earn 1000 total XP
- 🎯 **High Scorer** - Score 8+ on 5 consecutive messages
- 📚 **Consistent Learner** - Complete 50 practice sessions

## 📡 API Endpoints

### Core Functions
- `POST /api/chat` - Text conversation with fluency analysis
- `POST /api/audio-chat` - Voice conversation (transcription + analysis)
- `POST /api/transcribe` - Audio-to-text transcription only

### Progress & Gamification
- `GET /api/user-progress/:userId` - XP, level, badges, streak
- `GET /api/leaderboard?type=xp&limit=10` - Rankings
- `GET /api/sessions/:userId` - Conversation history
- `GET /api/week-summary/:userId` - Weekly analytics

## 🔧 Configuration

### Environment Variables
```bash
# Required
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talkbuddy

# Optional
NODE_ENV=production
PORT=5000
DB_FALLBACK=true
```

### Supported Audio Formats
- **Input**: MP3, WAV, WebM, OGG, M4A, FLAC, MP4, MPEG, MPGA, OPUS
- **Max Size**: 25MB (Groq free tier limit)
- **Processing**: Automatic cleanup after transcription

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Use ES6 modules and async/await
- Follow existing code style and naming conventions
- Add comprehensive error handling
- Test both frontend and backend changes
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Groq](https://groq.com)** - Lightning-fast AI inference for Llama and Whisper
- **[MongoDB Atlas](https://mongodb.com/atlas)** - Managed cloud database
- **[Netlify](https://netlify.com)** - Seamless deployment and hosting
- **[TailwindCSS](https://tailwindcss.com)** - Beautiful, responsive design system

## 📞 Support

- 📧 **Email**: your-email@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/talkbuddy/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/talkbuddy/discussions)

---

## 🎯 Roadmap

### v2.0 (Coming Soon)
- [ ] User authentication and profiles
- [ ] Advanced pronunciation analysis
- [ ] Conversation topics and structured lessons
- [ ] Social features and friend challenges
- [ ] Mobile app (React Native)
- [ ] Multi-language support

### v2.1 (Future)
- [ ] AI conversation simulator for specific scenarios
- [ ] Integration with popular language learning platforms
- [ ] Advanced analytics and learning recommendations
- [ ] Voice synthesis for AI responses
- [ ] Collaborative learning features

---

**Made with ❤️ by the TalkBuddy Team**

*Empowering English learners worldwide with AI-powered conversation coaching.*
