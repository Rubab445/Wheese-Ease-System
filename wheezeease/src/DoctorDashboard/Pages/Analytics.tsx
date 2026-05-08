import React, { useState } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { BrainCircuit, Activity, Wind, CloudFog, Droplets, Thermometer, Gauge, AlertTriangle, ShieldAlert, BarChart3, TrendingUp, Info } from 'lucide-react';
import '../../styles/analytics.css';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
}

const Analytics: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [chartType, setChartType] = useState<'symptoms' | 'aqi' | 'both'>('both');

    // ========== MOCK DATA ==========
    const correlationData = [
        { day: 'Mon', symptoms: 3.2, aqi: 85, pollen: 45 },
        { day: 'Tue', symptoms: 3.8, aqi: 92, pollen: 52 },
        { day: 'Wed', symptoms: 4.5, aqi: 110, pollen: 68 },
        { day: 'Thu', symptoms: 5.2, aqi: 135, pollen: 82 },
        { day: 'Fri', symptoms: 6.1, aqi: 158, pollen: 91 },
        { day: 'Sat', symptoms: 5.8, aqi: 145, pollen: 85 },
        { day: 'Sun', symptoms: 4.2, aqi: 98, pollen: 58 },
    ];

    const cityRiskData = [
        { city: 'Gujrat', critical: 8, warning: 4, stable: 2 },
        { city: 'Lahore', critical: 6, warning: 5, stable: 3 },
        { city: 'Sialkot', critical: 4, warning: 6, stable: 2 },
        { city: 'Islamabad', critical: 2, warning: 4, stable: 6 },
        { city: 'Rawalpindi', critical: 3, warning: 5, stable: 4 },
    ];

    const triggerData = [
        { name: 'Pollen', value: 45, color: '#D97706', patients: 23 },
        { name: 'PM2.5', value: 28, color: '#991B1B', patients: 15 },
        { name: 'Dust', value: 15, color: '#4F46E5', patients: 8 },
        { name: 'Humidity', value: 8, color: '#0D9488', patients: 4 },
    ];

    const forecastData = [
        { day: 'Mon', risk: 65, aqi: 95 },
        { day: 'Tue', risk: 72, aqi: 110 },
        { day: 'Wed', risk: 78, aqi: 125 },
        { day: 'Thu', risk: 85, aqi: 145 },
        { day: 'Fri', risk: 82, aqi: 138 },
        { day: 'Sat', risk: 70, aqi: 105 },
        { day: 'Sun', risk: 58, aqi: 88 },
    ];

    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">{label}</p>
                    {payload.map((p, idx) => (
                        <p key={idx} className="tooltip-value" style={{ color: p.color }}>
                            {p.name}: {p.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="analytics-page">
            {/* ── Header ── */}
            <div className="analytics-header">
                <div>
                    <h1 style={{ fontWeight: 900 }}>Health Analytics</h1>
                </div>
                <div className="time-range-selector">
                    <button className={timeRange === '7d' ? 'active' : ''} onClick={() => setTimeRange('7d')}>7 Days</button>
                    <button className={timeRange === '30d' ? 'active' : ''} onClick={() => setTimeRange('30d')}>30 Days</button>
                    <button className={timeRange === '90d' ? 'active' : ''} onClick={() => setTimeRange('90d')}>90 Days</button>
                </div>
            </div>

            {/* ── Top Metric Cards ── */}
            <div className="analytics-metrics-grid">
                <div className="analytics-metric-card lined-purple">
                    <div className="metric-icon purple">
                        <Activity size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">94.2%</span>
                        <span className="metric-label">AI Prediction Accuracy</span>
                    </div>
                </div>
                <div className="analytics-metric-card lined-orange">
                    <div className="metric-icon orange">
                        <TrendingUp size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">0.87</span>
                        <span className="metric-label">Environmental Correlation</span>
                    </div>
                </div>
                <div className="analytics-metric-card lined-blue">
                    <div className="metric-icon blue">
                        <Wind size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">158</span>
                        <span className="metric-label">Peak AQI This Week</span>
                    </div>
                </div>
                <div className="analytics-metric-card lined-green">
                    <div className="metric-icon green">
                        <Droplets size={24} />
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">78%</span>
                        <span className="metric-label">Medication Adherence</span>
                    </div>
                </div>
            </div>

            {/* ── AI Insight Header (System Generated Box) ── */}
            <div className="ai-insight-box">
                <div className="ai-insight-icon">
                    <BrainCircuit size={24} />
                </div>
                <div className="ai-insight-content">
                    <h4>TOP AI INSIGHT OF THE WEEK</h4>
                    <p>AI detected a 22% correlation between humidity spikes in Gujrat and inhaler usage among asthma patients this week. Early warning alerts successfully prevented 7 potential emergency admissions.</p>
                </div>
            </div>

            {/* ── Main Environmental vs Symptom Correlation ── */}
            <div className="analytics-chart-card">
                <div className="chart-header">
                    <div>
                        <h3>Environmental vs Symptom Correlation</h3>
                        <p>Dashed lines represent environmental factors, solid lines represent clinical symptoms.</p>
                    </div>
                    <div className="chart-type-toggle">
                        <button className={chartType === 'both' ? 'active' : ''} onClick={() => setChartType('both')}>Dual View</button>
                        <button className={chartType === 'symptoms' ? 'active' : ''} onClick={() => setChartType('symptoms')}>Symptoms</button>
                        <button className={chartType === 'aqi' ? 'active' : ''} onClick={() => setChartType('aqi')}>Environment</button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={correlationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} dy={8} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" align="right" iconSize={10} />
                        {(chartType === 'symptoms' || chartType === 'both') && (
                            <Line yAxisId="left" type="monotone" dataKey="symptoms" name="Symptoms" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 3, fill: '#4F46E5' }} activeDot={{ r: 5 }} />
                        )}
                        {(chartType === 'aqi' || chartType === 'both') && (
                            <Line yAxisId="right" type="monotone" dataKey="aqi" name="AQI" stroke="#991B1B" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                        )}
                        {(chartType === 'both') && (
                            <Line yAxisId="right" type="monotone" dataKey="pollen" name="Pollen" stroke="#D97706" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ── Two Column Layout ── */}
            <div className="analytics-two-column">
                {/* Risk Distribution by City - Stacked Bars */}
                <div className="analytics-chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Risk Distribution by City</h3>
                            <p>Active crisis zones by severity.</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={cityRiskData} layout="vertical" margin={{ left: -10, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                            <XAxis type="number" axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="city" axisLine={false} tickLine={false} width={70} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Legend verticalAlign="top" align="right" iconSize={10} />
                            <Bar dataKey="critical" name="Critical" stackId="a" fill="#991B1B" />
                            <Bar dataKey="warning" name="Moderate" stackId="a" fill="#D97706" />
                            <Bar dataKey="stable" name="Stable" stackId="a" fill="#0D9488" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* AI Performance Tracking */}
                <div className="analytics-chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>AI Insight Reliability</h3>
                            <p>Predicted risk vs actual reports.</p>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={forecastData} margin={{ left: -20, right: 10 }}>
                            <defs>
                                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="risk" name="Accuracy" stroke="#4F46E5" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ── Forecast Banner ── */}
            <div className="analytics-chart-card" style={{ borderLeft: '3px solid #991B1B' }}>
                <div className="chart-header">
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ShieldAlert size={16} color="#991B1B" />
                            7-Day Predictive Risk Forecast
                        </h3>
                        <p>Projected risk escalation based on weather forecasts.</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={forecastData} margin={{ left: -20, right: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" align="right" iconSize={10} />
                        <Line type="stepAfter" dataKey="risk" name="Predicted Risk %" stroke="#991B1B" strokeWidth={2.5} dot={{ r: 3, fill: '#991B1B' }} />
                        <Line type="monotone" dataKey="aqi" name="AQI Projected" stroke="#4F46E5" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
                <div className="forecast-warning">
                    <AlertTriangle size={18} />
                    <span><strong>Action Required:</strong> AI predicts an 85% risk spike on Thursday. Preventive alerts recommended for patients in high-density Gujrat clusters.</span>
                </div>
            </div>
        </div>
    );
};

export default Analytics;