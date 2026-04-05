import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PATIENTS, Patient } from "./data/patients";
import { THEME_COLORS } from "./data/constants";
import {
  OverviewPage,
  PatientsPage,
  AlertsPage,
  AnalyticsPage,
  MessagesPage,
  SettingsPage,
} from "./pages";
import LoginPage from "./pages/LoginPage";
import "./styles/index.css"

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

interface Message {
  from: "in" | "out";
  text: string;
  time: string;
}

const INITIAL_ALERTS: Alert[] = [
  {
    id: 1,
    pid: "P-041",
    patient: "Sara Ahmed",
    type: "high",
    msg: "Risk jumped to 78% — possible attack imminent",
    time: "4 min ago",
    icon: "🚨",
    read: false,
  },
  {
    id: 2,
    pid: "P-041",
    patient: "Sara Ahmed",
    type: "high",
    msg: "4th inhaler use detected today — overuse risk",
    time: "9 min ago",
    icon: "💨",
    read: false,
  },
  {
    id: 3,
    pid: "P-012",
    patient: "Mohammad Khan",
    type: "high",
    msg: "AQI exceeded 150 — active trigger zone",
    time: "22 min ago",
    icon: "🌫️",
    read: false,
  },
  {
    id: 4,
    pid: "P-055",
    patient: "Bilal Chaudhry",
    type: "mod",
    msg: "Risk rising to 63% — chest tightness reported",
    time: "1h ago",
    icon: "⚠️",
    read: true,
  },
  {
    id: 5,
    pid: "P-027",
    patient: "Fatima Noor",
    type: "mod",
    msg: "Wheezing reported — risk escalating",
    time: "2h ago",
    icon: "🫁",
    read: true,
  },
  {
    id: 6,
    pid: "P-019",
    patient: "Zara Butt",
    type: "low",
    msg: "Daily check-in complete — all clear",
    time: "3h ago",
    icon: "✅",
    read: true,
  },
];

const WEEK_DATA = [
  { day: "Mon", high: 4, mod: 11, low: 28 },
  { day: "Tue", high: 3, mod: 12, low: 27 },
  { day: "Wed", high: 5, mod: 13, low: 26 },
  { day: "Thu", high: 6, mod: 14, low: 25 },
  { day: "Fri", high: 5, mod: 12, low: 27 },
  { day: "Sat", high: 7, mod: 13, low: 24 },
  { day: "Now", high: 2, mod: 3, low: 4 },
];

type Section =
  | "overview"
  | "patients"
  | "alerts"
  | "analytics"
  | "messages"
  | "settings";
type AlertFilter = "all" | "unread" | "high" | "mod" | "low";
type PtFilter = "all" | "high" | "mod" | "low";

const riskColor = (r: number) =>
  r >= 61 ? "#e8445a" : r >= 31 ? "#f5a623" : "#22c87a";
const riskBg = (r: number) =>
  r >= 61 ? "#fff0f2" : r >= 31 ? "#fff8ed" : "#edfbf4";
const riskClass = (r: number) => (r >= 61 ? "high" : r >= 31 ? "mod" : "low");

// ============================================================
// PROTECTED ROUTE — redirects to login if no token
// ============================================================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

