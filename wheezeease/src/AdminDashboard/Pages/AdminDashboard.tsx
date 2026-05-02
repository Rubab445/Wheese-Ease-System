import React, { useState, useEffect, useCallback } from 'react';
import '../Admin.module.css/AdminDashboard.css'
import { 
  Users, Activity, AlertTriangle, Server, Search, Bell, 
  Send, CheckCircle, X 
} from 'lucide-react';

// --- Types ---
type AlertSeverity = 'critical' | 'high' | 'medium';
type ChartRange = '7d' | '30d' | '90d';

interface Alert {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  severity: AlertSeverity;
  icon: string;
  detail: string;
  actions: string[];
  patientName?: string;
}

interface MetricData {
  cpu: number;
  memory: number;
  storage: number;
  apiLatency: number;
  dbConnections: number;
  aiLoad: number;
}

// --- Mock Data ---
const ALERTS_DATA: Alert[] = [
  {
    id: 1,
    title: "Matt Smith — Severe Flare-up",
    subtitle: "SpO₂ dropped to 88% · Salbutamol used 4× today",
    time: "2 min ago · Emergency",
    severity: "critical",
    icon: "🫁",
    patientName: "Matt Smith",
    detail: "Patient Matt Smith (WE-2024-0034) has experienced a severe asthma flare-up. SpO₂ has fallen to 88% (normal: >95%). He has used his Salbutamol rescue inhaler 4 times today, indicating uncontrolled asthma. Gujrat AQI is 148 — this is likely an environmental trigger. Immediate clinical review recommended.",
    actions: ["Call Emergency Contact", "Notify Dr. Ahmad", "Dispatch Community Nurse"]
  },
  {
    id: 2,
    title: "Gujrat AQI Spike — 148",
    subtitle: "12 patients in high-risk zone affected",
    time: "15 min ago · Environmental",
    severity: "high",
    icon: "🌿",
    detail: "Air Quality Index in Gujrat has spiked to 148 (Unhealthy). Grass pollen levels are critical. 12 of your registered patients live in the affected zone. AI model predicts a 38% higher flare-up probability for the next 24 hours.",
    actions: ["Send AQI Alert to Patients", "Increase Preventer Dose Advisory", "Log Environmental Event"]
  },
  {
    id: 3,
    title: "Ayesha Khan — Missed Doses",
    subtitle: "3 consecutive missed Seretide doses detected",
    time: "1 hr ago · Adherence",
    severity: "medium",
    icon: "💊",
    patientName: "Ayesha Khan",
    detail: "Patient Ayesha Khan has missed her Seretide controller inhaler for 3 consecutive doses. Her adherence rate has dropped to 52% this week. Without controller medication, her risk of a flare-up increases significantly.",
    actions: ["Send Reminder SMS", "Flag for Follow-up Call", "Adjust Prescription Schedule"]
  },
  {
    id: 4,
    title: "Hassan Malik — Peak Flow Drop",
    subtitle: "PF 295 L/min — 24% below personal best",
    time: "2 hr ago · Clinical",
    severity: "medium",
    icon: "📉",
    patientName: "Hassan Malik",
    detail: "Hassan Malik's recorded peak flow is 295 L/min, which is 24% below his personal best of 390 L/min. This drop is clinically significant and may indicate worsening airway obstruction.",
    actions: ["Schedule Urgent Review", "Send Spirometry Request", "Notify Primary Doctor"]
  },
  {
    id: 5,
    title: "Fatima Noor — New Diagnosis",
    subtitle: "Occupational asthma confirmed · Plan needed",
    time: "3 hr ago · Clinical",
    severity: "medium",
    icon: "🩺",
    patientName: "Fatima Noor",
    detail: "Fatima Noor has been newly diagnosed with Occupational Asthma following spirometry results. A personalised treatment plan has not yet been created.",
    actions: ["Create Treatment Plan", "Refer to Specialist", "Schedule Follow-up"]
  },
  {
    id: 6,
    title: "System: SMS Gateway Degraded",
    subtitle: "Message delivery delay >4 min detected",
    time: "5 hr ago · System",
    severity: "high",
    icon: "⚠️",
    detail: "The SMS Gateway service is experiencing degraded performance. Message delivery is delayed by an average of 4+ minutes.",
    actions: ["View Error Logs", "Switch to Email Fallback", "Notify Engineering"]
  },
];

