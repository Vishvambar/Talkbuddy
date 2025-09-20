import React from 'react';

const HomeScreen = () => {
  return (
    <div className='home-container'>
      <div className='hero-section'>
        <div className='hero-content'>
          <div className='brand-logo'>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="var(--accent-color)"/>
              <path d="M16 24h32M16 32h32M16 40h24" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className='hero-title'>Welcome to TalkBuddy</h1>
          <p className='hero-subtitle'>Your AI-powered English conversation partner</p>
          <p className='hero-description'>
            Practice speaking English naturally with our advanced AI tutor. Get real-time feedback, 
            improve your pronunciation, and build confidence in your conversations.
          </p>
        </div>
      </div>

      <div className='features-section'>
        <div className='features-grid'>
          <div className='feature-card'>
            <div className='feature-icon'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className='feature-title'>Natural Conversations</h3>
            <p className='feature-description'>
              Engage in realistic conversations with our AI that adapts to your skill level
            </p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <h3 className='feature-title'>Voice Recognition</h3>
            <p className='feature-description'>
              Practice pronunciation with advanced speech recognition technology
            </p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 className='feature-title'>Real-time Feedback</h3>
            <p className='feature-description'>
              Get instant corrections and suggestions to improve your English skills
            </p>
          </div>

          <div className='feature-card'>
            <div className='feature-icon'>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 className='feature-title'>Progress Tracking</h3>
            <p className='feature-description'>
              Monitor your improvement with detailed conversation history and analytics
            </p>
          </div>
        </div>
      </div>

      <div className='cta-section'>
        <div className='cta-content'>
          <h2 className='cta-title'>Ready to start practicing?</h2>
          <p className='cta-description'>
            Begin your English learning journey today with personalized AI conversations
          </p>
          <div className='cta-actions'>
            <button className='btn btn-primary btn-lg'>
              Start Chatting
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
