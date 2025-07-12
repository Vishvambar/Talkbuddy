# TalkBuddy - Agent Configuration

## Commands
- **Backend dev**: `cd backend && npm run dev` (starts nodemon on port 5000)
- **Frontend dev**: `cd frontend && npm run dev` (starts Vite dev server)
- **Frontend build**: `cd frontend && npm run build`
- **Frontend lint**: `cd frontend && npm run lint`
- **Tests**: No tests configured yet (backend shows "Error: no test specified")

## Architecture
- **Stack**: Node.js/Express backend + React/Vite frontend
- **AI Services**: Groq SDK for Llama chat and Whisper transcription
- **Key APIs**: `/api/chat` (text), `/api/transcribe` (audio to text), `/api/audio-chat` (audio to chat)
- **File uploads**: Multer handles audio files in `backend/uploads/`
- **Frontend state**: Redux Toolkit, components in `src/components/`

## Code Style
- **Backend**: ES6 modules, async/await, Express middleware pattern
- **Frontend**: React functional components, JSX, ES6 imports
- **Styling**: TailwindCSS with custom classes
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Error handling**: Try-catch blocks, global error middleware in backend
- **File structure**: Separate routes, utils, components directories
- **Environment**: `.env` files for API keys, CORS enabled for cross-origin requests
