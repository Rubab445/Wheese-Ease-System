import React from 'react';
import type { Patient } from '../../../types/patient.types';

interface PatientGridViewProps {
  patients: Patient[];
  onPatientClick: (patient: Patient) => void;
  onMessageClick: (patient: Patient) => void;
  onPrescriptionClick: (patient: Patient) => void;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { class: string; label: string }> = {
    stable: { class: 'stable', label: 'Stable' },
    watch: { class: 'watch', label: 'Watch' },
    critical: { class: 'critical', label: 'Critical' },
  };
  const s = statusMap[status] || statusMap.stable;
  return (
    <span className={`badge ${s.class}`}>
      <span className="badge-dot"></span>
      {s.label}
    </span>
  );
};

const PatientGridView: React.FC<PatientGridViewProps> = ({
  patients,
  onPatientClick,
  onMessageClick,
  onPrescriptionClick,
}) => {
  return (
    <div className="grid-view">
      {patients.map((patient) => (
        <div key={patient.id} className="patient-card" onClick={() => onPatientClick(patient)}>
          <div className="card-top">
            <div
              className="card-avatar"
              style={{
                background: patient.avatarBg,
                color: patient.avatarColor,
              }}
            >
              {patient.initials}
            </div>
            <div className="card-meta">
              <div className="card-name">{patient.name}</div>
              <div className="card-sub">
                {patient.id} · {patient.age}y {patient.gender}
              </div>
            </div>
            {getStatusBadge(patient.status)}
          </div>

          <div className="card-stats">
            <div className="card-stat">
              <div className="card-stat-label">Condition</div>
              <div className="card-stat-val">{patient.condition}</div>
            </div>
            <div className="card-stat">
              <div className="card-stat-label">Last Active</div>
              <div className="card-stat-val">{patient.lastActive}</div>
            </div>
            <div className="card-stat">
              <div className="card-stat-label">SpO₂</div>
              <div
                className="card-stat-val"
                style={{
                  color: parseInt(patient.vitals.spo2) < 95 ? 'var(--red)' : 'var(--green)',
                }}
              >
                {patient.vitals.spo2}
              </div>
            </div>
            <div className="card-stat">
              <div className="card-stat-label">City</div>
              <div className="card-stat-val">{patient.city}</div>
            </div>
          </div>

          <div className="card-actions" onClick={(e) => e.stopPropagation()}>
            <button className="btn-sm btn-msg" onClick={() => onMessageClick(patient)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Message
            </button>
            <button className="btn-sm btn-rx" onClick={() => onPrescriptionClick(patient)}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Update Rx
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientGridView;