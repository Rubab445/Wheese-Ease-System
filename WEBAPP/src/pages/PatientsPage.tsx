import React, { useState } from 'react';
import { PATIENTS, ALERTS } from '../data/patients';
import { riskClass, riskLabel, riskColor, riskBg } from '../utils/helpers';
import EmptyState from '../components/Shared/EmptyState';

interface PatientsPageProps {
  selectedPatientId: string | null;
  onPatientSelect: (patientId: string) => void;
  onMessageFromDetail: (patientId: string) => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({ 
  selectedPatientId, 
  onPatientSelect, 
  onMessageFromDetail 
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'mod' | 'low'>('all');
  const [search, setSearch] = useState('');

  const filteredPatients = PATIENTS.filter(p => {
    const matchFilter = filter === 'all' || riskClass(p.risk) === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search) || p.id.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });

  const selectedPatient = selectedPatientId ? PATIENTS.find(p => p.id === selectedPatientId) : PATIENTS[0];

  const renderPatientDetail = () => {
    if (!selectedPatient) return <EmptyState icon="👤" message="Select a patient from the list to view their details" />;

    const p = selectedPatient;
    const rcol = riskColor(p.risk);
    const rbg = riskBg(p.risk);
    const rl = riskLabel(p.risk);
    const rc = riskClass(p.risk);
    
    const arcLen = Math.PI * 75;
    const filled = (p.risk / 100) * arcLen;
    const offset = arcLen - filled;
    const angle = -180 + (p.risk / 100) * 180;
    const rad = angle * Math.PI / 180;
    const nx = 90 + 75 * Math.cos(rad);
    const ny = 90 + 75 * Math.sin(rad);

    return (
      <div className="patient-detail-container">
        {/* Patient Header Card */}
        <div className="patient-header-card">
          <div className="patient-header-content">
            <div className="patient-avatar-large" style={{ background: p.color }}>
              {p.av}
            </div>
            <div className="patient-info">
              <h2 className="patient-name">{p.name}</h2>
              <p className="patient-meta">
                {p.id} · {p.gender === 'M' ? 'Male' : 'Female'} · {p.age} yrs · {p.cond}
              </p>
              <p className="patient-meta">
                Medication: {p.med} · Last Visit: {p.lastVisit}
              </p>
              <div className="patient-actions">
                <button className="btn-send-advice" onClick={() => onMessageFromDetail(p.id)}>
                  ✉️ Send Advice
                </button>
                <div className={`risk-badge ${rc}`}>
                  {rl} Risk — {p.risk}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - 2 columns */}
        <div className="patient-stats-grid">
          {/* SMS SCORE Card */}
          <div className="stat-card-clean">
            <h4 className="stat-title">SMS SCORE</h4>
            <svg className="gauge-svg" viewBox="0 0 180 100">
              <defs>
                <linearGradient id="grd" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--green)"/>
                  <stop offset="45%" stopColor="var(--amber)"/>
                  <stop offset="100%" stopColor="var(--red)"/>
                </linearGradient>
              </defs>
              <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="var(--border)" strokeWidth="12" strokeLinecap="round"/>
              <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="url(#grd)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${arcLen}`} strokeDashoffset={`${offset}`}/>
              <line x1="90" y1="90" x2={nx} y2={ny} stroke={rcol} strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="90" cy="90" r="5" fill={rcol}/>
              <text x="12" y="100" fontSize="9" fill="var(--dim)" fontFamily="Nunito">0</text>
              <text x="157" y="100" fontSize="9" fill="var(--dim)" fontFamily="Nunito">100</text>
            </svg>
            <div className="gauge-value" style={{ color: rcol }}>{p.risk}%</div>
            <div className="gauge-subtitle">COUNTRY-SM-LOCAL</div>
            <div className="gauge-status-label" style={{ background: rbg, color: rcol }}>
              {rl.toUpperCase()}-RISK
            </div>
          </div>

          {/* VITALS Card */}
          <div className="stat-card-clean">
            <h4 className="stat-title">VITAL & ENVIRONMENT</h4>
            <div className="vitals-grid-clean">
              <div className="vital-item-clean">
                <span className="vital-label">INHALER TODAY</span>
                <span className="vital-value" style={{ color: p.inhaler >= 3 ? 'var(--red)' : 'var(--green)' }}>
                  {p.inhaler}×
                </span>
              </div>
              <div className="vital-item-clean">
                <span className="vital-label">AQI</span>
                <span className="vital-value" style={{ color: p.aqi > 150 ? 'var(--red)' : p.aqi > 100 ? 'var(--amber)' : 'var(--green)' }}>
                  {p.aqi}
                </span>
              </div>
              <div className="vital-item-clean">
                <span className="vital-label">POLLEN</span>
                <span className="vital-value" style={{ color: p.pollen === 'High' ? 'var(--red)' : p.pollen === 'Med' ? 'var(--amber)' : 'var(--green)' }}>
                  {p.pollen}
                </span>
              </div>
              <div className="vital-item-clean">
                <span className="vital-label">HUMIDITY</span>
                <span className="vital-value" style={{ color: 'var(--blue)' }}>{p.humidity}%</span>
              </div>
              <div className="vital-item-clean">
                <span className="vital-label">TEMPERATURE</span>
                <span className="vital-value" style={{ color: 'var(--amber)' }}>{p.temp}°C</span>
              </div>
              <div className="vital-item-clean">
                <span className="vital-label">LAST SYMPTOM</span>
                <span className="vital-value" style={{ color: 'var(--text)' }}>{p.inhaler > 0 ? 'Wheeze' : 'None'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AQI Recommendations Card */}
        <div className="recommendation-card">
          <h4 className="stat-title">AQI RECOMMENDATIONS</h4>
          <div className="recommendation-content" style={{ background: rbg, borderColor: `${rcol}22` }}>
            {p.aqi > 150 ? (
              <>
                <div>• Current air quality index (AQI) is CRITICAL</div>
                <div>• Air pollution alert level: EXTREMELY HIGH</div>
                <div>• Avoid all outdoor activity</div>
                <div>• Wear N95 mask if going outside</div>
                <div>• Use air purifier indoors</div>
                <div>• Keep windows closed</div>
                <div>• Emergency inhaler should be readily available</div>
              </>
            ) : p.aqi > 100 ? (
              <>
                <div>• Current air quality index (AQI) is UNHEALTHY</div>
                <div>• Air pollution alert level: HIGH</div>
                <div>• Limit outdoor activity</div>
                <div>• Wear mask when outside</div>
                <div>• Keep windows closed</div>
                <div>• Monitor breathing symptoms closely</div>
              </>
            ) : p.aqi > 50 ? (
              <>
                <div>• Current air quality index (AQI) is MODERATE</div>
                <div>• Air pollution alert level: MEDIUM</div>
                <div>• Sensitive individuals should limit outdoor activity</div>
                <div>• Consider wearing mask if sensitive</div>
              </>
            ) : (
              <>
                <div>• Current air quality index (AQI) is GOOD</div>
                <div>• Air pollution alert level: LOW</div>
                <div>• Safe for outdoor activities</div>
                <div>• Regular breathing exercises recommended</div>
              </>
            )}
          </div>
          <div className="doctor-notes">
            <strong>Doctor Notes:</strong>
            <p>{p.notes}</p>
          </div>
        </div>

        {/* Symptom History Chart */}
        <div className="symptom-chart-card">
          <h4 className="stat-title">Symptom History — Last 7 Days</h4>
          <div className="symptom-bars">
            {[3, 5, 3, 7, 6, 8, p.inhaler * 2.5].map((h, i) => (
              <div key={i} className="symptom-bar-col">
                <div className="symptom-bar-fill" style={{
                  height: `${Math.max(h * 8, 6)}px`,
                  background: h > 14 ? 'var(--red)' : h > 8 ? 'var(--amber)' : 'var(--green)'
                }}></div>
                <div className="symptom-bar-day">{['M', 'T', 'W', 'T', 'F', 'S', 'T'][i]}</div>
              </div>
            ))}
          </div>
          <div className="symptom-legend">
            <div className="legend-dot-green"></div>
            <span>Mild</span>
            <div className="legend-dot-amber"></div>
            <span>Moderate</span>
            <div className="legend-dot-red"></div>
            <span>Severe</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="patients-layout">
      {/* Patient Detail Area - LEFT side (Content first) */}
      <div className="patient-detail-side">
        {renderPatientDetail()}
      </div>

      {/* Sidebar - Patient List - RIGHT side */}
      <div className="patient-list-sidebar">
        <div className="sidebar-head">
          <h3>All Patients <span>({filteredPatients.length})</span></h3>
          <div className="search-box">
            <span>🔍</span>
            <input 
              placeholder="Search name or ID…" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-tabs">
          <button className={`ftab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`ftab ${filter === 'high' ? 'active' : ''}`} onClick={() => setFilter('high')}>High</button>
          <button className={`ftab ${filter === 'mod' ? 'active' : ''}`} onClick={() => setFilter('mod')}>Mod</button>
          <button className={`ftab ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>Low</button>
        </div>
        
        <div className="patient-list">
          {filteredPatients.map(p => {
            const hasAlert = ALERTS.some(a => a.pid === p.id && !a.read);
            return (
              <div 
                key={p.id} 
                className={`pt-item ${selectedPatientId === p.id ? 'active' : ''}`} 
                onClick={() => onPatientSelect(p.id)}
              >
                <div className="pt-avatar" style={{ background: p.color }}>{p.av}</div>
                <div className="pt-info">
                  <div className="pt-name">{p.name}</div>
                  <div className="pt-cond">{p.cond} · {p.age}y</div>
                </div>
                {hasAlert && <div className="pt-alert-dot"></div>}
                <div className={`risk-badge-small ${riskClass(p.risk)}`}>
                  {p.risk}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;