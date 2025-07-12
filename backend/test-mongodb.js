#!/usr/bin/env node

/**
 * MongoDB Connection Test Script
 * Run with: node test-mongodb.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './utils/database.js';
import Session from './models/Session.js';

dotenv.config();

async function testMongoDB() {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  try {
    // Test connection
    console.log('1. Testing database connection...');
    await connectDB();
    
    if (mongoose.connection.readyState === 1) {
      console.log('✅ Successfully connected to MongoDB!');
      console.log(`📍 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
    } else {
      console.log('⚠️  Using file storage fallback');
      return;
    }
    
    // Test creating a session
    console.log('\n2. Testing session creation...');
    const testSession = new Session({
      user: 'mongodb-test-user',
      transcript: 'This is a test message',
      corrected: 'This is a test message.',
      score: 8,
      reply: 'Great job! Your English is improving.',
      feedback: 'Perfect grammar and punctuation!',
      corrections: []
    });
    
    const savedSession = await testSession.save();
    console.log('✅ Test session created successfully!');
    console.log(`📝 Session ID: ${savedSession._id}`);
    
    // Test reading sessions
    console.log('\n3. Testing session retrieval...');
    const sessions = await Session.find({ user: 'mongodb-test-user' });
    console.log(`✅ Found ${sessions.length} session(s) for test user`);
    
    // Clean up test data
    console.log('\n4. Cleaning up test data...');
    await Session.deleteMany({ user: 'mongodb-test-user' });
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 MongoDB is configured correctly!');
    console.log('💡 TalkBuddy will now save sessions to MongoDB instead of local files.');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check your MONGODB_URI in .env file');
    console.log('2. Ensure your MongoDB cluster is running');
    console.log('3. Verify network access (whitelist your IP)');
    console.log('4. Check username/password are correct');
    console.log('\n📁 TalkBuddy will use file storage as fallback');
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

testMongoDB();
