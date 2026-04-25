import React, { useEffect, useState, useRef } from 'react';
import { ALERTS } from '../../data/patients';
import { createPortal } from 'react-dom';

interface TopNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onHamburgerClick?: () => void;
  
}

const TopNav: React.FC<TopNavProps> = ({ 
  activeSection, 
  onSectionChange, 
  onHamburgerClick
}) => {
  const [time, setTime] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const handleDropdownToggle = () => {
    if (!isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        right: window.innerWidth - rect.right + window.scrollX,
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const sections = ['dashboard', 'patients', 'alerts', 'analytics', 'messages', 'settings'];

  return (
    <nav className="topnav">
      <button 
        className="hamburger-btn"
        onClick={onHamburgerClick}
        aria-label="Toggle sidebar"
        style={{
          background: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '8px 10px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <span style={{ width: '20px', height: '2px', background: '#333', borderRadius: '2px' }}></span>
        <span style={{ width: '20px', height: '2px', background: '#333', borderRadius: '2px' }}></span>
        <span style={{ width: '20px', height: '2px', background: '#333', borderRadius: '2px' }}></span>
      </button>

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
        <div style={{ fontSize: '12px', color: 'var(--muted)' }} className="live-time">{time}</div>
        <div className="notif-btn" onClick={() => onSectionChange('alerts')}>
          🔔
          <div className="notif-count">{unreadCount}</div>
        </div>
        
        {/* Doctor Profile Button */}
        <div 
          ref={buttonRef}
          className="doc-chip" 
          onClick={handleDropdownToggle}
          style={{ cursor: 'pointer' }}
        >
          <div className="doc-avatar-sm">DR</div>
          <div>
            <div className="doc-chip-name">Dr. A. Rahman</div>
            <div className="doc-chip-role">Pulmonologist</div>
          </div>
          <span style={{ fontSize: '12px', marginLeft: '4px' }}>
            {isDropdownOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Dropdown using Portal - Simplified with only Settings and Logout */}
      {isDropdownOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="dropdown-portal"
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
            minWidth: '160px',
            background: 'white',
            border: '1px solid #e4eaf2',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 10000,
            overflow: 'hidden'
          }}
        >
          {/* Settings Option */}
          <div 
            className="dropdown-item"
            onClick={() => {
              setIsDropdownOpen(false);
              onSectionChange('settings');
            }}
          >
            <span className="dropdown-icon">⚙️</span>
            <span className="dropdown-text">Settings</span>
          </div>
          
          {/* Divider */}
          <div className="dropdown-divider"></div>
          
          {/* Logout Option */}
          <div 
            className="dropdown-item logout"
            onClick={handleLogout}
          >
            <span className="dropdown-icon">🚪</span>
            <span className="dropdown-text">Logout</span>
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default TopNav;