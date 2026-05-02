import React from 'react';

interface GaugeProps {
  accuracy: number;
  f1: number;
  latency: string;
}

const AccuracyGauges: React.FC<GaugeProps> = ({ accuracy, f1, latency }) => {
  const metrics = [
    { label: 'Model Accuracy', value: `${accuracy}%`, color: 'var(--violet-glow)' },
    { label: 'F1 Score', value: f1, color: 'var(--turquoise)' },
    { label: 'API Latency', value: latency, color: '#f59e0b' }
  ];

  return (
    <div className="gauge-grid">
      {metrics.map((m, i) => (
        <div key={i} className="gauge-card">
          <p className="gauge-label">{m.label}</p>
          <h2 className="gauge-value" style={{ color: m.color }}>{m.value}</h2>
          <div className="mini-progress-bg">
            <div className="mini-progress-fill" style={{ width: '70%', backgroundColor: m.color }}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccuracyGauges;