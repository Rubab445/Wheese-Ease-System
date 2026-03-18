import React from "react";
import { THEME_COLORS } from "../../data/constants";

interface AnalyticsPanelProps {
  patients: any[];
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ patients }) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: THEME_COLORS.bg,
      }}
    >
      <div
        style={{
          background: THEME_COLORS.white,
          borderRadius: "14px",
          padding: "24px",
          border: `1px solid ${THEME_COLORS.border}`,
          boxShadow: THEME_COLORS.shadow,
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 800,
            color: THEME_COLORS.text,
            marginBottom: "16px",
          }}
        >
          Analytics Dashboard
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            {
              label: "Avg Risk Score",
              value: (patients.reduce((sum, p) => sum + p.risk, 0) / patients.length).toFixed(1) + "%",
            },
            {
              label: "Avg Inhaler Use",
              value: (patients.reduce((sum, p) => sum + p.inhalerToday, 0) / patients.length).toFixed(1) + "x/day",
            },
            {
              label: "Critical Cases",
              value: patients.filter((p) => p.risk >= 75).length,
            },
            {
              label: "Stable Patients",
              value: patients.filter((p) => p.risk < 30).length,
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: THEME_COLORS.bg,
                padding: "16px",
                borderRadius: "10px",
                border: `1px solid ${THEME_COLORS.border}`,
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  color: THEME_COLORS.muted,
                  fontWeight: 700,
                  marginBottom: "8px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  color: THEME_COLORS.blue,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: THEME_COLORS.bg,
            padding: "16px",
            borderRadius: "10px",
            border: `1px solid ${THEME_COLORS.border}`,
            color: THEME_COLORS.muted,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          More analytics coming soon...
        </div>
      </div>
    </div>
  );
};
