import React, { useState } from "react";
import { RefreshCw, Check, AlertTriangle } from 'lucide-react';

import ModelInfoCard, { type ModelId } from '../../AdminDashboard/Components/AI Monitoring/Modelinfocard'
import AIPerformanceMetrics from '../../AdminDashboard/Components/AI Monitoring/Aiperformancemetrics'
import AIActivityLog from '../../AdminDashboard/Components/AI Monitoring/Aiactivitylog'
import '../Admin.module.css/AIMonitoring.css'

// ─── Types ────────────────────────────────────────────────────

type RetrainState = "idle" | "loading" | "success";

// ─── Page Component ───────────────────────────────────────────

const AIMonitoringPage: React.FC = () => {
  const [activeModel, setActiveModel] = useState<ModelId>("sklearn");
  const [alertThreshold, setAlertThreshold] = useState<number>(70);
  const [aiEnabled, setAiEnabled] = useState<boolean>(true);
  const [retrainState, setRetrainState] = useState<RetrainState>("idle");

  // ── Handlers ────────────────────────────────────────────────

  const handleToggleAI = (): void => {
    setAiEnabled((prev) => !prev);
  };

  const handleModelSwitch = (modelId: ModelId): void => {
    setActiveModel(modelId);
  };

  const handleRetrain = async (): Promise<void> => {
    if (retrainState === "loading") return;
    setRetrainState("loading");
    await new Promise<void>((resolve) => setTimeout(resolve, 2800));
    setRetrainState("success");
    setTimeout(() => setRetrainState("idle"), 4000);
  };

  const handleThresholdChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setAlertThreshold(Number(e.target.value));
  };

  // ── Retrain button label / class ────────────────────────────

  const getRetrainContent = () => {
    switch (retrainState) {
      case "idle": return <><RefreshCw size={14} /> Retrain Model</>;
      case "loading": return <><RefreshCw size={14} className="animate-spin" /> Retraining...</>;
      case "success": return <><Check size={14} /> Retrained!</>;
    }
  };

  return (
    <div className="aim-page">

      {/* ── Header ── */}
      <div className="aim-header">
        <div className="aim-header-left">
          <h1 className="aim-title">
            AI <span>Monitoring</span>
          </h1>
          <p className="aim-subtitle">
            Real-time AI oversight & performance tracking
          </p>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="aim-controls">

        {/* AI Engine toggle */}
        <div className="aim-toggle-row">
          <span className="aim-toggle-label">AI Engine</span>
          <button
            className={`aim-toggle ${aiEnabled ? "aim-toggle--on" : "aim-toggle--off"}`}
            onClick={handleToggleAI}
            aria-label={`AI engine is ${aiEnabled ? "on" : "off"}`}
          >
            <div className="aim-toggle__thumb" />
          </button>
          <span
            className={`aim-toggle-status ${aiEnabled ? "aim-toggle-status--on" : "aim-toggle-status--off"
              }`}
          >
            {aiEnabled ? "ON" : "OFF"}
          </span>
        </div>

        {/* Retrain button */}
        <button
          onClick={handleRetrain}
          disabled={retrainState === "loading"}
          className={`aim-retrain-btn ${retrainState === 'success' ? 'aim-retrain-btn--success' : ''}`}
        >
          {getRetrainContent()}
        </button>

        {/* Alert threshold slider */}
        <div className="aim-threshold-box">
          <span className="aim-threshold-box__label">Alert Threshold</span>
          <div className="aim-threshold-box__row">
            <input
              type="range"
              min={40}
              max={95}
              value={alertThreshold}
              onChange={handleThresholdChange}
              className="aim-slider"
              aria-label="Alert threshold percentage"
            />
            <span className="aim-threshold-value">{alertThreshold}%</span>
          </div>
        </div>

      </div>

      {/* ── Warning bar (shown when AI is disabled) ── */}
      {!aiEnabled && (
        <div className="aim-warning-bar" role="alert">
          <AlertTriangle size={18} /> AI Engine is currently DISABLED — no predictions or alerts are
          being generated
        </div>
      )}

      {/* ── Main content grid ── */}
      <main className="aim-grid">

        {/* Component 1: Model info + switcher */}
        <ModelInfoCard
          activeModel={activeModel}
          onModelSwitch={handleModelSwitch}
        />

        {/* Component 2: Live performance metrics */}
        <AIPerformanceMetrics activeModel={activeModel} />

        {/* Component 3: Real-time activity log (spans full width) */}
        <AIActivityLog activeModel={activeModel} />

      </main>

      {/* ── Footer ── */}
      <footer className="aim-footer">
        <span>
          Model: {activeModel} · Threshold: {alertThreshold}% · Engine:{" "}
          {aiEnabled ? "Active" : "Offline"}
        </span>
      </footer>

    </div>
  );
};

export default AIMonitoringPage;