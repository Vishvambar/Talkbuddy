# 🔍 TalkBuddy Deployment Verification Guide

## ✅ Pre-Deployment Checklist

### 1. Environment Variables (Critical)
Before deploying, ensure these are set in Netlify Dashboard → Site Settings → Environment Variables:

```
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/talkbuddy
```

⚠️ **Without these, you'll get HTTP 502 errors!**

### 2. Build Settings Verification
In Netlify Dashboard → Site Settings → Build & Deploy:

- **Build command**: `npm install && cd netlify && npm install && cd ../frontend && npm install && npm run build`
- **Publish directory**: `frontend/dist`
- **Functions directory**: `netlify/functions` (auto-detected)

## 🧪 Post-Deployment Testing

### Test 1: Basic Chat Function
```bash
curl -X POST https://your-site.netlify.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, test message","userId":"test_user"}'
```

**Expected Response:**
```json
{
  "reply": "AI response here",
  "score": 7,
  "corrected": "Corrected version",
  "corrections": [],
  "feedback": "Feedback text"
}
```

### Test 2: User Progress API
```bash
curl https://your-site.netlify.app/api/user-progress/test_user
```

**Expected Response:**
```json
{
  "success": true,
  "progress": {
    "totalXP": 0,
    "level": 1,
    "streak": 0,
    "badges": []
  }
}
```

### Test 3: Leaderboard API
```bash
curl https://your-site.netlify.app/api/leaderboard
```

**Expected Response:**
```json
{
  "success": true,
  "leaderboard": [],
  "type": "xp"
}
```

## 🚨 Common Issues & Solutions

### HTTP 502 Bad Gateway
**Cause**: Function import errors or missing dependencies
**Solution**: 
1. Check Netlify Function logs
2. Verify environment variables are set
3. Redeploy to refresh function bundle

### HTTP 500 Internal Server Error
**Cause**: Environment variables not set
**Error in logs**: `Missing required environment variables: GROQ_API_KEY, MONGODB_URI`
**Solution**: Add environment variables in Netlify Dashboard

### CORS Errors
**Cause**: Incorrect headers or preflight handling
**Solution**: Already handled in functions, but verify browser console for details

### Database Connection Issues
**Cause**: Invalid MongoDB URI or network restrictions
**Solution**: 
1. Verify MongoDB Atlas connection string
2. Check IP whitelist (allow 0.0.0.0/0 for Netlify)
3. Ensure user has read/write permissions

## 🔧 Debugging Tools

### Netlify Function Logs
1. Go to Netlify Dashboard → Functions
2. Click on any function to see real-time logs
3. Logs show console.error() output from functions

### Browser Developer Tools
1. Open Network tab
2. Try a chat message
3. Check API call response for error details

### Function Test URLs
After deployment, functions are available at:
- `https://your-site.netlify.app/.netlify/functions/chat`
- `https://your-site.netlify.app/.netlify/functions/user-progress`
- `https://your-site.netlify.app/.netlify/functions/leaderboard`

## 📊 Health Check Endpoint

Test all functions with this simple script:

```javascript
const baseUrl = 'https://your-site.netlify.app';
const testUserId = 'health_check_' + Date.now();

async function healthCheck() {
  try {
    // Test chat
    const chatResponse = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Hello, this is a health check', 
        userId: testUserId 
      })
    });
    console.log('Chat API:', chatResponse.ok ? '✅' : '❌', await chatResponse.json());

    // Test user progress
    const progressResponse = await fetch(`${baseUrl}/api/user-progress/${testUserId}`);
    console.log('Progress API:', progressResponse.ok ? '✅' : '❌', await progressResponse.json());

    // Test leaderboard
    const leaderboardResponse = await fetch(`${baseUrl}/api/leaderboard`);
    console.log('Leaderboard API:', leaderboardResponse.ok ? '✅' : '❌', await leaderboardResponse.json());

  } catch (error) {
    console.error('Health check failed:', error);
  }
}

healthCheck();
```

## 🎯 Success Indicators

When everything is working correctly, you should see:

1. **Frontend loads** without console errors
2. **Chat messages** get AI responses with scores
3. **Voice recording** works (if microphone available)
4. **Session history** shows previous conversations
5. **Gamification** shows XP gains and level progression
6. **No 502 or 500 errors** in network tab

## 📞 If Issues Persist

1. **Check Netlify Function logs** for specific error messages
2. **Verify environment variables** are exactly correct
3. **Test MongoDB connection** separately using MongoDB Compass
4. **Redeploy the site** to refresh function bundles
5. **Check browser console** for client-side errors

---

**Remember**: The most common issue is missing or incorrect environment variables. Always verify `GROQ_API_KEY` and `MONGODB_URI` are set correctly in Netlify Dashboard!
