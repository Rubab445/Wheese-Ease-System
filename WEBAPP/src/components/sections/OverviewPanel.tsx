import React from "react";
import { Patient } from "../../data/patients";
import { THEME_COLORS } from "../../data/constants";

interface OverviewPanelProps {
  patients: Patient[];
  weekData: any[];
  riskCounts: { high: number; mod: number; low: number };
}

const riskColor = (r: number) =>
  r >= 61 ? "#e8445a" : r >= 31 ? "#f5a623" : "#22c87a";

export const OverviewPanel: React.FC<OverviewPanelProps> = ({
  patients,
  weekData,
  riskCounts,
}) => {
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          { label: "Total Patients", value: patients.length, color: "#3a8eff" },
          { label: "High Risk", value: riskCounts.high, color: "#e8445a" },
          { label: "Moderate Risk", value: riskCounts.mod, color: "#f5a623" },
          { label: "Low Risk", value: riskCounts.low, color: "#22c87a" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: THEME_COLORS.white,
              borderRadius: "14px",
              padding: "20px",
              border: `1px solid ${THEME_COLORS.border}`,
              boxShadow: THEME_COLORS.shadow,
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
                fontSize: "36px",
                fontWeight: 800,
                color: stat.color,
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: THEME_COLORS.white,
          borderRadius: "14px",
          padding: "20px",
          border: `1px solid ${THEME_COLORS.border}`,
          boxShadow: THEME_COLORS.shadow,
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: THEME_COLORS.text,
            marginBottom: "16px",
          }}
        >
          Weekly Alert Trend
        </h3>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-end",
            height: "160px",
          }}
        >
          {weekData.map((day, i) => {
            const maxH = Math.max(...weekData.map((d: any) => d.high + d.mod + d.low));
            const total = day.high + day.mod + day.low;
            const heightPct = (total / maxH) * 100;

            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${heightPct}%`,
                    background: `linear-gradient(to top, ${riskColor(day.high + day.mod + day.low / 3)}, rgba(58,142,255,0.1))`,
                    borderRadius: "8px 8px 0 0",
                    border: `1px solid ${THEME_COLORS.border}`,
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: THEME_COLORS.muted,
                  }}
                >
                  {day.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
