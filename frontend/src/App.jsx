import React, { useState, useEffect } from 'react'
import ChatScreen from './components/ChatScreen'
import SessionHistory from './components/SessionHistory'
import Navigation from './components/Navigation'

const App = () => {
  const [activeTab, setActiveTab] = useState('chat')
  const [sessionCount, setSessionCount] = useState(0)
  const userId = 'demo-user'

  // Fetch session count for navigation badge
  useEffect(() => {
    const fetchSessionCount = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/sessions/${userId}`)
        const data = await response.json()
        if (data.success) {
          setSessionCount(data.total)
        }
      } catch (error) {
        console.error('Failed to fetch session count:', error)
      }
    }

    fetchSessionCount()
    
    // Refresh session count every 30 seconds
    const interval = setInterval(fetchSessionCount, 30000)
    return () => clearInterval(interval)
  }, [userId])

  const handleNewSession = () => {
    // Increment session count when a new session is created
    setSessionCount(prev => prev + 1)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatScreen onNewSession={handleNewSession} userId={userId} />
      case 'history':
        return <SessionHistory userId={userId} />
      default:
        return <ChatScreen onNewSession={handleNewSession} userId={userId} />
    }
  }

  return (
    <div className='h-screen flex flex-col bg-gray-50'>
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sessionCount={sessionCount}
      />
      
      <main className='flex-1 overflow-hidden'>
        {renderContent()}
      </main>
    </div>
  )
}

export default App