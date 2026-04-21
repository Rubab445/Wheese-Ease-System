// src/components/Sidebar.tsx
import React from 'react';

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  pendingCount: number;
  unassignedCount: number;
  alertCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange, pendingCount, unassignedCount, alertCount }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'alerts', label: 'Alerts', icon: '🔔', badge: alertCount, badgeClass: '' },
    { id: 'doctors', label: 'Doctors', icon: '🩺', badge: pendingCount, badgeClass: 'amber' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'unassigned', label: 'Unassigned', icon: '⚠️', badge: unassignedCount, badgeClass: '' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'broadcast', label: 'Broadcast', icon: '📢' },
    { id: 'ai', label: 'AI Monitor', icon: '🤖' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'reports', label: 'Reports', icon: '📄' },
    { id: 'config', label: 'Configuration', icon: '⚙️' },
    { id: 'settings', label: 'Settings', icon: '🔒' },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-brand">
        <div className="sb-logo">
          <div className="sb-logo-icon">🫁</div>
          <div className="sb-logo-text">Wheeze<span>Ease</span></div>
        </div>
        <div className="sb-badge">⚙️ ADMIN PANEL</div>
      </div>
      <div className="sb-section">Main</div>
      {navItems.slice(0, 2).map(item => (
        <button
          key={item.id}
          className={`sb-item ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => onNavChange(item.id)}
        >
          <span className="sb-icon">{item.icon}</span>
          {item.label}
          {item.badge !== undefined && item.badge > 0 && (
            <span className={`sb-count ${item.badgeClass === 'amber' ? 'amber' : ''}`}>{item.badge}</span>
          )}
        </button>
      ))}
      <div className="sb-section">Users</div>
      {navItems.slice(2, 5).map(item => (
        <button
          key={item.id}
          className={`sb-item ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => onNavChange(item.id)}
        >
          <span className="sb-icon">{item.icon}</span>
          {item.label}
          {item.badge !== undefined && item.badge > 0 && (
            <span className={`sb-count ${item.badgeClass === 'amber' ? 'amber' : ''}`}>{item.badge}</span>
          )}
        </button>
      ))}
      <div className="sb-section">Communication</div>
      {navItems.slice(5, 7).map(item => (
        <button
          key={item.id}
          className={`sb-item ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => onNavChange(item.id)}
        >
          <span className="sb-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div className="sb-section">System</div>
      {navItems.slice(7).map(item => (
        <button
          key={item.id}
          className={`sb-item ${activeNav === item.id ? 'active' : ''}`}
          onClick={() => onNavChange(item.id)}
        >
          <span className="sb-icon">{item.icon}</span>
          {item.label}
        </button>
      ))}
      <div className="sb-footer">
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div className="sb-av">SA</div>
          <div>
            <div className="sb-admin-name">Super Admin</div>
            <div className="sb-admin-role">System Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;