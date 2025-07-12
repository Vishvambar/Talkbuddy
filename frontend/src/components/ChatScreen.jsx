import MessageBubble from './MessageBubble'
import React, { useState } from 'react'
import MessageInput from './MessageInput';

const ChatScreen = ({ onNewSession, userId = 'demo-user' }) => {
    const [messages, setMessages] = useState([{
        sender: 'bot', 
        text: 'Hello! I am TalkBuddy. How can I help you? You can type messages or use voice recording.',
        score: null,
        corrected: null,
        corrections: [],
        feedback: null
    }]);

    const handleSend = async (userText) => {
        const userMessage = { 
            sender: 'user', 
            text: userText,
            score: null,
            corrected: null,
            corrections: [],
            feedback: null
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        
        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userText,
                    userId: userId
                }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                setMessages([...newMessages, { 
                    sender: 'bot', 
                    text: 'Error: ' + (data.error || 'Unknown error'),
                    score: null,
                    corrected: null,
                    corrections: [],
                    feedback: null
                }]);
            } else {
                // Update user message with analysis data
                const updatedUserMessage = {
                    ...userMessage,
                    score: data.score,
                    corrected: data.corrected,
                    corrections: data.corrections || [],
                    feedback: data.feedback
                };
                
                const botMessage = {
                    sender: 'bot',
                    text: data.reply,
                    score: null,
                    corrected: null,
                    corrections: [],
                    feedback: data.feedback
                };
                
                setMessages([...messages, updatedUserMessage, botMessage]);
                
                // Notify parent component about new session
                if (onNewSession) {
                    onNewSession();
                }
            }
        } catch (err) {
            setMessages([...newMessages, { 
                sender: 'bot', 
                text: 'Network Error: ' + err.message + '. Please check if the backend server is running on port 5000.',
                score: null,
                corrected: null,
                corrections: [],
                feedback: null
            }]);
        }
    };

    const handleVoiceMessage = async (audioBlob) => {
        // Add a temporary message while processing
        const processingMessage = { sender: 'user', text: '🎤 Processing voice message...' };
        setMessages(prev => [...prev, processingMessage]);

        const formData = new FormData();
        
        // Determine proper file extension based on type
        let fileName = 'recording.webm'; // default
        if (audioBlob.type) {
            if (audioBlob.type.includes('mp4')) fileName = 'recording.mp4';
            else if (audioBlob.type.includes('webm')) fileName = 'recording.webm';
            else if (audioBlob.type.includes('ogg')) fileName = 'recording.ogg';
            else if (audioBlob.type.includes('wav')) fileName = 'recording.wav';
            else if (audioBlob.type.includes('mp3')) fileName = 'recording.mp3';
        }
        
        // If it's a file upload, use the original filename
        if (audioBlob.name) {
            fileName = audioBlob.name;
        }
        
        formData.append('audio', audioBlob, fileName);
        formData.append('userId', userId); // Add userId for session tracking
        
        try {
            const res = await fetch('http://localhost:5000/api/audio-chat', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            
            // Remove processing message and add actual results
            setMessages(prev => {
                const withoutProcessing = prev.slice(0, -1);
                if (!res.ok) {
                    return [...withoutProcessing, 
                        { 
                            sender: 'user', 
                            text: 'Voice message (error in transcription)',
                            score: null,
                            corrected: null,
                            corrections: [],
                            feedback: null
                        },
                        { 
                            sender: 'bot', 
                            text: 'Error: ' + (data.error || 'Unknown error') + '. Details: ' + (data.details || 'No additional details'),
                            score: null,
                            corrected: null,
                            corrections: [],
                            feedback: null
                        }
                    ];
                } else {
                    const userMessage = {
                        sender: 'user',
                        text: data.transcription,
                        score: data.score,
                        corrected: data.corrected,
                        corrections: data.corrections || [],
                        feedback: data.feedback
                    };
                    
                    const botMessage = {
                        sender: 'bot',
                        text: data.reply,
                        score: null,
                        corrected: null,
                        corrections: [],
                        feedback: data.feedback
                    };
                    
                    const result = [...withoutProcessing, userMessage, botMessage];
                    
                    // Notify parent component about new session
                    if (onNewSession) {
                        onNewSession();
                    }
                    
                    return result;
                }
            });
        } catch (err) {
            // Remove processing message and add error
            setMessages(prev => {
                const withoutProcessing = prev.slice(0, -1);
                return [...withoutProcessing,
                    { 
                        sender: 'user', 
                        text: 'Voice message (network error)',
                        score: null,
                        corrected: null,
                        corrections: [],
                        feedback: null
                    },
                    { 
                        sender: 'bot', 
                        text: 'Network Error: ' + err.message + '. Please check if the backend server is running on port 5000.',
                        score: null,
                        corrected: null,
                        corrections: [],
                        feedback: null
                    }
                ];
            });
        }
    };

    return (
        <div className='flex flex-col h-full bg-white'>
            {/* Chat Header */}
            <div className='bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4'>
                <h2 className='text-lg font-semibold'>💬 English Conversation Practice</h2>
                <p className='text-sm text-blue-100'>Type or speak to practice your English with AI feedback</p>
            </div>
            
            {/* Messages Area */}
            <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
                {messages.map((msg, index) => (
                    <MessageBubble 
                        key={index} 
                        sender={msg.sender} 
                        text={msg.text}
                        score={msg.score}
                        corrected={msg.corrected}
                        corrections={msg.corrections}
                        feedback={msg.feedback}
                    />
                ))}
            </div>

            {/* Message Input */}
            <div className='bg-white border-t border-gray-200'>
                <MessageInput onSend={handleSend} onVoiceMessage={handleVoiceMessage} />
            </div>
        </div>
    )
}

export default ChatScreen