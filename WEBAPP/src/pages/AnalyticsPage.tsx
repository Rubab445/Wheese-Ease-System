import React from 'react';
import { PATIENTS, WEEK } from '../data/patients';
import { getRiskStats } from '../utils/helpers';
import StatsCard from '../components/Overview/StatsCard';
import ProgressBar from '../components/Shared/ProgressBar';
import WeekChart from '../components/Overview/WeekChart';

export const AnalyticsPage: React.FC = () => {
  const stats = getRiskStats(PATIENTS);
  const highs = [4, 3, 5, 6, 5, 7, 2];

  const conditions = {
    'Asthma': 4,
    'Seasonal Allergy': 2,
    'COPD + Allergy': 2,
    'Dust Allergy': 1,
  };

  const triggers = {
    'High AQI (>150)': { count: 4, color: 'var(--red)' },
    'High Pollen': { count: 5, color: 'var(--amber)' },
    'High Humidity': { count: 3, color: 'var(--blue)' },
    'Inhaler Overuse': { count: 2, color: 'var(--red)' },
  };

  return (
    <>
      <div className="stats-row">
        <StatsCard icon="📊" value={47} label="Avg Risk Score" sub="Across all patients" colorClass="c-blue" delay={0} />
        <StatsCard icon="⬆️" value={22} label="High Risk Rate" sub="2 of 9 patients" colorClass="c-red" delay={0.06} />
        <StatsCard icon="📉" value={8} label="vs Last Week" sub="Improving trend" colorClass="c-green" delay={0.12} />
        <StatsCard icon="💨" value={27} label="Inhaler Uses" sub="Total this week" colorClass="c-amber" delay={0.18} />
      </div>

      <div className="analytics-grid">
        <div className="panel">
          <div className="panel-head"><div className="panel-title">Risk Distribution</div></div>
          <div style={{ padding: '18px 20px' }}>
            <ProgressBar label="Low Risk" value={stats.low} color="var(--green)" max={stats.total} />
            <ProgressBar label="Moderate Risk" value={stats.mod} color="var(--amber)" max={stats.total} />
            <ProgressBar label="High Risk" value={stats.high} color="var(--red)" max={stats.total} />
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Top Triggers This Week</div></div>
          <div style={{ padding: '18px 20px' }}>
            {Object.entries(triggers).map(([name, data]) => (
              <ProgressBar key={name} label={name} value={data.count} color={data.color} max={9} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">Condition Breakdown</div></div>
          <div style={{ padding: '18px 20px' }}>
            {Object.entries(conditions).map(([name, count]) => (
              <ProgressBar key={name} label={name} value={count} color="var(--blue)" max={stats.total} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head"><div className="panel-title">High-Risk Count Per Day</div></div>
          <div className="bar-chart">
            <div className="bars">
              {WEEK.map((d, i) => (
                <div key={d.day} className="bar-col">
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--red)', marginBottom: '3px' }}>{highs[i]}</div>
                  <div className="bar-fill" style={{
                    height: `${(highs[i] / 8) * 72}px`,
                    background: 'var(--red)',
                    opacity: i === 6 ? 1 : 0.65,
                    boxShadow: i === 6 ? '0 0 10px rgba(232,68,90,0.3)' : 'none'
                  }}></div>
                  <div className="bar-day" style={i === 6 ? { color: 'var(--blue)', fontWeight: '900' } : {}}>{d.day}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};