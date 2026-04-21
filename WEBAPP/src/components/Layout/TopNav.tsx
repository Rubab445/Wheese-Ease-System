import React, { useEffect, useState } from 'react';
import { ALERTS } from '../../data/patients';

interface TopNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const TopNav: React.FC<TopNavProps> = ({ activeSection, onSectionChange }) => {
  const [time, setTime] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateClock = () => {
      setTime(
        new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) +
        ' · ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateUnread = () => {
      const unread = ALERTS.filter(a => !a.read).length;
      setUnreadCount(unread);
    };
    updateUnread();
    const interval = setInterval(updateUnread, 1000);
    return () => clearInterval(interval);
  }, []);

  const sections = ['overview', 'patients', 'alerts', 'analytics', 'messages', 'settings'];

  return (
    <nav className="topnav">
      <button className="menu-toggle" onClick={() => {
        const tabs = document.querySelector('.nav-tabs');
        tabs?.classList.toggle('open');
      }}>☰</button>
      <div className="brand">
        <div className="brand-icon">🫁</div>
        Wheeze<span className="brand-dot">Ease</span>
      </div>

      <div className="nav-tabs">
        {sections.map(section => (
          <button
            key={section}
            className={`nav-tab ${activeSection === section ? 'active' : ''}`}
            onClick={() => onSectionChange(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
            {section === 'alerts' && unreadCount > 0 && <span className="tab-badge"></span>}
          </button>
        ))}
      </div>

      <div className="nav-right">
        <div className="live-pill">
          <div className="live-dot"></div>
          Live
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{time}</div>
        <div className="notif-btn" onClick={() => onSectionChange('alerts')}>
          🔔
          <div className="notif-count">{unreadCount}</div>
        </div>
        <div className="doc-chip">
          <div className="doc-avatar-sm">DR</div>
          <div>
            <div className="doc-chip-name">Dr. A. Rahman</div>
            <div className="doc-chip-role">Pulmonologist</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;