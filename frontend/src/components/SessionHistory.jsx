import React, { useState, useEffect } from 'react';

const SessionHistory = ({ userId = 'demo-user' }) => {
    const [sessions, setSessions] = useState([]);
    const [weeklyStats, setWeeklyStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('sessions'); // 'sessions' or 'stats'

    useEffect(() => {
        fetchSessions();
        fetchWeeklyStats();
    }, [userId]);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/sessions/${userId}`);
            const data = await response.json();
            
            if (data.success) {
                setSessions(data.sessions);
            } else {
                setError('Failed to load sessions');
            }
        } catch (err) {
            setError('Network error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWeeklyStats = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/week-summary/${userId}`);
            const data = await response.json();
            
            if (data.success) {
                setWeeklyStats(data);
            }
        } catch (err) {
            console.error('Failed to load weekly stats:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600 bg-green-100';
        if (score >= 6) return 'text-yellow-600 bg-yellow-100';
        if (score >= 4) return 'text-orange-600 bg-orange-100';
        return 'text-red-600 bg-red-100';
    };

    const getScoreEmoji = (score) => {
        if (score >= 8) return '🌟';
        if (score >= 6) return '👍';
        if (score >= 4) return '💪';
        return '📚';
    };

    const renderCorrections = (corrections) => {
        if (!corrections || corrections.length === 0) return null;
        
        return (
            <div className="mt-2">
                <div className="text-xs font-semibold text-gray-600 mb-1">Corrections:</div>
                <div className="flex flex-wrap gap-1">
                    {corrections.map((correction, index) => (
                        <div key={index} className="text-xs">
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded mr-1">
                                ❌ {correction.original}
                            </span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                                ✅ {correction.corrected}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeeklyStats = () => {
        if (!weeklyStats) return null;

        return (
            <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4">📊 Weekly Progress</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{weeklyStats.averageScore}</div>
                            <div className="text-sm opacity-90">Average Score</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{weeklyStats.activeDays}</div>
                            <div className="text-sm opacity-90">Active Days</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{weeklyStats.totalSessions}</div>
                            <div className="text-sm opacity-90">Sessions</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold">
                                {weeklyStats.improvementTrend === 'Improving' ? '📈' : 
                                 weeklyStats.improvementTrend === 'Stable' ? '📊' : '📉'}
                            </div>
                            <div className="text-sm opacity-90">{weeklyStats.improvementTrend}</div>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-white bg-opacity-20 rounded">
                        <div className="text-sm font-semibold">Weekly Goal:</div>
                        <div className="text-sm">{weeklyStats.weeklyGoal}</div>
                    </div>
                </div>

                {/* Score Distribution */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="font-bold text-gray-700 mb-3">Score Distribution</h4>
                    <div className="flex justify-between items-end h-20 bg-gray-50 p-2 rounded">
                        {sessions.length > 0 ? (
                            sessions.slice(0, 10).map((session, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div 
                                        className={`w-4 bg-blue-500 rounded-t ${getScoreColor(session.score)}`}
                                        style={{ height: `${(session.score / 10) * 100}%` }}
                                    ></div>
                                    <div className="text-xs mt-1">{session.score}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-center w-full">No data yet</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderSessions = () => {
        if (sessions.length === 0) {
            return (
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversations yet</h3>
                    <p className="text-gray-500">Start chatting to see your session history here!</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {sessions.map((session, index) => (
                    <div key={session._id || index} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(session.score)}`}>
                                    {getScoreEmoji(session.score)} {session.score}/10
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatDate(session.timestamp || session.createdAt)}
                                </span>
                            </div>
                        </div>

                        {/* User's message */}
                        <div className="mb-3">
                            <div className="text-sm font-semibold text-gray-600 mb-1">Your message:</div>
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="text-gray-800">{session.transcript}</div>
                                {session.corrected && session.corrected !== session.transcript && (
                                    <div className="mt-2 text-sm">
                                        <span className="font-semibold text-green-700">Corrected:</span>
                                        <span className="text-green-700 ml-1">"{session.corrected}"</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Corrections */}
                        {renderCorrections(session.corrections)}

                        {/* TalkBuddy's reply */}
                        <div className="mt-3">
                            <div className="text-sm font-semibold text-gray-600 mb-1">TalkBuddy's response:</div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="text-gray-800">{session.reply}</div>
                                {session.feedback && (
                                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                                        <span className="font-semibold text-blue-700">💡 Feedback:</span>
                                        <span className="text-blue-700 ml-1">{session.feedback}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading your session history...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Sessions</h3>
                <p className="text-gray-600">{error}</p>
                <button 
                    onClick={() => { fetchSessions(); fetchWeeklyStats(); }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">📚 Your Learning Journey</h2>
                <p className="text-gray-600">Review your conversations and track your English fluency progress</p>
            </div>

            {/* View Mode Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                    onClick={() => setViewMode('sessions')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'sessions'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    📝 Conversations ({sessions.length})
                </button>
                <button
                    onClick={() => setViewMode('stats')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'stats'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                    }`}
                >
                    📊 Progress Analytics
                </button>
            </div>

            {/* Content */}
            <div className="min-h-96">
                {viewMode === 'sessions' ? renderSessions() : renderWeeklyStats()}
            </div>

            {/* Refresh Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => { fetchSessions(); fetchWeeklyStats(); }}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    🔄 Refresh Data
                </button>
            </div>
        </div>
    );
};

export default SessionHistory;
