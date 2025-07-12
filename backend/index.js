import express from 'express';
import dotenv from 'dotenv';
import groqRoutes from './routes/groq.js';
import cors from 'cors';
import { connectDB } from './utils/database.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

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
