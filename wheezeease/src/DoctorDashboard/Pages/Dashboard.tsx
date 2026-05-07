// DoctorDashboard.tsx - Updated with Patient View Modal & View All Modal
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, AlertTriangle, Activity, Wind, Clock, User, Phone, Mail, Heart, TrendingUp } from 'lucide-react';
import '../../styles/doctorDashboard.css'
import '../../styles/dashboard.css'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const RECENT_PREDICTIONS = [
  { id: 1, patient: "Matt Smith",    trigger: "PM2.5 Peak",       confidence: 98, risk: "High",   time: "2 min ago",  status: "critical", spo2: "88%", pf: "210", age: 34, contact: "+92 300 1234567", email: "matt.smith@email.com",   condition: "Severe Asthma",         patientId: "WE-2024-0034", lastVisit: "Dec 05, 2022" },
  { id: 2, patient: "Ayesha Khan",   trigger: "Pollen Level 4",   confidence: 82, risk: "Medium", time: "15 min ago", status: "warning",  spo2: "94%", pf: "295", age: 28, contact: "+92 321 9876543", email: "ayesha.k@email.com",     condition: "Mild Wheezing",         patientId: "WE-2024-0045", lastVisit: "Dec 06, 2022" },
  { id: 3, patient: "Salman Raza",   trigger: "Temperature Drop", confidence: 45, risk: "Low",    time: "1 hr ago",   status: "stable",   spo2: "97%", pf: "390", age: 45, contact: "+92 333 5556677", email: "salman.r@email.com",     condition: "Chronic Asthma",        patientId: "WE-2024-0056", lastVisit: "Dec 07, 2022" },
  { id: 4, patient: "Fatima Noor",   trigger: "Humidity Spike",   confidence: 76, risk: "Medium", time: "2 hr ago",   status: "warning",  spo2: "95%", pf: "310", age: 31, contact: "+92 312 4445566", email: "fatima.n@email.com",     condition: "Occupational Asthma",   patientId: "WE-2024-0067", lastVisit: "Dec 04, 2022" },
  { id: 5, patient: "Hassan Malik",  trigger: "Grass Pollen",     confidence: 91, risk: "High",   time: "3 hr ago",   status: "critical", spo2: "89%", pf: "245", age: 52, contact: "+92 345 7778899", email: "hassan.m@email.com",     condition: "Exercise-Induced",      patientId: "WE-2024-0078", lastVisit: "Dec 03, 2022" },
];

