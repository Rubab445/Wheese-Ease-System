import React from 'react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isExpanded: boolean;
  
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isExpanded
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'patients', label: 'Patients', icon: '👥' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onSectionChange(item.id)}
            title={!isExpanded ? item.label : ''}
          >
            <span className="sidebar-nav-icon">{item.icon}</span>
            {isExpanded && <span className="sidebar-nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!isExpanded && (
        <div className="sidebar-footer-collapsed">
          <div className="sidebar-avatar">DR</div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;