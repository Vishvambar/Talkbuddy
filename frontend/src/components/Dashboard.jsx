import React, { useState, useEffect } from 'react';
import '../assets/dashboard.css';

const Dashboard = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalSessions: 0,
        averageScore: 0,
        streakDays: 0,
        totalMinutes: 0,
        weeklyProgress: [],
        recentSessions: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserStats();
    }, []);

    const fetchUserStats = async () => {
        try {
            setLoading(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Mock data - replace with actual API call
            setStats({
                totalSessions: 24,
                averageScore: 8.5,
                streakDays: 7,
                totalMinutes: 480,
                weeklyProgress: [
                    { day: 'Mon', score: 8.2, sessions: 2 },
                    { day: 'Tue', score: 8.5, sessions: 3 },
                    { day: 'Wed', score: 7.8, sessions: 1 },
                    { day: 'Thu', score: 9.1, sessions: 2 },
                    { day: 'Fri', score: 8.7, sessions: 2 },
                    { day: 'Sat', score: 8.9, sessions: 1 },
                    { day: 'Sun', score: 9.2, sessions: 2 }
                ],
                recentSessions: [
                    {
                        id: 1,
                        date: '2024-01-15',
                        score: 9.2,
                        duration: 15,
                        corrections: 2,
                        topic: 'Daily Conversation'
                    },
                    {
                        id: 2,
                        date: '2024-01-14',
                        score: 8.7,
                        duration: 12,
                        corrections: 3,
                        topic: 'Business English'
                    },
                    {
                        id: 3,
                        date: '2024-01-13',
                        score: 8.9,
                        duration: 18,
                        corrections: 1,
                        topic: 'Travel Phrases'
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 9) return '#10b981';
        if (score >= 8) return '#f59e0b';
        if (score >= 7) return '#ef4444';
        return '#6b7280';
    };

    const getStreakIcon = () => {
        if (stats.streakDays >= 7) return '🔥';
        if (stats.streakDays >= 3) return '⚡';
        return '💪';
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your progress...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="user-welcome">
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="welcome-text">
                            <h1>Welcome back, {user?.name || 'User'}!</h1>
                            <p>Ready to continue your English journey?</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn btn-outline" onClick={onLogout}>
                            <span className="icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="feature-announcement">
                <div className="feature-badge">✨ NEW</div>
                <div className="feature-content">
                    <h3>Real-time Streaming Responses</h3>
                    <p>Experience more natural conversations with our new streaming chat feature. Watch as TalkBuddy responds in real-time, just like a real conversation!</p>
                    <button className="try-feature-btn" onClick={() => window.location.hash = '#chat'}>Try it now</button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="dashboard-nav">
                <div className="nav-tabs">
                    <button 
                        className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <span className="icon">📊</span>
                        Overview
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'progress' ? 'active' : ''}`}
                        onClick={() => setActiveTab('progress')}
                    >
                        <span className="icon">📈</span>
                        Progress
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'sessions' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sessions')}
                    >
                        <span className="icon">💬</span>
                        Sessions
                    </button>
                    <button 
                        className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <span className="icon">👤</span>
                        Profile
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="dashboard-content">
                {activeTab === 'overview' && (
                    <div className="overview-tab">
                        {/* Stats Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💬</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.totalSessions}</div>
                                    <div className="stat-label">Total Sessions</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⭐</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.averageScore.toFixed(1)}</div>
                                    <div className="stat-label">Average Score</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">{getStreakIcon()}</div>
                                <div className="stat-content">
                                    <div className="stat-number">{stats.streakDays}</div>
                                    <div className="stat-label">Day Streak</div>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">⏱️</div>
                                <div className="stat-content">
                                    <div className="stat-number">{Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m</div>
                                    <div className="stat-label">Practice Time</div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="quick-actions">
                            <h2>Quick Actions</h2>
                            <div className="actions-grid">
                                <button className="action-card primary">
                                    <div className="action-icon">🚀</div>
                                    <div className="action-content">
                                        <h3>Start New Session</h3>
                                        <p>Begin a conversation with TalkBuddy</p>
                                    </div>
                                </button>
                                <button className="action-card">
                                    <div className="action-icon">📚</div>
                                    <div className="action-content">
                                        <h3>Review Corrections</h3>
                                        <p>Practice your recent mistakes</p>
                                    </div>
                                </button>
                                <button className="action-card">
                                    <div className="action-icon">🎯</div>
                                    <div className="action-content">
                                        <h3>Set Goals</h3>
                                        <p>Define your learning objectives</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="recent-activity">
                            <h2>Recent Activity</h2>
                            <div className="activity-list">
                                {stats.recentSessions.slice(0, 3).map(session => (
                                    <div key={session.id} className="activity-item">
                                        <div className="activity-icon">
                                            <div 
                                                className="score-badge"
                                                style={{ backgroundColor: getScoreColor(session.score) }}
                                            >
                                                {session.score}
                                            </div>
                                        </div>
                                        <div className="activity-content">
                                            <h4>{session.topic}</h4>
                                            <p>{session.duration} minutes • {session.corrections} corrections</p>
                                            <span className="activity-date">{new Date(session.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'progress' && (
                    <div className="progress-tab">
                        <h2>Weekly Progress</h2>
                        <div className="progress-chart">
                            <div className="chart-container">
                                {stats.weeklyProgress.map((day, index) => (
                                    <div key={index} className="chart-bar">
                                        <div 
                                            className="bar"
                                            style={{ 
                                                height: `${(day.score / 10) * 100}%`,
                                                backgroundColor: getScoreColor(day.score)
                                            }}
                                        ></div>
                                        <div className="bar-label">{day.day}</div>
                                        <div className="bar-value">{day.score}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="progress-insights">
                            <h3>Insights</h3>
                            <div className="insights-grid">
                                <div className="insight-card">
                                    <div className="insight-icon">📈</div>
                                    <div className="insight-content">
                                        <h4>Improving Trend</h4>
                                        <p>Your scores have improved by 15% this week!</p>
                                    </div>
                                </div>
                                <div className="insight-card">
                                    <div className="insight-icon">🎯</div>
                                    <div className="insight-content">
                                        <h4>Consistency</h4>
                                        <p>You've practiced 6 out of 7 days this week.</p>
                                    </div>
                                </div>
                                <div className="insight-card">
                                    <div className="insight-icon">💡</div>
                                    <div className="insight-content">
                                        <h4>Recommendation</h4>
                                        <p>Focus on grammar exercises to boost your scores.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'sessions' && (
                    <div className="sessions-tab">
                        <div className="sessions-header">
                            <h2>Session History</h2>
                            <button className="btn btn-primary">
                                <span className="icon">📊</span>
                                Export Data
                            </button>
                        </div>
                        
                        <div className="sessions-list">
                            {stats.recentSessions.map(session => (
                                <div key={session.id} className="session-card">
                                    <div className="session-header">
                                        <div className="session-info">
                                            <h3>{session.topic}</h3>
                                            <p>{new Date(session.date).toLocaleDateString()}</p>
                                        </div>
                                        <div 
                                            className="session-score"
                                            style={{ backgroundColor: getScoreColor(session.score) }}
                                        >
                                            {session.score}
                                        </div>
                                    </div>
                                    <div className="session-details">
                                        <div className="detail-item">
                                            <span className="icon">⏱️</span>
                                            <span>{session.duration} minutes</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="icon">✏️</span>
                                            <span>{session.corrections} corrections</span>
                                        </div>
                                        <button className="btn btn-outline btn-sm">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className="profile-tab">
                        <div className="profile-header">
                            <div className="profile-avatar-large">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="profile-info">
                                <h2>{user?.name || 'User'}</h2>
                                <p>{user?.email || 'user@example.com'}</p>
                                <div className="profile-badges">
                                    <span className="badge">Beginner</span>
                                    <span className="badge">Consistent Learner</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-sections">
                            <div className="profile-section">
                                <h3>Learning Goals</h3>
                                <div className="goals-list">
                                    <div className="goal-item">
                                        <div className="goal-icon">🎯</div>
                                        <div className="goal-content">
                                            <h4>Daily Practice</h4>
                                            <p>Practice English for 15 minutes daily</p>
                                            <div className="goal-progress">
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: '70%' }}></div>
                                                </div>
                                                <span>7/10 days</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="goal-item">
                                        <div className="goal-icon">📈</div>
                                        <div className="goal-content">
                                            <h4>Score Improvement</h4>
                                            <p>Achieve an average score of 9.0</p>
                                            <div className="goal-progress">
                                                <div className="progress-bar">
                                                    <div className="progress-fill" style={{ width: '85%' }}></div>
                                                </div>
                                                <span>8.5/9.0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <h3>Preferences</h3>
                                <div className="preferences-list">
                                    <div className="preference-item">
                                        <label>Difficulty Level</label>
                                        <select className="form-select">
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                    <div className="preference-item">
                                        <label>Session Duration</label>
                                        <select className="form-select">
                                            <option>10 minutes</option>
                                            <option>15 minutes</option>
                                            <option>20 minutes</option>
                                            <option>30 minutes</option>
                                        </select>
                                    </div>
                                    <div className="preference-item">
                                        <label>Daily Reminders</label>
                                        <div className="toggle-switch">
                                            <input type="checkbox" id="reminders" defaultChecked />
                                            <label htmlFor="reminders"></label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;