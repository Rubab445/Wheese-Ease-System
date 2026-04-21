import React from 'react';
import { WeekData } from '../../data/patients';

interface WeekChartProps {
  data: WeekData[];
}

const WeekChart: React.FC<WeekChartProps> = ({ data }) => {
  const max = Math.max(...data.map(d => d.high + d.mod + d.low));
  const scale = 78 / max;

  return (
    <div className="bars">
      {data.map((d, i) => {
        const isNow = i === data.length - 1;
        return (
          <div key={d.day} className="bar-col">
            <div 
              className="bar-fill" 
              style={{ 
                height: `${d.high * scale}px`, 
                background: isNow ? 'var(--red)' : 'rgba(232,68,90,0.6)' 
              }}
            ></div>
            <div 
              className="bar-fill" 
              style={{ 
                height: `${d.mod * scale}px`, 
                background: isNow ? 'var(--amber)' : 'rgba(245,166,35,0.6)' 
              }}
            ></div>
            <div 
              className="bar-fill" 
              style={{ 
                height: `${d.low * scale}px`, 
                background: isNow ? 'var(--green)' : 'rgba(34,200,122,0.6)' 
              }}
            ></div>
            <div className="bar-day" style={isNow ? { color: 'var(--blue)', fontWeight: '900' } : {}}>
              {d.day}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekChart;