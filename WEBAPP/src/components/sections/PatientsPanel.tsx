import React from "react";
import { Patient } from "../../data/patients";
import { THEME_COLORS } from "../../data/constants";

interface PatientsPanelProps {
  selectedPatient: Patient | undefined;
  onChat: (id: string) => void;
}

const riskColor = (r: number) =>
  r >= 61 ? "#e8445a" : r >= 31 ? "#f5a623" : "#22c87a";
const riskBg = (r: number) =>
  r >= 61 ? "#fff0f2" : r >= 31 ? "#fff8ed" : "#edfbf4";

export const PatientsPanel: React.FC<PatientsPanelProps> = ({
  selectedPatient,
  onChat,
}) => {
  if (!selectedPatient) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: THEME_COLORS.muted,
        }}
      >
        Select a patient to view details
      </div>
    );
  }

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
          marginBottom: "16px",
          boxShadow: THEME_COLORS.shadow,
        }}
      >
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: selectedPatient.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {selectedPatient.av}
          </div>
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: THEME_COLORS.text,
                margin: "0 0 4px 0",
              }}
            >
              {selectedPatient.name}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: THEME_COLORS.muted,
                margin: "0 0 8px 0",
              }}
            >
              {selectedPatient.id} | Age: {selectedPatient.age} |{" "}
              {selectedPatient.gender}
            </p>
            <p
              style={{
                fontSize: "13px",
                color: THEME_COLORS.text,
                margin: 0,
                fontWeight: 600,
              }}
            >
              {selectedPatient.cond}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "8px",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                background: riskBg(selectedPatient.risk),
                color: riskColor(selectedPatient.risk),
                fontWeight: 800,
                fontSize: "14px",
              }}
            >
              {selectedPatient.risk}% Risk
            </div>
            <button
              onClick={() => onChat(selectedPatient.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                background: THEME_COLORS.blue,
                color: "#fff",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Message
            </button>
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
            { label: "Inhaler Today", value: `${selectedPatient.inhaler}x` },
            { label: "Pollen Level", value: selectedPatient.pollen },
            { label: "Medication", value: selectedPatient.med },
            {
              label: "Last Visit",
              value: selectedPatient.lastVisit,
            },
            { label: "AQI", value: `${selectedPatient.aqi}` },
            { label: "Humidity", value: `${selectedPatient.humidity}%` },
            { label: "Temperature", value: `${selectedPatient.temp}°C` },
            { label: "Pollen", value: selectedPatient.pollen },
          ].map((item, i) => (
            <div key={i}>
              <div
                style={{
                  fontSize: "11px",
                  color: THEME_COLORS.muted,
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: THEME_COLORS.text,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPatient.notes && (
        <div
          style={{
            background: THEME_COLORS.white,
            borderRadius: "14px",
            padding: "16px",
            border: `1px solid ${THEME_COLORS.border}`,
            boxShadow: THEME_COLORS.shadow,
          }}
        >
          <h4
            style={{
              fontSize: "12px",
              fontWeight: 800,
              color: THEME_COLORS.muted,
              margin: "0 0 8px 0",
            }}
          >
            Clinical Notes
          </h4>
          <p
            style={{
              fontSize: "13px",
              lineHeight: "1.6",
              color: THEME_COLORS.text,
              margin: 0,
            }}
          >
            {selectedPatient.notes}
          </p>
        </div>
      )}
    </div>
  );
};
