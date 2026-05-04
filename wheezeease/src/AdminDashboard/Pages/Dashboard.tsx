import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../Admin.module.css/AdminDashboard.css';
import { 
  Users, Activity, AlertTriangle, Server, Search, Bell, 
  Send, CheckCircle, X 
} from 'lucide-react';

// --- Types & Constants ---
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

const ALERTS_DATA: Alert[] = [
  {
    id: 1,
    title: "Matt Smith — Severe Flare-up",
    subtitle: "SpO₂ dropped to 88% · Salbutamol used 4× today",
    time: "2 min ago · Emergency",
    severity: "critical",
    icon: "🫁",
    patientName: "Matt Smith",
    detail: "Patient Matt Smith (WE-2024-0034) has experienced a severe asthma flare-up. SpO₂ has fallen to 88%. Gujrat AQI is 148 — environmental trigger. Immediate review recommended.",
    actions: ["Call Emergency Contact", "Notify Dr. Ahmad", "Dispatch Nurse"]
  },
  {
    id: 2,
    title: "Gujrat AQI Spike — 148",
    subtitle: "12 patients in high-risk zone affected",
    time: "15 min ago · Environmental",
    severity: "high",
    icon: "🌿",
    detail: "Air Quality Index in Gujrat has spiked to 148 (Unhealthy). Grass pollen levels are critical.",
    actions: ["Send AQI Alert", "Log Environmental Event"]
  },
  {
    id: 6,
    title: "System: SMS Gateway Degraded",
    subtitle: "Message delivery delay >4 min detected",
    time: "5 hr ago · System",
    severity: "high",
    icon: "⚠️",
    detail: "The SMS Gateway service is experiencing degraded performance.",
    actions: ["View Error Logs", "Switch to Email Fallback"]
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

// --- Helper Components ---
const StatCard = ({ title, value, trend, icon, color, onClick }: any) => (
  <div className="stat-card" style={{ backgroundColor: color }} onClick={onClick}>
    <div className="stat-card-icon">{icon}</div>
    <div className="stat-card-content">
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-trend">{trend}</div>
    </div>
  </div>
);

// --- Main Dashboard Component ---
const Dashboard: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAllAlertsOpen, setIsAllAlertsOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [emergencyMsg, setEmergencyMsg] = useState("");
  const [chartRange, setChartRange] = useState<ChartRange>("7d");
  const [metrics, setMetrics] = useState<MetricData>({
    cpu: 34, memory: 61, storage: 42, apiLatency: 128, dbConnections: 18, aiLoad: 72
  });
  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 3000);
  }, []);

  // Performance Optimization: Memoize alert lists
  const criticalAlertsCount = useMemo(() => ALERTS_DATA.filter(a => a.severity === "critical").length, []);
  const recentAlerts = useMemo(() => ALERTS_DATA.slice(0, 3), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpu: Math.min(95, Math.max(15, prev.cpu + (Math.random() - 0.5) * 6)),
        apiLatency: Math.min(350, Math.max(80, prev.apiLatency + (Math.random() - 0.5) * 15)),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSendEmergencyBroadcast = () => {
    if (emergencyMsg.trim()) {
      showToast(`📢 Emergency broadcast sent to all patients`);
      setEmergencyMsg("");
      setIsAllAlertsOpen(false);
    } else {
      showToast("Please enter an emergency message");
    }
  };

  return (
    <div className="dashboard">
      {toast.visible && <div className="toast"><CheckCircle size={16} /> {toast.message}</div>}

      <header className="header">
        <div className="header-left">
          <h1 className="header-title">WheezeEase <span className="header-badge">Admin</span></h1>
          <p className="header-greeting">Welcome back, Dr. Sarah</p>
        </div>
        <div className="header-right">
          <div className="search-bar"><Search size={16} /><input type="text" placeholder="Search..." /></div>
          <button className="icon-button"><Bell size={18} /></button>
          <div className="avatar">SA</div>
        </div>
      </header>

      <main className="main-content">
        <div className="stats-grid">
          <StatCard title="Total Patients" value="284" trend="↑ 12%" icon={<Users size={20} />} color="#f8fafc" onClick={() => {}} />
          <StatCard title="Active Sessions" value="47" trend="● Live" icon={<Activity size={20} />} color="#f0fdf4" onClick={() => {}} />
          <StatCard title="Critical Alerts" value={criticalAlertsCount} trend="↑ 3 new" icon={<AlertTriangle size={20} />} color="#fef2f2" onClick={() => setIsAllAlertsOpen(true)} />
        </div>

        <div className="two-column">
          <div className="chart-card">
            <div className="card-header">
               <div className="card-title"><Activity size={18} /> Patient Activity</div>
               <div className="chart-tabs">
                {['7d', '30d', '90d'].map((r) => (
                  <button key={r} className={`chart-tab ${chartRange === r ? 'active' : ''}`} onClick={() => setChartRange(r as ChartRange)}>{r}</button>
                ))}
               </div>
            </div>
            <div className="chart-container">
              <ActivityChart data={CHART_DATA[chartRange]} />
            </div>
          </div>

          <div className="right-panel">
            <div className="broadcast-card">
              <div className="card-title"><Send size={18} /> Broadcast</div>
              <textarea 
                className="broadcast-textarea" 
                placeholder="Message to patients..." 
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              />
              <button className="broadcast-button" onClick={() => { showToast("Sent!"); setBroadcastMessage(""); }}>Send</button>
            </div>
          </div>
        </div>
      </main>

      {/* Emergency Modal */}
      {isAllAlertsOpen && (
        <div className="modal-overlay" onClick={() => setIsAllAlertsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Emergency Broadcast</h3>
              <X className="modal-close" onClick={() => setIsAllAlertsOpen(false)} />
            </div>
            <div className="modal-body">
              <textarea 
                className="emergency-textarea" 
                placeholder="Enter emergency instructions..." 
                value={emergencyMsg}
                onChange={(e) => setEmergencyMsg(e.target.value)}
              />
              <button className="broadcast-emergency" onClick={handleSendEmergencyBroadcast}>Broadcast Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SVG Chart Component ---
const ActivityChart: React.FC<{ data: any }> = ({ data }) => {
  const width = 600;
  const height = 150;
  const maxValue = Math.max(...data.newPatients, ...data.flareups) + 5;
  const getY = (v: number) => height - (v / maxValue) * height;
  const getX = (i: number) => (i / (data.labels.length - 1)) * width;

  const points = (arr: number[]) => arr.map((v, i) => `${getX(i)},${getY(v)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="none">
      <polyline points={points(data.newPatients)} fill="none" stroke="#8b5cf6" strokeWidth="3" />
      <polyline points={points(data.flareups)} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" />
    </svg>
  );
};

export default Dashboard;