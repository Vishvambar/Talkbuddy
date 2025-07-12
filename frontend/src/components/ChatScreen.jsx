import MessageBubble from './MessageBubble'
import React, { useState } from 'react'
import MessageInput from './MessageInput';

const ChatScreen = () => {
    const [messages, setMessages] = useState([{
        sender: 'bot', text: 'Hello! I am TalkBuddy. How can I help you? You can type messages or use voice recording.'
    }]);

    const handleSend = async (userText) => {
        const newMessages = [...messages, { sender: 'user', text: userText }];
        setMessages(newMessages);
        try {
            const res = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userText }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessages([...newMessages, { sender: 'bot', text: 'Error: ' + (data.error || 'Unknown error') }]);
            } else {
                setMessages([...newMessages, { sender: 'bot', text: data.reply }]);
            }
        } catch (err) {
            setMessages([...newMessages, { sender: 'bot', text: 'Network Error: ' + err.message + '. Please check if the backend server is running on port 5000.' }]);
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
                        { sender: 'user', text: 'Voice message (error in transcription)' },
                        { sender: 'bot', text: 'Error: ' + (data.error || 'Unknown error') + '. Details: ' + (data.details || 'No additional details') }
                    ];
                } else {
                    return [...withoutProcessing,
                        { sender: 'user', text: data.transcription },
                        { sender: 'bot', text: data.reply }
                    ];
                }
            });
        } catch (err) {
            // Remove processing message and add error
            setMessages(prev => {
                const withoutProcessing = prev.slice(0, -1);
                return [...withoutProcessing,
                    { sender: 'user', text: 'Voice message (network error)' },
                    { sender: 'bot', text: 'Network Error: ' + err.message + '. Please check if the backend server is running on port 5000.' }
                ];
            });
        }
    };

    return (
        <div className='flex flex-col h-full bg-white'>
            <div className='flex-1 overflow-y-auto p-4'>
                {messages.map((msg, index) => (
                    <MessageBubble key={index} sender={msg.sender} text={msg.text} />
                ))}
            </div>

            <MessageInput onSend={handleSend} onVoiceMessage={handleVoiceMessage} />
        </div>
    )
}

export default ChatScreen