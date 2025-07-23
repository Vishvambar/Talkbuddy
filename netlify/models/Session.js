import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    default: 'anonymous'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  transcript: {
    type: String,
    required: true
  },
  corrected: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  reply: {
    type: String,
    required: true
  },
  feedback: {
    type: String,
    default: ''
  },
  corrections: [{
    original: String,
    corrected: String,
    type: String // grammar, vocabulary, structure, etc.
  }]
}, {
  timestamps: true
});

// Index for efficient querying
sessionSchema.index({ user: 1, timestamp: -1 });
sessionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Session', sessionSchema);
