# TalkBuddy Netlify Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **MongoDB Atlas**: Set up database at [mongodb.com/atlas](https://mongodb.com/atlas)
3. **Groq API Key**: Get from [console.groq.com](https://console.groq.com/keys)

### 1. Deploy to Netlify

#### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub
2. Connect GitHub repo to Netlify
3. Netlify will auto-deploy on pushes

#### Option B: Manual Deploy
1. Run `npm run build` locally
2. Drag `frontend/dist` folder to Netlify deploy interface

### 2. Configure Environment Variables

In Netlify Dashboard → Site Settings → Environment Variables, add:

```
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talkbuddy
NODE_ENV=production
```

### 3. Enable Netlify Functions
- Functions are automatically deployed from `/netlify/functions/`
- No additional configuration needed

## 🏗️ Project Structure for Netlify

```
TalkBuddy/
├── netlify/
│   └── functions/           # Serverless backend functions
│       ├── chat.js         # Text conversation endpoint
│       ├── audio-chat.js   # Voice conversation endpoint
│       ├── transcribe.js   # Audio transcription endpoint
│       ├── user-progress.js # Gamification progress
│       ├── leaderboard.js  # Rankings and leaderboards
│       └── sessions.js     # Session history
├── frontend/               # React application
│   ├── dist/              # Built files (auto-generated)
│   └── src/
│       └── config/
│           └── api.js     # Environment-aware API configuration
├── backend/               # Original Express code (used by functions)
├── netlify.toml          # Netlify configuration
└── package.json          # Root dependencies for functions
```

## 🔧 Configuration Files

### netlify.toml
- **Build settings**: Frontend build command and output directory
- **Redirects**: API routes to Netlify Functions
- **Headers**: CORS and caching configuration
- **SPA routing**: Single Page Application fallback

### API Configuration
- **Development**: `http://localhost:5000/api/*`
- **Production**: `/.netlify/functions/*`
- **Auto-detection**: Based on environment and hostname

## 📡 API Endpoints (Production)

All endpoints automatically work as Netlify Functions:

- `POST /.netlify/functions/chat` - Text conversation
- `POST /.netlify/functions/audio-chat` - Voice conversation  
- `POST /.netlify/functions/transcribe` - Audio transcription
- `GET /.netlify/functions/user-progress/:userId` - User progress
- `GET /.netlify/functions/leaderboard` - Rankings
- `GET /.netlify/functions/sessions/:userId` - Session history

## 🛠️ Development vs Production

### Local Development
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### Production (Netlify)
- Frontend: Static React app served by Netlify CDN
- Backend: Serverless functions auto-scale and sleep when idle
- Database: MongoDB Atlas (always-on cloud database)

## 🎯 Deployment Checklist

### Before First Deploy
- [ ] Create MongoDB Atlas cluster
- [ ] Get Groq API key
- [ ] Test locally with `npm run build`
- [ ] Verify environment variables

### Netlify Setup
- [ ] Connect GitHub repository
- [ ] Add environment variables
- [ ] Verify build command: `cd frontend && npm run build`
- [ ] Verify publish directory: `frontend/dist`
- [ ] Enable Netlify Functions (automatic)

### Post-Deploy Testing
- [ ] Test chat functionality
- [ ] Test voice recording (if microphone available)
- [ ] Verify gamification (XP, badges, leaderboard)
- [ ] Check session history
- [ ] Test responsive design on mobile

## 🔍 Troubleshooting

### Common Issues

**Build Fails**
- Check Node.js version (18+ recommended)
- Verify all dependencies in `frontend/package.json`
- Run `npm install` in root and frontend directories

**Functions Not Working**
- Verify environment variables are set
- Check function logs in Netlify dashboard
- Ensure MongoDB connection string is correct

**API Calls Failing**
- Check browser developer tools for CORS errors
- Verify environment detection in `frontend/src/config/api.js`
- Test functions individually using Netlify function URLs

**Gamification Not Working**
- Verify MongoDB connection
- Check console logs for database errors
- Test with file fallback by setting `DB_FALLBACK=true`

### Debug Tools
- **Netlify Function Logs**: Real-time debugging in dashboard
- **Browser DevTools**: Network tab for API call inspection
- **MongoDB Compass**: Database connection and data verification

## 💰 Cost Considerations

### Netlify Free Tier
- **Bandwidth**: 100GB/month
- **Build minutes**: 300 minutes/month  
- **Functions**: 125,000 invocations/month
- **Function runtime**: 10 seconds max

### Scaling
- Free tier suitable for moderate usage
- Upgrade to Pro ($19/month) for higher limits
- Functions auto-scale based on demand

## 🚀 Performance Optimizations

### Built-in Optimizations
- **CDN**: Global content delivery network
- **Compression**: Automatic Gzip/Brotli
- **Caching**: Static asset caching with cache headers
- **Code Splitting**: Vendor and Redux chunks separated

### Manual Optimizations
- Image optimization (WebP, compression)
- Lazy loading for heavy components
- MongoDB query optimization with indexes
- Function cold start minimization

## 🔐 Security

### Automatic Security
- **HTTPS**: SSL certificates auto-generated
- **Headers**: Security headers in netlify.toml
- **Environment Variables**: Securely encrypted

### Best Practices
- Never commit API keys to git
- Use environment variables for all secrets
- Enable MongoDB IP whitelisting if needed
- Regular dependency updates

## 📊 Monitoring

### Netlify Analytics
- Function invocation counts
- Build success/failure rates
- Bandwidth usage tracking

### Application Monitoring
- MongoDB Atlas monitoring
- Groq API usage tracking
- User engagement via gamification metrics

---

## 🎉 Success!

Your TalkBuddy app is now live! Share the Netlify URL with users to start improving their English conversation skills with AI-powered coaching and gamification.

**Live Demo Features:**
- ✅ AI-powered conversation analysis
- ✅ Voice recording and transcription  
- ✅ Real-time fluency scoring
- ✅ XP system with levels and badges
- ✅ Leaderboards and streaks
- ✅ Session history and analytics
- ✅ Mobile-responsive design
