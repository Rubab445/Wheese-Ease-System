import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down';
  iconBg: string;
  iconColor: string;
  sparkPct?: number;
  sparkColor?: string;
}

export default function StatsCard({
  icon, label, value, change, changeType,
  iconBg, iconColor, sparkPct, sparkColor,
}: StatsCardProps) {
  return (
    <div className="stat-card" style={{ '--card-color': iconColor } as React.CSSProperties}>
      <div className="stat-card-top">
        <div className="stat-icon-wrap" style={{ background: iconBg }}>
          <span style={{ color: iconColor, display: 'flex' }}>{icon}</span>
        </div>
        <span className={`stat-change ${changeType}`}>
          {changeType === 'up'
            ? <TrendingUp size={11} />
            : <TrendingDown size={11} />}
          {change}
        </span>
      </div>

      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>

      {sparkPct !== undefined && (
        <div className="stat-sparkline">
          <div
            className="stat-sparkline-fill"
            style={{ width: `${sparkPct}%`, background: sparkColor || iconColor }}
          />
        </div>
      )}
    </div>
  );
}
