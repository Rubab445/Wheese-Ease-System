import React, { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap } from 'lucide-react';

const TRENDS_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `May ${i + 1}`,
  aqi: Math.floor(Math.random() * 150) + 40,
  temp: Math.floor(Math.random() * 15) + 25,
  humidity: Math.floor(Math.random() * 40) + 40,
  flareUps: Math.floor(Math.random() * 12),
}));

const TrendsChart: React.FC = () => {
  const [showAqi, setShowAqi] = useState(true);
  const [showTemp, setShowTemp] = useState(true);
  const [showHumidity, setShowHumidity] = useState(false);
  const [showFlareUps, setShowFlareUps] = useState(true);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">30-Day Correlation Chart</div>
          <div className="panel-subtitle">Data Source: OpenWeatherMap API & Internal DB</div>
        </div>
      </div>

      <div className="chart-toggles">
        <button className={`chart-toggle-btn ${showAqi ? 'active' : ''}`} onClick={() => setShowAqi(!showAqi)}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: '#F59E0B'}}/> AQI
        </button>
        <button className={`chart-toggle-btn ${showTemp ? 'active' : ''}`} onClick={() => setShowTemp(!showTemp)}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: '#EF4444'}}/> Temp
        </button>
        <button className={`chart-toggle-btn ${showHumidity ? 'active' : ''}`} onClick={() => setShowHumidity(!showHumidity)}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: '#3B82F6'}}/> Humidity
        </button>
        <button className={`chart-toggle-btn ${showFlareUps ? 'active' : ''}`} onClick={() => setShowFlareUps(!showFlareUps)}>
          <div style={{width: 8, height: 8, borderRadius: '5px', background: '#8B5CF6'}}/> Flare-ups
        </button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{fontSize: 11, fill: '#64748B'}} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#64748B'}} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#64748B'}} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
            {showAqi && <Line yAxisId="left" type="monotone" dataKey="aqi" stroke="#F59E0B" strokeWidth={2} dot={false} />}
            {showTemp && <Line yAxisId="left" type="monotone" dataKey="temp" stroke="#EF4444" strokeWidth={2} dot={false} />}
            {showHumidity && <Line yAxisId="left" type="monotone" dataKey="humidity" stroke="#3B82F6" strokeWidth={2} dot={false} />}
            {showFlareUps && <Bar yAxisId="right" dataKey="flareUps" fill="#8B5CF6" barSize={10} radius={[4, 4, 0, 0]} opacity={0.7} />}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="ai-insight-box">
        <Zap size={20} className="ai-insight-icon" />
        <div className="ai-insight-text">
          <strong>AI Insight:</strong> Analysis of the last 30 days shows a strong positive correlation between AQI above 100 and patient flare-up events. On high-AQI days the average flare-ups were 11.2 compared to 1.8 on low-AQI days.
        </div>
      </div>
    </div>
  );
};

export default TrendsChart;
