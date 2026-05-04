import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient.types';
import { getPatientById } from '../../data/patients.mock';

const PatientDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<Patient | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'symptoms' | 'meds' | 'ai'>('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            const data = getPatientById(id);
            if (data) setPatient(data);
            else navigate('/patients');
        }
        setLoading(false);
    }, [id, navigate]);

    if (loading) return (
        <div className="detail-loading">
            <div className="loading-spinner"></div>
            <p>Loading patient data...</p>
        </div>
    );
    
    if (!patient) return (
        <div className="detail-not-found">
            <i className="fas fa-user-slash"></i>
            <h3>Patient not found</h3>
            <button onClick={() => navigate('/patients')}>Back to Directory</button>
        </div>
    );

    const getRiskColor = () => {
        switch (patient.riskLevel) {
            case 'critical': return '#dc2626';
            case 'warning': return '#d97706';
            case 'stable': return '#10b981';
            default: return '#7C3AED';
        }
    };

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('');

    return (
        <div className="patient-detail-container">
            {/* Back Button */}
            <button className="detail-back-btn" onClick={() => navigate('/patients')}>
                <i className="fas fa-arrow-left"></i> Back to Patients
            </button>

            {/* Profile Header */}
            <div className="detail-profile-wrapper">
                <div className="detail-profile-card">
                    <div className="profile-avatar" style={{ background: `linear-gradient(135deg, ${getRiskColor()}, ${getRiskColor()}80)` }}>
                        {getInitials(patient.name)}
                    </div>
                    <div className="profile-details">
                        <h1>{patient.name}</h1>
                        <div className="profile-badges">
                            <span className="badge purple"><i className="fas fa-id-card"></i> {patient.patientId}</span>
                            <span className="badge gray"><i className="fas fa-calendar-alt"></i> {patient.age} years</span>
                            <span className="badge gray"><i className="fas fa-venus-mars"></i> {patient.gender}</span>
                            <span className="badge blue"><i className="fas fa-map-marker-alt"></i> {patient.location}</span>
                        </div>
                        <div className="profile-contact">
                            <span><i className="fas fa-envelope"></i> {patient.email || 'Not provided'}</span>
                            <span><i className="fas fa-phone"></i> {patient.phone || 'Not provided'}</span>
                        </div>
                    </div>
                    <div className="profile-risk" style={{ background: `${getRiskColor()}10`, borderColor: getRiskColor() }}>
                        <i className="fas fa-shield-alt" style={{ color: getRiskColor() }}></i>
                        <span style={{ color: getRiskColor() }}>
                            {patient.riskLevel === 'critical' ? '⚠️ Critical - Immediate Attention' : 
                             patient.riskLevel === 'warning' ? '⚠️ Warning - Monitor Closely' : '✅ Stable - Routine Care'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="detail-divider"></div>

            {/* Stats Row */}
            <div className="detail-stats-row">
                <div className="detail-stat">
                    <div className="stat-icon purple-bg"><i className="fas fa-lungs"></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{patient.asthmaType.split(' ')[0]}</span>
                        <span className="stat-label">Asthma Type</span>
                    </div>
                </div>
                <div className="detail-stat">
                    <div className="stat-icon red-bg"><i className="fas fa-hospital-user"></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{patient.pastERVisits}</span>
                        <span className="stat-label">ER Visits</span>
                    </div>
                </div>
                <div className="detail-stat">
                    <div className="stat-icon green-bg"><i className="fas fa-chart-line"></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{patient.adherenceRate}%</span>
                        <span className="stat-label">Adherence Rate</span>
                    </div>
                </div>
                <div className="detail-stat">
                    <div className="stat-icon orange-bg"><i className="fas fa-sync-alt"></i></div>
                    <div className="stat-info">
                        <span className="stat-value">{patient.lastSync.split(' ')[0]}</span>
                        <span className="stat-label">Last Sync</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="detail-tabs-container">
                <button className={`detail-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                    <i className="fas fa-chart-line"></i> Overview
                </button>
                <button className={`detail-tab ${activeTab === 'symptoms' ? 'active' : ''}`} onClick={() => setActiveTab('symptoms')}>
                    <i className="fas fa-head-side-cough"></i> Symptoms
                </button>
                <button className={`detail-tab ${activeTab === 'meds' ? 'active' : ''}`} onClick={() => setActiveTab('meds')}>
                    <i className="fas fa-pills"></i> Medications
                </button>
                <button className={`detail-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
                    <i className="fas fa-brain"></i> AI Insights
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="detail-overview">
                    <div className="info-card clinical">
                        <div className="card-header">
                            <div className="card-icon"><i className="fas fa-notes-medical"></i></div>
                            <h3>Clinical History</h3>
                        </div>
                        <div className="card-body">
                            <div className="info-row"><span>Asthma Type</span><strong>{patient.asthmaType}</strong></div>
                            <div className="info-row"><span>Past ER Visits</span><strong>{patient.pastERVisits}</strong></div>
                            <div className="info-row"><span>Last Sync</span><strong>{patient.lastSync}</strong></div>
                        </div>
                    </div>

                    <div className="info-card trigger">
                        <div className="card-header">
                            <div className="card-icon"><i className="fas fa-bolt"></i></div>
                            <h3>Trigger Profile</h3>
                        </div>
                        <div className="card-body">
                            <div className="trigger-tags">
                                {patient.triggers.map((t, i) => <span key={i} className="trigger-tag">{t}</span>)}
                            </div>
                            <div className="primary-trigger">
                                <span>Primary Trigger</span>
                                <strong>{patient.triggerIcon} {patient.primaryTrigger}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="info-card adherence">
                        <div className="card-header">
                            <div className="card-icon"><i className="fas fa-chart-simple"></i></div>
                            <h3>Medication Adherence</h3>
                        </div>
                        <div className="card-body">
                            <div className="adherence-circle">
                                <svg viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                                    <circle cx="50" cy="50" r="42" fill="none" stroke="#7C3AED" strokeWidth="8" 
                                            strokeDasharray={`${2 * Math.PI * 42 * patient.adherenceRate / 100} ${2 * Math.PI * 42}`} 
                                            strokeLinecap="round" transform="rotate(-90 50 50)"/>
                                    <text x="50" y="56" textAnchor="middle" fontSize="18" fontWeight="700" fill="#0f172a">{patient.adherenceRate}%</text>
                                </svg>
                            </div>
                            <div className="usage-bars">
                                <div className="usage-item"><span>Preventer</span><div className="bar"><div className="fill preventive" style={{ width: `${patient.preventiveUsage}%` }}></div></div><strong>{patient.preventiveUsage}%</strong></div>
                                <div className="usage-item"><span>Rescue</span><div className="bar"><div className="fill rescue" style={{ width: `${patient.rescueUsage}%` }}></div></div><strong>{patient.rescueUsage}%</strong></div>
                            </div>
                        </div>
                    </div>

                    {patient.peakFlowReadings && patient.peakFlowReadings.length > 0 && (
                        <div className="info-card peakflow full-width">
                            <div className="card-header">
                                <div className="card-icon"><i className="fas fa-chart-line"></i></div>
                                <h3>Peak Flow Trend</h3>
                            </div>
                            <div className="card-body">
                                <div className="peak-flow-chart">
                                    {patient.peakFlowReadings.map((r, i) => (
                                        <div key={i} className="peak-bar">
                                            <div className="peak-bar-fill" style={{ height: `${(r.value / 600) * 100}%` }}></div>
                                            <span className="peak-value">{r.value}</span>
                                            <span className="peak-date">{r.date.slice(5)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {patient.emergencyContact && (
                        <div className="info-card emergency">
                            <div className="card-header">
                                <div className="card-icon"><i className="fas fa-phone-alt"></i></div>
                                <h3>Emergency Contact</h3>
                            </div>
                            <div className="card-body">
                                <div className="emergency-name">{patient.emergencyContact.name}</div>
                                <div className="emergency-details">
                                    <span><i className="fas fa-heart"></i> {patient.emergencyContact.relationship}</span>
                                    <span><i className="fas fa-phone"></i> {patient.emergencyContact.phone}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Symptoms Tab */}
            {activeTab === 'symptoms' && (
                <div className="detail-symptoms">
                    <div className="symptoms-table-wrapper">
                        <table className="symptoms-table">
                            <thead>
                                <tr><th>Date & Time</th><th>Symptom</th><th>Severity</th></tr>
                            </thead>
                            <tbody>
                                {patient.symptoms.length > 0 ? patient.symptoms.map((s, i) => (
                                    <tr key={i}>
                                        <td><i className="fas fa-calendar-day"></i> {s.date}{s.time && <span className="time-sm"> at {s.time}</span>}</td>
                                        <td><i className="fas fa-stethoscope"></i> {s.symptom}</td>
                                        <td><span className="severity-badge" style={{ background: `rgba(124,58,237,${s.severity/10})` }}>{s.severity}/10</span></td>
                                    </tr>
                                )) : <tr><td colSpan={3} className="empty-table">No symptoms reported</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Medications Tab */}
            {activeTab === 'meds' && (
                <div className="detail-medications">
                    <div className="medications-table-wrapper">
                        <table className="medications-table">
                            <thead>
                                <tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Last Taken</th></tr>
                            </thead>
                            <tbody>
                                {patient.medications.length > 0 ? patient.medications.map((m, i) => (
                                    <tr key={i}>
                                        <td><i className="fas fa-pills"></i> {m.name}</td>
                                        <td>{m.dosage}</td>
                                        <td>{m.frequency}</td>
                                        <td>{m.lastTaken || 'Not recorded'}</td>
                                    </tr>
                                )) : <tr><td colSpan={4} className="empty-table">No medications prescribed</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* AI Insights Tab */}
            {activeTab === 'ai' && (
                <div className="detail-ai">
                    {patient.aiPredictions && patient.aiPredictions.length > 0 ? patient.aiPredictions.map((p, i) => (
                        <div key={i} className={`ai-insight-card ${p.riskLevel}`}>
                            <div className="ai-insight-header">
                                <div className="ai-icon"><i className="fas fa-robot"></i></div>
                                <div className="ai-date"><i className="fas fa-calendar"></i> {p.date}</div>
                                <div className={`ai-risk-tag ${p.riskLevel}`}>
                                    {p.riskLevel === 'high' && '🔴 High Risk'}
                                    {p.riskLevel === 'medium' && '🟡 Medium Risk'}
                                    {p.riskLevel === 'low' && '🟢 Low Risk'}
                                </div>
                            </div>
                            <div className="ai-insight-body">
                                <div className="ai-trigger"><strong>Predicted Trigger:</strong> {p.predictedTrigger}</div>
                                <div className="ai-recommendation-box"><i className="fas fa-lightbulb"></i> {p.recommendation}</div>
                            </div>
                            <div className="ai-insight-footer">
                                <button className="ai-btn acknowledge" onClick={() => alert('Acknowledged')}><i className="fas fa-check"></i> Acknowledge</button>
                                <button className="ai-btn update" onClick={() => navigate(`/prescriptions?patient=${patient.id}`)}><i className="fas fa-prescription"></i> Update Prescription</button>
                            </div>
                        </div>
                    )) : <div className="empty-state-ai"><i className="fas fa-brain"></i><h3>No AI Predictions Available</h3><p>AI predictions will appear here when available</p></div>}
                </div>
            )}
        </div>
    );
};

export default PatientDetail;