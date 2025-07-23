import Session from '../models/Session.js';
import { connectDB, isConnected, loadSessions, saveSessions } from '../utils/database.js';

/**
 * Save a session to database or file
 * @param {Object} sessionData - Session data to save
 * @returns {Promise<Object>} - Saved session
 */
export async function saveSession(sessionData) {
  await connectDB();
  
  if (isConnected) {
    // Use MongoDB
    try {
      const session = new Session(sessionData);
      return await session.save();
    } catch (error) {
      console.error('MongoDB save error, falling back to file:', error);
    }
  }
  
  // Fallback to file storage
  const sessions = loadSessions();
  const newSession = {
    _id: Date.now().toString(),
    ...sessionData,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  sessions.push(newSession);
  saveSessions(sessions);
  return newSession;
}

/**
 * Get all sessions for a user
 * @param {string} userId - User identifier
 * @param {number} limit - Maximum number of sessions to return
 * @returns {Promise<Array>} - Array of sessions
 */
export async function getUserSessions(userId, limit = 50) {
  await connectDB();
  
  if (isConnected) {
    try {
      return await Session
        .find({ user: userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('MongoDB query error, falling back to file:', error);
    }
  }
  
  // Fallback to file storage
  const sessions = loadSessions();
  return sessions
    .filter(session => session.user === userId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}

/**
 * Get weekly summary for a user
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} - Weekly summary stats
 */
export async function getWeeklySummary(userId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  await connectDB();
  
  let sessions = [];
  
  if (isConnected) {
    try {
      sessions = await Session
        .find({ 
          user: userId,
          timestamp: { $gte: oneWeekAgo }
        })
        .sort({ timestamp: 1 })
        .lean();
    } catch (error) {
      console.error('MongoDB query error, falling back to file:', error);
    }
  }
  
  if (!isConnected || sessions.length === 0) {
    // Fallback to file storage
    const allSessions = loadSessions();
    sessions = allSessions
      .filter(session => 
        session.user === userId && 
        new Date(session.timestamp) >= oneWeekAgo
      )
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }
  
  if (sessions.length === 0) {
    return {
      averageScore: 0,
      activeDays: 0,
      totalSessions: 0,
      improvementTrend: 'No data available',
      weeklyGoal: 'Practice daily for better progress!'
    };
  }
  
  // Calculate statistics
  const scores = sessions.map(s => s.score);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Count unique days
  const uniqueDays = new Set(
    sessions.map(s => new Date(s.timestamp).toDateString())
  ).size;
  
  // Calculate improvement trend
  let improvementTrend = 'Stable';
  if (sessions.length >= 3) {
    const firstHalf = sessions.slice(0, Math.floor(sessions.length / 2));
    const secondHalf = sessions.slice(Math.floor(sessions.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.score, 0) / secondHalf.length;
    
    const improvement = secondHalfAvg - firstHalfAvg;
    if (improvement > 0.5) improvementTrend = 'Improving';
    else if (improvement < -0.5) improvementTrend = 'Needs attention';
  }
  
  return {
    averageScore: Math.round(averageScore * 10) / 10,
    activeDays: uniqueDays,
    totalSessions: sessions.length,
    improvementTrend,
    weeklyGoal: uniqueDays >= 5 
      ? 'Great consistency! Keep it up!' 
      : `Try to practice ${Math.max(1, 5 - uniqueDays)} more days this week.`
  };
}

/**
 * Get all sessions (for admin/testing purposes)
 * @param {number} limit - Maximum number of sessions
 * @returns {Promise<Array>} - Array of all sessions
 */
export async function getAllSessions(limit = 100) {
  await connectDB();
  
  if (isConnected) {
    try {
      return await Session
        .find({})
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
    } catch (error) {
      console.error('MongoDB query error, falling back to file:', error);
    }
  }
  
  // Fallback to file storage
  const sessions = loadSessions();
  return sessions
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
}