const CHART_DATA = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    newPatients: [8, 12, 7, 15, 10, 6, 14],
    flareups: [3, 5, 2, 8, 4, 2, 6],
    recovered: [5, 8, 6, 10, 7, 4, 9]
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    newPatients: [28, 35, 22, 41],
    flareups: [12, 18, 8, 22],
    recovered: [18, 24, 16, 30]
  },
  '90d': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    newPatients: [85, 102, 78, 130, 95, 72, 118, 140, 88],
    flareups: [32, 48, 25, 62, 40, 20, 55, 70, 30],
    recovered: [55, 72, 52, 88, 62, 45, 80, 98, 58]
  }
};

const SERVICES = [
  { name: "AI Prediction Engine", status: "online", dotColor: "#10b981" },
  { name: "AQI Feed Connector", status: "online", dotColor: "#10b981" },
  { name: "Patient Portal", status: "online", dotColor: "#10b981" },
  { name: "SMS Gateway", status: "degraded", dotColor: "#f59e0b" },
  { name: "E-Prescription Service", status: "online", dotColor: "#10b981" }
];

// --- Helper Components ---
const AdminStatCard: React.FC<{
  title: string;
  value: string | number;
  trend: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}> = ({ title, value, trend, icon, color, onClick }) => (
  <div className="admin-stat-card" style={{ backgroundColor: color }} onClick={onClick}>
    <div className="admin-stat-card-icon">{icon}</div>
    <div className="admin-stat-card-content">
      <div className="admin-stat-card-value">{value}</div>
      <div className="admin-stat-card-title">{title}</div>
      <div className="admin-stat-card-trend">{trend}</div>
    </div>
  </div>
);

const AdminAlertItem: React.FC<{
  alert: Alert;
  onClick: () => void;
}> = ({ alert, onClick }) => {
  const severityColor = {
    critical: { bg: "#fef2f2", text: "#dc2626", border: "#fee2e2" },
    high: { bg: "#fff7ed", text: "#ea580c", border: "#ffedd5" },
    medium: { bg: "#fffbeb", text: "#d97706", border: "#fef3c7" }
  }[alert.severity];

  return (
    <div className="admin-alert-item" onClick={onClick}>
      <div className="admin-alert-icon" style={{ backgroundColor: severityColor.bg }}>
        <span>{alert.icon}</span>
      </div>
      <div className="admin-alert-content">
        <div className="admin-alert-title">{alert.title}</div>
        <div className="admin-alert-subtitle">{alert.subtitle}</div>
        <div className="admin-alert-time">{alert.time}</div>
      </div>
      <div className="admin-alert-badge" style={{ backgroundColor: severityColor.bg, color: severityColor.text }}>
        {alert.severity}
      </div>
    </div>
  );
};

const AdminHealthMetric: React.FC<{
  label: string;
  value: string;
  percent: number;
  color: string;
}> = ({ label, value, percent, color }) => (
  <div className="admin-health-metric">
    <div className="admin-health-metric-label">{label}</div>
    <div className="admin-health-metric-value">{value}</div>
    <div className="admin-health-metric-bar">
      <div className="admin-health-metric-fill" style={{ width: `${percent}%`, backgroundColor: color }} />
    </div>
  </div>
);

