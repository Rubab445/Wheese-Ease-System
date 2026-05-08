import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import '../../../styles/Layout.css'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getActivePage = () => {
        const path = location.pathname;
        if (path === '/dashboard' || path === '/doctor') return 'dashboard';
        if (path === '/patients') return 'patients';
        if (path === '/analytics') return 'analytics';
        if (path === '/alerts') return 'alerts';
        if (path === '/messages') return 'messages';
        if (path === '/settings') return 'settings';
        return 'dashboard';
    };

    const activePage = getActivePage();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.querySelector('.admin-sidebar');
            
            if (sidebarOpen && sidebar && !sidebar.contains(event.target as Node)) {
                // Keep the sidebar logic simple: if clicked outside, maybe collapse it
                // Or let the user toggle it manually. Let's just collapse it if clicked outside for mobile
                if (window.innerWidth < 1024) setSidebarOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sidebarOpen]);

    const handleNavigate = (page: string) => {
        // Only close sidebar on navigate if on mobile
        if (window.innerWidth < 1024) setSidebarOpen(false);
        
        switch(page) {
            case 'dashboard': navigate('/dashboard'); break;
            case 'patients': navigate('/patients'); break;
            case 'analytics': navigate('/analytics'); break;
            case 'alerts': navigate('/alerts'); break;
            case 'messages': navigate('/messages'); break;
            case 'settings': navigate('/settings'); break;
            default: navigate('/dashboard');
        }
    };

    return (
        <div className="app-layout">
            <div style={{
              width: sidebarOpen ? '260px' : '88px',
              flexShrink: 0,
              backgroundColor: 'white',
              zIndex: 1300,
              transition: 'width 0.3s ease',
              boxShadow: '4px 0 10px rgba(0,0,0,0.02)'
            }}>
                <Sidebar
                    isOpen={sidebarOpen}
                    onToggle={() => setSidebarOpen(!sidebarOpen)}
                    activePage={activePage}
                    onNavigate={handleNavigate}
                />
            </div>
            
            <div className="main-container">
                <div className="dashboard-container">
                    <div className={`content-area ${activePage}-page`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;