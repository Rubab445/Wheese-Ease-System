import React from "react";
import { THEME_COLORS, DOCTOR_PROFILE } from "../../data/constants";

interface SettingsPanelProps {
  doctorProfile?: any;
}


export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  doctorProfile = DOCTOR_PROFILE,
}) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px",
        background: THEME_COLORS.bg,
        maxWidth: "600px",
      }}
    >
      {/* Doctor Profile */}
      <div
        style={{
          background: THEME_COLORS.white,
          borderRadius: "14px",
          padding: "24px",
          border: `1px solid ${THEME_COLORS.border}`,
          marginBottom: "16px",
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
          Doctor Profile
        </h3>

        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3a8eff, #6a5af9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "32px",
              fontWeight: 800,
            }}
          >
            {doctorProfile.initials || "DR"}
          </div>

          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontSize: "16px",
                fontWeight: 800,
                color: THEME_COLORS.text,
                margin: "0 0 4px 0",
              }}
            >
              {doctorProfile.name || "Dr. A. Rahman"}
            </h4>
            <p
              style={{
                fontSize: "13px",
                color: THEME_COLORS.muted,
                margin: "0 0 8px 0",
              }}
            >
              {doctorProfile.specialty || "Pulmonologist"}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: THEME_COLORS.text,
                margin: 0,
              }}
            >
              License: {doctorProfile.license || "MD-PA-2024-0145"}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}
        >
          {[
            { label: "Patients", value: "85" },
            { label: "Avg Response", value: "2.3h" },
            { label: "Experience", value: "12 years" },
            { label: "Rating", value: "4.8/5" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: THEME_COLORS.bg,
                padding: "12px",
                borderRadius: "8px",
                border: `1px solid ${THEME_COLORS.border}`,
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: THEME_COLORS.muted,
                  fontWeight: 700,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: THEME_COLORS.blue,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Settings */}
      <div
        style={{
          background: THEME_COLORS.white,
          borderRadius: "14px",
          padding: "24px",
          border: `1px solid ${THEME_COLORS.border}`,
          marginBottom: "16px",
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
          Preferences
        </h3>

        {[
          { label: "Email Notifications", enabled: true },
          { label: "SMS Alerts", enabled: true },
          { label: "High Risk Alerts Only", enabled: false },
          { label: "Dark Mode", enabled: false },
        ].map((pref, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: i < 3 ? `1px solid ${THEME_COLORS.border}` : "none",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: THEME_COLORS.text,
              }}
            >
              {pref.label}
            </span>
            <input
              type="checkbox"
              defaultChecked={pref.enabled}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div
        style={{
          background: "#fff0f2",
          borderRadius: "14px",
          padding: "20px",
          border: `1px solid #f5a8b8`,
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 800,
            color: "#c7254e",
            marginBottom: "12px",
          }}
        >
          Danger Zone
        </h3>
        <button
          style={{
            width: "100%",
            padding: "10px",
            background: "#e8445a",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "12px",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
