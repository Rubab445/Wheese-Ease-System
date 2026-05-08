import React from 'react';
import { MessageSquare, FileEdit, Send, Activity, ShieldAlert, AlertTriangle } from 'lucide-react';
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

// Demo triggers - in real app would come from patient data
const getTriggers = (patientId: string) => {
  const triggers: Record<string, string[]> = {
    'P-041': ['High Pollen', 'AQI Spike', 'Inhaler Overuse'],
    'P-012': ['Humidity Shift', 'Medication Gap'],
    'P-025': ['Dust Exposure', 'AQI Moderate'],
    'P-027': ['Seasonal Flare', 'Pollen Alert'],
    'P-033': ['Stable', 'Good Control'],
    'P-061': ['Mild Humidity'],
    'P-038': ['Pet Dander', 'Dust'],
    'P-008': ['Cold Air', 'Exercise'],
    'P-015': ['Pollen', 'Stable'],
  };
  return triggers[patientId] || ['No active triggers'];
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
              {/* Column 1: Identity */}
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
                    <div className="p-tag-id">{patient.id}</div>
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
                {/* Score mapping for demo: critical=70-95, watch=35-65, stable=5-30 */}
                {getRiskPill(patient.status, patient.status === 'critical' ? 78 : patient.status === 'watch' ? 47 : 12)}
              </td>

              {/* Column 4: AI Triggers */}
              <td>
                <div className="p-trigger-list">
                  {getTriggers(patient.id).map((t) => (
                    <span key={t} className="p-trigger-tag">{t}</span>
                  ))}
                </div>
              </td>

              {/* Column 5: Last Activity */}
              <td>
                <div className="p-activity">{patient.lastActive}</div>
              </td>

              {/* Column 6: Actions */}
              <td onClick={(e) => e.stopPropagation()}>
                <div className="p-actions">
                  <button className="btn-icon" onClick={() => onMessageClick(patient)} title="Message Patient">
                    <MessageSquare size={14} />
                  </button>
                  <button className="btn-icon" onClick={() => onPrescriptionClick(patient)} title="Update Prescription">
                    <FileEdit size={14} />
                  </button>
                  <button className="btn-table-primary" onClick={() => alert(`Sending AI advice to ${patient.name}...`)}>
                    <Send size={11} style={{ marginRight: '4px' }} />
                    SEND AI ADVICE
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