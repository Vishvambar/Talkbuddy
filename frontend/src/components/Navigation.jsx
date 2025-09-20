import React from 'react'

const Navigation = ({ activeTab, setActiveTab, sessionCount, user, onLogout }) => {
  // Different navigation items based on user authentication
  const getNavItems = () => {
    if (user) {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'chat', label: 'Chat', icon: '💬', badge: '✨', badgeClass: 'feature-badge' },
        { id: 'history', label: 'History', icon: '📈', badge: sessionCount > 0 ? sessionCount : null }
      ]
    } else {
      return [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'chat', label: 'Chat', icon: '💬' },
        { id: 'history', label: 'History', icon: '📊', badge: sessionCount > 0 ? sessionCount : null }
      ]
    }
  }

  const navItems = getNavItems()

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <span className="brand-icon">🗣️</span>
        <span className="brand-text">TalkBuddy</span>
      </div>
      
      <div className="nav-items">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && (
              <span className={`nav-badge ${item.badgeClass || ''}`}>{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      {user && (
        <div className="nav-user">
          <div className="user-info">
            <div className="user-avatar">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name || 'User'}</span>
              {user.isDemo && <span className="demo-badge">Demo</span>}
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Logout">
            🚪
          </button>
        </div>
      )}
    </nav>
  )
};

export default Navigation;
