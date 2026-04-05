import React from "react";
import "../../styles/dashboard.css";

interface Patient {
  risk: number;
  inhalerToday: number;
  condition?: string;
}

interface AnalyticsPanelProps {
  patients: Patient[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ patients }) => {
  
  const total = patients.length;

  const avgRisk =
    total > 0
      ? Math.round(patients.reduce((s, p) => s + p.risk, 0) / total)
      : 0;

  const critical = patients.filter((p) => p.risk >= 75).length;
  const stable = patients.filter((p) => p.risk < 30).length;

  const avgInhaler =
  total > 0
    ? (
        patients.reduce((s, p) => s + (p.inhalerToday || 0), 0) / total
      ).toFixed(1)
    : "0";
  const low = stable;
  const high = critical;
  const moderate = total - (low + high);

  // percentages
  const lowPct = total ? Math.round((low / total) * 100) : 0;
  const modPct = total ? Math.round((moderate / total) * 100) : 0;
  const highPct = total ? Math.round((high / total) * 100) : 0;

  return (
    <div className="main active" id="sec-analytics">

      {/* ================= TOP STATS ================= */}
      <div className="stats-row">

        <div className="stat-card c-blue">
          <div className="stat-icon">📊</div>
          <div className="stat-val c-blue">{avgRisk}%</div>
          <div className="stat-label">Avg Risk Score</div>
          <div className="stat-sub">Across all patients</div>
        </div>

        <div className="stat-card c-red">
          <div className="stat-icon">🚨</div>
          <div className="stat-val c-red">{high}</div>
          <div className="stat-label">High Risk Rate</div>
          <div className="stat-sub">{high} of {total} patients</div>
        </div>

        <div className="stat-card c-green">
          <div className="stat-icon">📉</div>
          <div className="stat-val c-green">{stable}</div>
          <div className="stat-label">Stable Patients</div>
          <div className="stat-sub">Low risk group</div>
        </div>

        <div className="stat-card c-amber">
          <div className="stat-icon">💨</div>
          <div className="stat-val c-amber">{avgInhaler}</div>
          <div className="stat-label">Inhaler Uses</div>
          <div className="stat-sub">Avg per day</div>
        </div>

      </div>

     
      <div className="analytics-grid">

        {/* ===== Risk Distribution ===== */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Risk Distribution</div>
          </div>

          <div style={{ padding: "18px 20px" }}>

            <div className="progress-row">
              <div className="progress-label">
                <span>Low Risk</span>
                <span style={{ color: "var(--green)" }}>
                  {low} ({lowPct}%)
                </span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${lowPct}%`,
                    background: "var(--green)",
                  }}
                />
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-label">
                <span>Moderate Risk</span>
                <span style={{ color: "var(--amber)" }}>
                  {moderate} ({modPct}%)
                </span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${modPct}%`,
                    background: "var(--amber)",
                  }}
                />
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-label">
                <span>High Risk</span>
                <span style={{ color: "var(--red)" }}>
                  {high} ({highPct}%)
                </span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${highPct}%`,
                    background: "var(--red)",
                  }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ===== Top Triggers ===== */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Top Triggers This Week</div>
          </div>

          <div style={{ padding: "18px 20px" }}>

            <div className="progress-row">
              <div className="progress-label">
                <span>High AQI</span>
                <span style={{ color: "var(--red)" }}>{high}</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: "70%", background: "var(--red)" }}
                />
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-label">
                <span>High Pollen</span>
                <span style={{ color: "var(--amber)" }}>{moderate}</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: "50%", background: "var(--amber)" }}
                />
              </div>
            </div>

            <div className="progress-row">
              <div className="progress-label">
                <span>Humidity</span>
                <span style={{ color: "var(--blue)" }}>{low}</span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{ width: "30%", background: "var(--blue)" }}
                />
              </div>
            </div>

          </div>
        </div>

        {/* ===== Condition Breakdown ===== */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">Condition Breakdown</div>
          </div>

          <div style={{ padding: "18px 20px" }}>

            {["Asthma", "Allergy", "COPD"].map((cond, i) => {
              const count = patients.filter(
                (p) => p.condition?.includes(cond)
              ).length;

              const pct = total ? Math.round((count / total) * 100) : 0;

              return (
                <div className="progress-row" key={i}>
                  <div className="progress-label">
                    <span>{cond}</span>
                    <span>{count}</span>
                  </div>
                  <div className="progress-bg">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: "var(--blue)",
                      }}
                    />
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* ===== Chart ===== */}
        <div className="panel">
          <div className="panel-head">
            <div className="panel-title">High-Risk Trend</div>
          </div>

          <div className="bar-chart">
            <div className="bars">
              {[10, 30, 50, 20, 60, 40, 70].map((h, i) => (
                <div className="bar-col" key={i}>
                  <div
                    className="bar-fill"
                    style={{
                      height: `${h}%`,
                      background: "var(--red)",
                    }}
                  />
                  <div className="bar-day">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};