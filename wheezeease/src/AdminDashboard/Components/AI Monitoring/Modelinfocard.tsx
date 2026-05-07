// ModelInfoCard.tsx
// Component 1 — AI Monitoring Module | WheezeEase
// Shows active AI model info and lets admin switch between models

import React, { useState } from "react";
import '../../Admin.module.css/AIMonitoring.css'

// ─── Types ────────────────────────────────────────────────────

export type ModelId =
  | "sklearn"
  | "tensorflow"
  | "claude-haiku"
  | "claude-sonnet"
  | "gemini";

interface AIModel {
  id: ModelId;
  name: string;
  version: string;
  type: string;
  speed: string;
  accuracy: number;
  trainedOn: string;
  lastTrained: string;
  features: string[];
  color: string;
}

interface ModelInfoCardProps {
  activeModel: ModelId;
  onModelSwitch: (modelId: ModelId) => void;
}

// ─── Data ─────────────────────────────────────────────────────

const MODELS: AIModel[] = [
  {
    id: "sklearn",
    name: "scikit-learn RandomForest",
    version: "v2.1.3",
    type: "Local ML",
    speed: "Fast",
    accuracy: 84,
    trainedOn: "1,240 patient records",
    lastTrained: "Apr 28, 2025",
    features: ["AQI", "Pollen", "Humidity", "Symptoms", "Medication history"],
    color: "#00c9a7",
  },
  {
    id: "tensorflow",
    name: "TensorFlow Neural Net",
    version: "v1.4.0",
    type: "Deep Learning",
    speed: "Moderate",
    accuracy: 91,
    trainedOn: "3,800 patient records",
    lastTrained: "May 01, 2025",
    features: ["AQI", "Pollen", "Humidity", "Symptoms", "Temperature", "Heart rate"],
    color: "#ff6b6b",
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku 4.5",
    version: "claude-haiku-4-5",
    type: "LLM API",
    speed: "Very Fast",
    accuracy: 88,
    trainedOn: "Anthropic pre-trained (no fine-tune)",
    lastTrained: "N/A — API model",
    features: ["Symptom text", "Patient context", "Environmental data", "History"],
    color: "#845ef7",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4.6",
    version: "claude-sonnet-4-6",
    type: "LLM API",
    speed: "Balanced",
    accuracy: 94,
    trainedOn: "Anthropic pre-trained (no fine-tune)",
    lastTrained: "N/A — API model",
    features: [
      "Symptom text",
      "Patient context",
      "Environmental data",
      "History",
      "Complex reasoning",
    ],
    color: "#339af0",
  },
  {
    id: "gemini",
    name: "Gemini 1.5 Flash",
    version: "gemini-1.5-flash",
    type: "LLM API",
    speed: "Fast",
    accuracy: 87,
    trainedOn: "Google pre-trained (no fine-tune)",
    lastTrained: "N/A — API model",
    features: ["Symptom text", "Patient context", "Environmental data"],
    color: "#fcc419",
  },
];

// ─── Sub-component: InfoPill ───────────────────────────────────

interface InfoPillProps {
  label: string;
  value: string;
}

const InfoPill: React.FC<InfoPillProps> = ({ label, value }) => (
  <div className="mic-pill">
    <div className="mic-pill__label">{label}</div>
    <div className="mic-pill__value">{value}</div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────

const ModelInfoCard: React.FC<ModelInfoCardProps> = ({
  activeModel,
  onModelSwitch,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [switching, setSwitching] = useState<boolean>(false);

  const current: AIModel =
    MODELS.find((m) => m.id === activeModel) ?? MODELS[0];

  const handleSwitch = async (modelId: ModelId): Promise<void> => {
    if (modelId === activeModel) return;
    setSwitching(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 900));
    onModelSwitch(modelId);
    setSwitching(false);
    setExpanded(false);
  };

  return (
    <div className="aim-card">
      {/* Header */}
      <div className="aim-card__header">
        <span className="aim-card__label">ACTIVE AI MODEL</span>
        <span
          className="mic-badge"
          style={{
            backgroundColor: current.color + "22",
            color: current.color,
            border: `1px solid ${current.color}44`,
          }}
        >
          {current.type}
        </span>
      </div>

      {/* Model identity row */}
      <div className="mic-model-row">
        <div
          className="mic-model-dot"
          style={{
            backgroundColor: current.color,
            boxShadow: `0 0 14px ${current.color}88`,
          }}
        />
        <div>
          <div className="mic-model-name">{current.name}</div>
          <div className="mic-model-version">{current.version}</div>
        </div>
      </div>

      {/* Info pills */}
      <div className="mic-info-grid">
        <InfoPill label="Accuracy"      value={`${current.accuracy}%`}  />
        <InfoPill label="Speed"         value={current.speed}            />
        <InfoPill label="Last Trained"  value={current.lastTrained}      />
        <InfoPill label="Training Data" value={current.trainedOn}        />
      </div>

      {/* Features */}
      <div className="mic-features">
        <div className="mic-features__title">Input Features</div>
        <div className="mic-features__tags">
          {current.features.map((f) => (
            <span
              key={f}
              className="mic-feature-tag"
              style={{ borderColor: current.color + "55" }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Toggle switcher */}
      <button
        className="mic-switch-btn"
        onClick={() => setExpanded((prev) => !prev)}
      >
        {expanded ? "▲ Close Model Switcher" : "⇄ Switch AI Model"}
      </button>

      {/* Model list */}
      {expanded && (
        <div className="mic-model-list">
          {MODELS.map((m) => (
            <div
              key={m.id}
              onClick={() => handleSwitch(m.id)}
              className={`mic-model-option ${
                m.id === activeModel
                  ? "mic-model-option--active"
                  : "mic-model-option--idle"
              }`}
              style={{
                borderColor:
                  m.id === activeModel ? m.color : "#ffffff11",
                backgroundColor:
                  m.id === activeModel ? m.color + "15" : "transparent",
              }}
            >
              <div className="mic-model-option__left">
                <div
                  className="mic-model-option__dot"
                  style={{ backgroundColor: m.color }}
                />
                <span className="mic-model-option__name">{m.name}</span>
              </div>
              <div className="mic-model-option__right">
                <span className="mic-model-option__acc">
                  {m.accuracy}% acc
                </span>
                {m.id === activeModel ? (
                  <span style={{ color: m.color, fontSize: 12 }}>
                    ● Active
                  </span>
                ) : switching ? (
                  <span className="mic-model-option__hint">...</span>
                ) : (
                  <span className="mic-model-option__hint">Activate →</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModelInfoCard;