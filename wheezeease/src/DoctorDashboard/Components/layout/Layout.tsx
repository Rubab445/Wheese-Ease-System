import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import RightUtilityBar from './RightUtilityBar';
import '../../../styles/Layout.css'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // FIXED: Isay function ki bajaye constant bana diya taake direct use ho sake
    const getActivePage = () => {
        const path = location.pathname;
        if (path === '/') return 'dashboard';
        if (path === '/patients') return 'patients';
        if (path === '/analytics') return 'analytics';
        if (path === '/prescriptions') return 'prescriptions';
        if (path === '/alerts') return 'alerts';
        if (path === '/messages') return 'messages';
        if (path === '/settings') return 'settings';
        return 'dashboard';
    };

    // FIXED: Alag se useState hatadi, ab ye direct location se calculate hoga
    const activePage = getActivePage();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.querySelector('.sidebar');
            const settingsBtn = document.querySelector('.settings-btn');
            const hamburgerBtn = document.querySelector('.hamburger-btn');
            
            if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
                if (!settingsBtn?.contains(event.target as Node) && 
                    !hamburgerBtn?.contains(event.target as Node)) {
                    setSidebarOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    const handleNavigate = (page: string) => {
        setSidebarOpen(false);
        switch(page) {
            case 'dashboard': navigate('/'); break;
            case 'patients': navigate('/patients'); break;
            case 'analytics': navigate('/analytics'); break;
            case 'prescriptions': navigate('/prescriptions'); break;
            case 'alerts': navigate('/alerts'); break;
            case 'messages': navigate('/messages'); break;
            case 'settings': navigate('/settings'); break;
            default: navigate('/');
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                onLogout={handleLogout}
               activePage={activePage}
                onNavigate={handleNavigate}
            />
            
            <div className="main-container">
                <Header />
                <div className="dashboard-container">
                    <div className="content-area">
                        {children}
                    </div>
                </div>
            </div>

            <div className="utility-area">
                <RightUtilityBar onLogout={handleLogout} />
            </div>

            {showLogoutModal && (
                <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <i className="fas fa-shield-alt" style={{ fontSize: '48px', color: '#7C3AED', marginBottom: '16px' }}></i>
                        <h3>Security Confirmation</h3>
                        <p>Are you sure you want to logout?</p>
                        <div className="modal-buttons">
                            <button onClick={() => setShowLogoutModal(false)} className="btn-cancel">Cancel</button>
                            <button onClick={confirmLogout} className="btn-logout">Logout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;