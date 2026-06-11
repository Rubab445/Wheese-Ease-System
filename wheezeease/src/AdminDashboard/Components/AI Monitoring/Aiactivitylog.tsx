// AIActivityLog.tsx
// Component 3 — AI Monitoring Module | WheezeEase
// Real-time scrollable audit log of every AI decision made per patient

import React, { useState, useEffect, useRef } from "react";
import '../../Admin.module.css/AIMonitoring.css'

// ─── Types ────────────────────────────────────────────────────

export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";
export type FilterOption = "ALL" | RiskLevel;

interface LogEntry {
  id: number;
  patient: string;
  recommendation: string;
  risk: RiskLevel;
  riskColor: string;
  model: string;
  time: string;
  confidence: number;
}

interface AIActivityLogProps {
  /** Currently active model id — new log entries use this model label */
  activeModel: string;
}

// ─── Constants ────────────────────────────────────────────────

const RISK_COLORS: Record<RiskLevel, string> = {
  HIGH:   "#ff6b6b",
  MEDIUM: "#fcc419",
  LOW:    "#00c9a7",
};

const PATIENTS = [
  "Fatima K.", "Ahmed R.", "Sara N.",   "Bilal M.",
  "Zara A.",  "Usman T.", "Hira S.",   "Ali Z.",
];

const RECOMMENDATIONS = [
  "High risk alert sent — AQI 178, pollen spike",
  "Preventive tip: avoid outdoor activity",
  "Medication reminder dispatched",
  "Low risk — no action required",
  "Trigger pattern identified: humidity > 80%",
  "Doctor notified of worsening trend",
  "Emergency alert: severe symptom spike",
  "Weekly summary generated for doctor",
];

const RISK_SEQUENCE: RiskLevel[] = [
  "HIGH", "LOW", "MEDIUM", "LOW", "MEDIUM", "HIGH", "HIGH", "LOW",
];

const MODEL_LABELS: Record<string, string> = {
  sklearn:    "scikit-learn",
  tensorflow: "TensorFlow",
  llama:      "Llama 3",
};

// ─── Helper ───────────────────────────────────────────────────

const buildEntry = (seed: number, modelId: string): LogEntry => {
  const i       = seed % 8;
  const risk    = RISK_SEQUENCE[i];
  const now     = new Date();
  now.setMinutes(now.getMinutes() - seed * 3);

  return {
    id: seed,
    patient:        PATIENTS[i],
    recommendation: RECOMMENDATIONS[i],
    risk,
    riskColor:      RISK_COLORS[risk],
    model:          MODEL_LABELS[modelId] ?? "scikit-learn",
    time:           now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    confidence:     Math.floor(65 + Math.random() * 30),
  };
};

// ─── Component ────────────────────────────────────────────────

const AIActivityLog: React.FC<AIActivityLogProps> = ({ activeModel }) => {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    Array.from({ length: 12 }, (_, i) => buildEntry(i, activeModel))
  );
  const [filter, setFilter]     = useState<FilterOption>("ALL");
  const [newId,  setNewId]      = useState<number | null>(null);
  const scrollRef               = useRef<HTMLDivElement>(null);

  const filters: FilterOption[] = ["ALL", "HIGH", "MEDIUM", "LOW"];

  // Auto-append a new log entry every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const seed  = Math.floor(Math.random() * 1000);
      const entry = buildEntry(seed, activeModel);
      entry.time  = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      entry.model = MODEL_LABELS[activeModel] ?? "scikit-learn";

      setNewId(entry.id);
      setLogs((prev) => [entry, ...prev.slice(0, 19)]);

      const clearTimer = setTimeout(() => setNewId(null), 1200);
      return () => clearTimeout(clearTimer);
    }, 6000);

    return () => clearInterval(interval);
  }, [activeModel]);

  const filtered: LogEntry[] =
    filter === "ALL" ? logs : logs.filter((l) => l.risk === filter);

  return (
    <div className="aim-card aim-card--full-width">
      {/* Header + filters */}
      <div className="aal-header">
        <span className="aim-card__label">AI ACTIVITY LOG</span>

        <div className="aal-filters">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`aal-filter-btn ${
                filter === f ? "aal-filter-btn--active" : "aal-filter-btn--idle"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable log */}
      <div className="aal-scroll" ref={scrollRef}>
        {filtered.map((log) => (
          <div
            key={`${log.id}-${log.time}`}
            className={`aal-row ${newId === log.id ? "aal-row--new" : ""}`}
            style={{ borderLeftColor: log.riskColor }}
          >
            {/* Left: risk + text */}
            <div className="aal-row__left">
              <div
                className="aal-row__risk"
                style={{ color: log.riskColor }}
              >
                {log.risk}
              </div>
              <div className="aal-row__text">
                <span className="aal-row__patient">{log.patient}</span>
                {" — "}
                {log.recommendation}
              </div>
            </div>

            {/* Right: meta */}
            <div className="aal-row__right">
              <span className="aal-row__conf">{log.confidence}% conf</span>
              <span className="aal-row__model">{log.model}</span>
              <span className="aal-row__time">{log.time}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: "#546e7a",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
            }}
          >
            No {filter} risk entries found
          </div>
        )}
      </div>
    </div>
  );
};

export default AIActivityLog;