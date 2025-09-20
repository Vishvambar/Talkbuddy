# TalkBuddy API Reference

## Overview

This document provides detailed information about the TalkBuddy API endpoints, request/response formats, and authentication requirements. The TalkBuddy API allows developers to integrate language learning capabilities into their applications.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api` or `/.netlify/functions`

## Authentication

Currently, the API uses a simple user ID system. Future versions will implement proper authentication with JWT tokens.

## API Endpoints

### Chat API

#### Send Text Message

Process a text message and get AI response with language corrections.

- **URL**: `/chat`
- **Method**: `POST`
- **Content-Type**: `application/json`

**Request Body**:

```json
{
  "message": "Hello, how are you today?",
  "userId": "user123"
}
```

**Response**:

```json
{
  "reply": "I'm doing well, thank you for asking! How about you? What have you been up to today?",
  "score": 9,
  "corrected": "Hello, how are you today?",
  "corrections": [],
  "feedback": "Excellent job! Your sentence is grammatically correct and natural.",
  "totalXP": 1250,
  "level": 5,
  "streak": 3,
  "xpGained": 25,
  "newBadges": []
}
```

**Status Codes**:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `500 Internal Server Error`: Server error

#### Transcribe Audio

Transcribe an audio recording and process it as a conversation message.

- **URL**: `/transcribe`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

**Request Body**:

```
Form data with:
- audio: Audio file (supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm)
- userId: "user123"
- model: "whisper-large-v3-turbo" (optional)
- language: "en" (optional)
```

**Response**: Same as text chat endpoint

**Status Codes**:
- `200 OK`: Request successful
- `400 Bad Request`: Invalid file format or missing file
- `500 Internal Server Error`: Server error

### User Progress API

#### Get User Progress

Retrieve a user's progress and gamification data.

- **URL**: `/user-progress/:userId`
- **Method**: `GET`

**Response**:

```json
{
  "totalXP": 1250,
  "level": 5,
  "streak": 3,
  "badges": ["first_conversation", "three_day_streak"],
  "totalSessions": 42,
  "lastActive": "2023-06-15",
  "weeklyStats": {
    "weekStartDate": "2023-06-12",
    "currentWeekXP": 350,
    "currentWeekSessions": 12
  },
  "recentSessions": [
    {
      "score": 8,
      "date": "2023-06-15",
      "timestamp": "2023-06-15T14:32:10.123Z"
    },
    {
      "score": 7,
      "date": "2023-06-15",
      "timestamp": "2023-06-15T10:15:22.456Z"
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Request successful
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### Get Leaderboard

Retrieve the top users ranked by XP.

- **URL**: `/leaderboard`
- **Method**: `GET`
- **Query Parameters**:
  - `limit`: Maximum number of users to return (default: 10)

**Response**:

```json
{
  "leaderboard": [
    {
      "user": "user456",
      "totalXP": 3250,
      "level": 12,
      "streak": 15
    },
    {
      "user": "user789",
      "totalXP": 2800,
      "level": 10,
      "streak": 7
    },
    {
      "user": "user123",
      "totalXP": 1250,
      "level": 5,
      "streak": 3
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Request successful
- `500 Internal Server Error`: Server error

### Session History API

#### Get User Sessions

Retrieve a user's conversation history.

- **URL**: `/sessions/:userId`
- **Method**: `GET`
- **Query Parameters**:
  - `limit`: Maximum number of sessions to return (default: 20)
  - `offset`: Number of sessions to skip (for pagination, default: 0)

**Response**:

```json
{
  "sessions": [
    {
      "_id": "session123",
      "user": "user123",
      "timestamp": "2023-06-15T14:32:10.123Z",
      "transcript": "Hello, how are you today?",
      "corrected": "Hello, how are you today?",
      "score": 9,
      "reply": "I'm doing well, thank you for asking! How about you? What have you been up to today?",
      "feedback": "Excellent job! Your sentence is grammatically correct and natural.",
      "corrections": []
    },
    {
      "_id": "session122",
      "user": "user123",
      "timestamp": "2023-06-15T10:15:22.456Z",
      "transcript": "I go to store yesterday.",
      "corrected": "I went to the store yesterday.",
      "score": 7,
      "reply": "Oh, what did you buy at the store? Did you find everything you were looking for?",
      "feedback": "Good effort! Remember to use past tense for past actions and include articles where needed.",
      "corrections": [
        {
          "original": "go",
          "corrected": "went",
          "type": "grammar"
        },
        {
          "original": "to store",
          "corrected": "to the store",
          "type": "article"
        }
      ]
    }
  ],
  "total": 42,
  "limit": 20,
  "offset": 0
}
```

**Status Codes**:
- `200 OK`: Request successful
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

#### Get Weekly Summary

Retrieve a user's weekly performance summary.

- **URL**: `/sessions/:userId/week-summary`
- **Method**: `GET`

**Response**:

```json
{
  "weeklyStats": {
    "weekStartDate": "2023-06-12",
    "sessionsCompleted": 12,
    "averageScore": 7.5,
    "xpEarned": 350,
    "topTopics": ["daily life", "hobbies", "travel"],
    "mostImprovedAreas": ["past tense", "articles"],
    "challengeAreas": ["prepositions", "conditionals"]
  },
  "previousWeek": {
    "weekStartDate": "2023-06-05",
    "sessionsCompleted": 8,
    "averageScore": 6.8,
    "xpEarned": 240
  },
  "improvement": {
    "sessionsChange": 4,
    "scoreChange": 0.7,
    "xpChange": 110
  }
}
```

**Status Codes**:
- `200 OK`: Request successful
- `404 Not Found`: User not found
- `500 Internal Server Error`: Server error

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Rate Limiting

The API currently has the following rate limits:

- 60 requests per minute per IP address
- 10 audio transcription requests per minute per user

When rate limited, the API will respond with a `429 Too Many Requests` status code.

## Webhook Notifications (Coming Soon)

In future versions, TalkBuddy will support webhook notifications for:

- New badges earned
- Streak milestones
- Level-up events
- Weekly summary generation

## SDK and Client Libraries

Official client libraries for common programming languages are under development. Currently, you can use any HTTP client to interact with the API.

## Best Practices

1. **Implement Caching**: Cache user progress and session history to reduce API calls
2. **Handle Errors Gracefully**: Display user-friendly messages when API errors occur
3. **Implement Retry Logic**: Use exponential backoff for failed requests
4. **Optimize Audio Files**: Compress audio files before uploading to improve performance
5. **Batch Requests**: Fetch multiple sessions at once rather than individual requests

## Changelog

### v1.0.0 (Current)

- Initial API release
- Basic chat and transcription endpoints
- User progress and session history

### v1.1.0 (Planned)

- JWT authentication
- Webhook notifications
- Enhanced analytics endpoints
- Topic-based conversation starters

## Support

For API support, contact api-support@talkbuddy.com or visit our developer forum at https://developers.talkbuddy.com.