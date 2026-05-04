// PatientGrid.tsx
import React, { useState } from 'react';
import type { Patient } from '../../../types/prescription';
import { Search, Activity, AlertTriangle, Clock, CheckCircle2, ArrowUpDown, Filter, LayoutGrid, List } from 'lucide-react';

const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Matt Smith', initials: 'MS', age: 34, dob: '12 Mar 1992', patientId: 'WE-2024-0034', condition: 'Severe Asthma Attack', severity: 'critical', lastVisit: '2024-04-30', medications: [], vitals: { spo2: '91%', peakFlow: '210 L/min' } },
  { id: '2', name: 'Ayesha Khan', initials: 'AK', age: 28, dob: '15 Jun 1996', patientId: 'WE-2024-0045', condition: 'Mild Wheezing Episode', severity: 'warning', lastVisit: '2024-04-29', medications: [], vitals: { spo2: '95%', peakFlow: '310 L/min' } },
  { id: '3', name: 'Salman Raza', initials: 'SR', age: 45, dob: '23 Aug 1979', patientId: 'WE-2024-0056', condition: 'Chronic Asthma · Stable', severity: 'stable', lastVisit: '2024-04-28', medications: [], vitals: { spo2: '98%', peakFlow: '420 L/min' } },
  { id: '4', name: 'Fatima Noor', initials: 'FN', age: 31, dob: '05 Nov 1993', patientId: 'WE-2024-0067', condition: 'Occupational Asthma', severity: 'warning', lastVisit: '2024-04-27', medications: [], vitals: { spo2: '94%', peakFlow: '295 L/min' } },
  { id: '5', name: 'Hassan Malik', initials: 'HM', age: 52, dob: '30 Jan 1972', patientId: 'WE-2024-0078', condition: 'Exercise-Induced Asthma', severity: 'stable', lastVisit: '2024-04-26', medications: [], vitals: { spo2: '97%', peakFlow: '390 L/min' } },
  { id: '6', name: 'Zara Butt', initials: 'ZB', age: 27, dob: '19 Sep 1997', patientId: 'WE-2024-0089', condition: 'Allergic Asthma', severity: 'stable', lastVisit: '2024-04-25', medications: [], vitals: { spo2: '96%', peakFlow: '365 L/min' } }
];

interface PatientGridProps {
  onPatientSelect: (patient: Patient) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
}

const PatientGrid: React.FC<PatientGridProps> = ({ onPatientSelect, viewMode, setViewMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'severity' | 'lastVisit'>('name');

  const statsData = [
    { label: 'Total Patients', value: MOCK_PATIENTS.length, icon: '👥', color: '#667eea' },
    { label: 'Critical', value: MOCK_PATIENTS.filter(p => p.severity === 'critical').length, icon: '⚠️', color: '#f5576c' },
    { label: 'Warning', value: MOCK_PATIENTS.filter(p => p.severity === 'warning').length, icon: '🟡', color: '#fa709a' },
    { label: 'Stable', value: MOCK_PATIENTS.filter(p => p.severity === 'stable').length, icon: '✅', color: '#4facfe' }
  ];

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'critical': return <AlertTriangle size={14} color="#dc2626" />;
      case 'warning': return <Clock size={14} color="#d97706" />;
      case 'stable': return <CheckCircle2 size={14} color="#16a34a" />;
      default: return <Activity size={14} color="#7c3aed" />;
    }
  };

  const filteredPatients = MOCK_PATIENTS
    .filter(patient => patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(patient => filterSeverity === 'all' ? true : patient.severity === filterSeverity)
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'severity') {
        const severityOrder: Record<Patient['severity'], number> = { critical: 0, warning: 1, stable: 2, done: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    });

  return (
    <div className="patient-grid-container">
      {/* Page Title */}
      <div className="page-header-section">
        <h1 className="page-main-title">Prescription Management</h1>
        <p className="page-sub-description">Manage and prescribe medications to patients</p>
      </div>

      {/* 4 Stats Cards */}
      <div className="stats-cards-row">
        {statsData.map((stat, idx) => (
          <div key={idx} className="stat-card-premium" style={{ background: `linear-gradient(135deg, ${stat.color}, ${stat.color}dd)` }}>
            <div className="stat-icon-premium">{stat.icon}</div>
            <div className="stat-content-premium">
              <div className="stat-value-premium">{stat.value}</div>
              <div className="stat-label-premium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="controls-bar">
        <div className="search-wrapper-premium">
          <Search size={16} />
          <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-wrapper-premium">
          <Filter size={16} />
          <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="stable">Stable</option>
          </select>
        </div>
        <div className="sort-wrapper-premium">
          <ArrowUpDown size={16} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="name">Sort by Name</option>
            <option value="severity">Sort by Severity</option>
            <option value="lastVisit">Sort by Last Visit</option>
          </select>
        </div>
        <div className="view-toggle">
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={16} /> Grid</button>
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><List size={16} /> List</button>
        </div>
      </div>

      {/* Patients Display */}
      {viewMode === 'grid' ? (
        <div className="patients-grid-premium">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-card-premium" onClick={() => onPatientSelect(patient)}>
              <div className="patient-avatar-premium" style={{
                background: patient.severity === 'critical' ? 'linear-gradient(135deg,#dc2626,#f87171)'
                  : patient.severity === 'warning' ? 'linear-gradient(135deg,#d97706,#fcd34d)'
                  : 'linear-gradient(135deg,#7c3aed,#a78bfa)'
              }}>{patient.initials}</div>
              <div className="patient-info-premium">
                <div className="patient-name-premium">
                  <h4>{patient.name}</h4>
                  <span className={`severity-badge severity-${patient.severity}`}>{getSeverityIcon(patient.severity)}{patient.severity}</span>
                </div>
                <div className="patient-details-premium">
                  <span>ID: {patient.patientId}</span><span>•</span><span>Age: {patient.age}</span><span>•</span><span>Last: {patient.lastVisit}</span>
                </div>
                <div className="patient-condition-premium"><Activity size={12} /><span>{patient.condition}</span></div>
                {patient.vitals && (<div className="patient-vitals-premium"><span className="vital-badge-premium">SpO₂: {patient.vitals.spo2}</span><span className="vital-badge-premium">PF: {patient.vitals.peakFlow}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="patients-list-premium">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="patient-list-item" onClick={() => onPatientSelect(patient)}>
              <div className="patient-avatar-list" style={{
                background: patient.severity === 'critical' ? 'linear-gradient(135deg,#dc2626,#f87171)'
                  : patient.severity === 'warning' ? 'linear-gradient(135deg,#d97706,#fcd34d)'
                  : 'linear-gradient(135deg,#7c3aed,#a78bfa)'
              }}>{patient.initials}</div>
              <div className="patient-info-list">
                <div className="patient-name-list">{patient.name} <span className={`severity-badge severity-${patient.severity}`}>{patient.severity}</span></div>
                <div className="patient-meta-list">{patient.patientId} • {patient.age} yrs • {patient.condition}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPatients.length === 0 && (<div className="no-results-premium"><p>No patients found matching your criteria</p></div>)}
    </div>
  );
};

export default PatientGrid;