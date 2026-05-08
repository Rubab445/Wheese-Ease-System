import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  subLabel: string;
  color: 'blue' | 'green' | 'amber' | 'red';
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, subLabel, color, delay }) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'c-blue';
      case 'green': return 'c-green';
      case 'amber': return 'c-amber';
      case 'red': return 'c-red';
      default: return 'c-blue';
    }
  };

  return (
    <div className={`stat-card c-${color}`} style={{ animationDelay: `${delay}s` }}>
      <div className="stat-icon">{icon}</div>
      <div className={`stat-val ${getColorClass()}`}>{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-sub">{subLabel}</div>
    </div>
  );
};

export default StatCard;