import React, { useState } from 'react';
import type { Patient, SymptomLog, MedicationLog, AIPrediction } from '../../../types/patient.types';

interface PatientDetailModalProps {
    patient: Patient | null;
    onClose: () => void;
    onMessage: (patient: Patient) => void;
    onPrescription: (patient: Patient) => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, onClose, onMessage, onPrescription }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'symptoms' | 'meds' | 'ai'>('overview');

    if (!patient) return null;

    const getRiskColor = () => {
        switch (patient.riskLevel) {
            case 'critical': return '#ef4444';
            case 'warning': return '#f59e0b';
            case 'stable': return '#10b981';
            default: return '#7C3AED';
        }
    };

    const getRiskText = () => {
        switch (patient.riskLevel) {
            case 'critical': return 'Critical - Immediate Attention Required';
            case 'warning': return 'Warning - Monitor Closely';
            case 'stable': return 'Stable - Routine Care';
            default: return 'Unknown';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="patient-modal" onClick={(e) => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="modal-header">
                    <div className="modal-header-info">
                        <div className="modal-avatar" style={{ background: `linear-gradient(135deg, ${getRiskColor()}, ${getRiskColor()}80)` }}>
                            {patient.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <div>
                            <h2>{patient.name}</h2>
                            <div className="modal-meta">
                                <span><i className="fas fa-id-card"></i> {patient.patientId}</span>
                                <span><i className="fas fa-calendar-alt"></i> {patient.age} years</span>
                                <span><i className="fas fa-venus-mars"></i> {patient.gender}</span>
                                <span><i className="fas fa-map-marker-alt"></i> {patient.location}</span>
                            </div>
                            <div className="modal-contact">
                                <span><i className="fas fa-envelope"></i> {patient.email || 'Not provided'}</span>
                                <span><i className="fas fa-phone"></i> {patient.phone || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-risk" style={{ background: `${getRiskColor()}15`, borderLeftColor: getRiskColor() }}>
                        <i className="fas fa-shield-alt" style={{ color: getRiskColor() }}></i>
                        <span style={{ color: getRiskColor() }}>{getRiskText()}</span>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>

                {/* Stats Row */}
                <div className="modal-stats">
                    <div className="modal-stat">
                        <i className="fas fa-lungs"></i>
                        <div>
                            <span className="stat-value">{patient.asthmaType.split(' ')[0]}</span>
                            <span className="stat-label">Asthma Type</span>
                        </div>
                    </div>
                    <div className="modal-stat">
                        <i className="fas fa-hospital-user"></i>
                        <div>
                            <span className="stat-value">{patient.pastERVisits}</span>
                            <span className="stat-label">ER Visits</span>
                        </div>
                    </div>
                    <div className="modal-stat">
                        <i className="fas fa-chart-line"></i>
                        <div>
                            <span className="stat-value">{patient.adherenceRate}%</span>
                            <span className="stat-label">Adherence</span>
                        </div>
                    </div>
                    <div className="modal-stat">
                        <i className="fas fa-sync-alt"></i>
                        <div>
                            <span className="stat-value">{patient.lastSync.split(' ')[0]}</span>
                            <span className="stat-label">Last Sync</span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>
                        <i className="fas fa-chart-line"></i> Overview
                    </button>
                    <button className={activeTab === 'symptoms' ? 'active' : ''} onClick={() => setActiveTab('symptoms')}>
                        <i className="fas fa-head-side-cough"></i> Symptoms
                    </button>
                    <button className={activeTab === 'meds' ? 'active' : ''} onClick={() => setActiveTab('meds')}>
                        <i className="fas fa-pills"></i> Medications
                    </button>
                    <button className={activeTab === 'ai' ? 'active' : ''} onClick={() => setActiveTab('ai')}>
                        <i className="fas fa-brain"></i> AI Insights
                    </button>
                </div>

                {/* Tab Content */}
                <div className="modal-content">
                    {activeTab === 'overview' && (
                        <div className="modal-overview">
                            <div className="modal-card">
                                <h3><i className="fas fa-notes-medical"></i> Clinical History</h3>
                                <div className="info-row"><span>Asthma Type</span><strong>{patient.asthmaType}</strong></div>
                                <div className="info-row"><span>Past ER Visits</span><strong>{patient.pastERVisits}</strong></div>
                                <div className="info-row"><span>Last Sync</span><strong>{patient.lastSync}</strong></div>
                            </div>
                            <div className="modal-card">
                                <h3><i className="fas fa-bolt"></i> Trigger Profile</h3>
                                <div className="trigger-tags">
                                    {patient.triggers.map((t: string, i: number) => <span key={i} className="trigger-tag">{t}</span>)}
                                </div>
                                <div className="info-row"><span>Primary Trigger</span><strong>{patient.triggerIcon} {patient.primaryTrigger}</strong></div>
                            </div>
                            <div className="modal-card">
                                <h3><i className="fas fa-chart-simple"></i> Medication Adherence</h3>
                                <div className="adherence-meter">
                                    <div className="meter-circle">
                                        <svg viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8"/>
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#7C3AED" strokeWidth="8" 
                                                    strokeDasharray={`${2 * Math.PI * 42 * patient.adherenceRate / 100} ${2 * Math.PI * 42}`} 
                                                    strokeLinecap="round" transform="rotate(-90 50 50)"/>
                                            <text x="50" y="56" textAnchor="middle" fontSize="18" fontWeight="700">{patient.adherenceRate}%</text>
                                        </svg>
                                    </div>
                                    <div><span>Preventer: {patient.preventiveUsage}%</span><div className="bar"><div className="fill preventive" style={{ width: `${patient.preventiveUsage}%` }}></div></div></div>
                                    <div><span>Rescue: {patient.rescueUsage}%</span><div className="bar"><div className="fill rescue" style={{ width: `${patient.rescueUsage}%` }}></div></div></div>
                                </div>
                            </div>
                            {patient.emergencyContact && (
                                <div className="modal-card">
                                    <h3><i className="fas fa-phone-alt"></i> Emergency Contact</h3>
                                    <div><strong>{patient.emergencyContact.name}</strong></div>
                                    <div>{patient.emergencyContact.relationship} • {patient.emergencyContact.phone}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'symptoms' && (
                        <div className="modal-symptoms">
                            <table className="modal-table">
                                <thead><tr><th>Date</th><th>Symptom</th><th>Severity</th></tr></thead>
                                <tbody>
                                    {patient.symptoms.length > 0 ? patient.symptoms.map((s: SymptomLog, i: number) => (
                                        <tr key={i}>
                                            <td>{s.date}{s.time && <span className="time-sm"> at {s.time}</span>}</td>
                                            <td>{s.symptom}</td>
                                            <td><span className="severity-badge" style={{ background: `rgba(124,58,237,${s.severity/10})` }}>{s.severity}/10</span></td>
                                        </tr>
                                    )) : <tr><td colSpan={3} className="empty">No symptoms reported</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'meds' && (
                        <div className="modal-meds">
                            <table className="modal-table">
                                <thead><tr><th>Medication</th><th>Dosage</th><th>Frequency</th><th>Last Taken</th></tr></thead>
                                <tbody>
                                    {patient.medications.length > 0 ? patient.medications.map((m: MedicationLog, i: number) => (
                                        <tr key={i}>
                                            <td><i className="fas fa-pills"></i> {m.name}</td>
                                            <td>{m.dosage}</td>
                                            <td>{m.frequency}</td>
                                            <td>{m.lastTaken || 'Not recorded'}</td>
                                        </tr>
                                    )) : <tr><td colSpan={4} className="empty">No medications prescribed</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="modal-ai">
                            {patient.aiPredictions && patient.aiPredictions.length > 0 ? patient.aiPredictions.map((p: AIPrediction, i: number) => (
                                <div key={i} className={`ai-card ${p.riskLevel}`}>
                                    <div className="ai-header">
                                        <div className="ai-icon"><i className="fas fa-robot"></i></div>
                                        <span>{p.date}</span>
                                        <span className={`risk-tag ${p.riskLevel}`}>{p.riskLevel === 'high' ? '🔴 High' : p.riskLevel === 'medium' ? '🟡 Medium' : '🟢 Low'}</span>
                                    </div>
                                    <div className="ai-body">
                                        <div><strong>Predicted Trigger:</strong> {p.predictedTrigger}</div>
                                        <div className="ai-recommendation"><i className="fas fa-lightbulb"></i> {p.recommendation}</div>
                                    </div>
                                </div>
                            )) : <div className="empty">No AI predictions available</div>}
                        </div>
                    )}
                </div>

                {/* Modal Footer - Action Buttons */}
                <div className="modal-footer">
                    <button className="modal-btn message" onClick={() => onMessage(patient)}>
                        <i className="fas fa-comment"></i> Send Message
                    </button>
                    <button className="modal-btn prescription" onClick={() => onPrescription(patient)}>
                        <i className="fas fa-prescription-bottle"></i> Update Prescription
                    </button>
                    <button className="modal-btn close" onClick={onClose}>
                        <i className="fas fa-times"></i> Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PatientDetailModal;