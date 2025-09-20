import React, { useState, useEffect } from 'react'
import { ENDPOINTS, apiCall } from './config/api'
import ChatScreen from './components/ChatScreen'
import SessionHistory from './components/SessionHistory'
import Navigation from './components/Navigation'
import HomeScreen from './components/HomeScreen'
import LandingPage from './components/LandingPage'
import AuthScreen from './components/AuthScreen'
import Dashboard from './components/Dashboard'
import './assets/design-system.css'
import './assets/modern-layout.css'
import './assets/modern-chat.css'
import './assets/modern-home.css'
import './assets/auth.css'
import './assets/landing.css'
import './assets/dashboard.css'

const App = () => {
  const [activeTab, setActiveTab] = useState('home')
  const [sessionCount, setSessionCount] = useState(0)
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showLanding, setShowLanding] = useState(true)
  const userId = user?.id || 'demo-user'

  useEffect(() => {
    // Check if user is logged in (from localStorage or session)
    const savedUser = localStorage.getItem('talkbuddy_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setShowLanding(false)
        setActiveTab('dashboard')
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('talkbuddy_user')
      }
    }
    
    fetchSessionCount()
  }, [])

  // Fetch session count for navigation badge
  useEffect(() => {
    const fetchSessionCountInterval = async () => {
      try {
        const data = await apiCall(ENDPOINTS.SESSIONS(userId))
        if (data.success) {
          setSessionCount(data.total)
        }
      } catch (error) {
        console.error('Failed to fetch session count:', error)
      }
    }

    if (user) {
      fetchSessionCountInterval()
      // Refresh session count every 30 seconds
      const interval = setInterval(fetchSessionCountInterval, 30000)
      return () => clearInterval(interval)
    }
  }, [userId, user])

  const fetchSessionCount = async () => {
    try {
      const data = await apiCall(ENDPOINTS.SESSIONS(userId))
      if (data.success) {
        setSessionCount(data.total)
      }
    } catch (error) {
      console.error('Failed to fetch session count:', error)
    }
  }

  const handleNewSession = () => {
    // Increment session count when a new session is created
    setSessionCount(prev => prev + 1)
  }

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('talkbuddy_user', JSON.stringify(userData))
    setShowAuth(false)
    setShowLanding(false)
    setActiveTab('dashboard')
  }

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear cookies
      await apiCall(ENDPOINTS.LOGOUT, { method: 'POST' })
      // Clear local storage and state
      setUser(null)
      localStorage.removeItem('talkbuddy_user')
      setShowLanding(true)
      setActiveTab('home')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear local data even if API call fails
      setUser(null)
      localStorage.removeItem('talkbuddy_user')
      setShowLanding(true)
      setActiveTab('home')
    }
  }

  const handleGetStarted = () => {
    setShowAuth(true)
    setShowLanding(false)
  }

  const handleDemoMode = () => {
    const demoUser = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@talkbuddy.com',
      isDemo: true
    }
    handleLogin(demoUser)
  }

  const handleBackToLanding = () => {
    setShowAuth(false)
    setShowLanding(true)
  }

  // Show landing page for new users
  if (showLanding && !user) {
    return (
      <LandingPage 
        onGetStarted={handleGetStarted}
        onDemoMode={handleDemoMode}
      />
    )
  }

  // Show authentication screen
  if (showAuth && !user) {
    return (
      <AuthScreen 
        onLogin={handleLogin}
        onDemoMode={handleDemoMode}
        onBack={handleBackToLanding}
      />
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} onLogout={handleLogout} />
      case 'home':
        return <HomeScreen />
      case 'chat':
        return <ChatScreen onNewSession={handleNewSession} userId={userId} />
      case 'history':
        return <SessionHistory userId={userId} />
      default:
        return user ? <Dashboard user={user} onLogout={handleLogout} /> : <HomeScreen />
    }
  }

  return (
    <div className='app-container'>
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sessionCount={sessionCount}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className='main-content'>
        <div className='content-body'>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App