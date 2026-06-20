# TalkBuddy API Documentation

## Overview

This document provides detailed information about the TalkBuddy API endpoints, request/response formats, and usage examples. The API enables developers to integrate TalkBuddy's language learning capabilities into their applications.

## Base URL

```
http://localhost:5000/api
```

In production, replace with your deployed API URL.

## Authentication

Currently, the API uses a simple user ID system without formal authentication. Future versions will implement proper authentication mechanisms.

## API Endpoints

### Text Conversation

**Endpoint:** `POST /chat`

**Description:** Process a text message and return AI-generated responses with fluency analysis.

**Request Body:**

```json
{
  "message": "I want to improving my english skills",
  "userId": "user123"
}
```

**Parameters:**

| Parameter | Type   | Required | Description                    |
|-----------|--------|----------|--------------------------------|
| message   | string | Yes      | The user's text message        |
| userId    | string | No       | User identifier (default: "anonymous") |

**Response:**

```json
{
  "reply": "That's great! I'm here to help you improve your English skills. What specific areas would you like to work on?",
  "score": 7,
  "corrected": "I want to improve my English skills.",
  "corrections": [
    {
      "original": "improving",
      "corrected": "improve",
      "type": "grammar"
    },
    {
      "original": "english",
      "corrected": "English",
      "type": "capitalization"
    }
  ],
  "feedback": "Good effort! Remember to use the base form of the verb after 'to' and capitalize language names.",
  "level": 2,
  "totalXP": 125,
  "xpEarned": 7,
  "streak": 3,
  "newBadges": ["streak_3"],
  "levelUp": false
}
```

**Response Fields:**

| Field       | Type    | Description                                      |
|-------------|---------|--------------------------------------------------|
| reply       | string  | AI response to the user's message                |
| score       | number  | Fluency score (1-10)                            |
| corrected   | string  | Corrected version of the user's message         |
| corrections | array   | Specific corrections with details                |
| feedback    | string  | Learning feedback and explanations              |
| level       | number  | Current user level                              |
| totalXP     | number  | Total experience points                         |
| xpEarned    | number  | XP earned from this interaction                 |
| streak      | number  | Current daily streak count                      |
| newBadges   | array   | Any new badges earned (empty if none)           |
| levelUp     | boolean | Whether the user leveled up in this interaction |

**Error Responses:**

```json
{
  "error": "Chat processing failed"
}
```

### Audio Transcription

**Endpoint:** `POST /transcribe`

**Description:** Transcribe an audio file to text and process it like a text message.

**Request:**

Multipart form data with the following fields:

| Field           | Type   | Required | Description                                  |
|-----------------|--------|----------|----------------------------------------------|
| audio           | file   | Yes      | Audio file (supported formats: flac, mp3, mp4, mpeg, mpga, m4a, ogg, opus, wav, webm) |
| userId          | string | No       | User identifier (default: "anonymous")       |
| model           | string | No       | Whisper model to use (default: "whisper-large-v3-turbo") |
| language        | string | No       | Language code (default: "en")               |
| response_format | string | No       | Response format (default: "json")           |
| prompt          | string | No       | Optional prompt to guide transcription      |

**Response:**

Same as the `/chat` endpoint, with additional fields:

```json
{
  "transcript": "I want to improving my english skills",
  "reply": "That's great! I'm here to help you improve your English skills. What specific areas would you like to work on?",
  "score": 7,
  "corrected": "I want to improve my English skills.",
  "corrections": [...],
  "feedback": "Good effort! Remember to use the base form of the verb after 'to' and capitalize language names.",
  "level": 2,
  "totalXP": 125,
  "xpEarned": 10,  // Note: Voice messages earn bonus XP
  "streak": 3,
  "newBadges": [],
  "levelUp": false,
  "voiceBonus": true
}
```

**Error Responses:**

```json
{
  "error": "No audio file uploaded or unsupported file type."
}
```

```json
{
  "error": "Uploaded file not found or corrupted."
}
```

```json
{
  "error": "Transcription failed: [error details]"
}
```

### User Sessions

**Endpoint:** `GET /sessions/:userId`

**Description:** Retrieve a user's conversation history.

**URL Parameters:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| userId    | string | Yes      | User identifier      |

**Query Parameters:**

| Parameter | Type   | Required | Description                                  |
|-----------|--------|----------|----------------------------------------------|
| limit     | number | No       | Maximum number of sessions (default: 20)     |
| offset    | number | No       | Number of sessions to skip (default: 0)      |
| sort      | string | No       | Sort order ("asc" or "desc", default: "desc") |

**Response:**

