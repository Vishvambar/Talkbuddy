import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { ENDPOINTS, apiCall, uploadFile } from '../config/api';
import '../assets/modern-chat.css';

const ChatScreen = ({ onNewSession, userId = 'demo-user' }) => {
    const [messages, setMessages] = useState([{
        sender: 'bot', 
        text: 'Hello! I am TalkBuddy. How can I help you? You can type messages or use voice recording.',
        score: null,
        corrected: null,
        corrections: [],
        feedback: null
    }]);

    // Ref for auto-scrolling to bottom of chat
    const messagesEndRef = useRef(null);
    
    // State for typing animation
    const [isTyping, setIsTyping] = useState(false);
    
    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
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
            // Add typing indicator
            setIsTyping(true);
            
            // Check if browser supports EventSource for streaming
            if (window.EventSource) {
                // Use streaming API
                const streamUrl = `${ENDPOINTS.CHAT}?stream=true`;
                const eventSource = new EventSource(streamUrl);
                
                // Create placeholder bot message that will be updated
                const botMessage = {
                    sender: 'bot',
                    text: '',
                    score: null,
                    corrected: null,
                    corrections: [],
                    feedback: null,
                    isStreaming: true
                };
                
                // Add empty bot message that will be filled with streaming content
                setMessages(prev => [...prev, botMessage]);
                
                // Set up event listeners for the stream
                eventSource.addEventListener('fluency', (event) => {
                    const fluencyData = JSON.parse(event.data);
                    
                    // Update user message with fluency data
                    setMessages(prev => {
                        const updated = [...prev];
                        // Find the last user message
                        const userMsgIndex = updated.length - 2; // -2 because we added the bot message
                        if (userMsgIndex >= 0 && updated[userMsgIndex].sender === 'user') {
                            updated[userMsgIndex] = {
                                ...updated[userMsgIndex],
                                score: fluencyData.score,
                                corrected: fluencyData.corrected,
                                corrections: fluencyData.corrections || [],
                                feedback: fluencyData.feedback
                            };
                        }
                        return updated;
                    });
                });
                
                eventSource.addEventListener('chunk', (event) => {
                    const data = JSON.parse(event.data);
                    
                    // Update bot message with new chunk
                    setMessages(prev => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        if (lastIndex >= 0 && updated[lastIndex].sender === 'bot') {
                            updated[lastIndex] = {
                                ...updated[lastIndex],
                                text: updated[lastIndex].text + data.chunk
                            };
                        }
                        return updated;
                    });
                });
                
                eventSource.addEventListener('done', (event) => {
                    // Stream is complete
                    eventSource.close();
                    setIsTyping(false);
                    
                    // Mark message as no longer streaming
                    setMessages(prev => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        if (lastIndex >= 0 && updated[lastIndex].sender === 'bot') {
                            updated[lastIndex] = {
                                ...updated[lastIndex],
                                isStreaming: false
                            };
                        }
                        return updated;
                    });
                    
                    // Notify parent component about new session
                    if (onNewSession) {
                        onNewSession();
                    }
                });
                
                eventSource.addEventListener('error', (event) => {
                    console.error('SSE Error:', event);
                    eventSource.close();
                    setIsTyping(false);
                    
                    // Update the bot message with error
                    setMessages(prev => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        if (lastIndex >= 0 && updated[lastIndex].sender === 'bot') {
                            updated[lastIndex] = {
                                ...updated[lastIndex],
                                text: 'Error: Connection to server was lost. Please try again.',
                                isStreaming: false
                            };
                        }
                        return updated;
                    });
                });
                
                // Send the actual request to start streaming
                await fetch(streamUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/event-stream'
                    },
                    body: JSON.stringify({ 
                        message: userText,
                        userId: userId
                    }),
                    credentials: 'include' // Include cookies for JWT
                });
            } else {
                // Fallback to non-streaming API for browsers that don't support EventSource
                const data = await apiCall(ENDPOINTS.CHAT, {
                    method: 'POST',
                    body: JSON.stringify({ 
                        message: userText,
                        userId: userId
                    })
                });
                
                if (data.error) {
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
            }
        } catch (err) {
            setIsTyping(false);
            setMessages([...newMessages, { 
                sender: 'bot', 
                text: 'Network Error: ' + err.message + '. Please check your internet connection.',
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
            const data = await uploadFile(ENDPOINTS.AUDIO_CHAT, formData);
            
            // Remove processing message and add actual results
            setMessages(prev => {
                const withoutProcessing = prev.slice(0, -1);
                if (data.error) {
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
                        text: 'Network Error: ' + err.message + '. Please check your internet connection.',
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
        <div className='chat-container'>
            {/* Chat Header */}
            <div className='chat-header'>
                <h1 className='chat-title'>TalkBuddy Chat</h1>
                <p className='chat-subtitle'>Practice your English conversation skills</p>
            </div>
            
            {/* Messages Area */}
            <div className='chat-messages'>
                {/* Typing indicator */}
                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                
                {messages.length === 1 ? (
                    <div className='chat-empty-state'>
                        <div className='empty-state-icon'>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                        </div>
                        <h3>Start a conversation</h3>
                        <p>Type a message or use voice recording to begin practicing English</p>
                    </div>
                ) : null}
                
                {messages.map((msg, index) => (
                    <MessageBubble 
                        key={index} 
                        sender={msg.sender} 
                        text={msg.text}
                        score={msg.score}
                        corrected={msg.corrected}
                        corrections={msg.corrections}
                        feedback={msg.feedback}
                        isStreaming={msg.isStreaming}
                    />
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}
                {/* Invisible element for auto-scrolling */}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className='chat-input-area'>
                <MessageInput onSend={handleSend} onVoiceMessage={handleVoiceMessage}/>
            </div>
        </div>
    )
}

export default ChatScreen