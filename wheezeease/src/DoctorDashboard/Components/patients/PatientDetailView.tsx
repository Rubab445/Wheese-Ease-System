import React from 'react';
import type { Patient } from '../../../types/patient.types';

interface PatientDetailViewProps {
  patient: Patient | null;
  onBack: () => void;
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

const PatientDetailView: React.FC<PatientDetailViewProps> = ({
  patient,
  onBack,
  onMessageClick,
  onPrescriptionClick,
}) => {
  if (!patient) return null;

  const riskColor =
    patient.risk.level === 'High'
      ? 'var(--red)'
      : patient.risk.level === 'Medium'
      ? 'var(--amber)'
      : 'var(--green)';

  return (
    <div className="detail-view">
      <button className="back-btn" onClick={onBack}>
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to Patients
      </button>

      <div className="detail-header">
        <div
          className="detail-avatar"
          style={{
            background: patient.avatarBg,
            color: patient.avatarColor,
          }}
        >
          {patient.initials}
        </div>
        <div className="detail-info">
          <div className="detail-name">{patient.name}</div>
          <div className="detail-meta">
            <span>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {patient.age} years · {patient.gender}
            </span>
            <span>{patient.id}</span>
            <span>{patient.condition}</span>
            <span>{getStatusBadge(patient.status)}</span>
            <span style={{ color: 'var(--text-secondary)' }}>
              Last active: {patient.lastActive}
            </span>
          </div>
          <div className="detail-tags">
            {patient.allergies.map((a: string, i: number) => (
              <span key={i} className="tag allergy">
                ⚠️ {a}
              </span>
            ))}
            {patient.triggers.map((t: string, i: number) => (
              <span key={i} className="tag trigger">
                ⚡ {t}
              </span>
            ))}
            <span className="tag condition">🩸 {patient.blood}</span>
          </div>
        </div>
        <div className="detail-actions">
          <button className="btn-outline blue" onClick={() => onMessageClick(patient)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Message
          </button>
          <button className="btn-outline green" onClick={() => onPrescriptionClick(patient)}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Update Prescription
          </button>
        </div>
      </div>

      <div className="detail-grid three">
        <div className="detail-card">
          <div className="detail-card-title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Personal Info
          </div>
          <div className="info-row">
            <span className="key">Phone</span>
            <span className="val">{patient.phone}</span>
          </div>
          <div className="info-row">
            <span className="key">Email</span>
            <span className="val" style={{ fontSize: '12px' }}>
              {patient.email}
            </span>
          </div>
          <div className="info-row">
            <span className="key">City</span>
            <span className="val">{patient.city}</span>
          </div>
          <div className="info-row">
            <span className="key">Blood Type</span>
            <span className="val">{patient.blood}</span>
          </div>
          <div className="info-row">
            <span className="key">Condition</span>
            <span className="val">{patient.condition}</span>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            Vitals
          </div>
          <div className="vital-grid">
            <div className="vital-item">
              <div className="vital-label">SpO₂</div>
              <div
                className="vital-value"
                style={{
                  color: parseInt(patient.vitals.spo2) < 95 ? 'var(--red)' : 'var(--green)',
                }}
              >
                {patient.vitals.spo2}
              </div>
            </div>
            <div className="vital-item">
              <div className="vital-label">Peak Flow</div>
              <div className="vital-value" style={{ fontSize: '14px' }}>
                {patient.vitals.peakFlow}
              </div>
            </div>
            <div className="vital-item">
              <div className="vital-label">Heart Rate</div>
              <div className="vital-value" style={{ fontSize: '15px' }}>
                {patient.vitals.heartRate}
              </div>
            </div>
            <div className="vital-item">
              <div className="vital-label">Temperature</div>
              <div className="vital-value" style={{ fontSize: '15px' }}>
                {patient.vitals.temp}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Risk Assessment
          </div>
          <div className="risk-section">
            <div className="risk-header">
              <span className="risk-label">Risk Score</span>
              <span className="risk-score" style={{ color: riskColor }}>
                {patient.risk.score}/100
              </span>
            </div>
            <div className="risk-meter">
              <div className="risk-fill" style={{ width: `${patient.risk.score}%`, background: riskColor }}></div>
            </div>
            <div className="risk-factors">
              {patient.risk.factors.map((f: string, i: number) => (
                <div key={i} className="risk-factor">
                  • {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <div className="detail-card-title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Recent Symptoms
          </div>
          <div className="symptom-list">
            {patient.symptoms.map((s: any, i: number) => (
              <div key={i} className="symptom-item">
                <div className="symptom-left">
                  <span className="symptom-icon">{s.icon}</span>
                  <div>
                    <div className="symptom-name">{s.name}</div>
                    <div className="symptom-time">{s.time}</div>
                  </div>
                </div>
                <div className="severity-section">
                  <div className="severity-percent">{s.severity}%</div>
                  <div className="severity-bar">
                    <div
                      className="severity-fill"
                      style={{
                        width: `${s.severity}%`,
                        background: s.severity > 70 ? 'var(--red)' : s.severity > 45 ? 'var(--amber)' : 'var(--green)',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-card">
          <div className="detail-card-title">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Current Medications
          </div>
          <div className="medication-list">
            {patient.medications.map((m: any, i: number) => (
              <div key={i} className="med-item">
                <div className="med-icon">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2l4 4-10.5 10.5-4-4L18 2z" />
                    <path d="M11.5 12.5L2 22" />
                  </svg>
                </div>
                <div className="med-info">
                  <div className="med-name">{m.name}</div>
                  <div className="med-dose">{m.dose}</div>
                </div>
                <span className="med-freq">{m.freq}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="detail-card ai-card">
        <div className="detail-card-title ai-title">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          AI Recommendations
        </div>
        <div className="ai-rec-list">
          {patient.ai.map((a: any, i: number) => (
            <div key={i} className="ai-rec-item">
              <div className={`ai-rec-icon ${a.type}`}>
                <span>{a.icon}</span>
              </div>
              <div className="ai-rec-content">
                <div className="ai-rec-title">{a.title}</div>
                <div className="ai-rec-desc">{a.desc}</div>
                <div className="ai-confidence">
                  AI Confidence: {a.conf}%
                  <div className="confidence-bar">
                    <div className="confidence-fill" style={{ width: `${a.conf}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card-title">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Visit History
        </div>
        <div className="history-list">
          {patient.history.map((h: any, i: number) => (
            <div key={i} className="history-item">
              <div className="history-dot"></div>
              <div className="history-date">{h.date}</div>
              <div className="history-content">
                <div className="history-title">{h.title}</div>
                <div className="history-note">{h.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;