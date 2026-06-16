import React from 'react';
import { MessageSquare, FileEdit, Activity, ShieldAlert, AlertTriangle } from 'lucide-react';
import type { Patient } from '../../../types/patient.types';

interface PatientListViewProps {
  patients: Patient[];
  onPatientClick: (patient: Patient) => void;
  onMessageClick: (patient: Patient) => void;
  onPrescriptionClick: (patient: Patient) => void;
}

const getRiskPill = (status: string, score: number) => {
  const config = {
    stable: { class: 'stable', label: 'Stable', icon: <Activity size={12} /> },
    watch: { class: 'watch', label: 'Watch', icon: <AlertTriangle size={12} /> },
    critical: { class: 'critical', label: 'Critical', icon: <ShieldAlert size={12} /> },
  };
  const s = config[status as keyof typeof config] || config.stable;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span className={`p-risk-pill ${s.class}`}>
        {s.icon}
        {s.label}
      </span>
      <span className="p-risk-score">{score}%</span>
    </div>
  );
};

const getTriggers = (patient: Patient): string[] => {
  const triggers: string[] = [];
  const condition = (patient.condition || '').toLowerCase();
  const allergies = (patient.allergies || []).join(' ').toLowerCase();

  if (patient.status === 'critical') {
    if (allergies.includes('dust') || condition.includes('dust')) triggers.push('Dust Exposure');
    if (allergies.includes('pollen')) triggers.push('High Pollen');
    if (condition.includes('copd')) triggers.push('COPD Flare');
    if (allergies.includes('cold air') || allergies.includes('cold')) triggers.push('Cold Air');
    triggers.push('Inhaler Overuse');
    if (triggers.length < 2) triggers.push('AQI Spike');
  } else if (patient.status === 'watch') {
    if (allergies.includes('exercise')) triggers.push('Exercise Trigger');
    if (allergies.includes('smoke')) triggers.push('Smoke Exposure');
    if (allergies.includes('pollen')) triggers.push('Pollen Alert');
    if (allergies.includes('cold air')) triggers.push('Cold Air');
    if (condition.includes('rhinitis')) triggers.push('Seasonal Flare');
    if (triggers.length < 1) triggers.push('Humidity Shift');
  } else {
    if (allergies.includes('pollen')) triggers.push('Low Pollen');
    triggers.push('Stable Control');
  }

  return triggers.slice(0, 3);
};

const PatientListView: React.FC<PatientListViewProps> = ({
  patients,
  onPatientClick,
  onMessageClick,
  onPrescriptionClick,
}) => {
  return (
    <div className="p-table-container">
      <table className="p-main-table">
        <thead>
          <tr>
            <th>Patient Identity</th>
            <th>Demographics & Condition</th>
            <th>AI Risk Level</th>
            <th>AI Triggers (Explainability)</th>
            <th>Last Activity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} onClick={() => onPatientClick(patient)}>
              {/* Column 1: Identity — name only, no ID */}
              <td>
                <div className="p-id-cell">
                  <div
                    className="p-avatar"
                    style={{
                      background: patient.avatarBg,
                      color: patient.avatarColor,
                    }}
                  >
                    {patient.initials}
                  </div>
                  <div>
                    <div className="p-name">{patient.name}</div>
                  </div>
                </div>
              </td>

              {/* Column 2: Demographics & Condition */}
              <td>
                <div className="p-demo">{patient.age} / {patient.gender}</div>
                <div className="p-condition">{patient.condition}</div>
              </td>

              {/* Column 3: AI Risk Level */}
              <td>
                {getRiskPill(patient.status, patient.status === 'critical' ? 78 : patient.status === 'watch' ? 47 : 12)}
              </td>

              {/* Column 4: AI Triggers — derived from patient data */}
              <td>
                <div className="p-trigger-list">
                  {getTriggers(patient).map((t) => (
                    <span key={t} className="p-trigger-tag">{t}</span>
                  ))}
                </div>
              </td>

              {/* Column 5: Last Activity */}
              <td>
                <div className="p-activity">{patient.lastActive}</div>
              </td>

              {/* Column 6: Actions — message + prescription only */}
              <td onClick={(e) => e.stopPropagation()}>
                <div className="p-actions">
                  <button className="btn-icon" onClick={() => onMessageClick(patient)} title="Message Patient" style={{ background: '#EEF2FF', color: '#4F46E5', border: '1px solid #E0E7FF' }}>
                    <MessageSquare size={14} />
                  </button>
                  <button className="btn-icon" onClick={() => onPrescriptionClick(patient)} title="Update Prescription" style={{ background: '#F0FDF4', color: '#16A34A', border: '1px solid #DCFCE7' }}>
                    <FileEdit size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientListView;
