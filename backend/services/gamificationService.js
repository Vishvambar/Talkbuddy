import UserProgress from '../models/UserProgress.js';
import { updateGamificationData, formatProgressResponse } from '../utils/gamificationEngine.js';

/**
 * Gamification Service
 * Handles all gamification-related database operations
 */

export async function updateUserProgress(userId, sessionData) {
  try {
    // Get current user progress
    let userProgress = await UserProgress.findOne({ user: userId });
    
    if (!userProgress) {
      // Create new user progress record
      userProgress = new UserProgress({
        user: userId,
        totalXP: 0,
        level: 1,
        streak: 0,
        badges: [],
        totalSessions: 0,
        hadVoiceMessage: false,
        recentSessions: []
      });
    }
    
    // Store previous data for badge calculations
    const previousData = userProgress.toObject();
    
    // Update gamification data using engine
    const updatedData = updateGamificationData(previousData, sessionData);
    
    // Update recent sessions (keep last 10)
    const newSessionEntry = {
      score: sessionData.score,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date()
    };
    
    const recentSessions = [...(userProgress.recentSessions || []), newSessionEntry];
    if (recentSessions.length > 10) {
      recentSessions.shift(); // Remove oldest
    }
    
    // Update weekly stats
    const today = new Date().toISOString().split('T')[0];
    const monday = getMonday(new Date()).toISOString().split('T')[0];
    
    if (!userProgress.weeklyStats || userProgress.weeklyStats.weekStartDate !== monday) {
      // New week, reset weekly stats
      updatedData.weeklyStats = {
        currentWeekXP: updatedData.xpGained,
        currentWeekSessions: 1,
        weekStartDate: monday
      };
    } else {
      // Same week, accumulate
      updatedData.weeklyStats = {
        currentWeekXP: (userProgress.weeklyStats.currentWeekXP || 0) + updatedData.xpGained,
        currentWeekSessions: (userProgress.weeklyStats.currentWeekSessions || 0) + 1,
        weekStartDate: monday
      };
    }
    
    // Update all fields
    Object.assign(userProgress, {
      ...updatedData,
      recentSessions
    });
    
    // Save to database
    await userProgress.save();
    
    return {
      success: true,
      progress: formatProgressResponse(userProgress.toObject()),
      xpGained: updatedData.xpGained,
      newBadges: updatedData.newBadges || []
    };
    
  } catch (error) {
    console.error('Error updating user progress:', error);
    throw error;
  }
}

export async function getUserProgress(userId) {
  try {
    let userProgress = await UserProgress.findOne({ user: userId });
    
    if (!userProgress) {
      // Return default progress for new users
      return formatProgressResponse({
        totalXP: 0,
        level: 1,
        streak: 0,
        badges: [],
        totalSessions: 0,
        lastActive: null
      });
    }
    
    return formatProgressResponse(userProgress.toObject());
    
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}

export async function getLeaderboard(limit = 10, type = 'xp') {
  try {
    let sortField;
    switch (type) {
      case 'level':
        sortField = { level: -1, totalXP: -1 };
        break;
      case 'streak':
        sortField = { streak: -1, totalXP: -1 };
        break;
      case 'weekly':
        sortField = { 'weeklyStats.currentWeekXP': -1 };
        break;
      default:
        sortField = { totalXP: -1 };
    }
    
    const users = await UserProgress
      .find({})
      .sort(sortField)
      .limit(limit)
      .select('user totalXP level streak badges totalSessions weeklyStats');
    
    return users.map((user, index) => ({
      rank: index + 1,
      user: user.user === 'anonymous' ? `User${user._id.toString().slice(-4)}` : user.user,
      totalXP: user.totalXP,
      level: user.level,
      streak: user.streak,
      badgeCount: user.badges?.length || 0,
      totalSessions: user.totalSessions,
      weeklyXP: user.weeklyStats?.currentWeekXP || 0
    }));
    
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

export async function getWeeklyProgress(userId) {
  try {
    const userProgress = await UserProgress.findOne({ user: userId });
    
    if (!userProgress || !userProgress.weeklyStats) {
      return {
        currentWeekXP: 0,
        currentWeekSessions: 0,
        weekStartDate: getMonday(new Date()).toISOString().split('T')[0]
      };
    }
    
    return userProgress.weeklyStats;
    
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    throw error;
  }
}

// Helper function to get Monday of current week
function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
}

export async function resetWeeklyStats() {
  try {
    const monday = getMonday(new Date()).toISOString().split('T')[0];
    
    const result = await UserProgress.updateMany(
      { 'weeklyStats.weekStartDate': { $ne: monday } },
      {
        $set: {
          'weeklyStats.currentWeekXP': 0,
          'weeklyStats.currentWeekSessions': 0,
          'weeklyStats.weekStartDate': monday
        }
      }
    );
    
    console.log(`Reset weekly stats for ${result.modifiedCount} users`);
    return result;
    
  } catch (error) {
    console.error('Error resetting weekly stats:', error);
    throw error;
  }
}
