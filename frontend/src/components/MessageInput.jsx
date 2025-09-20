import React, { useState, useRef } from 'react'

const MessageInput = ({onSend, onVoiceMessage, className}) => {
    const [input, setInput] = useState("");
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput("");
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new window.MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];
            
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };
            
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
                setAudioBlob(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };
            
            mediaRecorder.start();
            setRecording(true);
        } catch (error) {
            console.error('Microphone access error:', error);
            alert('Microphone access denied or not available.');
        }
    };

    const stopRecording = () => {
        setRecording(false);
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAudioBlob(file);
        }
    };

    const sendVoiceMessage = () => {
        if (audioBlob && onVoiceMessage) {
            onVoiceMessage(audioBlob);
            setAudioBlob(null);
        }
    };

    const cancelVoiceMessage = () => {
        setAudioBlob(null);
    };

    // If there's an audio blob ready to send
    if (audioBlob) {
        return (
            <div className="voice-preview">
                <div className="voice-preview-content">
                    <div className="audio-player">
                        <audio controls src={URL.createObjectURL(audioBlob)} />
                    </div>
                    <div className="voice-actions">
                        <button 
                            onClick={sendVoiceMessage}
                            className="btn btn-primary"
                        >
                            Send Voice Message
                        </button>
                        <button 
                            onClick={cancelVoiceMessage}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <input
                    type="text"
                    className="input-field"
                    placeholder='Type your message...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !recording && handleSend()}
                    disabled={recording}
                />
                <div className="input-actions">
                    <button 
                        onClick={startRecording}
                        disabled={recording}
                        className={`input-action-btn mic-btn ${recording ? 'recording' : ''}`}
                        title="Record voice message"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </button>
                    <button 
                        onClick={handleSend}
                        disabled={recording || !input.trim()}
                        className="input-action-btn send-btn"
                        title="Send message"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
            
            {recording && (
                <div className="recording-indicator">
                    <div className="recording-pulse"></div>
                    <span className="recording-text">Recording...</span>
                    <button 
                        onClick={stopRecording}
                        className="btn btn-secondary btn-sm"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="6" y="6" width="12" height="12" rx="2"/>
                        </svg>
                        Stop
                    </button>
                </div>
            )}
        </div>
    )
}

export default MessageInput