import React from 'react'

const MessageBubble = ({ sender, text, score, corrected, corrections, feedback }) => {
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
                `<span class="bg-red-200 text-red-800 px-1 rounded" title="Correction: ${correction.corrected}">❌ ${correction.original}</span>`
            );
        });
        return highlightedText;
    };

    const renderCorrections = () => {
        if (!corrections || corrections.length === 0) return null;
        
        return (
            <div className="mt-2 text-xs">
                <div className="font-semibold text-gray-600 mb-1">Corrections:</div>
                {corrections.map((correction, index) => (
                    <div key={index} className="mb-1">
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded mr-2">
                            ❌ {correction.original}
                        </span>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            ✅ {correction.corrected}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
            <div className={`px-4 py-3 rounded-2xl max-w-sm ${
                isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
            }`}>
                {/* Main message text */}
                {isUser && corrections && corrections.length > 0 ? (
                    <div 
                        dangerouslySetInnerHTML={{ 
                            __html: renderCorrectionHighlights(text, corrections) 
                        }}
                    />
                ) : (
                    <div>{text}</div>
                )}

                {/* Score display for user messages */}
                {isUser && score && (
                    <div className="mt-2 text-xs bg-white bg-opacity-20 rounded px-2 py-1">
                        <span className="font-semibold">Fluency Score: {score}/10</span>
                        {score >= 8 && <span className="ml-1">🌟</span>}
                        {score >= 6 && score < 8 && <span className="ml-1">👍</span>}
                        {score < 6 && <span className="ml-1">💪</span>}
                    </div>
                )}

                {/* Corrections for user messages */}
                {isUser && renderCorrections()}

                {/* Feedback for bot messages */}
                {isBot && feedback && (
                    <div className="mt-2 text-xs bg-blue-50 text-blue-800 rounded px-2 py-1">
                        💡 {feedback}
                    </div>
                )}

                {/* Corrected version hint */}
                {isUser && corrected && corrected !== text && (
                    <div className="mt-2 text-xs bg-green-100 text-green-800 rounded px-2 py-1">
                        <strong>Better:</strong> "{corrected}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default MessageBubble;