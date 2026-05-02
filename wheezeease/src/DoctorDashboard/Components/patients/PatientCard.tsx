import React from 'react';
import type { Patient } from '../../../types/patient.types';

interface PatientCardProps {
    patient: Patient;
    onClick: (patient: Patient) => void;
    onMessage: (patient: Patient) => void;
    onPrescription: (patient: Patient) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onClick, onMessage, onPrescription }) => {
    const getRiskBadge = () => {
        switch (patient.riskLevel) {
            case 'critical':
                return <span className="risk-badge critical"><i className="fas fa-exclamation-circle"></i> Critical</span>;
            case 'warning':
                return <span className="risk-badge warning"><i className="fas fa-exclamation-triangle"></i> Warning</span>;
            case 'stable':
                return <span className="risk-badge stable"><i className="fas fa-check-circle"></i> Stable</span>;
            default:
                return null;
        }
    };

    const getInitials = (name: string): string => {
        return name.split(' ').map((n: string) => n[0]).join('');
    };

    const handleCardClick = () => {
        onClick(patient);
    };

    return (
        <div className={`patient-card-enhanced ${patient.riskLevel}`} onClick={handleCardClick}>
            <div className="card-gradient-bg"></div>
            <div className="patient-card-header">
                <div className="patient-avatar-enhanced">
                    {getInitials(patient.name)}
                </div>
                <div className="patient-status">
                    {getRiskBadge()}
                    {patient.isInactive && <span className="inactive-badge"><i className="fas fa-clock"></i> Inactive</span>}
                </div>
            </div>
            
            <div className="patient-card-name-enhanced">
                <h3>{patient.name}</h3>
                <p>{patient.patientId} • {patient.age} yrs • {patient.gender}</p>
            </div>

            <div className="patient-card-details-enhanced">
                <div className="detail-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{patient.location}</span>
                </div>
                <div className="detail-item">
                    <i className="fas fa-sync-alt"></i>
                    <span>{patient.lastSync}</span>
                </div>
                <div className="detail-item">
                    <i className="fas fa-bolt"></i>
                    <span className="trigger-text">{patient.triggerIcon} {patient.primaryTrigger}</span>
                </div>
            </div>

            <div className="patient-card-stats">
                <div className="stat">
                    <span className="stat-value">{patient.adherenceRate}%</span>
                    <span className="stat-label">Adherence</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{patient.pastERVisits}</span>
                    <span className="stat-label">ER Visits</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{patient.symptoms.length}</span>
                    <span className="stat-label">Symptoms</span>
                </div>
            </div>

            <div className="patient-card-footer">
                <button className="card-btn message" onClick={(e) => { e.stopPropagation(); onMessage(patient); }}>
                    <i className="fas fa-comment"></i> Message
                </button>
                <button className="card-btn prescription" onClick={(e) => { e.stopPropagation(); onPrescription(patient); }}>
                    <i className="fas fa-prescription"></i> Rx
                </button>
            </div>
        </div>
    );
};

export default PatientCard;