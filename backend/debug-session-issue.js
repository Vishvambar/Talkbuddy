#!/usr/bin/env node

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './utils/database.js';
import Session from './models/Session.js';
import { getUserSessions } from './services/sessionService.js';

dotenv.config();

async function debugSessionIssue() {
  console.log('🔍 Debugging Session Retrieval Issue\n');
  
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');
    
    // Check what's actually in the database
    console.log('\n1. Checking all sessions in database...');
    const allSessions = await Session.find({}).lean();
    console.log(`   Total sessions in DB: ${allSessions.length}`);
    
    if (allSessions.length > 0) {
      console.log('   Recent sessions:');
      allSessions.slice(-3).forEach((session, i) => {
        console.log(`   ${i + 1}. User: ${session.user}, Score: ${session.score}, Text: "${session.transcript?.substring(0, 30)}..."`);
      });
    }
    
    // Check for the specific user
    console.log('\n2. Checking for final-test-user specifically...');
    const finalTestSessions = await Session.find({ user: 'final-test-user' }).lean();
    console.log(`   Sessions for final-test-user: ${finalTestSessions.length}`);
    
    if (finalTestSessions.length > 0) {
      finalTestSessions.forEach((session, i) => {
        console.log(`   ${i + 1}. ID: ${session._id}, Score: ${session.score}, Text: "${session.transcript}"`);
      });
    }
    
    // Test the service function
    console.log('\n3. Testing getUserSessions service...');
    const serviceSessions = await getUserSessions('final-test-user', 10);
    console.log(`   Service returned: ${serviceSessions.length} sessions`);
    
    // Check if there are recent sessions
    console.log('\n4. Checking recent sessions (last 5 minutes)...');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentSessions = await Session.find({ 
      createdAt: { $gte: fiveMinutesAgo } 
    }).lean();
    console.log(`   Recent sessions: ${recentSessions.length}`);
    
    if (recentSessions.length > 0) {
      recentSessions.forEach((session, i) => {
        console.log(`   ${i + 1}. User: ${session.user}, Time: ${session.createdAt}, Score: ${session.score}`);
      });
    }
    
    // Test saving a new session for final-test-user
    console.log('\n5. Creating a test session for final-test-user...');
    const testSession = new Session({
      user: 'final-test-user',
      transcript: 'Debug test message',
      corrected: 'Debug test message.',
      score: 7,
      reply: 'Debug reply',
      feedback: 'Debug feedback',
      corrections: []
    });
    
    const saved = await testSession.save();
    console.log(`   ✅ Test session saved: ${saved._id}`);
    
    // Now check again
    console.log('\n6. Checking again after manual save...');
    const afterSave = await getUserSessions('final-test-user', 10);
    console.log(`   Sessions found: ${afterSave.length}`);
    
    if (afterSave.length > 0) {
      afterSave.forEach((session, i) => {
        console.log(`   ${i + 1}. Score: ${session.score}, Text: "${session.transcript}"`);
      });
    }
    
    console.log('\n✅ Debug complete');
    
    // Cleanup
    await Session.deleteOne({ _id: saved._id });
    console.log('🧹 Cleaned up test session');
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

debugSessionIssue();
