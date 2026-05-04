import React from 'react';

interface SidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    onLogout: () => void;
    activePage: string;
    onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onLogout, activePage, onNavigate }) => {
    const navItems = [
        { id: 'dashboard', icon: 'fas fa-th-large', label: 'Dashboard' },
        { id: 'patients', icon: 'fas fa-users', label: 'Patient Directory' },
        { id: 'analytics', icon: 'fas fa-chart-line', label: 'Health Analytics' },
        { id: 'prescriptions', icon: 'fas fa-prescription-bottle', label: 'Prescription Manager' },
        { id: 'alerts', icon: 'fas fa-bell', label: 'Alerts Hub' },
        { id: 'messages', icon: 'fas fa-comment-dots', label: 'Messages' },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div>
                {/* Only Hamburger - No Logo */}
                <div className="sidebar-header">
                    <button className="hamburger-btn" onClick={onToggle}>
                        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>

                <div className="nav-links">
                    {navItems.map((item) => (
                        <div
                            key={item.id}
                            className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar-footer">
                <button className="settings-btn" onClick={() => onNavigate('settings')}>
                    <i className="fas fa-cog"></i>
                    <span>Settings</span>
                </button>
                <button className="logout-btn" onClick={onLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;