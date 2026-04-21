// src/pages/Overview.tsx
import React from 'react';
import { Patient } from "../../data/patients";
import "../../styles/dashboard.css"

interface OverviewProps {
  patients: Patient[];
  weekData: any[];
  riskCounts: { high: number; mod: number; low: number };
  onViewPatient: (id: string) => void;
  onShowToast: (msg: string) => void;
  onNavChange: (nav: string) => void;
}

export const OverviewPanel: React.FC<OverviewProps> = ({
  patients,
  weekData,
  riskCounts,
  onViewPatient,
  onShowToast,
  onNavChange,
}) => {
  const alerts = [
    { type: "high", msg: "Risk jumped to 78% — possible attack imminent", patient: "Sara Ahmed", time: "4 min ago" },
    { type: "inhaler", msg: "4th inhaler use detected today — overuse risk", patient: "Sara Ahmed", time: "9 min ago" },
    { type: "aqi", msg: "AQI exceeded 150 — active trigger zone", patient: "Mohammad Khan", time: "22 min ago" },
    { type: "mod", msg: "Risk rising to 63% — chest tightness reported", patient: "Bilal Chaudhry", time: "1h ago" },
    { type: "high", msg: "Wheezing reported — risk escalating", patient: "Fatima Noor", time: "2h ago" },
  ];

  const getRiskType = (r: number) => (r >= 61 ? "High" : r >= 31 ? "Moderate" : "Low");
  const getRiskColor = (r: number) => (r >= 61 ? "#e8445a" : r >= 31 ? "#f5a623" : "#22c87a");
  const getTrend = (t: string) => {
    if (t === "up") return { symbol: "↑", color: "#e8445a" };
    if (t === "down") return { symbol: "↓", color: "#22c87a" };
    return { symbol: "→", color: "#f5a623" };
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'high': return '🚨';
      case 'inhaler': return '💨';
      case 'aqi': return '☁️';
      default: return '⚠️';
    }
  };

  return (
    <div className="overview-container">
      <div className="overview-inner">
        {/* TOP STAT CARDS */}
        <div className="stat-cards-grid">
          <div className="stat-card">
            <div className="stat-card-bar" style={{ background: '#3a8eff' }}></div>
            <div className="stat-icon-custom">👥</div>
            <div className="stat-card-value" style={{ color: '#3a8eff' }}>{patients.length}</div>
            <div className="stat-card-label">Total Patients</div>
            <div className="stat-card-sub">{patients.length - 3} checked in today</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-bar" style={{ background: '#22c87a' }}></div>
            <div className="stat-icon-custom">✅</div>
            <div className="stat-card-value" style={{ color: '#22c87a' }}>{riskCounts.low}</div>
            <div className="stat-card-label">Low Risk</div>
            <div className="stat-card-sub">Safe today</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-bar" style={{ background: '#f5a623' }}></div>
            <div className="stat-icon-custom">⚠️</div>
            <div className="stat-card-value" style={{ color: '#f5a623' }}>{riskCounts.mod}</div>
            <div className="stat-card-label">Moderate Risk</div>
            <div className="stat-card-sub">Monitor closely</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-bar" style={{ background: '#e8445a' }}></div>
            <div className="stat-icon-custom">🚨</div>
            <div className="stat-card-value" style={{ color: '#e8445a' }}>{riskCounts.high}</div>
            <div className="stat-card-label">High Risk</div>
            <div className="stat-card-sub">{riskCounts.high - 1} unread alerts</div>
          </div>
        </div>

        <div className="patient-panel-layout">
          {/* PATIENT FEED */}
          <div className="patient-feed-card">
            <div className="patient-feed-header">
              <span className="patient-feed-title">Patient Risk Feed</span>
              <span className="patient-feed-view-all" onClick={() => onNavChange('patients')}>View All →</span>
            </div>
            {patients.map((p) => {
              const color = getRiskColor(p.risk);
              const type = getRiskType(p.risk);
              const trend = getTrend(p.trend);
              return (
                <div key={p.id} onClick={() => onViewPatient(p.id)} className="patient-feed-item">
                  <div className="patient-feed-avatar" style={{ background: p.color || "#eee" }}>
                    {p.av}
                  </div>
                  <div className="patient-feed-info">
                    <div className="patient-feed-name">{p.name}</div>
                    <div className="patient-feed-details">{p.id} • {p.cond} • {p.age}y</div>
                  </div>
                  <div className="patient-feed-risk">
                    <span className={`risk-badge risk-${type.toLowerCase()}`}>{type}</span>
                    <div className="risk-percentage" style={{ color }}>
                      {p.risk}% <span style={{ color: trend.color }}>{trend.symbol}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="sidebar-stats">
            {/* STACKED BAR CHART */}
            <div className="chart-card">
              <div className="chart-title">7-Day Risk Overview</div>
              <div className="chart-bars-container">
                {weekData.map((d, i) => (
                  <div key={i} className="chart-bar-column">
                    <div className="chart-bars-stacked">
                      <div className="chart-bar-low" style={{ height: `${d.low || 0}%` }} />
                      <div className="chart-bar-mod" style={{ height: `${d.mod || 0}%` }} />
                      <div className="chart-bar-high" style={{ height: `${d.high || 0}%` }} />
                    </div>
                    <span className="chart-day-label">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-dot legend-low"></div>
                  <span>Low</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-mod"></div>
                  <span>Mod</span>
                </div>
                <div className="legend-item">
                  <div className="legend-dot legend-high"></div>
                  <span>High</span>
                </div>
              </div>
            </div>

            {/* ALERTS SECTION */}
            <div className="alerts-card">
              <div className="alerts-header">
                Recent Alerts
                <span className="alerts-view-all" onClick={() => onNavChange('alerts')}>See All →</span>
              </div>
              {alerts.map((alt, idx) => (
                <div key={idx} className="alert-item">
                  <div className="alert-content">
                    <span className="alert-icon">{getAlertIcon(alt.type)}</span>
                    <div className="alert-message">{alt.msg}</div>
                    <span className="alert-time">{alt.time}</span>
                  </div>
                  <div className="alert-patient">{alt.patient}</div>
                  <div className="alert-dot" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};