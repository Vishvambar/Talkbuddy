import React, { useState, useRef } from 'react'

const MessageInput = ({onSend, onVoiceMessage}) => {
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
            <div className='p-4 border-t bg-gray-50'>
                <div className='flex items-center space-x-2 mb-2'>
                    <audio controls src={URL.createObjectURL(audioBlob)} className='flex-1' />
                </div>
                <div className='flex space-x-2'>
                    <button 
                        onClick={sendVoiceMessage}
                        className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex-1'
                    >
                        Send Voice Message
                    </button>
                    <button 
                        onClick={cancelVoiceMessage}
                        className='bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg'
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='p-4 border-t'>
            <div className='flex items-center space-x-2 mb-2'>
                <input
                    type="text"
                    className='flex-1 p-2 border rounded-lg'
                    placeholder='Type your message or use voice recording...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !recording && handleSend()}
                    disabled={recording}
                />
                <button 
                    onClick={handleSend}
                    disabled={recording || !input.trim()}
                    className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg'
                >
                    Send
                </button>
            </div>
            
            <div className='flex items-center space-x-2'>
                <input
                    type="file"
                    accept=".flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.opus,.wav,.webm,audio/*"
                    onChange={handleFileUpload}
                    disabled={recording}
                    className='hidden'
                    id='file-upload'
                />
                <label
                    htmlFor='file-upload'
                    className='bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-pointer'
                >
                    📁 Upload Audio
                </label>
                
                {!recording ? (
                    <button 
                        onClick={startRecording}
                        className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
                    >
                        🎤 Record
                    </button>
                ) : (
                    <button 
                        onClick={stopRecording}
                        className='bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm animate-pulse'
                    >
                        ⏹️ Stop Recording
                    </button>
                )}
                
                <small className='text-gray-500 text-xs'>
                    Supported: MP3, WAV, WEBM, OGG, etc.
                </small>
            </div>
        </div>
    )
}

export default MessageInput