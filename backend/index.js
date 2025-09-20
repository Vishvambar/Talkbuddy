import express from 'express';
import dotenv from 'dotenv';
import groqRoutes from './routes/groq.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './utils/database.js';
import { optionalAuth } from './middleware/authMiddleware.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://talkbuddy.netlify.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Apply optional auth middleware to all routes
app.use(optionalAuth);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', groqRoutes);
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, async () => {
  console.log('🚀 Server running on http://localhost:5000');
  // Initialize database connection
  await connectDB();
});