const CHART_DATA = [
  { month: 'Jan', aqi: 145, attacks: 32 },
  { month: 'Feb', aqi: 152, attacks: 38 },
  { month: 'Mar', aqi: 168, attacks: 45 },
  { month: 'Apr', aqi: 187, attacks: 52 },
  { month: 'May', aqi: 201, attacks: 58 },
  { month: 'Jun', aqi: 178, attacks: 48 },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Patient {
  id: number; patient: string; trigger: string; confidence: number;
  risk: string; time: string; status: string; spo2: string; pf: string;
  age: number; contact: string; email: string; condition: string;
  patientId: string; lastVisit: string;
}

// ─── Patient Detail Modal ─────────────────────────────────────────────────────
const PatientViewModal: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient, onClose }) => {
  const isCritical = patient.status === 'critical';
  const isWarning  = patient.status === 'warning';

  const statusColor = isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';
  const statusBg    = isCritical ? '#fef2f2' : isWarning ? '#fffbeb' : '#f0fdf4';

  return (
    <div className="doctor-modal-overlay-final" onClick={onClose}>
      <div className="doctor-modal-content-final doctor-patient-view-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="doctor-modal-header-final doctor-pv-header">
          <div className="doctor-pv-header-left">
            <div className="doctor-pv-avatar">{patient.patient.charAt(0)}{patient.patient.split(' ')[1]?.charAt(0)}</div>
            <div>
              <h3>{patient.patient}</h3>
              <span className="doctor-pv-id">{patient.patientId}</span>
            </div>
          </div>
          <div className="doctor-pv-header-right">
            <span className="doctor-pv-status-badge" style={{ color: statusColor, background: statusBg }}>
              {isCritical ? '🔴' : isWarning ? '🟡' : '🟢'} {patient.status.toUpperCase()}
            </span>
            <button className="doctor-modal-close-final" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Body */}
        <div className="doctor-modal-body-final doctor-pv-body">
          {/* Alert banner for critical */}
          {isCritical && (
            <div className="doctor-pv-alert-banner">
              <AlertTriangle size={16} />
              <span>Critical alert — immediate attention required. Trigger: <strong>{patient.trigger}</strong></span>
            </div>
          )}

          {/* Vitals row */}
          <div className="doctor-pv-vitals-row">
            <div className="doctor-pv-vital-card">
              <div className="doctor-pv-vital-icon" style={{ background: '#fef2f2' }}><Heart size={18} color="#ef4444" /></div>
              <div>
                <div className="doctor-pv-vital-label">SpO₂</div>
                <div className="doctor-pv-vital-value" style={{ color: (patient.spo2 === '88%' || patient.spo2 === '89%') ? '#ef4444' : '#0f172a' }}>
                  {patient.spo2}
                </div>
              </div>
            </div>
            <div className="doctor-pv-vital-card">
              <div className="doctor-pv-vital-icon" style={{ background: '#f0fdf4' }}><Activity size={18} color="#22c55e" /></div>
              <div>
                <div className="doctor-pv-vital-label">Peak Flow</div>
                <div className="doctor-pv-vital-value">{patient.pf} L/min</div>
              </div>
            </div>
            <div className="doctor-pv-vital-card">
              <div className="doctor-pv-vital-icon" style={{ background: '#fef3c7' }}><TrendingUp size={18} color="#f59e0b" /></div>
              <div>
                <div className="doctor-pv-vital-label">AI Confidence</div>
                <div className="doctor-pv-vital-value">{patient.confidence}%</div>
              </div>
            </div>
            <div className="doctor-pv-vital-card">
              <div className="doctor-pv-vital-icon" style={{ background: '#eff6ff' }}><Wind size={18} color="#3b82f6" /></div>
              <div>
                <div className="doctor-pv-vital-label">Trigger</div>
                <div className="doctor-pv-vital-value doctor-pv-trigger-val">{patient.trigger}</div>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="doctor-pv-info-grid">
            <div className="doctor-pv-info-section">
              <h4 className="doctor-pv-section-title">Patient Details</h4>
              <div className="doctor-pv-info-row"><User size={14} /><span className="doctor-pv-info-label">Age</span><span>{patient.age} years</span></div>
              <div className="doctor-pv-info-row"><Phone size={14} /><span className="doctor-pv-info-label">Contact</span><span>{patient.contact}</span></div>
              <div className="doctor-pv-info-row"><Mail size={14} /><span className="doctor-pv-info-label">Email</span><span>{patient.email}</span></div>
              <div className="doctor-pv-info-row"><Clock size={14} /><span className="doctor-pv-info-label">Last Visit</span><span>{patient.lastVisit}</span></div>
            </div>
            <div className="doctor-pv-info-section">
              <h4 className="doctor-pv-section-title">Medical Info</h4>
              <div className="doctor-pv-info-row"><Activity size={14} /><span className="doctor-pv-info-label">Condition</span><span>{patient.condition}</span></div>
              <div className="doctor-pv-info-row">
                <span className="doctor-pv-risk-indicator" style={{ background: statusBg, color: statusColor }}>
                  Risk Level: <strong>{patient.risk}</strong>
                </span>
              </div>
              {/* Confidence bar */}
              <div className="doctor-pv-conf-section">
                <div className="doctor-pv-conf-label">
                  <span>AI Prediction Confidence</span>
                  <span style={{ fontWeight: 700 }}>{patient.confidence}%</span>
                </div>
                <div className="doctor-pv-conf-track">
                  <div className="doctor-pv-conf-fill" style={{
                    width: `${patient.confidence}%`,
                    background: patient.confidence > 80 ? '#ef4444' : patient.confidence > 60 ? '#f59e0b' : '#22c55e'
                  }} />
                </div>
              </div>
              <div className="doctor-pv-last-alert">
                <Clock size={12} /> Alert triggered <strong>{patient.time}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="doctor-modal-footer-final">
          <button className="doctor-btn-cancel-final" onClick={onClose}>Close</button>
          <button className="doctor-btn-save-final">📝 Write Prescription</button>
        </div>
      </div>
    </div>
  );
};