```json
{
  "success": true,
  "total": 42,
  "sessions": [
    {
      "_id": "60f1e5b3c5b7f40015a7b3e2",
      "user": "user123",
      "timestamp": "2023-09-15T14:32:10.123Z",
      "transcript": "I want to improving my english skills",
      "corrected": "I want to improve my English skills.",
      "score": 7,
      "reply": "That's great! I'm here to help you improve your English skills. What specific areas would you like to work on?",
      "feedback": "Good effort! Remember to use the base form of the verb after 'to' and capitalize language names.",
      "corrections": [
        {
          "original": "improving",
          "corrected": "improve",
          "type": "grammar"
        },
        {
          "original": "english",
          "corrected": "English",
          "type": "capitalization"
        }
      ]
    },
    // Additional sessions...
  ]
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Failed to retrieve sessions"
}
```

### User Progress

**Endpoint:** `GET /progress/:userId`

**Description:** Retrieve a user's progress and gamification data.

**URL Parameters:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| userId    | string | Yes      | User identifier      |

**Response:**

```json
{
  "success": true,
  "progress": {
    "user": "user123",
    "totalXP": 325,
    "level": 4,
    "streak": 7,
    "lastActive": "2023-09-15",
    "badges": ["first_100_xp", "streak_3", "streak_7", "voice_master"],
    "totalSessions": 42,
    "weeklyStats": {
      "weekStartDate": "2023-09-11",
      "sessionsCompleted": 12,
      "averageScore": 7.5,
      "xpEarned": 95
    },
    "recentSessions": [
      {
        "score": 8,
        "date": "2023-09-15",
        "timestamp": "2023-09-15T14:32:10.123Z"
      },
      // Additional recent sessions...
    ]
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Failed to retrieve user progress"
}
```

### Leaderboard

**Endpoint:** `GET /leaderboard`

**Description:** Retrieve the top users by XP.

**Query Parameters:**

| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| limit     | number | No       | Maximum number of users (default: 10)    |

**Response:**

```json
{
  "success": true,
  "leaderboard": [
    {
      "user": "user456",
      "totalXP": 850,
      "level": 9,
      "streak": 12,
      "badges": 7
    },
    {
      "user": "user789",
      "totalXP": 720,
      "level": 8,
      "streak": 5,
      "badges": 6
    },
    // Additional users...
  ]
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Failed to retrieve leaderboard"
}
```

### Weekly Summary

**Endpoint:** `GET /weekly-summary/:userId`

**Description:** Retrieve a user's weekly performance summary.

**URL Parameters:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| userId    | string | Yes      | User identifier      |

**Response:**

```json
{
  "success": true,
  "summary": {
    "weekStartDate": "2023-09-11",
    "weekEndDate": "2023-09-17",
    "sessionsCompleted": 12,
    "averageScore": 7.5,
    "xpEarned": 95,
    "streakMaintained": true,
    "badgesEarned": ["streak_7"],
    "commonErrors": [
      {
        "type": "grammar",
        "count": 8,
        "examples": ["improving", "have eat"]
      },
      {
        "type": "capitalization",
        "count": 5,
        "examples": ["english", "monday"]
      }
    ],
    "improvementAreas": ["verb tenses", "capitalization"],
    "strengths": ["vocabulary", "sentence structure"]
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "error": "Failed to retrieve weekly summary"
}
```

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server-side error

All error responses include an `error` field with a description of the error.

## Rate Limiting

Currently, there are no rate limits implemented. However, excessive usage may be throttled in future versions.

## Webhook Integration

Webhook support for real-time notifications is planned for future releases.

## Example Usage

### JavaScript (Fetch API)

```javascript
// Send a text message
async function sendMessage(message, userId) {
  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        userId
      })
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

// Send an audio recording
async function sendAudio(audioBlob, userId) {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('userId', userId);
    
    const response = await fetch('http://localhost:5000/api/transcribe', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending audio:', error);
    throw error;
  }
}

// Get user sessions
async function getUserSessions(userId, limit = 20) {
  try {
    const response = await fetch(`http://localhost:5000/api/sessions/${userId}?limit=${limit}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}
```

### Python (Requests)

```python
import requests

# Send a text message
def send_message(message, user_id):
    try:
        response = requests.post(
            'http://localhost:5000/api/chat',
            json={
                'message': message,
                'userId': user_id
            }
        )
        return response.json()
    except Exception as e:
        print(f'Error sending message: {e}')
        raise

# Send an audio recording
def send_audio(audio_file_path, user_id):
    try:
        with open(audio_file_path, 'rb') as audio_file:
            files = {'audio': audio_file}
            data = {'userId': user_id}
            response = requests.post(
                'http://localhost:5000/api/transcribe',
                files=files,
                data=data
            )
        return response.json()
    except Exception as e:
        print(f'Error sending audio: {e}')
        raise

# Get user sessions
def get_user_sessions(user_id, limit=20):
    try:
        response = requests.get(
            f'http://localhost:5000/api/sessions/{user_id}',
            params={'limit': limit}
        )
        return response.json()
    except Exception as e:
        print(f'Error fetching sessions: {e}')
        raise
```

## Future API Enhancements

- OAuth2 authentication
- WebSocket support for real-time conversations
- Bulk operations for session management
- Advanced analytics endpoints
- Custom prompt configuration
- Multi-language support

---

For additional support or to report issues, please contact the TalkBuddy development team.