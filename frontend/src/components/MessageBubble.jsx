import React from 'react'

const MessageBubble = ({ sender, text, score, corrected, corrections, feedback, isStreaming }) => {
    const isUser = sender === "user";
    const isBot = sender === "bot";

    const renderCorrectionHighlights = (original, corrections) => {
        if (!corrections || corrections.length === 0) {
            return original;
        }

        let highlightedText = original;
        corrections.forEach((correction, index) => {
            const regex = new RegExp(`\\b${correction.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            highlightedText = highlightedText.replace(regex, 
                `<span class="correction-highlight" title="Correction: ${correction.corrected}">❌ ${correction.original}</span>`
            );
        });
        return highlightedText;
    };

    const renderCorrections = () => {
        if (!corrections || corrections.length === 0) return null;
        
        return (
            <div className="message-corrections">
                <div className="corrections-label">Corrections:</div>
                {corrections.map((correction, index) => (
                    <div key={index} className="correction-item">
                        <span className="correction-original">
                            ❌ {correction.original}
                        </span>
                        <span className="correction-fixed">
                            ✅ {correction.corrected}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`message-wrapper ${isUser ? "user-message" : "assistant-message"}`}>
            <div 
                className={`message-bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}
                data-streaming={isStreaming ? "true" : "false"}
            >
                {/* Main message text */}
                <div className="message-content">
                    {isUser && corrections && corrections.length > 0 ? (
                        <div 
                            dangerouslySetInnerHTML={{ 
                                __html: renderCorrectionHighlights(text, corrections) 
                            }}
                        />
                    ) : (
                        <div>{text}</div>
                    )}
                </div>

                {/* Score display for user messages */}
                {isUser && score && (
                    <div className="message-score">
                        <span className="score-text">Fluency Score: {score}/10</span>
                        {score >= 8 && <span className="score-emoji">🌟</span>}
                        {score >= 6 && score < 8 && <span className="score-emoji">👍</span>}
                        {score < 6 && <span className="score-emoji">💪</span>}
                    </div>
                )}

                {/* Corrections for user messages */}
                {isUser && renderCorrections()}

                {/* Feedback for bot messages */}
                {isBot && feedback && (
                    <div className="message-feedback">
                        💡 {feedback}
                    </div>
                )}

                {/* Corrected version hint */}
                {isUser && corrected && corrected !== text && (
                    <div className="message-suggestion">
                        <strong>Better:</strong> "{corrected}"
                    </div>
                )}
            </div>
            
            <div className="message-timestamp">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
        </div>
    );
};

export default MessageBubble;