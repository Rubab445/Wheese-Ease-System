import { useState } from 'react';
import Sidebar from './AdminDashboard/Components/Sidebar'
import UtilitySidebar from './AdminDashboard/Components/UtilitySidebar';
import Overview from './AdminDashboard/Pages/AdminDashboard';
import UserManagement from './AdminDashboard/Pages/UserManagement';
import DoctorManagement from './AdminDashboard/Pages/DoctorManagement';
import PatientManagement from './AdminDashboard/Pages/PatientManagement';
import EnvironmentalMonitor from './AdminDashboard/Pages/EnvironmentalMonitor';
import AIMonitoring from './AdminDashboard/Pages/AIMonitoring';
import Settings from './AdminDashboard/Pages/Settings';
import AdminMessages from './AdminDashboard/Pages/AdminMessages'

export default function AdminDashboard() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Overview />;
      case 'user-management':
        return <UserManagement />;
      case 'doctor-management':
        return <DoctorManagement />;
      case 'patient-directory':
        return <PatientManagement />;
      case 'settings':
        return <Settings />;
      case 'environmental-monitor':
        return <EnvironmentalMonitor />;
      case 'analytics':
        return <AIMonitoring />;
      case 'messages':
        return <AdminMessages />;
      default:
        return (
          <div style={{ padding: '40px', backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B', margin: '0 0 16px 0' }}>
              Module: {activeModule}
            </h1>
            <p style={{ color: '#64748B' }}>This module is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100vh',
        backgroundColor: '#F8FAFC',
      }}
    >
      <Sidebar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        {renderModule()}
      </main>
      <UtilitySidebar />
    </div>
  );
}
