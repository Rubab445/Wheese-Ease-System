import React from 'react';
import { Patient } from '../../data/patients';
import { riskClass, riskLabel, riskColor, trendArrow, trendClass } from '../../utils/helpers';

interface PatientFeedProps {
  patients: Patient[];
  onPatientClick: (patientId: string) => void;
}

const PatientFeed: React.FC<PatientFeedProps> = ({ patients, onPatientClick }) => {
  const sorted = [...patients].sort((a, b) => b.risk - a.risk);

  return (
    <>
      {sorted.map(p => (
        <div key={p.id} className="feed-row" onClick={() => onPatientClick(p.id)}>
          <div className="feed-av" style={{ background: p.color }}>{p.av}</div>
          <div>
            <div className="feed-name">{p.name}</div>
            <div className="feed-sub">{p.id} · {p.cond} · {p.age}y</div>
          </div>
          <div className={`risk-badge ${riskClass(p.risk)}`}>{riskLabel(p.risk)}</div>
          <div className="feed-risk" style={{ color: riskColor(p.risk) }}>
            {p.risk}%
            <span className={`trend ${trendClass(p.trend)}`}>{trendArrow(p.trend)}</span>
          </div>
        </div>
      ))}
    </>
  );
};

export default PatientFeed;