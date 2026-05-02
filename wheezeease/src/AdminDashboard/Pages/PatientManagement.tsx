import { useState } from 'react';
import { Search, Plus, Users, AlertTriangle, Activity, MapPin } from 'lucide-react';
import type { Patient } from '../types';
import PatientDataTable from '../Components/PatientDataTable';
import PatientHistoryDrawer from '../Components/PatientHistoryDrawer';
import RegisterPatientModal from '../Components/RegisterPatientModal';
import EditPatientModal from '../Components/EditPatientModal';
import '../Admin.module.css/PatientManagement.css'

export default function PatientManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);

  const patients: Patient[] = [
    {
      id: 'PT-1024',
      name: 'Ahmed Khan',
      age: 35,
      gender: 'Male',
      email: 'ahmed.khan@patient.com',
      phone: '+92 300 1234567',
      riskLevel: 'Critical',
      location: 'Gujrat, Pakistan',
      aqi: 187,
      assignedDoctor: 'Dr. Sarah Mitchell',
      lastAttack: '2 hours ago',
      avatar: 'AK',
      bloodType: 'O+',
      knownTriggers: ['Smog', 'Dust', 'Cold Weather'],
      medications: ['Albuterol Inhaler', 'Montelukast 10mg'],
      peakFlowData: [320, 310, 295, 280, 265, 250, 240],
      medicalHistory: 'Chronic asthma since childhood. Recent exacerbation due to high AQI levels.'
    },
    {
      id: 'PT-1025',
      name: 'Sara Malik',
      age: 28,
      gender: 'Female',
      email: 'sara.malik@patient.com',
      phone: '+92 301 2345678',
      riskLevel: 'Stable',
      location: 'Lahore, Pakistan',
      aqi: 95,
      assignedDoctor: 'Dr. Michael Chen',
      lastAttack: '2 weeks ago',
      avatar: 'SM',
      bloodType: 'A+',
      knownTriggers: ['Pollen', 'Pet Dander'],
      medications: ['Cetirizine 10mg', 'Nasal Spray'],
      peakFlowData: [380, 385, 390, 395, 400, 405, 410],
      medicalHistory: 'Seasonal allergic rhinitis, well-controlled with current medication.'
    },
    {
      id: 'PT-1026',
      name: 'Omar Hassan',
      age: 52,
      gender: 'Male',
      email: 'omar.hassan@patient.com',
      phone: '+92 302 3456789',
      riskLevel: 'Guarded',
      location: 'Karachi, Pakistan',
      aqi: 142,
      assignedDoctor: 'Dr. Sarah Mitchell',
      lastAttack: '3 days ago',
      avatar: 'OH',
      bloodType: 'B+',
      knownTriggers: ['Smoke', 'Air Pollution', 'Exercise'],
      medications: ['Symbicort Inhaler', 'Prednisone 5mg'],
      peakFlowData: [280, 285, 275, 270, 280, 290, 295],
      medicalHistory: 'COPD with moderate obstruction. Regular monitoring required.'
    },
    {
      id: 'PT-1027',
      name: 'Fatima Ali',
      age: 41,
      gender: 'Female',
      email: 'fatima.ali@patient.com',
      phone: '+92 303 4567890',
      riskLevel: 'Stable',
      location: 'Islamabad, Pakistan',
      aqi: 78,
      assignedDoctor: 'Dr. Aisha Patel',
      lastAttack: '1 month ago',
      avatar: 'FA',
      bloodType: 'AB+',
      knownTriggers: ['Seasonal Pollen'],
      medications: ['Fluticasone Inhaler'],
      peakFlowData: [420, 425, 430, 435, 440, 445, 450],
      medicalHistory: 'Mild intermittent asthma, excellent compliance with treatment plan.'
    },
    {
      id: 'PT-1028',
      name: 'Bilal Ahmed',
      age: 19,
      gender: 'Male',
      email: 'bilal.ahmed@patient.com',
      phone: '+92 304 5678901',
      riskLevel: 'Critical',
      location: 'Gujrat, Pakistan',
      aqi: 187,
      assignedDoctor: 'Dr. Emily Rodriguez',
      lastAttack: '6 hours ago',
      avatar: 'BA',
      bloodType: 'O-',
      knownTriggers: ['Smog', 'Dust Mites', 'Mold'],
      medications: ['Albuterol Inhaler', 'Budesonide', 'Montelukast 10mg'],
      peakFlowData: [250, 245, 230, 220, 210, 200, 195],
      medicalHistory: 'Severe persistent asthma. Multiple ER visits in past year.'
    },
  ];

  const stats = {
    totalPatients: patients.length,
    criticalRisk: patients.filter(p => p.riskLevel === 'Critical').length,
    guardedRisk: patients.filter(p => p.riskLevel === 'Guarded').length,
    stablePatients: patients.filter(p => p.riskLevel === 'Stable').length,
    avgAQI: Math.round(patients.reduce((sum, p) => sum + p.aqi, 0) / patients.length),
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedPatient(null);
  };

  const handleEditPatient = (patient: Patient) => {
    setPatientToEdit(patient);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setPatientToEdit(null);
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         patient.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'All' || patient.riskLevel === riskFilter;
    const matchesLocation = locationFilter === 'All' || patient.location.includes(locationFilter);
    return matchesSearch && matchesRisk && matchesLocation;
  });

  return (
    <div className="patient-management-page">
      <div className="patient-management-header">
        <div className="header-left">
          <h1 className="page-title">Patient Intelligence</h1>
          <p className="page-subtitle">AI-powered patient monitoring and risk assessment</p>
        </div>
        <button className="btn-register-patient" onClick={() => setIsRegisterModalOpen(true)}>
          <Plus size={20} />
          Register New Patient
        </button>
      </div>

      <div className="patient-stats-grid">
        <div className="stat-card gradient-blue">
          <div className="stat-icon-wrapper">
            <Users size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Patients</p>
            <h3 className="stat-value">{stats.totalPatients}</h3>
            <span className="stat-badge">Under Monitoring</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-red">
          <div className="stat-icon-wrapper">
            <AlertTriangle size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Critical Risk</p>
            <h3 className="stat-value">{stats.criticalRisk}</h3>
            <span className="stat-badge">Immediate Attention</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-amber">
          <div className="stat-icon-wrapper">
            <Activity size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Guarded Status</p>
            <h3 className="stat-value">{stats.guardedRisk}</h3>
            <span className="stat-badge">Close Monitoring</span>
          </div>
          <div className="stat-decoration"></div>
        </div>

        <div className="stat-card gradient-green">
          <div className="stat-icon-wrapper">
            <MapPin size={28} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Average AQI</p>
            <h3 className="stat-value">{stats.avgAQI}</h3>
            <span className="stat-badge">Environmental Index</span>
          </div>
          <div className="stat-decoration"></div>
        </div>
      </div>

      <div className="filter-section">
        <div className="search-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, ID, location..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="All">All Risk Levels</option>
            <option value="Critical">Critical</option>
            <option value="Guarded">Guarded</option>
            <option value="Stable">Stable</option>
          </select>

          <select
            className="filter-select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">All Locations</option>
            <option value="Gujrat">Gujrat</option>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
            <option value="Islamabad">Islamabad</option>
          </select>
        </div>
      </div>

      <PatientDataTable
        patients={filteredPatients}
        onPatientClick={handlePatientClick}
        onEditPatient={handleEditPatient}
      />

      <PatientHistoryDrawer
        isOpen={isDrawerOpen}
        patient={selectedPatient}
        onClose={handleCloseDrawer}
      />

      <RegisterPatientModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />

      <EditPatientModal
        isOpen={isEditModalOpen}
        patient={patientToEdit}
        onClose={handleCloseEditModal}
      />
    </div>
  );
}
