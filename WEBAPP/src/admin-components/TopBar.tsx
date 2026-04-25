// src/components/TopBar.tsx
import React, { useState, useEffect } from 'react';

interface TopBarProps {
  title: string;
  subtitle: string;
  alertCount: number;
  onSearchOpen: () => void;
  onAlertsClick: () => void;
  onLogout?: () => void;  // Add this prop
}

const TopBar: React.FC<TopBarProps> = ({ 
  title, 
  subtitle, 
  alertCount, 
  onSearchOpen, 
  onAlertsClick,
  onLogout  // Add this
}) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }) + 
        ' · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('doctorName');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
  };

  return (
    <div className="topbar">
      <div>
        <span className="topbar-title">{title}</span>
        <span className="topbar-sub"> — {subtitle}</span>
      </div>
      <div className="tb-right">
        <div className="tb-clock">{time}</div>
        <button className="tb-search-btn" onClick={onSearchOpen}>
          🔍 &nbsp;Search users, doctors…<span style={{marginLeft:'12px',fontSize:'10px',background:'var(--border)',borderRadius:'5px',padding:'2px 6px'}}>Ctrl+K</span>
        </button>
        <div className="tb-notif" onClick={onAlertsClick}>
          🔔
          {alertCount > 0 && <div className="tb-notif-dot">{alertCount}</div>}
        </div>
        {/* Logout Button - Extreme Right, Oval, No Icon */}
        <button className="tb-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default TopBar;