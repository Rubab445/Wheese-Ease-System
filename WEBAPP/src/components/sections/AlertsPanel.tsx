import React from "react";
import { THEME_COLORS } from "../../data/constants";

interface Alert {
  id: number;
  pid: string;
  patient: string;
  type: "high" | "mod" | "low";
  msg: string;
  time: string;
  icon: string;
  read: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
  alertFilter: "all" | "unread" | "high" | "mod" | "low";
  onFilterChange: (filter: "all" | "unread" | "high" | "mod" | "low") => void;
  onMarkAsRead: (id: number) => void;
}

const alertBg = (type: string) => {
  switch (type) {
    case "high":
      return "#fff0f2";
    case "mod":
      return "#fff8ed";
    case "low":
      return "#edfbf4";
    default:
      return THEME_COLORS.bg;
  }
};

const alertColor = (type: string) => {
  switch (type) {
    case "high":
      return "#e8445a";
    case "mod":
      return "#f5a623";
    case "low":
      return "#22c87a";
    default:
      return THEME_COLORS.muted;
  }
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  alertFilter,
  onFilterChange,
  onMarkAsRead,
}) => {
  const filteredAlerts = alerts.filter((a) => {
    if (alertFilter === "unread") return !a.read;
    if (alertFilter === "all") return true;
    return a.type === alertFilter;
  });

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: THEME_COLORS.bg,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {(["all", "unread", "high", "mod", "low"] as const).map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              border: `2px solid ${alertFilter === f ? THEME_COLORS.blue : THEME_COLORS.border}`,
              background:
                alertFilter === f ? THEME_COLORS.blueBg : THEME_COLORS.white,
              color:
                alertFilter === f ? THEME_COLORS.blue : THEME_COLORS.muted,
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.15s",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            {f === "all"
              ? "All"
              : f === "unread"
                ? "Unread"
                : f === "high"
                  ? "High"
                  : f === "mod"
                    ? "Moderate"
                    : "Low"}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        {filteredAlerts.length === 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: THEME_COLORS.muted,
            }}
          >
            No alerts
          </div>
        ) : (
          filteredAlerts.map((a) => (
            <div
              key={a.id}
              onClick={() => onMarkAsRead(a.id)}
              style={{
                background: alertBg(a.type),
                borderLeft: `5px solid ${alertColor(a.type)}`,
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
                cursor: "pointer",
                opacity: a.read ? 0.6 : 1,
                transition: "all 0.15s",
                border: `1px solid ${alertColor(a.type)}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: "20px" }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: THEME_COLORS.text,
                      marginBottom: "4px",
                    }}
                  >
                    {a.patient}
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: THEME_COLORS.muted,
                      margin: "0 0 4px 0",
                    }}
                  >
                    {a.msg}
                  </p>
                  <div
                    style={{
                      fontSize: "11px",
                      color: alertColor(a.type),
                      fontWeight: 700,
                    }}
                  >
                    {a.time}
                  </div>
                </div>
                {!a.read && (
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      background: alertColor(a.type),
                      borderRadius: "50%",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