// ============================================================
// MAIN DASHBOARD — all your existing code unchanged
// ============================================================
const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([...PATIENTS]);
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    PATIENTS[0].id
  );
  const [alertFilter, setAlertFilter] = useState<AlertFilter>("all");
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [ptFilter, setPtFilter] = useState<PtFilter>("all");
  const [clock, setClock] = useState("");
  const [chats, setChats] = useState<Record<string, Message[]>>({});
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Get logged in doctor name from token/localStorage
  const doctorName =
    localStorage.getItem("doctorName") || "Dr. A. Rahman";

  // Clock Update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const date = now.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      });
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setClock(`${date} · ${time}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Live Risk Updates
  useEffect(() => {
    const timer = setInterval(() => {
      setPatients((prev) =>
        prev.map((p) => {
          const delta = Math.floor(Math.random() * 5) - 2;
          return {
            ...p,
            risk: Math.max(5, Math.min(95, p.risk + delta)),
            trend: delta > 1 ? "up" : delta < -1 ? "down" : "flat",
          };
        })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Helper Functions

  const unreadCount = alerts.filter((a) => !a.read).length;

  const filteredPatients = patients.filter((p) => {
    const matchF = ptFilter === "all" || riskClass(p.risk) === ptFilter;
    const matchS =
      !searchTerm ||
      p.name.toLowerCase().includes(searchTerm) ||
      p.id.toLowerCase().includes(searchTerm);
    return matchF && matchS;
  });



  // Chat Functions
  const openChat = (id: string) => {
    setActiveChatId(id);
    console.log('fff',activeChatId);
    if (!chats[id]) {
      setChats((prev) => ({ ...prev, [id]: [] }));
    }
    setActiveSection("messages");
  };

  const sendChat = (patientId: string, text: string) => {
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setChats((prev) => ({
      ...prev,
      [patientId]: [...(prev[patientId] || []), { from: "out", text, time }],
    }));

    setTimeout(() => {
      const replies = [
        "Thank you doctor. I will follow your advice.",
        "Understood. Should I increase my inhaler dose?",
        "I will stay indoors today as you suggested.",
        "Yes doctor, I have been feeling better since yesterday.",
      ];
      const replyTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setChats((prev) => ({
        ...prev,
        [patientId]: [
          ...(prev[patientId] || []),
          {
            from: "in",
            text: replies[Math.floor(Math.random() * replies.length)],
            time: replyTime,
          },
        ],
      }));
    }, 1100);
  };

  const markAlertAsRead = (id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  // ── Logout ──
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorName");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        backgroundColor: THEME_COLORS.bg,
        color: THEME_COLORS.text,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      }}
    >
      {/* TOP NAVIGATION */}
      <nav
        style={{
          background: THEME_COLORS.white,
          borderBottom: `1px solid ${THEME_COLORS.border}`,
          padding: "0 28px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          overflow: "hidden",
          boxShadow: THEME_COLORS.shadow,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "20px",
            fontWeight: 800,
            color: THEME_COLORS.text,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => setActiveSection("overview")}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              background: "linear-gradient(135deg, #3a8eff, #6a5af9)",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
            }}
          >
            🫁
          </div>
          <span>
            Wheeze<span style={{ color: THEME_COLORS.blue }}>.</span>Ease
          </span>
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", gap: "4px", marginLeft: "16px" }}>
          {(
            [
              "overview",
              "patients",
              "alerts",
              "analytics",
              "messages",
              "settings",
            ] as Section[]
          ).map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              style={{
                padding: "7px 16px",
                borderRadius: "9px",
                fontSize: "13px",
                fontWeight: 700,
                color:
                  section === activeSection
                    ? THEME_COLORS.blue
                    : THEME_COLORS.muted,
                cursor: "pointer",
                border: "none",
                background:
                  section === activeSection ? THEME_COLORS.blueBg : "none",
                transition: "all 0.18s",
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        {/* Right Side Actions */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Live indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: THEME_COLORS.greenBg,
              border: `1px solid rgba(34,200,122,0.3)`,
              borderRadius: "20px",
              padding: "5px 12px",
              fontSize: "12px",
              fontWeight: 700,
              color: THEME_COLORS.green,
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                background: THEME_COLORS.green,
                borderRadius: "50%",
                animation: "blink 1.8s infinite",
              }}
            />
            Live
          </div>

          <div style={{ fontSize: "12px", color: THEME_COLORS.muted, whiteSpace: "nowrap" }}>
            {clock}
          </div>

          {/* Alerts bell */}
          <button
            onClick={() => setActiveSection("alerts")}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: THEME_COLORS.bg,
              border: `1px solid ${THEME_COLORS.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: "16px",
              position: "relative",
              transition: "all 0.15s",
            }}
          >
            🔔
            {unreadCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: THEME_COLORS.red,
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 800,
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: `2px solid ${THEME_COLORS.white}`,
                }}
              >
                {unreadCount}
              </div>
            )}
          </button>

          {/* Doctor profile + logout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 10px",
              borderRadius: "10px",
              background: THEME_COLORS.bg,
              border: `1px solid ${THEME_COLORS.border}`,
              cursor: "pointer",
            }}
            onClick={() => setActiveSection("settings")}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #3a8eff, #6a5af9)",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              DR
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700 }}>
                {doctorName}
              </div>
              <div style={{ fontSize: "10px", color: THEME_COLORS.muted }}>
                Pulmonologist
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              padding: "7px 14px",
              borderRadius: "9px",
              fontSize: "12px",
              fontWeight: 700,
              color: "#e8445a",
              cursor: "pointer",
              border: "1px solid rgba(232,68,90,0.3)",
              background: "rgba(232,68,90,0.06)",
              transition: "all 0.18s",
              fontFamily: "'Nunito', sans-serif",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="wheezease-admin-sidebar-styling">
        {/* SIDEBAR */}
        {( activeSection === "patients") && (
          <div
            style={{
              background: THEME_COLORS.white,
              borderRight: `1px solid ${THEME_COLORS.border}`,
              display: "flex",
              flexDirection: "column",
            }}
            className="patient-sidebar"
          >
            <div
              style={{
                padding: "16px",
                borderBottom: `1px solid ${THEME_COLORS.border}`,
              }}
            >
              <h3
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  color: THEME_COLORS.text,
                  marginBottom: "10px",
                }}
              >
                All Patients{" "}
                <span style={{ color: THEME_COLORS.muted, fontWeight: 600 }}>
                  ({filteredPatients.length})
                </span>
              </h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: THEME_COLORS.bg,
                  border: `1px solid ${THEME_COLORS.border}`,
                  borderRadius: "10px",
                  padding: "8px 12px",
                }}
              >
                <span style={{ fontSize: "14px", color: THEME_COLORS.dim }}>
                  🔍
                </span>
                <input
                  placeholder="Search name or ID…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: "none",
                    background: "none",
                    outline: "none",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "13px",
                    color: THEME_COLORS.text,
                    width: "100%",
                  }}
                />
              </div>
            </div>

            {/* Filter Buttons */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                padding: "10px 16px",
                borderBottom: `1px solid ${THEME_COLORS.border}`,
              }}
            >
              {(["all", "high", "mod", "low"] as PtFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setPtFilter(f)}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: "8px",
                    border: "none",
                    fontFamily: "'Nunito', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color:
                      ptFilter === f ? THEME_COLORS.blue : THEME_COLORS.muted,
                    background:
                      ptFilter === f ? THEME_COLORS.blueBg : "none",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    transition: "all 0.15s",
                  }}
                >
                  {f === "all"
                    ? "All"
                    : f === "high"
                      ? "High"
                      : f === "mod"
                        ? "Mod"
                        : "Low"}
                </button>
              ))}
            </div>

            {/* Patient List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredPatients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedPatientId(p.id);
                    setActiveSection("patients");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    cursor: "pointer",
                    borderBottom: `1px solid ${THEME_COLORS.border}`,
                    background:
                      p.id === selectedPatientId
                        ? THEME_COLORS.blueBg
                        : "none",
                    borderLeft:
                      p.id === selectedPatientId
                        ? `3px solid ${THEME_COLORS.blue}`
                        : "none",
                    transition: "background 0.14s",
                  }}
                >
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#fff",
                      background: p.color,
                      flexShrink: 0,
                    }}
                  >
                    {p.av}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: THEME_COLORS.text,
                      }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: THEME_COLORS.muted,
                        marginTop: "1px",
                      }}
                    >
                      {p.cond} · {p.age}y
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "3px 8px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: 800,
                      background: riskBg(p.risk),
                      color: riskColor(p.risk),
                      flexShrink: 0,
                    }}
                  >
                    {p.risk}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        {activeSection === "overview" && (
          <OverviewPage
            patients={patients}
            alerts={alerts}
            weekData={WEEK_DATA}
            onViewPatient={setSelectedPatientId}
            onNavigate={(section: string) => setActiveSection(section as Section)}
          />
        )}
        {activeSection === "patients" && (
          <PatientsPage
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            onOpenChat={openChat}
          />
        )}
        {activeSection === "alerts" && (
          <AlertsPage
            alerts={alerts}
            alertFilter={alertFilter}
            onFilterChange={setAlertFilter}
            onMarkAsRead={markAlertAsRead}
          />
        )}
        {activeSection === "analytics" && (
          <AnalyticsPage patients={patients} />
        )}
        {activeSection === "messages" && (
          <MessagesPage
            patients={patients}
            chats={chats}
            activeChatId={activeChatId}
            onSetActiveChatId={setActiveChatId}
            onSendMessage={sendChat}
          />
        )}
        {activeSection === "settings" && (
          <SettingsPage onSave={() => console.log("Settings saved")} />
        )}
      </div>
    </div>
  );
};

// ============================================================
// ROOT APP — handles routing between login and dashboard
// ============================================================
const WheezeEase: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected route — dashboard */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            // </ProtectedRoute>
          }
        />

        {/* Default — redirect based on auth */}
        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default WheezeEase;