import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '../Components/Overview/StatCard';
import PatientRiskFeed from '../Components/Overview/PatientRiskFeed';
import WeekRiskChart from '../Components/Overview/WeekRiskChart';
import RecentAlerts from '../Components/Overview/RecentAlerts';
import { type Patient, type Alert, type WeekData, type DashboardStats } from '../types/dashboard.types';
import { fetchDashboardStats, fetchPatients, fetchAlerts } from '../../lib/patientService';
import {
  Users, ShieldCheck, AlertTriangle, AlertOctagon,
  Activity, Wind, CloudFog,
  BrainCircuit, Droplets, Thermometer, Gauge
} from 'lucide-react';
import PatientInsightsDrawer from '../Components/patients/PatientInsightsDrawer';
import { type Patient as DirectoryPatient } from '../../types/patient.types';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const AVATAR_COLORS_DASH = ['#e84393', '#e84343', '#9b43e8', '#f5a623', '#3a8eff', '#22c87a', '#20b2aa'];

function mapToDashPatient(p: DirectoryPatient, i: number): Patient {
  const score = p.risk.score;
  return {
    id: p.id,
    name: p.name,
    av: p.initials,
    age: p.age,
    gender: p.gender === 'Female' ? 'F' : 'M',
    cond: p.condition,
    risk: score,
    trend: p.status === 'critical' ? 'up' : p.status === 'watch' ? 'up' : 'flat',
    inhaler: p.symptoms.some(s => s.name === 'Inhaler Used') ? 1 : 0,
    aqi: score >= 70 ? 148 : score >= 40 ? 115 : 78,
    pollen: score >= 70 ? 'High' : score >= 40 ? 'Med' : 'Low',
    humidity: score >= 70 ? 67 : score >= 40 ? 62 : 55,
    temp: 30,
    med: p.medications[0]?.name ?? 'As prescribed',
    lastVisit: p.lastActive,
    notes: p.ai[0]?.desc ?? 'Monitoring in progress.',
    color: AVATAR_COLORS_DASH[i % AVATAR_COLORS_DASH.length],
  };
}

