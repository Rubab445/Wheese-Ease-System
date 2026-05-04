import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient.types';
import { mockPatients, locations } from '../../data/patients.mock';
import PatientDetailModal from '../Components/patients/PatientDetailModal';
import '../../styles/patients.css';

const PatientDirectory: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRisk, setFilterRisk] = useState('all');
    const [filterLocation, setFilterLocation] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showModal, setShowModal] = useState(false);

    const filteredPatients = useMemo(() => {
        return mockPatients.filter((patient: Patient) => {
            const matchesSearch = searchTerm === '' ||
                patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRisk = filterRisk === 'all' || patient.riskLevel === filterRisk;
            const matchesLocation = filterLocation === 'All' || patient.location === filterLocation;

            return matchesSearch && matchesRisk && matchesLocation;
        });
    }, [searchTerm, filterRisk, filterLocation]);

    const handlePatientClick = (patient: Patient) => {
        setSelectedPatient(patient);
        setShowModal(true);
    };

    const handleMessage = (patientId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/messages?patient=${patientId}`);
    };

    const handlePrescription = (patientId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/prescriptions?patient=${patientId}`);
    };

    const stats = {
        total: mockPatients.length,
        critical: mockPatients.filter((p: Patient) => p.riskLevel === 'critical').length,
        warning: mockPatients.filter((p: Patient) => p.riskLevel === 'warning').length,
        stable: mockPatients.filter((p: Patient) => p.riskLevel === 'stable').length,
    };

    const getRiskBadge = (riskLevel: string) => {
        switch (riskLevel) {
            case 'critical':
                return <span className="pd-risk-badge critical"><i className="fas fa-exclamation-circle"></i> Critical</span>;
            case 'warning':
                return <span className="pd-risk-badge warning"><i className="fas fa-exclamation-triangle"></i> Warning</span>;
            case 'stable':
                return <span className="pd-risk-badge stable"><i className="fas fa-check-circle"></i> Stable</span>;
            default:
                return null;
        }
    };

    const getInitials = (name: string): string => {
        return name.split(' ').map(n => n[0]).join('');
    };

    return (
        <div className="pd-module">
            {/* Heading */}
            <div className="pd-heading">
                <h1>Patients</h1>
                <p>Manage and monitor all patients under your care</p>
            </div>

            {/* 4 Stats Cards */}
            <div className="pd-stats">
                <div className="pd-stat total">
                    <div className="stat-icon"><i className="fas fa-users"></i></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.total}</span>
                        <span className="stat-label">Total Patients</span>
                    </div>
                </div>
                <div className="pd-stat critical">
                    <div className="stat-icon"><i className="fas fa-exclamation-triangle"></i></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.critical}</span>
                        <span className="stat-label">Critical</span>
                    </div>
                </div>
                <div className="pd-stat warning">
                    <div className="stat-icon"><i className="fas fa-chart-line"></i></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.warning}</span>
                        <span className="stat-label">Warning</span>
                    </div>
                </div>
                <div className="pd-stat stable">
                    <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
                    <div className="stat-info">
                        <span className="stat-number">{stats.stable}</span>
                        <span className="stat-label">Stable</span>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="pd-search-filters">
                <div className="pd-search">
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Search by name, ID, or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="pd-clear" onClick={() => setSearchTerm('')}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <div className="pd-filters">
                    <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                        <option value="all">All Risks</option>
                        <option value="critical">Critical</option>
                        <option value="warning">Warning</option>
                        <option value="stable">Stable</option>
                    </select>
                    <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                        {locations.map((loc: string) => (
                            <option key={loc} value={loc}>{loc === 'All' ? 'All Cities' : loc}</option>
                        ))}
                    </select>
                    <div className="pd-view-toggle">
                        <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
                            <i className="fas fa-th-large"></i>
                        </button>
                        <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="pd-grid">
                    {filteredPatients.map((patient: Patient) => (
                        <div key={patient.id} className={`pd-card ${patient.riskLevel}`} onClick={() => handlePatientClick(patient)}>
                            <div className="pd-card-grad"></div>
                            <div className="pd-card-top">
                                <div className="pd-avatar">{getInitials(patient.name)}</div>
                                {getRiskBadge(patient.riskLevel)}
                            </div>
                            <h3 className="pd-name">{patient.name}</h3>
                            <div className="pd-info">
                                <div className="pd-meta">
                                    <span><i className="fas fa-id-card"></i> {patient.patientId}</span>
                                    <span><i className="fas fa-calendar-alt"></i> {patient.age} yrs</span>
                                    <span><i className="fas fa-venus-mars"></i> {patient.gender}</span>
                                </div>
                                <div className="pd-location">
                                    <i className="fas fa-map-marker-alt"></i> {patient.location}
                                </div>
                                <div className="pd-trigger">
                                    {patient.triggerIcon} {patient.primaryTrigger}
                                </div>
                            </div>
                            <div className="pd-stats">
                                <div><span>{patient.adherenceRate}%</span><label>Adherence</label></div>
                                <div><span>{patient.pastERVisits}</span><label>ER Visits</label></div>
                                <div><span>{patient.lastSync.split(' ')[0]}</span><label>Sync</label></div>
                            </div>
                            <div className="pd-actions">
                                <button className="msg" onClick={(e) => handleMessage(patient.id, e)}>
                                    <i className="fas fa-comment"></i> Message
                                </button>
                                <button className="rx" onClick={(e) => handlePrescription(patient.id, e)}>
                                    <i className="fas fa-prescription-bottle"></i> Prescription
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="pd-table-wrap">
                    <table className="pd-table">
                        <thead>
                            <tr><th>Patient</th><th>ID</th><th>Age/Gender</th><th>Location</th><th>Trigger</th><th>Risk</th><th>Adherence</th><th></th></tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient: Patient) => (
                                <tr key={patient.id} onClick={() => handlePatientClick(patient)}>
                                    <td>
                                        <div className="pd-table-patient">
                                            <div className="pd-table-avatar">{getInitials(patient.name)}</div>
                                            <div>
                                                <div className="pd-table-name">{patient.name}</div>
                                                <div className="pd-table-sync">Last sync: {patient.lastSync}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{patient.patientId}</td>
                                    <td>{patient.age} yrs / {patient.gender}</td>
                                    <td><i className="fas fa-map-marker-alt"></i> {patient.location}</td>
                                    <td><span className="pd-trigger-badge">{patient.triggerIcon} {patient.primaryTrigger}</span></td>
                                    <td>{getRiskBadge(patient.riskLevel)}</td>
                                    <td>
                                        <div className="pd-adherence">
                                            <div className="pd-adherence-bar"><div className="fill" style={{ width: `${patient.adherenceRate}%` }}></div></div>
                                            <span>{patient.adherenceRate}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="pd-table-actions">
                                            <button className="msg" onClick={(e) => handleMessage(patient.id, e)}><i className="fas fa-comment"></i></button>
                                            <button className="rx" onClick={(e) => handlePrescription(patient.id, e)}><i className="fas fa-prescription-bottle"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredPatients.length === 0 && (
                <div className="pd-empty">
                    <i className="fas fa-users-slash"></i>
                    <h3>No patients found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            )}

            {/* Patient Detail Modal */}
            {showModal && selectedPatient && (
                <PatientDetailModal 
                    patient={selectedPatient}
                    onClose={() => setShowModal(false)}
                    onMessage={(patient: Patient) => {
                        setShowModal(false);
                        navigate(`/messages?patient=${patient.id}`);
                    }}
                    onPrescription={(patient: Patient) => {
                        setShowModal(false);
                        navigate(`/prescriptions?patient=${patient.id}`);
                    }}
                />
            )}
        </div>
    );
};

export default PatientDirectory;