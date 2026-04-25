// src/App.tsx (Complete Updated Version with Mobile Menu & Fixed Messages Component)
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './admin-components/Sidebar';
import TopBar from './admin-components/TopBar';
import Toast from './admin-components/Toast';
import SearchOverlay from './admin-components/SearchOverlay';
import MobileMenuButton from './admin-components/MobileMenuButton';
import AddDoctorModal from './admin-components/AddDoctorModal';
import ViewDoctorModal from './admin-components/ViewDoctorModal';
import ConfirmModal from './admin-components/ConfirmModal';
import AddPatientModal from './admin-components/AddPatientModal';
import ViewPatientModal from './admin-components/ViewPatientModal';
import AssignDoctorModal from './admin-components/AssignDoctorModal';
import ConfirmPatientModal from './admin-components/ConfirmPatientModal';
import Overview from './admin-pages/Overview';
import Alerts from './admin-pages/Alerts';
import Doctors from './admin-pages/Doctors';
import Patients from './admin-pages/Patients';
import Unassigned from './admin-pages/Unassigned';
import Messages from './admin-pages/Messages';
import Broadcast from './admin-pages/Broadcast';
import AIMonitor from './admin-pages/AIMonitor';
import Analytics from './admin-pages/Analytics';
import Reports from './admin-pages/Reports';
import Config from './admin-pages/Config';
import Settings from './admin-pages/Settings';
import { INIT_DOCTORS, INIT_PATIENTS, INIT_ALERTS } from './data/mockData';
import type { Doctor, Patient, Alert, NewDoctorData, NewPatientData } from './types';

import './styles/admin-dashboard.css';

const AdminDashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('overview');
  const [doctors, setDoctors] = useState<Doctor[]>(INIT_DOCTORS);
  const [patients, setPatients] = useState<Patient[]>(INIT_PATIENTS);
  const [alerts, setAlerts] = useState<Alert[]>(INIT_ALERTS);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Doctor Modal states
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [isViewDoctorModalOpen, setIsViewDoctorModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorToSuspend, setDoctorToSuspend] = useState<Doctor | null>(null);

  // Patient Modal states
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isViewPatientModalOpen, setIsViewPatientModalOpen] = useState(false);
  const [isAssignDoctorModalOpen, setIsAssignDoctorModalOpen] = useState(false);
  const [isConfirmPatientModalOpen, setIsConfirmPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToAction, setPatientToAction] = useState<{ id: string; name: string; action: 'suspend' | 'remove' } | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2800);
  }, []);

  const unassignedCount = patients.filter(p => p.doctor === '—').length;
  const pendingCount = doctors.filter(d => d.status === 'pending').length;
  const alertCount = alerts.filter(a => !a.read).length;

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('doctorName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = '/login';
  };

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
    // Prevent body scroll when menu is open
    if (!isMobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
      }
      document.body.classList.remove('menu-open');
    }
  };

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.querySelector('.sidebar');
      const menuBtn = document.querySelector('.mobile-menu-btn');
      if (isMobileMenuOpen && sidebar && menuBtn && 
          !sidebar.contains(event.target as Node) && 
          !menuBtn.contains(event.target as Node)) {
        closeMobileMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Handle window resize - close menu on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Clean up body class on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, []);

  // Helper functions
  const generateRandomColor = () => {
    const colors = [
      'linear-gradient(135deg,#3a8eff,#7c5cfc)',
      'linear-gradient(135deg,#e84393,#f5a623)',
      'linear-gradient(135deg,#20b2aa,#3a8eff)',
      'linear-gradient(135deg,#f5a623,#e84343)',
      'linear-gradient(135deg,#7c5cfc,#e843e8)',
      'linear-gradient(135deg,#22c87a,#3a8eff)',
      'linear-gradient(135deg,#ff6b35,#f5a623)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRandomColor = () => {
    const colors = ['#e84393', '#3a8eff', '#22c87a', '#f5a623', '#9b43e8', '#20b2aa', '#ff6b35'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getMedication = (condition: string): string => {
    const meds: Record<string, string> = {
      'Asthma': 'Salbutamol + Fluticasone',
      'Allergy': 'Cetirizine + Fluticasone',
      'COPD': 'Tiotropium + Montelukast',
      'Dust Allergy': 'Loratadine',
      'Seasonal Allergy': 'Fexofenadine',
      'Bronchitis': 'Budesonide + Formoterol'
    };
    return meds[condition] || 'Standard medication';
  };

  // Doctor Handlers
  const handleAddDoctor = (newDoctorData: NewDoctorData) => {
    const newDoctor: Doctor = {
      id: `D-${String(doctors.length + 1).padStart(3, '0')}`,
      name: newDoctorData.name,
      init: getInitials(newDoctorData.name),
      spec: newDoctorData.specialty,
      hosp: newDoctorData.hospital,
      patients: 0,
      response: '—',
      status: 'pending',
      email: newDoctorData.email,
      phone: newDoctorData.phone || '+92-300-0000000',
      color: generateRandomColor(),
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    setDoctors(prev => [...prev, newDoctor]);
    showToast(`✅ Dr. ${newDoctorData.name} added and pending approval`);
  };

  const handleApproveDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, status: 'active' as const } : d));
    const doctor = doctors.find(d => d.id === id);
    showToast(`✅ ${doctor?.name} approved and notified`);
  };

  const handleRejectDoctor = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    setDoctors(prev => prev.filter(d => d.id !== id));
    showToast(`❌ ${doctor?.name} registration rejected`);
  };

  const handleOpenSuspend = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
      setDoctorToSuspend(doctor);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmSuspend = () => {
    if (doctorToSuspend) {
      setDoctors(prev => prev.map(d => d.id === doctorToSuspend.id ? { ...d, status: 'suspended' as const } : d));
      showToast(`🔴 ${doctorToSuspend.name} has been suspended`);
      setIsConfirmModalOpen(false);
      setDoctorToSuspend(null);
      setIsViewDoctorModalOpen(false);
    }
  };

  const handleViewDoctor = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsViewDoctorModalOpen(true);
    }
  };

  const handleViewDoctorFromAnalytics = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setIsViewDoctorModalOpen(true);
    } else {
      showToast('Doctor not found');
    }
  };

  const handleMessageDoctor = (id: string) => {
    const doctor = doctors.find(d => d.id === id);
    showToast(`💬 Opening chat with ${doctor?.name}`);
    setActiveNav('messages');
    closeMobileMenu();
  };

  // Patient Handlers
  const handleAddPatient = (newPatientData: NewPatientData) => {
    const newPatient: Patient = {
      id: `P-${String(patients.length + 1).padStart(3, '0')}`,
      name: newPatientData.name,
      init: getInitials(newPatientData.name),
      age: newPatientData.age,
      gender: newPatientData.gender,
      cond: newPatientData.condition,
      risk: Math.floor(Math.random() * 30) + 10,
      doctor: newPatientData.doctorId ? doctors.find(d => d.id === newPatientData.doctorId)?.name || '—' : '—',
      lastCI: 'Today',
      color: getRandomColor(),
      med: getMedication(newPatientData.condition),
      phone: newPatientData.phone,
      city: newPatientData.city
    };
    
    setPatients(prev => [...prev, newPatient]);
    
    if (newPatientData.doctorId) {
      setDoctors(prev => prev.map(d => 
        d.id === newPatientData.doctorId 
          ? { ...d, patients: d.patients + 1 }
          : d
      ));
    }
    
    showToast(`✅ ${newPatientData.name} added successfully`);
  };

  const handleViewPatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setSelectedPatient(patient);
      setIsViewPatientModalOpen(true);
    }
  };

  const handleViewPatientFromAI = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsViewPatientModalOpen(true);
    } else {
      const tempPatient: Patient = {
        id: patientId,
        name: patientId === 'P-041' ? 'Sara Ahmed' : patientId === 'P-033' ? 'Usman Iqbal' : 'Hina Malik',
        init: patientId === 'P-041' ? 'SA' : patientId === 'P-033' ? 'UI' : 'HM',
        age: patientId === 'P-041' ? 34 : patientId === 'P-033' ? 45 : 39,
        gender: patientId === 'P-041' ? 'F' : patientId === 'P-033' ? 'M' : 'F',
        cond: patientId === 'P-041' ? 'Asthma' : patientId === 'P-033' ? 'Asthma' : 'Allergy',
        risk: patientId === 'P-041' ? 92 : patientId === 'P-033' ? 78 : 48,
        doctor: patientId === 'P-041' ? 'Dr. A. Rahman' : patientId === 'P-033' ? 'Dr. Hina Bajwa' : 'Dr. Kamran M.',
        lastCI: 'Today',
        color: patientId === 'P-041' ? '#e84393' : patientId === 'P-033' ? '#3a8eff' : '#22c87a',
        med: patientId === 'P-041' ? 'Salbutamol + Fluticasone' : patientId === 'P-033' ? 'Budesonide + Formoterol' : 'Fexofenadine',
        phone: '+92-300-0000000',
        city: 'Gujranwala'
      };
      setSelectedPatient(tempPatient);
      setIsViewPatientModalOpen(true);
    }
  };

  const handleEscalateFromAI = (patientName: string, doctorName: string) => {
    showToast(`⚡ ${patientName} escalated to ${doctorName}`);
  };

  const handleOpenAssignDoctor = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      setIsAssignDoctorModalOpen(true);
    }
  };

  const handleConfirmAssignDoctor = (patientId: string, doctorId: string, reason: string, note: string) => {
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);
    
    if (patient && doctor) {
      if (patient.doctor !== '—') {
        const oldDoctor = doctors.find(d => d.name === patient.doctor);
        if (oldDoctor) {
          setDoctors(prev => prev.map(d => 
            d.id === oldDoctor.id 
              ? { ...d, patients: Math.max(0, d.patients - 1) }
              : d
          ));
        }
      }
      
      setPatients(prev => prev.map(p => 
        p.id === patientId 
          ? { ...p, doctor: doctor.name }
          : p
      ));
      
      setDoctors(prev => prev.map(d => 
        d.id === doctorId 
          ? { ...d, patients: d.patients + 1 }
          : d
      ));
      
      showToast(`✅ ${patient.name} assigned to ${doctor.name} · Doctor notified`);
    }
  };

  const handleSuspendPatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setPatientToAction({ id: patientId, name: patient.name, action: 'suspend' });
      setIsConfirmPatientModalOpen(true);
    }
  };

  const handleRemovePatient = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setPatientToAction({ id: patientId, name: patient.name, action: 'remove' });
      setIsConfirmPatientModalOpen(true);
    }
  };

  const handleConfirmPatientAction = () => {
    if (patientToAction) {
      if (patientToAction.action === 'suspend') {
        setPatients(prev => prev.filter(p => p.id !== patientToAction.id));
        showToast(`🔴 ${patientToAction.name} has been suspended`);
      } else {
        setPatients(prev => prev.filter(p => p.id !== patientToAction.id));
        showToast(`🗑 ${patientToAction.name} has been removed`);
      }
      setIsConfirmPatientModalOpen(false);
      setPatientToAction(null);
      setIsViewPatientModalOpen(false);
    }
  };

  const handleNotifyDoctor = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    showToast(`📧 Note sent to ${patient?.doctor}`);
  };

  const handleAssignDoctorFromUnassigned = (patientId: string) => {
    handleOpenAssignDoctor(patientId);
  };

  // Alert Handlers
  const handleMarkAlertRead = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
    showToast('✓ Marked as read');
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    showToast('✓ All alerts marked as read');
  };

  const handleDismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    showToast('Alert dismissed');
  };

  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    closeMobileMenu();
  };

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'Overview', subtitle: 'System summary' },
    alerts: { title: 'Alerts', subtitle: 'All system notifications' },
    doctors: { title: 'Doctor Management', subtitle: 'Approvals & oversight' },
    patients: { title: 'Patient Management', subtitle: 'All registered patients' },
    unassigned: { title: 'Unassigned Patients', subtitle: 'Requires attention' },
    messages: { title: 'Messages', subtitle: 'Doctor communication' },
    broadcast: { title: 'Broadcast', subtitle: 'Platform announcements' },
    ai: { title: 'AI Monitor', subtitle: 'Model performance' },
    analytics: { title: 'Analytics', subtitle: 'Platform insights' },
    reports: { title: 'Reports', subtitle: 'Download & schedule' },
    config: { title: 'Configuration', subtitle: 'System settings' },
    settings: { title: 'Admin Settings', subtitle: 'Account preferences' },
  };

  const currentSection = sectionTitles[activeNav] || { title: 'Dashboard', subtitle: '' };

  // Message handlers
  const handleOpenNewMessage = () => {
    showToast('📝 New message composer opened');
  };

  const handleSendNewMessage = (doctorId: string, message: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    showToast(`📨 Message sent to ${doctor?.name || 'doctor'}: ${message.substring(0, 30)}...`);
  };

  return (
    <div className="app-container" style={{display:'flex',minHeight:'100vh',overflow:'hidden'}}>
      <MobileMenuButton onToggle={toggleMobileMenu} isOpen={isMobileMenuOpen} />
      
      <Sidebar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        pendingCount={pendingCount}
        unassignedCount={unassignedCount}
        alertCount={alertCount}
      />
      
      <div className="app-main">
        <TopBar
          title={currentSection.title}
          subtitle={currentSection.subtitle}
          alertCount={alertCount}
          onSearchOpen={() => setSearchOpen(true)}
          onAlertsClick={() => handleNavChange('alerts')}
          onLogout={handleLogout}  // <-- Added Logout prop
        />
        <div className="content">
          {activeNav === 'overview' && <Overview onShowToast={showToast} onNavChange={handleNavChange} />}
          {activeNav === 'alerts' && (
            <Alerts
              alerts={alerts}
              onMarkRead={handleMarkAlertRead}
              onMarkAllRead={handleMarkAllAlertsRead}
              onDismiss={handleDismissAlert}
              onShowToast={showToast}
            />
          )}
          {activeNav === 'doctors' && (
            <Doctors
              doctors={doctors}
              patients={patients}
              onApprove={handleApproveDoctor}
              onReject={handleRejectDoctor}
              onSuspend={handleOpenSuspend}
              onViewDoctor={handleViewDoctor}
              onAddDoctor={handleAddDoctor}
              onShowToast={showToast}
              onOpenAddModal={() => setIsAddDoctorModalOpen(true)}
            />
          )}
          {activeNav === 'patients' && (
            <Patients
              patients={patients}
              doctors={doctors}
              onViewPatient={handleViewPatient}
              onAssignDoctor={handleOpenAssignDoctor}
              onSuspendPatient={handleSuspendPatient}
              onRemovePatient={handleRemovePatient}
              onShowToast={showToast}
              onOpenAddModal={() => setIsAddPatientModalOpen(true)}
            />
          )}
          {activeNav === 'unassigned' && (
            <Unassigned
              patients={patients}
              doctors={doctors}
              onAssignDoctor={handleAssignDoctorFromUnassigned}
              onViewPatient={handleViewPatient}
              onShowToast={showToast}
            />
          )}
          {activeNav === 'messages' && (
            <Messages 
              doctors={doctors}
              onOpenNewMessage={handleOpenNewMessage}
              onSendNewMessage={handleSendNewMessage}
              onShowToast={showToast}
            />
          )}
          {activeNav === 'broadcast' && <Broadcast onShowToast={showToast} />}
          {activeNav === 'ai' && (
            <AIMonitor 
              onViewPatient={handleViewPatientFromAI}
              onEscalate={handleEscalateFromAI}
            />
          )}
          {activeNav === 'analytics' && (
            <Analytics 
              onViewDoctor={handleViewDoctorFromAnalytics}
              onShowToast={showToast}
            />
          )}
          {activeNav === 'reports' && <Reports onShowToast={showToast} />}
          {activeNav === 'config' && <Config onShowToast={showToast} />}
          {activeNav === 'settings' && <Settings onShowToast={showToast} />}
        </div>
      </div>

      {/* Doctor Modals */}
      <AddDoctorModal
        isOpen={isAddDoctorModalOpen}
        onClose={() => setIsAddDoctorModalOpen(false)}
        onAddDoctor={handleAddDoctor}
        onShowToast={showToast}
      />

      <ViewDoctorModal
        isOpen={isViewDoctorModalOpen}
        onClose={() => setIsViewDoctorModalOpen(false)}
        doctor={selectedDoctor}
        patients={patients}
        onSuspend={handleOpenSuspend}
        onApprove={handleApproveDoctor}
        onReject={handleRejectDoctor}
        onMessageDoctor={handleMessageDoctor}
        onShowToast={showToast}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDoctorToSuspend(null);
        }}
        onConfirm={handleConfirmSuspend}
        title="Suspend Doctor"
        message={`Are you sure you want to suspend ${doctorToSuspend?.name}?`}
        subMessage="Their patients will become unassigned. This action can be reversed."
        confirmText="Suspend"
        icon="🔴"
        isDanger={true}
      />

      {/* Patient Modals */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onAddPatient={handleAddPatient}
        doctors={doctors}
        onShowToast={showToast}
      />

      <ViewPatientModal
        isOpen={isViewPatientModalOpen}
        onClose={() => setIsViewPatientModalOpen(false)}
        patient={selectedPatient}
        doctors={doctors}
        onAssignDoctor={handleOpenAssignDoctor}
        onSuspendPatient={handleSuspendPatient}
        onNotifyDoctor={handleNotifyDoctor}
        onShowToast={showToast}
      />

      <AssignDoctorModal
        isOpen={isAssignDoctorModalOpen}
        onClose={() => {
          setIsAssignDoctorModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        doctors={doctors}
        onConfirmAssign={handleConfirmAssignDoctor}
        onShowToast={showToast}
      />

      <ConfirmPatientModal
        isOpen={isConfirmPatientModalOpen}
        onClose={() => {
          setIsConfirmPatientModalOpen(false);
          setPatientToAction(null);
        }}
        onConfirm={handleConfirmPatientAction}
        patientName={patientToAction?.name || ''}
        action={patientToAction?.action || 'suspend'}
        onShowToast={showToast}
      />

      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        doctors={doctors}
        patients={patients}
        onViewDoctor={(id) => { handleViewDoctor(id); handleNavChange('doctors'); closeMobileMenu(); }}
        onViewPatient={(id) => { handleViewPatient(id); handleNavChange('patients'); closeMobileMenu(); }}
      />
      
      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
};

export default AdminDashboard;