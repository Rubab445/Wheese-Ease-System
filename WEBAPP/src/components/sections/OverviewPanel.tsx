import React from "react";
import { Patient } from "../../data/patients";
import { THEME_COLORS } from "../../data/constants";
import "../../styles/index.css"
const Icons = {
  Total: () => (
    <span role="img" aria-label="total" style={{ fontSize: "20px", opacity: 0.7 }}>
      👥
    </span>
  ),
  Low: () => (
    <span role="img" aria-label="low" style={{ fontSize: "20px" }}>
      ✅
    </span>
  ),
  Mod: () => (
    <span role="img" aria-label="mod" style={{ fontSize: "20px" }}>
      ⚠️
    </span>
  ),
  High: () => (
    <span role="img" aria-label="high" style={{ fontSize: "20px" }}>
      🚨
    </span>
  ),
};

interface OverviewPanelProps {
  patients: Patient[];
  weekData: any[];
  riskCounts: { high: number; mod: number; low: number };
  onViewPatient: (id: string) => void;
}

const getRiskType = (r: number) => (r >= 61 ? "High" : r >= 31 ? "Moderate" : "Low");
const getRiskColor = (r: number) => (r >= 61 ? "#e8445a" : r >= 31 ? "#f5a623" : "#22c87a");

const getTrend = (t: string) => {
  if (t === "up") return { symbol: "↑", color: "#e8445a" };
  if (t === "down") return { symbol: "↓", color: "#22c87a" };
  return { symbol: "→", color: "#f5a623" }; // Match horizontal arrow in image
};

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  patients,
  weekData,
  riskCounts,
  onViewPatient,
}) => {

  const alerts = [
    { type: "high", msg: "Risk jumped to 78% — possible attack imminent", patient: "Sara Ahmed", time: "4 min ago" },
    { type: "inhaler", msg: "4th inhaler use detected today — overuse risk", patient: "Sara Ahmed", time: "9 min ago" },
    { type: "aqi", msg: "AQI exceeded 150 — active trigger zone", patient: "Mohammad Khan", time: "22 min ago" },
    { type: "mod", msg: "Risk rising to 63% — chest tightness reported", patient: "Bilal Chaudhry", time: "1h ago" },
    { type: "high", msg: "Wheezing reported — risk escalating", patient: "Fatima Noor", time: "2h ago" },
  ];

  return (
    <div style={{ width: "100%", background: THEME_COLORS.bg, minHeight: "100vh", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "1450px", padding: "24px" }}>
        
        {/* TOP STAT CARDS */}
        <div className="stat-cards-styling">
          {[
            { label: "Total Patients", sub: `${patients.length - 3} checked in today`, val: patients.length, color: "#3a8eff", Icon: Icons.Total },
            { label: "Low Risk", sub: "Safe today", val: riskCounts.low, color: "#22c87a", Icon: Icons.Low },
            { label: "Moderate Risk", sub: "Monitor closely", val: riskCounts.mod, color: "#f5a623", Icon: Icons.Mod },
            { label: "High Risk", sub: `${riskCounts.high - 1} unread alerts`, val: riskCounts.high, color: "#e8445a", Icon: Icons.High },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "20px", position: "relative", border: `1px solid ${THEME_COLORS.border}`, boxShadow: THEME_COLORS.shadow }}>
              <div style={{ height: "4px", background: s.color, position: "absolute", top: 0, left: 0, right: 0, borderRadius: "12px 12px 0 0" }} />
              <s.Icon />
              <div style={{ fontSize: "32px", fontWeight: "800", color: s.color, marginTop: "8px" }}>{s.val}</div>
              <div style={{ fontWeight: "700", fontSize: "13px", color: "#444" }}>{s.label}</div>
              <div style={{ fontSize: "11px", color: THEME_COLORS.muted }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="patient-panel-styling">
          
          {/* PATIENT FEED */}
          <div style={{ background: "#fff", borderRadius: "12px", border: `1px solid ${THEME_COLORS.border}`, boxShadow: THEME_COLORS.shadow }}>
            <div style={{ padding: "18px", borderBottom: `1px solid ${THEME_COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "800", fontSize: "16px" }}>Patient Risk Feed</span>
              <span style={{ color: "#3a8eff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>View All →</span>
            </div>
            {patients.map((p) => {
              const color = getRiskColor(p.risk);
              const type = getRiskType(p.risk);
              const trend = getTrend(p.trend);
              return (
                <div key={p.id} onClick={() => onViewPatient(p.id)} style={{ display: "flex", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid #f0f0f0`, cursor: "pointer" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: p.color || "#eee", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", marginRight: "12px" }}>{p.av}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "700", color: "#333" }}>{p.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{p.id} • {p.cond} • {p.age}y</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "800", background: type === "High" ? "#fff0f2" : type === "Moderate" ? "#fff8ed" : "#edfbf4", color }}>{type}</span>
                    <div style={{ marginTop: "6px", fontWeight: "800", color, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "4px" }}>
                      {p.risk}% <span style={{ color: trend.color }}>{trend.symbol}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* STACKED BAR CHART */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${THEME_COLORS.border}`, boxShadow: THEME_COLORS.shadow }}>
              <div style={{ fontWeight: "800", marginBottom: "16px" }}>7-Day Risk Overview</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "120px" }}>
                {weekData.map((d, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                    <div style={{ width: "14px", height: "80px", display: "flex", flexDirection: "column-reverse", gap: "2px" }}>
                      <div style={{ height: "40%", background: "#22c87a", borderRadius: "2px" }} />
                      <div style={{ height: "25%", background: "#f5a623", borderRadius: "2px" }} />
                      <div style={{ height: "20%", background: "#e8445a", borderRadius: "2px" }} />
                    </div>
                    <span style={{ fontSize: "10px", color: "#888", marginTop: "8px" }}>{d.day}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "12px" }}>
                {['Low', 'Mod', 'High'].map(l => (
                   <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                     <div style={{ width: '8px', height: '4px', borderRadius: '2px', background: l === 'Low' ? '#22c87a' : l === 'Mod' ? '#f5a623' : '#e8445a' }} /> {l}
                   </div>
                ))}
              </div>
            </div>

            {/* ALERTS SECTION */}
            <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", border: `1px solid ${THEME_COLORS.border}`, boxShadow: THEME_COLORS.shadow }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", marginBottom: "15px" }}>
                Recent Alerts <span style={{ color: "#3a8eff", fontSize: "12px", cursor: "pointer" }}>See All →</span>
              </div>
              {alerts.map((alt, idx) => (
                <div key={idx} style={{ padding: "12px 0", borderBottom: "1px solid #f0f0f0", position: "relative" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "14px" }}>{alt.type === "high" ? "🚨" : alt.type === "inhaler" ? "💨" : alt.type === "aqi" ? "☁️" : "⚠️"}</span>
                      <div style={{ fontSize: "12px", fontWeight: "600", color: "#333", flex: 1 }}>{alt.msg}</div>
                      <span style={{ fontSize: "10px", color: "#bbb" }}>{alt.time}</span>
                   </div>
                   <div style={{ fontSize: "11px", color: "#3a8eff", marginLeft: "25px", marginTop: "2px" }}>{alt.patient}</div>
                   <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", width: "6px", height: "6px", background: "#3a8eff", borderRadius: "50%" }} />
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};