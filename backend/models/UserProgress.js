import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    unique: true,
    default: 'anonymous'
  },
  totalXP: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActive: {
    type: String, // YYYY-MM-DD format
    default: () => new Date().toISOString().split('T')[0]
  },
  badges: [{
    type: String // badge IDs from gamificationEngine.js
  }],
  totalSessions: {
    type: Number,
    default: 0,
    min: 0
  },
  hadVoiceMessage: {
    type: Boolean,
    default: false
  },
  recentSessions: [{
    score: {
      type: Number,
      min: 1,
      max: 10
    },
    date: String, // YYYY-MM-DD format
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  // Weekly stats
  weeklyStats: {
    currentWeekXP: {
      type: Number,
      default: 0
    },
    currentWeekSessions: {
      type: Number,
      default: 0
    },
    weekStartDate: {
      type: String, // YYYY-MM-DD format
      default: () => {
        const now = new Date();
        const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
        return monday.toISOString().split('T')[0];
      }
    }
  }
}, {
  timestamps: true
});

// Index for efficient querying
userProgressSchema.index({ user: 1 });
userProgressSchema.index({ level: -1 }); // For leaderboards
userProgressSchema.index({ totalXP: -1 }); // For leaderboards
userProgressSchema.index({ lastActive: -1 }); // For active users

// Pre-save middleware to keep recentSessions array at max 10 items
userProgressSchema.pre('save', function(next) {
  if (this.recentSessions && this.recentSessions.length > 10) {
    this.recentSessions = this.recentSessions.slice(-10);
  }
  next();
});

export default mongoose.model('UserProgress', userProgressSchema);
