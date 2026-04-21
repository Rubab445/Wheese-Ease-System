import React, { useState, useEffect } from 'react';
import { PATIENTS, ALERTS } from '../data/patients';
import { riskClass, riskLabel, riskColor, riskBg, trendArrow, trendClass } from '../utils/helpers';
import EmptyState from '../components/Shared/EmptyState';
import "../styles/admin-dashboard.css"
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
    
    // Calculate gauge values
    const arcLen = Math.PI * 75;
    const filled = (p.risk / 100) * arcLen;
    const offset = arcLen - filled;
    const angle = -180 + (p.risk / 100) * 180;
    const rad = angle * Math.PI / 180;
    const nx = 90 + 75 * Math.cos(rad);
    const ny = 90 + 75 * Math.sin(rad);
    
    // Symptom history data
    const symH = [3, 5, 3, 7, 6, 8, p.inhaler * 2.5];
    const symDays = ['M', 'T', 'W', 'T', 'F', 'S', 'T'];

    // AQI Recommendations based on patient's AQI
    const getAQIRecommendations = () => {
      if (p.aqi > 150) {
        return [
          '• Current air quality index (AQI) is CRITICAL',
          '• Air pollution alert level: EXTREMELY HIGH',
          '• Avoid all outdoor activity',
          '• Wear N95 mask if going outside',
          '• Use air purifier indoors',
          '• Keep windows closed',
          '• Emergency inhaler should be readily available'
        ];
      } else if (p.aqi > 100) {
        return [
          '• Current air quality index (AQI) is UNHEALTHY',
          '• Air pollution alert level: HIGH',
          '• Limit outdoor activity',
          '• Wear mask when outside',
          '• Keep windows closed',
          '• Monitor breathing symptoms closely'
        ];
      } else if (p.aqi > 50) {
        return [
          '• Current air quality index (AQI) is MODERATE',
          '• Air pollution alert level: MEDIUM',
          '• Sensitive individuals should limit outdoor activity',
          '• Consider wearing mask if sensitive'
        ];
      } else {
        return [
          '• Current air quality index (AQI) is GOOD',
          '• Air pollution alert level: LOW',
          '• Safe for outdoor activities',
          '• Regular breathing exercises recommended'
        ];
      }
    };

    const aqiRecommendations = getAQIRecommendations();

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeUp .35s ease', padding: '0 4px' }}>
        
        {/* Patient Header Card - Exactly as in design */}
        <div className="detail-header" style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginTop:'20px'
        }}>
          <div className="detail-av" style={{ 
            background: p.color, 
            width: '70px', 
            height: '70px', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            fontWeight: 800,
            color: '#fff'
          }}>{p.av}</div>
          <div style={{ flex: 1 }}>
            <div className="detail-name" style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 700 }}>{p.name}</div>
            <div className="detail-meta" style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '6px' }}>
              {p.id} · {p.gender === 'M' ? 'Male' : 'Female'} · {p.age} yrs · {p.cond}
            </div>
            <div className="detail-meta" style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px' }}>
              Medication: {p.med} · Last Visit: {p.lastVisit}
            </div>
            <div className="detail-btns" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                className="btn btn-blue" 
                onClick={() => onMessageFromDetail(p.id)}
                style={{ padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}
              >
                ✉️ Send Advice
              </button>
              <div className={`risk-badge ${rc}`} style={{ padding: '8px 16px', fontSize: '13px', fontWeight: 800 }}>
                {rl} Risk — {p.risk}%
              </div>
            </div>
          </div>
        </div>

        {/* Three Column Layout - Risk Score, Vitals, Recommendations */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          
          {/* SMS SCORE / Risk Score Panel */}
          <div className="gauge-panel" style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            textAlign: 'center',
            boxShadow: 'var(--shadow)'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>
              SMS SCORE
            </h4>
            <svg className="gauge-svg" viewBox="0 0 180 100" style={{ width: '160px', height: '90px', margin: '0 auto' }}>
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
            <div className="gauge-num" style={{ fontFamily: "'Fraunces', serif", fontSize: '42px', fontWeight: 800, marginTop: '8px', color: rcol }}>
              {p.risk}%
            </div>
            <div className="gauge-label" style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '4px' }}>
              COUNTRY-SM-LOCAL
            </div>
            <div className="gauge-status" style={{ 
              display: 'inline-block', 
              marginTop: '12px',
              padding: '6px 16px', 
              borderRadius: '20px', 
              fontSize: '12px', 
              fontWeight: 800,
              textTransform: 'uppercase',
              background: rbg,
              color: rcol
            }}>
              {rl.toUpperCase()}-RISK
            </div>
          </div>

          {/* VITAL & ENVIRONMENT Panel */}
          <div className="vitals-panel" style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            boxShadow: 'var(--shadow)'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>
              VITAL & ENVIRONMENT
            </h4>
            <div className="vitals-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="vital-item" style={{
                background: 'var(--bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div className="vital-lbl" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inhaler Today</div>
                <div className="vital-val" style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, marginTop: '6px', color: p.inhaler >= 3 ? 'var(--red)' : 'var(--green)' }}>
                  {p.inhaler}×
                </div>
              </div>
              <div className="vital-item" style={{
                background: 'var(--bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div className="vital-lbl" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AQI</div>
                <div className="vital-val" style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, marginTop: '6px', color: p.aqi > 150 ? 'var(--red)' : p.aqi > 100 ? 'var(--amber)' : 'var(--green)' }}>
                  {p.aqi}
                </div>
              </div>
              <div className="vital-item" style={{
                background: 'var(--bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div className="vital-lbl" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Pollen</div>
                <div className="vital-val" style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, marginTop: '6px', color: p.pollen === 'High' ? 'var(--red)' : p.pollen === 'Med' ? 'var(--amber)' : 'var(--green)' }}>
                  {p.pollen}
                </div>
              </div>
              <div className="vital-item" style={{
                background: 'var(--bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div className="vital-lbl" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Humidity</div>
                <div className="vital-val" style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, marginTop: '6px', color: 'var(--blue)' }}>
                  {p.humidity}%
                </div>
              </div>
              <div className="vital-item" style={{
                background: 'var(--bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div className="vital-lbl" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Temperature</div>
                <div className="vital-val" style={{ fontFamily: "'Fraunces', serif", fontSize: '20px', fontWeight: 700, marginTop: '6px', color: 'var(--amber)' }}>
                  {p.temp}°C
                </div>
              </div>
              <div className="vital-item" style={{
                background: 'var(--bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border)'
              }}>
                <div className="vital-lbl" style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Last Symptom</div>
                <div className="vital-val" style={{ fontFamily: "'Fraunces', serif", fontSize: '16px', fontWeight: 700, marginTop: '6px', color: 'var(--text)' }}>
                  {p.inhaler > 0 ? 'Wheeze' : 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* AQI RECOMMENDATIONS Panel */}
          <div className="rec-panel" style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            padding: '24px',
            boxShadow: 'var(--shadow)'
          }}>
            <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>
              AQI RECOMMENDATIONS
            </h4>
            <div className="rec-box" style={{
              background: rbg,
              border: `1px solid ${rcol}22`,
              borderRadius: '10px',
              padding: '16px',
              fontSize: '12px',
              lineHeight: '1.8'
            }}>
              {aqiRecommendations.map((rec, idx) => (
                <div key={idx} style={{ marginBottom: idx === aqiRecommendations.length - 1 ? 0 : '6px' }}>
                  {rec}
                </div>
              ))}
            </div>
            <div className="notes-box" style={{
              marginTop: '16px',
              background: 'var(--bg)',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '12px',
              color: 'var(--muted)',
              lineHeight: '1.6'
            }}>
              <strong style={{ color: 'var(--text)', display: 'block', marginBottom: '8px' }}>Doctor Notes:</strong>
              {p.notes}
            </div>
          </div>
        </div>

        {/* Symptom History Chart */}
        <div className="sym-panel" style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          boxShadow: 'var(--shadow)'
        }}>
          <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' }}>
            Symptom History — Last 7 Days
          </h4>
          <div className="sym-bars" style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '100px' }}>
            {symH.map((h, i) => (
              <div key={i} className="sym-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div className="sym-bar" style={{
                  height: `${Math.max(h * 8, 6)}px`,
                  width: '100%',
                  background: h > 14 ? 'var(--red)' : h > 8 ? 'var(--amber)' : 'var(--green)',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.5s ease'
                }}></div>
                <div className="sym-day" style={{ fontSize: '11px', color: 'var(--dim)', fontWeight: 600 }}>{symDays[i]}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--muted)' }}>
              <div className="legend-dot" style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--green)' }}></div>
              Mild
            </div>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--muted)' }}>
              <div className="legend-dot" style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--amber)' }}></div>
              Moderate
            </div>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--muted)' }}>
              <div className="legend-dot" style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--red)' }}></div>
              Severe
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '24px', height: '100%', minHeight: 'calc(100vh - 84px)' }} className='pateint-main-page'>
      {/* Sidebar - Patient List */}
      <div className="patient-sidebar" style={{ 
        display: 'flex', 
        position: 'relative', 
        width: '300px', 
        flexShrink: 0,
        background: 'var(--white)',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border)',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 100px)',
        overflow: 'hidden'
      }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="sidebar-head" style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text)', marginBottom: '12px' }}>
              All Patients <span style={{ color: 'var(--muted)', fontWeight: 600 }}>({filteredPatients.length})</span>
            </h3>
            <div className="search-box" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '10px 14px'
            }}>
              <span style={{ fontSize: '14px', color: 'var(--dim)' }}>🔍</span>
              <input 
                placeholder="Search name or ID…" 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: '13px',
                  color: 'var(--text)',
                  width: '100%'
                }}
              />
            </div>
          </div>
          
          <div className="filter-tabs" style={{
            display: 'flex',
            gap: '6px',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)'
          }}>
            <button 
              className={`ftab ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => setFilter('all')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                color: filter === 'all' ? 'var(--blue)' : 'var(--muted)',
                background: filter === 'all' ? 'var(--blue-bg)' : 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              All
            </button>
            <button 
              className={`ftab ${filter === 'high' ? 'active' : ''}`} 
              onClick={() => setFilter('high')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                color: filter === 'high' ? 'var(--blue)' : 'var(--muted)',
                background: filter === 'high' ? 'var(--blue-bg)' : 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              High
            </button>
            <button 
              className={`ftab ${filter === 'mod' ? 'active' : ''}`} 
              onClick={() => setFilter('mod')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                color: filter === 'mod' ? 'var(--blue)' : 'var(--muted)',
                background: filter === 'mod' ? 'var(--blue-bg)' : 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Mod
            </button>
            <button 
              className={`ftab ${filter === 'low' ? 'active' : ''}`} 
              onClick={() => setFilter('low')}
              style={{
                flex: 1,
                padding: '8px 6px',
                borderRadius: '8px',
                border: 'none',
                fontFamily: "'Nunito', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                color: filter === 'low' ? 'var(--blue)' : 'var(--muted)',
                background: filter === 'low' ? 'var(--blue-bg)' : 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Low
            </button>
          </div>
          
          <div className="patient-list" style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {filteredPatients.map(p => {
              const hasAlert = ALERTS.some(a => a.pid === p.id && !a.read);
              return (
                <div 
                  key={p.id} 
                  className={`pt-item ${selectedPatientId === p.id ? 'active' : ''}`} 
                  onClick={() => onPatientSelect(p.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--border)',
                    transition: 'background 0.14s',
                    background: selectedPatientId === p.id ? 'var(--blue-bg)' : 'transparent',
                    borderLeft: selectedPatientId === p.id ? `3px solid var(--blue)` : '3px solid transparent'
                  }}
                >
                  <div className="pt-avatar" style={{ 
                    background: p.color, 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: '#fff',
                    flexShrink: 0
                  }}>{p.av}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="pt-name" style={{ fontSize: '14px', fontWeight: 700 }}>{p.name}</div>
                    <div className="pt-cond" style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{p.cond} · {p.age}y</div>
                  </div>
                  {hasAlert && <div className="pt-alert-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)', animation: 'blink 1.5s infinite' }}></div>}
                  <div className={`risk-badge ${riskClass(p.risk)}`} style={{ 
                    marginLeft: 'auto',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: riskClass(p.risk) === 'high' ? 'var(--red-bg)' : riskClass(p.risk) === 'mod' ? 'var(--amber-bg)' : 'var(--green-bg)',
                    color: riskClass(p.risk) === 'high' ? 'var(--red)' : riskClass(p.risk) === 'mod' ? 'var(--amber)' : 'var(--green)'
                  }}>
                    {p.risk}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient Detail Area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }} className="pateint-detail-side">
        {renderPatientDetail()}
      </div>
    </div>
  );
};
