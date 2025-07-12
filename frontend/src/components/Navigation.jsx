import React from 'react';

const Navigation = ({ activeTab, setActiveTab, sessionCount = 0 }) => {
    const tabs = [
        {
            id: 'chat',
            name: 'Chat',
            icon: '💬',
            description: 'Practice English conversation'
        },
        {
            id: 'history',
            name: 'History',
            icon: '📚',
            description: 'View past conversations',
            badge: sessionCount > 0 ? sessionCount : null
        }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-blue-600">TalkBuddy</h1>
                        <span className="ml-2 text-sm text-gray-500">AI English Coach</span>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                                title={tab.description}
                            >
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{tab.icon}</span>
                                    <span>{tab.name}</span>
                                    {tab.badge && (
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                                            {tab.badge}
                                        </span>
                                    )}
                                </div>
                                
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">Demo User</div>
                            <div className="text-xs text-gray-500">Keep practicing! 🌟</div>
                        </div>
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">DU</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
