// AIPerformanceMetrics.tsx
// Component 2 — AI Monitoring Module | WheezeEase
// Live stats: predictions, accuracy, alerts, confidence, risk distribution

import React, { useState, useEffect } from "react";
import '../../Admin.module.css/AIMonitoring.css'

import { Database, Calendar, Target, Percent, Bell, AlertTriangle } from 'lucide-react';

interface Stats {
  totalPredictions: number;
  todayPredictions: number;
  accuracy: number;
  avgConfidence: number;
  alertsSent: number;
  falseAlerts: number;
  highRisk: number;
  medRisk: number;
  lowRisk: number;
}

interface MetricCard {
  label: string;
  value: string | number;
  sub: string;
  color: string;
  icon: React.ReactNode;
}

interface RiskSegment {
  label: string;
  count: number;
  color: string;
}

interface AIPerformanceMetricsProps {
  /** Currently active model id — used for display only */
  activeModel: string;
}

// ─── Component ────────────────────────────────────────────────

const AIPerformanceMetrics: React.FC<AIPerformanceMetricsProps> = () => {
  const [stats, setStats] = useState<Stats>({
    totalPredictions: 1482,
    todayPredictions: 37,
    accuracy: 91.4,
    avgConfidence: 78.2,
    alertsSent: 214,
    falseAlerts: 18,
    highRisk: 43,
    medRisk: 201,
    lowRisk: 1238,
  });

  const [animating, setAnimating] = useState<boolean>(false);

  // Simulate live stats update every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);

      const updateTimer = setTimeout(() => {
        setStats((prev) => ({
          ...prev,
          totalPredictions:
            prev.totalPredictions + Math.floor(Math.random() * 3),
          todayPredictions:
            prev.todayPredictions + (Math.random() > 0.6 ? 1 : 0),
          avgConfidence: parseFloat(
            (prev.avgConfidence + (Math.random() - 0.5) * 0.4).toFixed(1)
          ),
          highRisk: prev.highRisk + (Math.random() > 0.8 ? 1 : 0),
        }));
        setAnimating(false);
      }, 300);

      return () => clearTimeout(updateTimer);
    }, 8000);

      return () => clearInterval(interval);
  }, []);

  // Derived values
  const falseRate: string = (
    (stats.falseAlerts / stats.alertsSent) *
    100
  ).toFixed(1);

  const metricCards: MetricCard[] = [
    {
      label: "Total Predictions",
      value: stats.totalPredictions.toLocaleString(),
      sub: "All time",
      color: "#3B82F6", // blue-500
      icon: <Database size={20} />,
    },
    {
      label: "Today",
      value: stats.todayPredictions,
      sub: "predictions today",
      color: "#10B981", // emerald-500
      icon: <Calendar size={20} />,
    },
    {
      label: "Model Accuracy",
      value: `${stats.accuracy}%`,
      sub: "on validation set",
      color: "#8B5CF6", // violet-500
      icon: <Target size={20} />,
    },
    {
      label: "Avg Confidence",
      value: `${stats.avgConfidence}%`,
      sub: "prediction confidence",
      color: "#F59E0B", // amber-500
      icon: <Percent size={20} />,
    },
    {
      label: "Alerts Sent",
      value: stats.alertsSent,
      sub: `${falseRate}% false rate`,
      color: "#EF4444", // red-500
      icon: <Bell size={20} />,
    },
    {
      label: "High Risk Cases",
      value: stats.highRisk,
      sub: "flagged patients",
      color: "#DC2626", // red-600
      icon: <AlertTriangle size={20} />,
    },
  ];

  const riskSegments: RiskSegment[] = [
    { label: "High",   count: stats.highRisk, color: "#ff6b6b" },
    { label: "Medium", count: stats.medRisk,  color: "#fcc419" },
    { label: "Low",    count: stats.lowRisk,  color: "#00c9a7" },
  ];

  return (
    <div className="aim-card">
      {/* Header */}
      <div className="aim-card__header">
        <span className="aim-card__label">AI PERFORMANCE METRICS</span>
        <span
          className="apm-live-dot"
          style={{ opacity: animating ? 0.4 : 1 }}
        >
          ● LIVE
        </span>
      </div>

      {/* Metric grid */}
      <div className="apm-metrics-grid">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className={`apm-metric-box ${animating ? "apm-metric-box--animating" : ""}`}
            style={{ borderColor: m.color + "33" }}
          >
            <div className="apm-metric-icon" style={{ color: m.color }}>
              {m.icon}
            </div>
            <div className="apm-metric-value">{m.value}</div>
            <div className="apm-metric-label">{m.label}</div>
            <div className="apm-metric-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Risk distribution bar */}
      <div className="apm-risk">
        <div className="apm-risk__title">Risk Distribution</div>

        <div className="apm-risk__bar">
          {riskSegments.map((seg) => (
            <div
              key={seg.label}
              className="apm-risk__segment"
              style={{ flex: seg.count, background: seg.color }}
              title={`${seg.label} Risk: ${seg.count}`}
            />
          ))}
        </div>

        <div className="apm-risk__legend">
          {riskSegments.map((seg) => (
            <div key={seg.label} className="apm-risk__legend-item">
              <div
                className="apm-risk__legend-dot"
                style={{ backgroundColor: seg.color }}
              />
              <span className="apm-risk__legend-text">
                {seg.label}: {seg.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPerformanceMetrics;