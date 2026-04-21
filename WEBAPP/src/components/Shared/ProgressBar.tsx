import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  color: string;
  max?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, color, max = 100 }) => {
  const percentage = (value / max) * 100;
  return (
    <div className="progress-row">
      <div className="progress-label">
        <span>{label}</span>
        <span style={{ color }}>{value}</span>
      </div>
      <div className="progress-bg">
        <div className="progress-fill" style={{ width: `${percentage}%`, background: color }}></div>
      </div>
    </div>
  );
};

export default ProgressBar;