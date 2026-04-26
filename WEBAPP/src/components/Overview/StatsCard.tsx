import React from 'react';

interface StatsCardProps {
  icon: string;
  value: number;
  label: string;
  sub: string;
  colorClass: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, value, label, sub, colorClass, delay = 0 }) => (
  <div className={`stat-card ${colorClass}`} style={{ animationDelay: `${delay}s` }}>
    <div className="stat-icon">{icon}</div>
    <div className={`stat-val ${colorClass}`}>{value}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-sub">{sub}</div>
  </div>
);

export default StatsCard;