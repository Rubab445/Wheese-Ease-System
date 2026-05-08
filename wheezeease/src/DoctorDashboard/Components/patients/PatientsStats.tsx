import React from 'react';
import { Users, Activity, ShieldAlert, AlertTriangle, TrendingUp } from 'lucide-react';

interface PatientStatsProps {
  totalPatients: number;
  activePatients: number;
  highRiskCount: number;
  moderateCount: number;
}

const PatientStats: React.FC<PatientStatsProps> = ({
  totalPatients,
  activePatients,
  highRiskCount,
  moderateCount,
}) => {
  return (
    <div className="patients-stats-row">
      <div className="p-stat-card">
        <div className="p-stat-head">
          <div className="p-stat-icon blue">
            <Users size={20} />
          </div>
          <div className="p-stat-trend up">
            <TrendingUp size={12} style={{ marginRight: '4px' }} />
            +2 this week
          </div>
        </div>
        <div className="p-stat-value">{totalPatients}</div>
        <div className="p-stat-label">Total Patients</div>
      </div>

      <div className="p-stat-card">
        <div className="p-stat-head">
          <div className="p-stat-icon green">
            <Activity size={20} />
          </div>
        </div>
        <div className="p-stat-value">{activePatients}</div>
        <div className="p-stat-label">Active (Logged symptoms in 24h)</div>
      </div>

      <div className="p-stat-card high-risk">
        <div className="p-stat-head">
          <div className="p-stat-icon red">
            <ShieldAlert size={20} />
          </div>
          <div className="p-stat-trend down" style={{ background: '#fef2f2', color: '#ef4444' }}>
            URGENT
          </div>
        </div>
        <div className="p-stat-value" style={{ color: '#991B1B' }}>{highRiskCount}</div>
        <div className="p-stat-label">High Intensity / Risk</div>
      </div>

      <div className="p-stat-card moderate-risk">
        <div className="p-stat-head">
          <div className="p-stat-icon amber">
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="p-stat-value" style={{ color: '#D97706' }}>{moderateCount}</div>
        <div className="p-stat-label">Moderate Intensity</div>
      </div>
    </div>
  );
};

export default PatientStats;