function timeAgoFromISO(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    lowRisk: 0,
    moderateRisk: 0,
    highRisk: 0,
  });

  useEffect(() => {
    fetchDashboardStats().then(s => setStats({
      totalPatients: s.totalPatients,
      lowRisk: s.lowRisk,
      moderateRisk: s.moderateRisk,
      highRisk: s.highRisk,
    }));
  }, []);

  const [rawPatients, setRawPatients] = useState<DirectoryPatient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetchPatients().then(data => {
      setRawPatients(data);
      setPatients(data.map((p, i) => mapToDashPatient(p, i)));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchAlerts().then(data => {
      setAlerts(data.map((a, i) => ({
        id: i + 1,
        pid: a.patientId ?? '',
        patient: a.patientName ?? 'Patient',
        type: a.severity === 'critical' ? 'high' as const : 'mod' as const,
        msg: a.message,
        time: timeAgoFromISO(a.timestamp),
        icon: a.severity === 'critical' ? <AlertOctagon size={14} /> : <AlertTriangle size={14} />,
        read: a.read,
      })));
    }).catch(() => {});
  }, []);

  const weekData = useMemo<WeekData[]>(() => {
    const h = stats.highRisk, m = stats.moderateRisk, l = stats.lowRisk;
    return [
      { day: 'Mon', high: Math.max(0, h - 1), mod: m, low: l },
      { day: 'Tue', high: h, mod: m, low: l },
      { day: 'Wed', high: Math.max(0, h - 1), mod: Math.max(0, m - 1), low: l },
      { day: 'Thu', high: h, mod: m, low: l },
      { day: 'Fri', high: h, mod: m, low: l },
      { day: 'Sat', high: Math.max(0, h - 1), mod: m, low: l },
      { day: 'Now', high: h, mod: m, low: l },
    ];
  }, [stats]);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' });
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setCurrentTime(`${date} · ${time}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);


  /* Environmental snapshot derived from patient data */
  const maxAQI = Math.max(...patients.map(p => p.aqi));
  const avgHumidity = Math.round(patients.reduce((s, p) => s + p.humidity, 0) / patients.length);
  const highPollen = patients.filter(p => p.pollen === 'High').length;
  const pollenLevel = highPollen >= 4 ? 'High' : highPollen >= 2 ? 'Moderate' : 'Low';
  const avgTemp = Math.round(patients.reduce((s, p) => s + p.temp, 0) / patients.length);

  const unread = alerts.filter(a => !a.read).length;

  const [selectedPatient, setSelectedPatient] = useState<DirectoryPatient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePatientClick = (p: Patient) => {
    const raw = rawPatients.find(r => r.id === p.id);
    if (raw) { setSelectedPatient(raw); setIsDrawerOpen(true); }
  };

  return (
    <div className="overview-content">

      {/* ── Page Header ── */}
      <div className="db-header">
        <div>
          <h1 className="dashboard-main-heading">Dashboard</h1>
          <p className="db-subtitle">WheezeEase · Clinical Overview · {currentTime}</p>
        </div>
        <div className="db-live-badge">
          <span className="live-dot" />
          Live Monitoring
        </div>
      </div>

      {/* ── Stats Row — 4 cards ── */}
      <div className="stats-row">
        <StatCard icon={<Users size={22} />} value={stats.totalPatients} label="Total Patients" subLabel="6 checked in today" color="blue" delay={0} />
        <StatCard icon={<ShieldCheck size={22} />} value={stats.lowRisk} label="Low Risk" subLabel="Stable · Safe today" color="green" delay={0.06} />
        <StatCard icon={<AlertTriangle size={22} />} value={stats.moderateRisk} label="Moderate Risk" subLabel="Monitor closely" color="amber" delay={0.12} />
        <StatCard icon={<AlertOctagon size={22} />} value={stats.highRisk} label="High Risk" subLabel={`${unread} unread alert${unread !== 1 ? 's' : ''}`} color="red" delay={0.18} />
      </div>

      {/* ── AI System Observation — full-width banner ── */}
      <div className="ai-obs-banner">
        <BrainCircuit size={22} className="ai-banner-icon" />
        <div className="ai-banner-body">
          <div className="ai-banner-title">
            AI System Observation
            <span className="ai-banner-label">LIVE</span>
          </div>
          <div className="ai-banner-text">
            {patients.length === 0
              ? 'Loading patient data... Ensure patients are linked to your doctor account in Supabase.'
              : (() => {
                  const topRisk = [...patients].sort((a, b) => b.risk - a.risk).slice(0, 2);
                  const atRisk = stats.highRisk + stats.moderateRisk;
                  return `Monitoring ${patients.length} patient${patients.length !== 1 ? 's' : ''}. ${atRisk > 0
                    ? `${topRisk.map(p => `${p.name} (${p.risk}%)`).join(' and ')} ${topRisk.length === 1 ? 'is' : 'are'} at elevated risk — preventive inhaler protocols recommended.`
                    : 'All patients currently stable. Continue routine monitoring.'}`;
                })()
            }
          </div>
        </div>
      </div>

      {/* ── Main 70/30 Grid ── */}
      <div className="main-grid">

        {/* ── LEFT COLUMN (70%) ── */}
        <div className="left-col">

          {/* Patient Risk Feed */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Activity size={15} />
                Patient Risk Feed
              </div>
              <button className="panel-link" onClick={() => navigate('/patients')}>View All →</button>
            </div>
            <PatientRiskFeed patients={patients} onPatientClick={handlePatientClick} />
          </div>

          {/* Recent Alerts */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <AlertTriangle size={15} />
                Recent Alerts
              </div>
              <button className="panel-link" onClick={() => navigate('/alerts')}>See All →</button>
            </div>
            <RecentAlerts alerts={alerts.slice(0, 6)} />
          </div>

        </div>

        {/* ── RIGHT COLUMN (30%) ── */}
        <div className="right-col">

          {/* Environmental Snapshot */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Wind size={15} />
                Environmental Snapshot
              </div>
              <span className="env-live-badge">Live · Gujrat</span>
            </div>
            <div className="env-body">

              {/* AQI */}
              <div className="env-metric-row">
                <div className={`env-metric-icon ${maxAQI >= 150 ? 'high' : maxAQI >= 100 ? 'mod' : 'low'}`}>
                  <Gauge size={18} />
                </div>
                <div className="env-metric-info">
                  <div className="env-metric-name">Air Quality Index</div>
                  <div className="env-metric-val">{maxAQI}</div>
                  <div className={`env-metric-status ${maxAQI >= 150 ? 'high' : maxAQI >= 100 ? 'mod' : 'low'}`}>
                    {maxAQI >= 150 ? 'Unhealthy' : maxAQI >= 100 ? 'Moderate' : 'Good'}
                  </div>
                </div>
              </div>

              {/* Pollen */}
              <div className="env-metric-row">
                <div className={`env-metric-icon ${pollenLevel === 'High' ? 'high' : pollenLevel === 'Moderate' ? 'mod' : 'low'}`}>
                  <CloudFog size={18} />
                </div>
                <div className="env-metric-info">
                  <div className="env-metric-name">Pollen Level</div>
                  <div className="env-metric-val">{pollenLevel}</div>
                  <div className={`env-metric-status ${pollenLevel === 'High' ? 'high' : pollenLevel === 'Moderate' ? 'mod' : 'low'}`}>
                    {pollenLevel === 'High' ? 'Avoid outdoor activity' : pollenLevel === 'Moderate' ? 'Use antihistamines' : 'Minimal impact'}
                  </div>
                </div>
              </div>

              {/* Humidity */}
              <div className="env-metric-row">
                <div className={`env-metric-icon ${avgHumidity >= 65 ? 'mod' : 'normal'}`}>
                  <Droplets size={18} />
                </div>
                <div className="env-metric-info">
                  <div className="env-metric-name">Humidity</div>
                  <div className="env-metric-val">{avgHumidity}%</div>
                  <div className={`env-metric-status ${avgHumidity >= 65 ? 'mod' : 'normal'}`}>
                    {avgHumidity >= 65 ? 'Elevated · Triggers mold' : 'Normal range'}
                  </div>
                </div>
              </div>

              {/* Temperature */}
              <div className="env-metric-row">
                <div className="env-metric-icon normal">
                  <Thermometer size={18} />
                </div>
                <div className="env-metric-info">
                  <div className="env-metric-name">Temperature</div>
                  <div className="env-metric-val">{avgTemp}°C</div>
                  <div className="env-metric-status normal">Hot · Stay hydrated</div>
                </div>
              </div>

            </div>
          </div>

          {/* 7-Day Risk Chart */}
          <div className="panel">
            <div className="panel-head">
              <div className="panel-title">
                <Activity size={15} />
                7-Day Risk Overview
              </div>
            </div>
            <WeekRiskChart data={weekData} />
          </div>

        </div>
      </div>
      {/* Side Drawer for Patient Insights */}
      <PatientInsightsDrawer
        isOpen={isDrawerOpen}
        patient={selectedPatient}
        onClose={() => setIsDrawerOpen(false)}
        onSendUrgentAlert={(p) => alert(`URGENT ALERT SENT to ${p.name}`)}
      />
    </div>
  );
};

export default Overview;