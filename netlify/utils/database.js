import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// MongoDB connection
let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talkbuddy';
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed, using file storage fallback:', error.message);
    isConnected = false;
  }
}

// File storage fallback
const STORAGE_DIR = path.join(process.cwd(), 'data');
const SESSIONS_FILE = path.join(STORAGE_DIR, 'sessions.json');

export function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

export function loadSessions() {
  ensureStorageDir();
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const data = fs.readFileSync(SESSIONS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading sessions from file:', error);
  }
  return [];
}

export function saveSessions(sessions) {
  ensureStorageDir();
  try {
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error saving sessions to file:', error);
    throw error;
  }
}

export { isConnected };