// ─── View All Patients Modal ──────────────────────────────────────────────────
const ViewAllModal: React.FC<{ patients: Patient[]; onClose: () => void; onViewPatient: (p: Patient) => void }> = ({ patients, onClose, onViewPatient }) => {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('All');

  const filtered = patients.filter(p => {
    const matchSearch = p.patient.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'All' || p.risk === filterRisk;
    return matchSearch && matchRisk;
  });

  return (
    <div className="doctor-modal-overlay-final" onClick={onClose}>
      <div className="doctor-modal-content-final doctor-view-all-modal" onClick={e => e.stopPropagation()}>
        <div className="doctor-modal-header-final">
          <h3>📋 All AI Prediction Alerts</h3>
          <button className="doctor-modal-close-final" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Filters */}
        <div className="doctor-va-filters">
          <input
            className="doctor-va-search"
            placeholder="Search patient or condition..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="doctor-va-risk-filters">
            {['All', 'High', 'Medium', 'Low'].map(r => (
              <button
                key={r}
                className={`doctor-va-filter-btn ${filterRisk === r ? 'active' : ''}`}
                onClick={() => setFilterRisk(r)}
              >{r}</button>
            ))}
          </div>
        </div>

        <div className="doctor-modal-body-final doctor-va-body">
          <div className="doctor-va-count">{filtered.length} patient{filtered.length !== 1 ? 's' : ''} found</div>
          {filtered.length === 0 ? (
            <div className="doctor-va-empty">No patients match your search.</div>
          ) : (
            filtered.map(p => {
              const isCrit = p.status === 'critical';
              const isWarn = p.status === 'warning';
              const sc = isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#22c55e';
              const sb = isCrit ? '#fef2f2' : isWarn ? '#fffbeb' : '#f0fdf4';
              return (
                <div key={p.id} className={`doctor-va-patient-row doctor-va-row-${p.status}`}>
                  <div className="doctor-va-avatar">{p.patient.charAt(0)}{p.patient.split(' ')[1]?.charAt(0)}</div>
                  <div className="doctor-va-info">
                    <div className="doctor-va-name">{p.patient}</div>
                    <div className="doctor-va-meta">{p.patientId} &bull; {p.condition}</div>
                  </div>
                  <div className="doctor-va-vitals">
                    <span className="doctor-va-vital">SpO₂ <strong style={{ color: (p.spo2 === '88%' || p.spo2 === '89%') ? '#ef4444' : '#0f172a' }}>{p.spo2}</strong></span>
                    <span className="doctor-va-vital">PF <strong>{p.pf}</strong></span>
                  </div>
                  <span className="doctor-va-risk-badge" style={{ color: sc, background: sb }}>{p.risk}</span>
                  <span className="doctor-va-time"><Clock size={11} /> {p.time}</span>
                  <button className="doctor-view-patient-btn" onClick={() => { onViewPatient(p); }}>View</button>
                </div>
              );
            })
          )}
        </div>

        <div className="doctor-modal-footer-final">
          <button className="doctor-btn-cancel-final" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [showAddPatientModal,   setShowAddPatientModal]   = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [viewedPatient,         setViewedPatient]         = useState<Patient | null>(null);
  const [showViewAllModal,      setShowViewAllModal]       = useState(false);
  const [selectedPatient,       setSelectedPatient]       = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '', age: '', dob: '', contact: '', email: '', condition: '', severity: 'stable', spo2: '', peakFlow: ''
  });

  const patientsList = RECENT_PREDICTIONS;

  // Open single patient view
  const openPatientView = (patient: Patient) => {
    setShowViewAllModal(false);
    setViewedPatient(patient);
  };

  const handleAddPatient = () => {
    if (!formData.name || !formData.age || !formData.contact) { alert('Please fill required fields'); return; }
    alert(`Patient ${formData.name} added successfully!`);
    setShowAddPatientModal(false);
    setFormData({ name: '', age: '', dob: '', contact: '', email: '', condition: '', severity: 'stable', spo2: '', peakFlow: '' });
  };

  const handleProceedToPrescription = () => {
    if (!selectedPatient) { alert('Please select a patient'); return; }
    navigate(`/prescriptions?patient=${selectedPatient.id}`);
    setShowPrescriptionModal(false);
  };

  return (
    <div className="doctor-dashboard-final">

      {/* ── Bold Welcome Header ── */}
      <div className="doctor-welcome-header-final">
        <div className="doctor-welcome-text-block">
          <h1 className="doctor-welcome-bold-title">Welcome Doctor!</h1>
          <p className="doctor-welcome-subtitle">Here's what's happening with your patients today.</p>
        </div>
        <div className="doctor-welcome-date-badge">
          <span className="doctor-welcome-date-day">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
          <span className="doctor-welcome-date-full">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>


      {/* ── 3 Action Cards ── */}
      <div className="doctor-action-cards-final">
        <div className="doctor-action-card-final" onClick={() => navigate('/analytics')}>
          <div className="doctor-action-icon-final">📊</div>
          <div className="doctor-action-details-final">
            <h4>View Reports & Analytics</h4>
            <p>AI insights & health analytics</p>
            <div className="doctor-action-meta-final">
              <span>📈 42 new patients</span>
              <span>↑ 12% this month</span>
            </div>
          </div>
          <div className="doctor-action-arrow-final">→</div>
        </div>

        <div className="doctor-action-card-final" onClick={() => setShowAddPatientModal(true)}>
          <div className="doctor-action-icon-final">👤</div>
          <div className="doctor-action-details-final">
            <h4>Add New Patient</h4>
            <p>Register patient profile</p>
            <div className="doctor-action-meta-final">
              <span>👥 Total: 284</span>
              <span>🆕 +42 this month</span>
            </div>
          </div>
          <div className="doctor-action-arrow-final">→</div>
        </div>

        <div className="doctor-action-card-final" onClick={() => setShowPrescriptionModal(true)}>
          <div className="doctor-action-icon-final">💊</div>
          <div className="doctor-action-details-final">
            <h4>Update Prescription</h4>
            <p>Modify patient medications</p>
            <div className="doctor-action-meta-final">
              <span>💊 34 active</span>
              <span>⚠️ 12 due for refill</span>
            </div>
          </div>
          <div className="doctor-action-arrow-final">→</div>
        </div>
      </div>

      {/* ── Chart Section ── */}
      <div className="doctor-chart-section-final">
        <div className="doctor-chart-header-final">
          <h3>📈 AQI vs Asthma Attacks Correlation</h3>
          <div className="doctor-chart-legend-final">
            <span><span className="doctor-legend-dot aqi"></span>AQI Index</span>
            <span><span className="doctor-legend-dot attacks"></span>Asthma Attacks</span>
          </div>
        </div>
        <div className="doctor-chart-container-final">
          <svg viewBox="0 0 700 200" className="doctor-correlation-svg">
            <defs>
              <linearGradient id="aqiGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="attackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 50, 100, 150, 200].map((y, i) => (
              <line key={i} x1="40" y1={y} x2="680" y2={y} stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="4,4" />
            ))}
            {CHART_DATA.map((d, i) => (
              <text key={i} x={60 + i * 100} y="196" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Inter">{d.month}</text>
            ))}
            {/* AQI area fill */}
            <polygon
              points={[
                ...CHART_DATA.map((d, i) => `${60 + i * 100},${180 - (d.aqi / 250) * 160}`),
                `${60 + (CHART_DATA.length - 1) * 100},180`, `60,180`
              ].join(' ')}
              fill="url(#aqiGrad)"
            />
            {/* Attack area fill */}
            <polygon
              points={[
                ...CHART_DATA.map((d, i) => `${60 + i * 100},${180 - (d.attacks / 70) * 160}`),
                `${60 + (CHART_DATA.length - 1) * 100},180`, `60,180`
              ].join(' ')}
              fill="url(#attackGrad)"
            />
            {/* AQI Line */}
            <polyline
              points={CHART_DATA.map((d, i) => `${60 + i * 100},${180 - (d.aqi / 250) * 160}`).join(' ')}
              fill="none" stroke="#f59e0b" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Attacks Line */}
            <polyline
              points={CHART_DATA.map((d, i) => `${60 + i * 100},${180 - (d.attacks / 70) * 160}`).join(' ')}
              fill="none" stroke="#ef4444" strokeWidth="2.8" strokeDasharray="6,4" strokeLinecap="round" strokeLinejoin="round"
            />
            {/* Data dots */}
            {CHART_DATA.map((d, i) => (
              <g key={i}>
                <circle cx={60 + i * 100} cy={180 - (d.aqi / 250) * 160} r="4" fill="#f59e0b" stroke="white" strokeWidth="2" />
                <circle cx={60 + i * 100} cy={180 - (d.attacks / 70) * 160} r="4" fill="#ef4444" stroke="white" strokeWidth="2" />
              </g>
            ))}
            {/* Tooltip bubble on peak */}
            <g>
              <rect x="268" y="36" width="130" height="24" rx="12" fill="#0f172a" />
              <text x="333" y="52" textAnchor="middle" fontSize="10" fill="white" fontFamily="Inter" fontWeight="600">5 insurance patients</text>
            </g>
          </svg>
        </div>
        <div className="doctor-chart-insight-final">
          <span className="doctor-insight-badge">⚠️ High Correlation Detected</span>
          <p>AQI increase strongly correlates with asthma attacks (+38% risk when AQI &gt; 150)</p>
        </div>
      </div>

      {/* ── Predictions Table ── */}
      <div className="doctor-predictions-table-final">
        <div className="doctor-table-header-final">
          <h3>📋 Recent AI Predictions & Alerts</h3>
          {/* View All — opens modal */}
          <button className="doctor-view-all-final" onClick={() => setShowViewAllModal(true)}>View All</button>
        </div>
        <div className="doctor-table-wrapper-final">
          <table className="doctor-predictions-data-table">
            <thead>
              <tr>
                <th>Patient</th><th>Trigger</th><th>Confidence</th><th>Risk Level</th>
                <th>SpO₂</th><th>Peak Flow</th><th>Time</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PREDICTIONS.map(pred => (
                <tr key={pred.id} className={`doctor-pred-row-${pred.status}`}>
                  <td className="doctor-patient-cell">{pred.patient}</td>
                  <td>{pred.trigger}</td>
                  <td>
                    <div className="doctor-conf-bar">
                      <div className="doctor-conf-fill" style={{
                        width: `${pred.confidence}%`,
                        background: pred.confidence > 80 ? '#ef4444' : pred.confidence > 60 ? '#f59e0b' : '#10b981'
                      }} />
                      <span>{pred.confidence}%</span>
                    </div>
                  </td>
                  <td><span className={`doctor-risk-badge-${pred.risk.toLowerCase()}`}>{pred.risk}</span></td>
                  <td className={pred.spo2 === '88%' || pred.spo2 === '89%' ? 'doctor-critical-value' : ''}>{pred.spo2}</td>
                  <td>{pred.pf} L/min</td>
                  <td className="doctor-time-cell">{pred.time}</td>
                  <td>
                    {/* View — opens patient detail modal, no navigation */}
                    <button className="doctor-view-patient-btn" onClick={() => setViewedPatient(pred)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Patient Detail View Modal ── */}
      {viewedPatient && (
        <PatientViewModal patient={viewedPatient} onClose={() => setViewedPatient(null)} />
      )}

      {/* ── View All Modal ── */}
      {showViewAllModal && (
        <ViewAllModal
          patients={RECENT_PREDICTIONS}
          onClose={() => setShowViewAllModal(false)}
          onViewPatient={openPatientView}
        />
      )}

      {/* ── Add Patient Modal ── */}
      {showAddPatientModal && (
        <div className="doctor-modal-overlay-final" onClick={() => setShowAddPatientModal(false)}>
          <div className="doctor-modal-content-final" onClick={e => e.stopPropagation()}>
            <div className="doctor-modal-header-final">
              <h3>➕ Add New Patient</h3>
              <button className="doctor-modal-close-final" onClick={() => setShowAddPatientModal(false)}><X size={16} /></button>
            </div>
            <div className="doctor-modal-body-final">
              <div className="doctor-form-row-final">
                <div className="doctor-form-group-final full"><label>Full Name *</label><input type="text" placeholder="Enter patient name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /></div>
              </div>
              <div className="doctor-form-row-final">
                <div className="doctor-form-group-final"><label>Age *</label><input type="number" placeholder="Age" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} /></div>
                <div className="doctor-form-group-final"><label>DOB</label><input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} /></div>
              </div>
              <div className="doctor-form-row-final">
                <div className="doctor-form-group-final"><label>Contact *</label><input type="tel" placeholder="+92 XXX XXXXXXX" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} /></div>
                <div className="doctor-form-group-final"><label>Email</label><input type="email" placeholder="patient@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
              </div>
              <div className="doctor-form-row-final">
                <div className="doctor-form-group-final"><label>Condition</label><input type="text" placeholder="Primary condition" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} /></div>
                <div className="doctor-form-group-final"><label>Severity</label>
                  <select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                    <option value="stable">Stable</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className="doctor-form-row-final">
                <div className="doctor-form-group-final"><label>SpO₂ (%)</label><input type="text" placeholder="e.g., 95%" value={formData.spo2} onChange={e => setFormData({...formData, spo2: e.target.value})} /></div>
                <div className="doctor-form-group-final"><label>Peak Flow</label><input type="text" placeholder="e.g., 350" value={formData.peakFlow} onChange={e => setFormData({...formData, peakFlow: e.target.value})} /></div>
              </div>
            </div>
            <div className="doctor-modal-footer-final">
              <button className="doctor-btn-cancel-final" onClick={() => setShowAddPatientModal(false)}>Cancel</button>
              <button className="doctor-btn-save-final" onClick={handleAddPatient}>Save Patient</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Prescription Patient Selection Modal ── */}
      {showPrescriptionModal && (
        <div className="doctor-modal-overlay-final" onClick={() => setShowPrescriptionModal(false)}>
          <div className="doctor-modal-content-final small" onClick={e => e.stopPropagation()}>
            <div className="doctor-modal-header-final">
              <h3>📝 Select Patient</h3>
              <button className="doctor-modal-close-final" onClick={() => setShowPrescriptionModal(false)}><X size={16} /></button>
            </div>
            <div className="doctor-modal-body-final">
              <div className="doctor-patient-list-final">
                {patientsList.map(patient => (
                  <div key={patient.id} className={`doctor-patient-item-final ${selectedPatient?.id === patient.id ? 'selected' : ''}`} onClick={() => setSelectedPatient(patient)}>
                    <div className="doctor-patient-avatar-final">{patient.patient.charAt(0)}{patient.patient.split(' ')[1]?.charAt(0)}</div>
                    <div className="doctor-patient-info-final">
                      <div className="doctor-patient-name-final">{patient.patient}</div>
                      <div className="doctor-patient-id-final">{patient.patientId} • {patient.condition}</div>
                    </div>
                    {selectedPatient?.id === patient.id && <div className="doctor-check-mark">✓</div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="doctor-modal-footer-final">
              <button className="doctor-btn-cancel-final" onClick={() => setShowPrescriptionModal(false)}>Cancel</button>
              <button className="doctor-btn-save-final" onClick={handleProceedToPrescription}>Continue to Prescription →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;