// --- Main Component ---
const Overview: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAllAlertsOpen, setIsAllAlertsOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("all");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [chartRange, setChartRange] = useState<ChartRange>("7d");
  const [metrics, setMetrics] = useState<MetricData>({
    cpu: 34,
    memory: 61,
    storage: 42,
    apiLatency: 128,
    dbConnections: 18,
    aiLoad: 72
  });
  const [notifications, setNotifications] = useState(true);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertModalOpen(true);
  };

  const handleResolveAlert = () => {
    if (selectedAlert) {
      showToast(`✓ Alert "${selectedAlert.title}" marked as resolved`);
      setIsAlertModalOpen(false);
      setSelectedAlert(null);
    }
  };

  const handleEscalateAlert = () => {
    if (selectedAlert) {
      showToast(`↑ Alert "${selectedAlert.title}" escalated to senior clinician`);
      setIsAlertModalOpen(false);
      setSelectedAlert(null);
    }
  };

  const handleAction = (action: string) => {
    showToast(`Processing: ${action}...`);
  };

  const handleSendBroadcast = () => {
    if (!broadcastMessage.trim()) {
      showToast("Please enter a message to broadcast");
      return;
    }
    setBroadcastSent(true);
    showToast(`📢 Broadcast sent to ${broadcastTarget} users`);
    setBroadcastMessage("");
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleSendEmergencyBroadcast = () => {
    const msg = (document.getElementById("admin-emergency-msg") as HTMLTextAreaElement)?.value;
    if (msg?.trim()) {
      showToast(`📢 Emergency broadcast sent to all patients`);
      setIsAllAlertsOpen(false);
    } else {
      showToast("Please enter an emergency message");
    }
  };

  // Simulate live metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(95, Math.max(15, prev.cpu + (Math.random() - 0.5) * 6)),
        memory: Math.min(90, Math.max(40, prev.memory + (Math.random() - 0.5) * 4)),
        storage: prev.storage,
        apiLatency: Math.min(350, Math.max(80, prev.apiLatency + (Math.random() - 0.5) * 15)),
        dbConnections: Math.min(45, Math.max(8, prev.dbConnections + (Math.random() - 0.5) * 2)),
        aiLoad: Math.min(95, Math.max(45, prev.aiLoad + (Math.random() - 0.5) * 3))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const criticalAlerts = ALERTS_DATA.filter(a => a.severity === "critical");
  const recentAlerts = ALERTS_DATA.slice(0, 3);

  return (
    <div className="admin-dashboard">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="admin-toast">
          <CheckCircle size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-left">
          <h1 className="admin-header-title">
            Welcome Admin!
          </h1>
        </div>
        <div className="admin-header-right">
          <div className="admin-search-bar">
            <Search size={16} className="admin-search-icon" />
            <input type="text" placeholder="Search patients, reports..." />
          </div>
          <button className="admin-icon-button" onClick={() => setNotifications(!notifications)}>
            <Bell size={18} />
            {notifications && <span className="admin-notification-dot" />}
          </button>
        </div>
      </header>

      <main className="admin-main-content">
        {/* Stats Row */}
        <div className="admin-stats-grid">
          <AdminStatCard
            title="Total Patients"
            value="284"
            trend="↑ 12% this month"
            icon={<Users size={20} />}
            color="#47c6dc"
            onClick={() => showToast("Viewing 284 registered patients")}
          />
          <AdminStatCard
            title="Active Sessions"
            value="47"
            trend="● Live now"
            icon={<Activity size={20} />}
            color="#47c6dc"
            onClick={() => showToast("47 active sessions in progress")}
          />
          <AdminStatCard
            title="Critical Alerts"
            value={criticalAlerts.length.toString()}
            trend="↑ 3 new today"
            icon={<AlertTriangle size={20} />}
            color="#47c6dc"
            onClick={() => setIsAllAlertsOpen(true)}
          />
          <AdminStatCard
            title="System Uptime"
            value="99.8%"
            trend="Last 30 days"
            icon={<Server size={20} />}
            color="#47c6dc"
            onClick={() => showToast("System uptime: 99.8% over last 30 days")}
          />
        </div>

        {/* Two Column Layout */}
        <div className="admin-two-column">
          {/* Chart Section */}
          <div className="admin-chart-card">
            <div className="admin-card-header">
              <div className="admin-card-title">
                <Activity size={18} />
                Patient Activity
              </div>
              <div className="admin-chart-tabs">
                {(["7d", "30d", "90d"] as ChartRange[]).map(range => (
                  <button
                    key={range}
                    className={`admin-chart-tab ${chartRange === range ? "active" : ""}`}
                    onClick={() => setChartRange(range)}
                  >
                    {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-chart-legend">
              <div className="admin-legend-item"><span className="admin-legend-dot" style={{ backgroundColor: "#8b5cf6" }} />New Patients</div>
              <div className="admin-legend-item"><span className="admin-legend-dot" style={{ backgroundColor: "#f59e0b" }} />Flare-ups</div>
              <div className="admin-legend-item"><span className="admin-legend-dot" style={{ backgroundColor: "#10b981" }} />Recovered</div>
            </div>
            <div className="admin-chart-container">
              <ActivityChart data={CHART_DATA[chartRange]} />
            </div>
          </div>

          {/* Right Panel */}
          <div className="admin-right-panel">
            {/* Alerts */}
            <div className="admin-alerts-card">
              <div className="admin-card-header">
                <div className="admin-card-title">
                  <AlertTriangle size={18} />
                  Critical Alerts
                  <span className="admin-alert-badge-count">{criticalAlerts.length}</span>
                </div>
                <button className="admin-text-button" onClick={() => setIsAllAlertsOpen(true)}>See all</button>
              </div>
              <div className="admin-alerts-list">
                {recentAlerts.map(alert => (
                  <AdminAlertItem key={alert.id} alert={alert} onClick={() => handleAlertClick(alert)} />
                ))}
              </div>
            </div>

            {/* Broadcast */}
            <div className="admin-broadcast-card">
              <div className="admin-card-title">
                <Send size={18} />
                Broadcast Message
              </div>
              <textarea
                className="admin-broadcast-textarea"
                rows={2}
                placeholder="Type a message to send to all patients or doctors..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              />
              <div className="admin-broadcast-controls">
                <select
                  className="admin-broadcast-select"
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                >
                  <option value="all">All users</option>
                  <option value="patients">Patients only</option>
                  <option value="doctors">Doctors only</option>
                  <option value="critical">Critical patients</option>
                </select>
                <button className="admin-broadcast-button" onClick={handleSendBroadcast}>
                  <Send size={14} />
                  Send
                </button>
              </div>
              {broadcastSent && (
                <div className="admin-broadcast-success">
                  <CheckCircle size={14} />
                  Broadcast sent successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="admin-health-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <Server size={18} />
              System Health
            </div>
            <div className="admin-health-badge">● All Systems Operational</div>
          </div>
          <div className="admin-health-metrics-grid">
            <AdminHealthMetric label="CPU Usage" value={`${Math.round(metrics.cpu)}%`} percent={metrics.cpu} color="#8b5cf6" />
            <AdminHealthMetric label="Memory" value={`${Math.round(metrics.memory)}%`} percent={metrics.memory} color="#3b82f6" />
            <AdminHealthMetric label="Storage" value={`${Math.round(metrics.storage)}%`} percent={metrics.storage} color="#10b981" />
            <AdminHealthMetric label="API Latency" value={`${Math.round(metrics.apiLatency)}ms`} percent={Math.min(100, metrics.apiLatency / 350 * 100)} color="#f59e0b" />
            <AdminHealthMetric label="Active DB Conn." value={`${Math.round(metrics.dbConnections)}`} percent={(metrics.dbConnections / 50) * 100} color="#f97316" />
            <AdminHealthMetric label="AI Model Load" value={`${Math.round(metrics.aiLoad)}%`} percent={metrics.aiLoad} color="#a855f7" />
          </div>
          <div className="admin-services-list">
            <div className="admin-services-header">Services</div>
            {SERVICES.map(service => (
              <div key={service.name} className="admin-service-item">
                <div className="admin-service-left">
                  <div className="admin-service-dot" style={{ backgroundColor: service.dotColor }} />
                  <span>{service.name}</span>
                </div>
                <div className={`admin-service-status ${service.status === "online" ? "status-online" : "status-degraded"}`}>
                  {service.status === "online" ? "Online" : "Degraded"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Alert Detail Modal */}
      {isAlertModalOpen && selectedAlert && (
        <div className="admin-modal-overlay" onClick={() => setIsAlertModalOpen(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                <span>{selectedAlert.icon}</span>
                <span>{selectedAlert.title}</span>
              </div>
              <button className="admin-modal-close" onClick={() => setIsAlertModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-alert-detail-badge" style={{
                backgroundColor: selectedAlert.severity === "critical" ? "#fef2f2" : selectedAlert.severity === "high" ? "#fff7ed" : "#fffbeb",
                color: selectedAlert.severity === "critical" ? "#dc2626" : selectedAlert.severity === "high" ? "#ea580c" : "#d97706"
              }}>
                {selectedAlert.severity.toUpperCase()}
              </div>
              <div className="admin-alert-detail-time">{selectedAlert.time}</div>
              <p className="admin-alert-detail-text">{selectedAlert.detail}</p>
              <div className="admin-alert-actions">
                {selectedAlert.actions.map((action, idx) => (
                  <button key={idx} className="admin-alert-action-button" onClick={() => handleAction(action)}>
                    {action} →
                  </button>
                ))}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="admin-modal-button admin-resolve" onClick={handleResolveAlert}>
                <CheckCircle size={14} /> Mark Resolved
              </button>
              <button className="admin-modal-button admin-escalate" onClick={handleEscalateAlert}>
                <AlertTriangle size={14} /> Escalate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Alerts Modal */}
      {isAllAlertsOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAllAlertsOpen(false)}>
          <div className="admin-modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div className="admin-modal-title">
                <AlertTriangle size={18} />
                All Critical Alerts
                <span className="admin-alert-count-badge">{ALERTS_DATA.length}</span>
              </div>
              <button className="admin-modal-close" onClick={() => setIsAllAlertsOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="admin-modal-body admin-alerts-list-modal">
              {ALERTS_DATA.map(alert => (
                <div
                  key={alert.id}
                  className="admin-alert-modal-item"
                  onClick={() => {
                    handleAlertClick(alert);
                    setIsAllAlertsOpen(false);
                  }}
                >
                  <div className="admin-alert-icon">{alert.icon}</div>
                  <div className="admin-alert-content">
                    <div className="admin-alert-title">{alert.title}</div>
                    <div className="admin-alert-subtitle">{alert.subtitle}</div>
                    <div className="admin-alert-time">{alert.time}</div>
                  </div>
                  <div className="admin-alert-badge">{alert.severity}</div>
                </div>
              ))}
            </div>
            <div className="admin-modal-footer admin-broadcast-footer">
              <textarea
                id="admin-emergency-msg"
                className="admin-emergency-textarea"
                rows={1}
                placeholder="Broadcast emergency message to all patients..."
              />
              <button className="admin-broadcast-emergency" onClick={handleSendEmergencyBroadcast}>
                <Send size={14} /> Broadcast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Chart Component using SVG for simplicity ---
const ActivityChart: React.FC<{ data: typeof CHART_DATA['7d'] }> = ({ data }) => {
  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 10, bottom: 20, left: 35 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(
    ...data.newPatients,
    ...data.flareups,
    ...data.recovered
  ) + 10;

  const getY = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  const linePoints = (values: number[]) =>
    values.map((v, i) => `${padding.left + (i / (data.labels.length - 1)) * chartWidth},${getY(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="admin-chart-svg">
      {/* Y-axis labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
        const value = Math.round(maxValue * (1 - tick));
        const y = padding.top + chartHeight * tick;
        return (
          <g key={i}>
            <text x={padding.left - 8} y={y + 4} textAnchor="end" className="admin-chart-axis-label">{value}</text>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.labels.map((label, i) => {
        const x = padding.left + (i / (data.labels.length - 1)) * chartWidth;
        return (
          <text key={i} x={x} y={height - 5} textAnchor="middle" className="admin-chart-axis-label">
            {label}
          </text>
        );
      })}

      {/* Lines */}
      <polyline points={linePoints(data.newPatients)} fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <polyline points={linePoints(data.flareups)} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,4" />
      <polyline points={linePoints(data.recovered)} fill="none" stroke="#10b981" strokeWidth="2" />

      {/* Area under New Patients */}
      <polygon
        points={`${padding.left},${getY(0)} ${linePoints(data.newPatients)} ${padding.left + chartWidth},${getY(0)}`}
        fill="rgba(139, 92, 246, 0.05)"
      />
    </svg>
  );
};

export default Overview;