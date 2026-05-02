import { X, User, Mail, Phone, MapPin, Activity, Heart, Wind, AlertCircle, Calendar, Pill, TrendingDown } from 'lucide-react';
import '../Admin.module.css/PatientManagement.css'

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  riskLevel: 'Critical' | 'Guarded' | 'Stable';
  location: string;
  aqi: number;
  assignedDoctor: string;
  lastAttack: string;
  avatar: string;
  bloodType?: string;
  knownTriggers?: string[];
  medications?: string[];
  peakFlowData?: number[];
  medicalHistory?: string;
}

interface PatientHistoryDrawerProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
}

export default function PatientHistoryDrawer({ isOpen, patient, onClose }: PatientHistoryDrawerProps) {
  if (!isOpen || !patient) return null;

  const peakFlowData = patient.peakFlowData || [300, 310, 305, 295, 290, 280, 275];
  const maxPeakFlow = Math.max(...peakFlowData);
  const minPeakFlow = Math.min(...peakFlowData);

  const recentAttacks = [
    { date: patient.lastAttack, severity: 'Moderate', trigger: 'High AQI', location: patient.location },
    { date: '1 week ago', severity: 'Mild', trigger: 'Cold Weather', location: patient.location },
    { date: '2 weeks ago', severity: 'Severe', trigger: 'Smog Exposure', location: patient.location },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container patient-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Medical History & AI Risk Assessment</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {/* Patient Profile Header */}
          <div className="patient-history-header">
            <div className="patient-avatar-large">{patient.avatar}</div>
            <div className="patient-header-info">
              <h3 className="patient-profile-name">{patient.name}</h3>
              <p className="patient-profile-meta">
                {patient.age} years • {patient.gender} • {patient.id}
              </p>
              <span className={`risk-badge-large risk-${patient.riskLevel.toLowerCase()}`}>
                <AlertCircle size={16} />
                {patient.riskLevel} Risk
              </span>
            </div>
            <div className="ai-assessment-box">
              <Activity size={20} />
              <div>
                <span className="ai-label">AI Assessment</span>
                <span className="ai-value">Updated 5 min ago</span>
              </div>
            </div>
          </div>

          {/* Key Medical Info */}
          <div className="medical-info-grid">
            <div className="medical-info-card">
              <Mail size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Email</span>
                <span className="info-value">{patient.email}</span>
              </div>
            </div>

            <div className="medical-info-card">
              <Phone size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Phone</span>
                <span className="info-value">{patient.phone}</span>
              </div>
            </div>

            <div className="medical-info-card">
              <Heart size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Blood Type</span>
                <span className="info-value">{patient.bloodType || 'N/A'}</span>
              </div>
            </div>

            <div className="medical-info-card">
              <User size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Assigned Doctor</span>
                <span className="info-value">{patient.assignedDoctor}</span>
              </div>
            </div>

            <div className="medical-info-card full-width">
              <MapPin size={18} className="info-icon" />
              <div className="info-content">
                <span className="info-label">Current Location & AQI</span>
                <span className="info-value">
                  {patient.location} • AQI: {patient.aqi}
                </span>
              </div>
            </div>
          </div>

          {/* Peak Flow Trends */}
          <div className="history-section">
            <h4 className="section-title">
              <TrendingDown size={18} />
              Peak Flow Trends (Last 7 Days)
            </h4>
            <div className="peak-flow-chart">
              <div className="chart-container">
                {peakFlowData.map((value, index) => {
                  const percentage = ((value - minPeakFlow) / (maxPeakFlow - minPeakFlow)) * 100;
                  const isLow = value < 300;
                  return (
                    <div key={index} className="chart-bar-wrapper">
                      <div className="chart-value">{value}</div>
                      <div className="chart-bar-container">
                        <div
                          className={`chart-bar ${isLow ? 'low' : 'normal'}`}
                          style={{ height: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="chart-label">Day {index + 1}</div>
                    </div>
                  );
                })}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color normal"></div>
                  <span>Normal (&gt;300 L/min)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color low"></div>
                  <span>Critical (&lt;300 L/min)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Known Triggers */}
          <div className="history-section">
            <h4 className="section-title">
              <AlertCircle size={18} />
              Known Triggers
            </h4>
            <div className="triggers-grid">
              {(patient.knownTriggers || ['No triggers recorded']).map((trigger, index) => (
                <div key={index} className="trigger-card">
                  <Wind size={16} />
                  <span>{trigger}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Medication */}
          <div className="history-section">
            <h4 className="section-title">
              <Pill size={18} />
              Current Medication Plan
            </h4>
            <div className="medication-list">
              {(patient.medications || ['No medications prescribed']).map((med, index) => (
                <div key={index} className="medication-item">
                  <div className="medication-dot"></div>
                  <span className="medication-name">{med}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Attack History */}
          <div className="history-section">
            <h4 className="section-title">
              <Calendar size={18} />
              Recent Attack History
            </h4>
            <div className="attack-timeline">
              {recentAttacks.map((attack, index) => (
                <div key={index} className="attack-item">
                  <div className="attack-date">{attack.date}</div>
                  <div className="attack-details">
                    <span className={`severity-badge severity-${attack.severity.toLowerCase()}`}>
                      {attack.severity}
                    </span>
                    <span className="attack-trigger">Trigger: {attack.trigger}</span>
                    <span className="attack-location">{attack.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Medical History Notes */}
          <div className="history-section">
            <h4 className="section-title">Medical History Notes</h4>
            <div className="medical-notes">
              <p>{patient.medicalHistory || 'No medical history notes available.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
