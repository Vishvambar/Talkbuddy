import React from 'react'
import ChatScreen from './components/ChatScreen'

const App = () => {
  return (
    <div className='h-screen flex flex-col'>
      <header className='bg-blue-600 text-white p-4'>
        <h1 className='text-xl font-bold'>TalkBuddy - AI English Coach</h1>
        <p className='text-sm text-blue-100 mt-1'>Type messages or use voice recording</p>
      </header>
      
      <main className='flex-1 overflow-hidden'>
        <ChatScreen />
      </main>
    </div>
  )
}

export default App