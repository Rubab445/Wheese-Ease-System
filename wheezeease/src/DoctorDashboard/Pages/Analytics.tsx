import React, { useState } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}

const Analytics: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
    const [chartType, setChartType] = useState<'symptoms' | 'aqi' | 'both'>('both');

    // ========== MOCK DATA ==========
    
    const correlationData = [
        { day: 'Mon', symptoms: 3.2, aqi: 85, pollen: 45, patients: 12 },
        { day: 'Tue', symptoms: 3.8, aqi: 92, pollen: 52, patients: 14 },
        { day: 'Wed', symptoms: 4.5, aqi: 110, pollen: 68, patients: 18 },
        { day: 'Thu', symptoms: 5.2, aqi: 135, pollen: 82, patients: 22 },
        { day: 'Fri', symptoms: 6.1, aqi: 158, pollen: 91, patients: 28 },
        { day: 'Sat', symptoms: 5.8, aqi: 145, pollen: 85, patients: 24 },
        { day: 'Sun', symptoms: 4.2, aqi: 98, pollen: 58, patients: 16 },
    ];

    const aiPerformanceData = [
        { week: 'Week 1', accuracy: 88, predictions: 45, correct: 40 },
        { week: 'Week 2', accuracy: 91, predictions: 52, correct: 47 },
        { week: 'Week 3', accuracy: 93, predictions: 58, correct: 54 },
        { week: 'Week 4', accuracy: 94, predictions: 65, correct: 61 },
    ];

    const cityRiskData = [
        { city: 'Gujrat', critical: 8, warning: 4, stable: 2, total: 14 },
        { city: 'Lahore', critical: 6, warning: 5, stable: 3, total: 14 },
        { city: 'Sialkot', critical: 4, warning: 6, stable: 2, total: 12 },
        { city: 'Islamabad', critical: 2, warning: 4, stable: 6, total: 12 },
        { city: 'Rawalpindi', critical: 3, warning: 5, stable: 4, total: 12 },
    ];

    const triggerData = [
        { name: 'Pollen', value: 45, color: '#f59e0b', patients: 23 },
        { name: 'PM2.5', value: 28, color: '#ef4444', patients: 15 },
        { name: 'Dust', value: 15, color: '#8b5cf6', patients: 8 },
        { name: 'Cold Air', value: 8, color: '#06b6d4', patients: 4 },
        { name: 'Humidity', value: 4, color: '#10b981', patients: 2 },
    ];

    const adherenceData = [
        { week: 'Week 1', preventive: 68, rescue: 32 },
        { week: 'Week 2', preventive: 71, rescue: 29 },
        { week: 'Week 3', preventive: 74, rescue: 26 },
        { week: 'Week 4', preventive: 78, rescue: 22 },
    ];

    const forecastData = [
        { day: 'Mon', risk: 65, aqi: 95, pollen: 55 },
        { day: 'Tue', risk: 72, aqi: 110, pollen: 62 },
        { day: 'Wed', risk: 78, aqi: 125, pollen: 70 },
        { day: 'Thu', risk: 85, aqi: 145, pollen: 78 },
        { day: 'Fri', risk: 82, aqi: 138, pollen: 75 },
        { day: 'Sat', risk: 70, aqi: 105, pollen: 60 },
        { day: 'Sun', risk: 58, aqi: 88, pollen: 48 },
    ];

    const weeklyStats = {
        totalAlerts: 47,
        avgSymptoms: 4.7,
        highRiskDays: 3,
        mostAffectedCity: 'Gujrat'
    };

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

    const renderPieLabel = (entry: any) => {
        return `${entry.name}`;
    };

    return (
        <div className="analytics-page">
            {/* Header */}
            <div className="analytics-header">
                <div>
                    <h1><i className="fas fa-chart-line"></i> Health Analytics</h1>
                    <p>AI-powered insights, environmental correlation, and population health trends</p>
                </div>
                <div className="time-range-selector">
                    <button className={timeRange === '7d' ? 'active' : ''} onClick={() => setTimeRange('7d')}>7 Days</button>
                    <button className={timeRange === '30d' ? 'active' : ''} onClick={() => setTimeRange('30d')}>30 Days</button>
                    <button className={timeRange === '90d' ? 'active' : ''} onClick={() => setTimeRange('90d')}>90 Days</button>
                </div>
            </div>

            {/* Key Metrics Cards - Redesigned */}
            <div className="analytics-metrics-grid">
                <div className="analytics-metric-card">
                    <div className="metric-icon purple">
                        <i className="fas fa-brain"></i>
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">94%</span>
                        <span className="metric-label">AI Accuracy</span>
                        <span className="metric-trend up">↑ +2.3% vs last week</span>
                    </div>
                </div>
                <div className="analytics-metric-card">
                    <div className="metric-icon orange">
                        <i className="fas fa-chart-line"></i>
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">0.87</span>
                        <span className="metric-label">AQI-Symptom Correlation</span>
                        <span className="metric-trend up">Strong positive correlation</span>
                    </div>
                </div>
                <div className="analytics-metric-card">
                    <div className="metric-icon blue">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">92</span>
                        <span className="metric-label">Active Patients</span>
                        <span className="metric-trend up">↑ +12 this month</span>
                    </div>
                </div>
                <div className="analytics-metric-card">
                    <div className="metric-icon green">
                        <i className="fas fa-pills"></i>
                    </div>
                    <div className="metric-info">
                        <span className="metric-value">78%</span>
                        <span className="metric-label">Medication Adherence</span>
                        <span className="metric-trend up">↑ +5% improvement</span>
                    </div>
                </div>
            </div>

            {/* Correlation Chart - Main Chart */}
            <div className="analytics-chart-card">
                <div className="chart-header">
                    <div>
                        <h3>📈 Environmental vs Symptom Correlation</h3>
                        <p>How AQI and Pollen levels affect patient symptoms</p>
                    </div>
                    <div className="chart-type-toggle">
                        <button className={chartType === 'both' ? 'active' : ''} onClick={() => setChartType('both')}>Both</button>
                        <button className={chartType === 'symptoms' ? 'active' : ''} onClick={() => setChartType('symptoms')}>Symptoms Only</button>
                        <button className={chartType === 'aqi' ? 'active' : ''} onClick={() => setChartType('aqi')}>AQI Only</button>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={correlationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis yAxisId="left" stroke="#64748b" domain={[0, 10]} label={{ value: 'Symptom Severity', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#64748b" domain={[0, 200]} label={{ value: 'AQI / Pollen', angle: 90, position: 'insideRight', style: { fill: '#64748b', fontSize: 12 } }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        {(chartType === 'symptoms' || chartType === 'both') && (
                            <Line yAxisId="left" type="monotone" dataKey="symptoms" name="Symptom Severity" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED', r: 5 }} />
                        )}
                        {(chartType === 'aqi' || chartType === 'both') && (
                            <Line yAxisId="right" type="monotone" dataKey="aqi" name="AQI Level" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
                        )}
                        {(chartType === 'both') && (
                            <Line yAxisId="right" type="monotone" dataKey="pollen" name="Pollen Count" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
                        )}
                    </LineChart>
                </ResponsiveContainer>
                <div className="insight-note">
                    <i className="fas fa-chart-line"></i>
                    <strong>Key Insight:</strong> Symptom severity increases by 32% when AQI exceeds 130. Friday spike correlated with 7 emergency reports.
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="analytics-two-column">
                {/* AI Model Performance */}
                <div className="analytics-chart-card">
                    <h3>🤖 AI Model Performance</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={aiPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="week" stroke="#64748b" />
                            <YAxis stroke="#64748b" domain={[80, 100]} />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="accuracy" name="Accuracy (%)" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="chart-stats">
                        <div className="stat">
                            <span className="stat-value">{aiPerformanceData[aiPerformanceData.length - 1].accuracy}%</span>
                            <span className="stat-label">Current Accuracy</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">+6%</span>
                            <span className="stat-label">Improvement</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">{aiPerformanceData.reduce((sum, w) => sum + w.predictions, 0)}</span>
                            <span className="stat-label">Total Predictions</span>
                        </div>
                    </div>
                </div>

                {/* Risk Distribution by City */}
                <div className="analytics-chart-card">
                    <h3>📍 Risk Distribution by City</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={cityRiskData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis type="number" stroke="#64748b" />
                            <YAxis type="category" dataKey="city" stroke="#64748b" width={80} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0, 8, 8, 0]} />
                            <Bar dataKey="warning" name="Warning" stackId="a" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                            <Bar dataKey="stable" name="Stable" stackId="a" fill="#10b981" radius={[0, 8, 8, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Second Two Column Layout */}
            <div className="analytics-two-column">
                {/* Trigger Frequency */}
                <div className="analytics-chart-card">
                    <h3>🌾 Common Triggers Analysis</h3>
                    <div className="pie-container">
                        <ResponsiveContainer width="60%" height={220}>
                            <PieChart>
                                <Pie
                                    data={triggerData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={3}
                                    dataKey="value"
                                    label={renderPieLabel}
                                    labelLine={true}
                                >
                                    {triggerData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="trigger-legend">
                            {triggerData.map((trigger, idx) => (
                                <div key={idx} className="legend-item">
                                    <span className="legend-dot" style={{ background: trigger.color }}></span>
                                    <span className="legend-name">{trigger.name}</span>
                                    <span className="legend-value">{trigger.patients} patients</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Medication Adherence */}
                <div className="analytics-chart-card">
                    <h3>💊 Medication Adherence Trends</h3>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={adherenceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="week" stroke="#64748b" />
                            <YAxis stroke="#64748b" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="preventive" name="Preventer Usage" fill="#10b981" radius={[8, 8, 0, 0]} />
                            <Bar dataKey="rescue" name="Rescue Usage" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="insight-note small">
                        <i className="fas fa-chart-simple"></i>
                        <span>Preventer usage increased by 10% over 4 weeks - positive trend!</span>
                    </div>
                </div>
            </div>

            {/* 7-Day Risk Forecast */}
            <div className="analytics-chart-card">
                <div className="chart-header">
                    <div>
                        <h3>⚠️ 7-Day Risk Forecast</h3>
                        <p>AI-predicted risk levels based on environmental forecasts</p>
                    </div>
                    <div className="forecast-badge">
                        <i className="fas fa-cloud-sun-rain"></i> Updated daily
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={forecastData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day" stroke="#64748b" />
                        <YAxis stroke="#64748b" domain={[0, 100]} label={{ value: 'Risk Level (%)', angle: -90, position: 'insideLeft', style: { fill: '#64748b', fontSize: 12 } }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area type="monotone" dataKey="risk" name="Predicted Risk %" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                        <Line type="monotone" dataKey="aqi" name="AQI Forecast" stroke="#7C3AED" strokeDasharray="5 5" />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="forecast-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    <strong>High Risk Alert:</strong> Thursday shows 85% risk level. Consider broadcasting preventive alerts to patients in Gujrat and Lahore.
                </div>
            </div>

            {/* Weekly Summary Stats */}
            <div className="weekly-summary">
                <h3>📊 Weekly Summary</h3>
                <div className="summary-grid">
                    <div className="summary-item">
                        <i className="fas fa-bell"></i>
                        <div>
                            <span className="summary-value">{weeklyStats.totalAlerts}</span>
                            <span className="summary-label">Total Alerts Generated</span>
                        </div>
                    </div>
                    <div className="summary-item">
                        <i className="fas fa-chart-line"></i>
                        <div>
                            <span className="summary-value">{weeklyStats.avgSymptoms}</span>
                            <span className="summary-label">Avg Symptom Severity</span>
                        </div>
                    </div>
                    <div className="summary-item">
                        <i className="fas fa-calendar-exclamation"></i>
                        <div>
                            <span className="summary-value">{weeklyStats.highRiskDays}</span>
                            <span className="summary-label">High Risk Days</span>
                        </div>
                    </div>
                    <div className="summary-item">
                        <i className="fas fa-map-marker-alt"></i>
                        <div>
                            <span className="summary-value">{weeklyStats.mostAffectedCity}</span>
                            <span className="summary-label">Most Affected City</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;