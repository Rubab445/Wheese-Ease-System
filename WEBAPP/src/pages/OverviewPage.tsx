import React from 'react';
import { PATIENTS, ALERTS, WEEK } from '../data/patients';
import { getRiskStats } from '../utils/helpers';
import StatsCard from '../components/Overview/StatsCard';
import PatientFeed from '../components/Overview/PatientFeed';
import WeekChart from '../components/Overview/WeekChart';
import RecentAlerts from '../components/Overview/RecentAlerts';

interface OverviewPageProps {
  onPatientSelect: (patientId: string) => void;
  onViewAllPatients: () => void;
  onViewAllAlerts: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ 
  onPatientSelect, 
  onViewAllPatients, 
  onViewAllAlerts 
}) => {
  const stats = getRiskStats(PATIENTS);

  return (
    <>
      <div className="stats-row">
        <StatsCard 
          icon="👥" value={stats.total} label="Total Patients" 
          sub="6 checked in today" colorClass="c-blue" delay={0} 
        />
        <StatsCard 
          icon="✅" value={stats.low} label="Low Risk" 
          sub="Safe today" colorClass="c-green" delay={0.06} 
        />
        <StatsCard 
          icon="⚠️" value={stats.mod} label="Moderate Risk" 
          sub="Monitor closely" colorClass="c-amber" delay={0.12} 
        />
        <StatsCard 
          icon="🚨" value={stats.high} label="High Risk" 
          sub="3 unread alerts" colorClass="c-red" delay={0.18} 
        />
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Patient Risk Feed</div>
            <button className="panel-link" onClick={onViewAllPatients}>View All →</button>
          </div>
          <PatientFeed patients={PATIENTS} onPatientClick={onPatientSelect} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">7-Day Risk Overview</div>
            </div>
            <div className="bar-chart">
              <WeekChart data={WEEK} />
              <div className="chart-legend">
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--green)' }}></div>Low</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--amber)' }}></div>Mod</div>
                <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--red)' }}></div>High</div>
              </div>
            </div>
          </div>

          <div className="panel" style={{ flex: 1 }}>
            <div className="panel-head">
              <div className="panel-title">Recent Alerts</div>
              <button className="panel-link" onClick={onViewAllAlerts}>See All →</button>
            </div>
            <RecentAlerts alerts={ALERTS} />
          </div>
        </div>
      </div>
    </>
  );
};
