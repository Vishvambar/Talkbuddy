/**
 * TalkBuddy Gamification Engine
 * Handles XP calculation, leveling, streaks, and badges
 */

// XP Formula based on fluency score
export function calculateXP(fluencyScore) {
  if (fluencyScore >= 9) return 15;
  if (fluencyScore >= 7) return 10;
  if (fluencyScore >= 5) return 7;
  return 3;
}

// Level calculation - every 100 XP = 1 level
export function calculateLevel(totalXP) {
  return Math.floor(totalXP / 100) + 1;
}

// Calculate XP needed for next level
export function getXPForNextLevel(totalXP) {
  const currentLevel = calculateLevel(totalXP);
  const nextLevelXP = currentLevel * 100;
  return nextLevelXP - totalXP;
}

// Badge definitions and logic
export const BADGES = {
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: '🧠 10/10 Master',
    description: 'Get a perfect fluency score',
    condition: (data) => data.score === 10
  },
  FIRST_100_XP: {
    id: 'first_100_xp',
    name: '💯 First 100 XP',
    description: 'Earn your first 100 XP',
    condition: (data) => data.totalXP >= 100 && data.previousXP < 100
  },
  STREAK_3: {
    id: 'streak_3',
    name: '🔥 3-Day Streak',
    description: 'Practice 3 days in a row',
    condition: (data) => data.streak >= 3 && data.previousStreak < 3
  },
  STREAK_7: {
    id: 'streak_7',
    name: '🔥 Week Warrior',
    description: 'Practice 7 days in a row',
    condition: (data) => data.streak >= 7 && data.previousStreak < 7
  },
  STREAK_30: {
    id: 'streak_30',
    name: '🔥 Month Master',
    description: 'Practice 30 days in a row',
    condition: (data) => data.streak >= 30 && data.previousStreak < 30
  },
  FIRST_VOICE: {
    id: 'first_voice',
    name: '🗣️ First Voice Message',
    description: 'Complete your first voice session',
    condition: (data) => data.isVoiceMessage && !data.hadVoiceBefore
  },
  XP_500: {
    id: 'xp_500',
    name: '⭐ 500 XP Master',
    description: 'Earn 500 total XP',
    condition: (data) => data.totalXP >= 500 && data.previousXP < 500
  },
  XP_1000: {
    id: 'xp_1000',
    name: '🌟 1000 XP Legend',
    description: 'Earn 1000 total XP',
    condition: (data) => data.totalXP >= 1000 && data.previousXP < 1000
  },
  HIGH_SCORER: {
    id: 'high_scorer',
    name: '🎯 High Scorer',
    description: 'Score 8+ on 5 consecutive messages',
    condition: (data) => data.recentHighScores >= 5
  },
  CONSISTENT_LEARNER: {
    id: 'consistent_learner',
    name: '📚 Consistent Learner',
    description: 'Complete 50 practice sessions',
    condition: (data) => data.totalSessions >= 50 && data.previousSessions < 50
  }
};

// Check which new badges user has earned
export function checkNewBadges(userData, previousData = {}) {
  const newBadges = [];
  const existingBadges = userData.badges || [];
  
  for (const badge of Object.values(BADGES)) {
    // Skip if user already has this badge
    if (existingBadges.includes(badge.id)) continue;
    
    // Check if badge condition is met
    const checkData = {
      ...userData,
      previousXP: previousData.totalXP || 0,
      previousStreak: previousData.streak || 0,
      previousSessions: previousData.totalSessions || 0,
      hadVoiceBefore: previousData.hadVoiceMessage || false
    };
    
    if (badge.condition(checkData)) {
      newBadges.push(badge);
    }
  }
  
  return newBadges;
}

// Calculate streak based on last active dates
export function calculateStreak(lastActive, today = new Date()) {
  if (!lastActive) return 1; // First day
  
  const lastDate = new Date(lastActive);
  const todayDate = new Date(today);
  
  // Normalize to just dates (ignore time)
  lastDate.setHours(0, 0, 0, 0);
  todayDate.setHours(0, 0, 0, 0);
  
  const diffTime = todayDate.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - don't increment streak
    return null; // Will use existing streak
  } else if (diffDays === 1) {
    // Next day - increment streak
    return 'increment';
  } else {
    // Gap in days - reset streak
    return 1;
  }
}

// Calculate recent high scores (8+ scores in last 5 sessions)
export function calculateRecentHighScores(recentSessions) {
  if (!recentSessions || recentSessions.length < 5) return 0;
  
  const last5 = recentSessions.slice(-5);
  return last5.filter(session => session.score >= 8).length;
}

// Main gamification update function
export function updateGamificationData(userProgress, sessionData) {
  const today = new Date().toISOString().split('T')[0];
  const previousData = { ...userProgress };
  
  // Calculate XP gained from this session
  const xpGained = calculateXP(sessionData.score);
  const newTotalXP = (userProgress.totalXP || 0) + xpGained;
  
  // Calculate new level
  const newLevel = calculateLevel(newTotalXP);
  
  // Calculate streak
  const streakResult = calculateStreak(userProgress.lastActive, new Date());
  let newStreak;
  if (streakResult === null) {
    newStreak = userProgress.streak || 1; // Same day, keep current
  } else if (streakResult === 'increment') {
    newStreak = (userProgress.streak || 0) + 1;
  } else {
    newStreak = streakResult; // Reset to 1
  }
  
  // Track voice usage
  const hadVoiceMessage = userProgress.hadVoiceMessage || sessionData.isVoiceMessage;
  
  // Count total sessions
  const totalSessions = (userProgress.totalSessions || 0) + 1;
  
  // Update user progress
  const updatedProgress = {
    ...userProgress,
    totalXP: newTotalXP,
    level: newLevel,
    streak: newStreak,
    lastActive: today,
    hadVoiceMessage,
    totalSessions,
    xpGained, // For this session
    recentHighScores: calculateRecentHighScores([
      ...(userProgress.recentSessions || []),
      { score: sessionData.score, date: today }
    ])
  };
  
  // Check for new badges
  const newBadges = checkNewBadges(updatedProgress, previousData);
  if (newBadges.length > 0) {
    updatedProgress.badges = [
      ...(userProgress.badges || []),
      ...newBadges.map(badge => badge.id)
    ];
    updatedProgress.newBadges = newBadges; // For response
  }
  
  return updatedProgress;
}

// Format progress for API response
export function formatProgressResponse(userProgress) {
  const badges = (userProgress.badges || []).map(badgeId => {
    const badge = Object.values(BADGES).find(b => b.id === badgeId);
    return badge ? { id: badge.id, name: badge.name, description: badge.description } : null;
  }).filter(Boolean);
  
  return {
    totalXP: userProgress.totalXP || 0,
    level: userProgress.level || 1,
    xpForNextLevel: getXPForNextLevel(userProgress.totalXP || 0),
    streak: userProgress.streak || 0,
    badges,
    totalSessions: userProgress.totalSessions || 0,
    lastActive: userProgress.lastActive,
    // Include any new badges earned this session
    newBadges: userProgress.newBadges || []
  };
}
