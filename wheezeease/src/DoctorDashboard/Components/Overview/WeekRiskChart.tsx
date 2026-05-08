import React from 'react';
import type{ WeekData } from '../../types/dashboard.types'

interface WeekRiskChartProps {
  data: WeekData[];
}

const WeekRiskChart: React.FC<WeekRiskChartProps> = ({ data }) => {
  const maxTotal = Math.max(...data.map(d => d.high + d.mod + d.low));
  const scale = 78 / maxTotal;

  return (
    <div className="week-risk-chart">
      <div className="bars">
        {data.map((item, idx) => {
          const isNow = idx === data.length - 1;
          return (
            <div key={item.day} className="bar-col">
              <div 
                className="bar-fill high-bar" 
                style={{ 
                  height: `${item.high * scale}px`,
                  background: isNow ? 'var(--red)' : 'rgba(232,68,90,0.6)'
                }}
              />
              <div 
                className="bar-fill mod-bar" 
                style={{ 
                  height: `${item.mod * scale}px`,
                  background: isNow ? 'var(--amber)' : 'rgba(245,166,35,0.6)'
                }}
              />
              <div 
                className="bar-fill low-bar" 
                style={{ 
                  height: `${item.low * scale}px`,
                  background: isNow ? 'var(--green)' : 'rgba(34,200,122,0.6)'
                }}
              />
              <div className={`bar-day ${isNow ? 'active' : ''}`}>
                {item.day}
              </div>
            </div>
          );
        })}
      </div>
      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--green)' }}></div>
          <span>Low</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--amber)' }}></div>
          <span>Mod</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: 'var(--red)' }}></div>
          <span>High</span>
        </div>
      </div>
    </div>
  );
};

export default WeekRiskChart;