import React, { useState, useEffect } from 'react';
import StatCard from '../Components/Overview/StatCard';
import PatientRiskFeed from '../Components/Overview/PatientRiskFeed';
import WeekRiskChart from '../Components/Overview/WeekRiskChart';
import RecentAlerts from '../Components/Overview/RecentAlerts';
import { type Patient, type Alert, type WeekData, type DashboardStats } from '../types/dashboard.types';
import {
  Users, ShieldCheck, AlertTriangle, AlertOctagon,
  Activity, Wind, CloudFog, CheckCircle2, TrendingDown,
  BrainCircuit, Droplets, Thermometer, Gauge, Bell
} from 'lucide-react';
import PatientInsightsDrawer from '../Components/patients/PatientInsightsDrawer';
import { type Patient as DirectoryPatient } from '../../types/patient.types';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 9,
    lowRisk: 4,
    moderateRisk: 3,
    highRisk: 2,
  });

  const [patients] = useState<Patient[]>([
    { id:'P-041', name:'Sara Ahmed',      av:'SA', age:34, gender:'F', cond:'Asthma',            risk:78, trend:'up',   inhaler:4, aqi:158, pollen:'High', humidity:67, temp:34, med:'Salbutamol + Fluticasone',    lastVisit:'Feb 18', notes:'Worsening this week. High pollen exposure. Monitor daily.', color:'#e84393' },
    { id:'P-012', name:'Mohammad Khan',   av:'MK', age:52, gender:'M', cond:'COPD + Allergy',     risk:71, trend:'up',   inhaler:3, aqi:142, pollen:'High', humidity:70, temp:33, med:'Tiotropium + Montelukast',    lastVisit:'Feb 22', notes:'History of severe attacks in spring. Close monitoring needed.', color:'#e84343' },
    { id:'P-025', name:'Bilal Chaudhry', av:'BC', age:23, gender:'M', cond:'Asthma + Allergy',   risk:63, trend:'up',   inhaler:2, aqi:130, pollen:'Med',  humidity:65, temp:32, med:'Montelukast + Salbutamol',    lastVisit:'Feb 25', notes:'Stress-induced flares. Advised breathing exercises.', color:'#9b43e8' },
    { id:'P-027', name:'Fatima Noor',    av:'FN', age:28, gender:'F', cond:'Seasonal Allergy',   risk:55, trend:'up',   inhaler:1, aqi:112, pollen:'High', humidity:62, temp:31, med:'Cetirizine + Fluticasone',    lastVisit:'Mar 01', notes:'Pollen allergy flare expected this week.', color:'#f5a623' },
    { id:'P-033', name:'Usman Iqbal',    av:'UI', age:45, gender:'M', cond:'Asthma',             risk:47, trend:'flat', inhaler:1, aqi:95,  pollen:'Med',  humidity:58, temp:30, med:'Budesonide + Formoterol',     lastVisit:'Feb 28', notes:'Stable. Continue current regimen.', color:'#3a8eff' },
    { id:'P-061', name:'Ayesha Raza',    av:'AR', age:24, gender:'F', cond:'Seasonal Allergy',   risk:38, trend:'flat', inhaler:0, aqi:88,  pollen:'Med',  humidity:60, temp:30, med:'Azelastine nasal spray',      lastVisit:'Mar 02', notes:'Mild symptoms. Indoor air filter recommended.', color:'#20b2aa' },
    { id:'P-038', name:'Zara Butt',      av:'ZB', age:18, gender:'F', cond:'Dust Allergy',       risk:22, trend:'down', inhaler:0, aqi:78,  pollen:'Low',  humidity:55, temp:29, med:'Loratadine',                  lastVisit:'Mar 03', notes:'Responding well. Reduce home dust exposure.', color:'#22c87a' },
    { id:'P-008', name:'Ali Javed',      av:'AJ', age:61, gender:'M', cond:'Asthma',             risk:14, trend:'down', inhaler:0, aqi:72,  pollen:'Low',  humidity:52, temp:28, med:'Salmeterol + Fluticasone',    lastVisit:'Mar 05', notes:'Excellent control. Consider reducing steroid dose.', color:'#22c87a' },
    { id:'P-015', name:'Hina Malik',     av:'HM', age:38, gender:'F', cond:'Allergy',            risk:9,  trend:'down', inhaler:0, aqi:65,  pollen:'Low',  humidity:50, temp:27, med:'Fexofenadine',                lastVisit:'Mar 06', notes:'In remission. Seasonal monitoring advised.', color:'#22c87a' },
  ]);

  const [alerts] = useState<Alert[]>([
    { id:1, pid:'P-041', patient:'Sara Ahmed',     type:'high', msg:'Risk jumped to 78% — possible attack imminent', time:'4m ago',  icon:<AlertOctagon size={14}/>, read:false },
    { id:2, pid:'P-041', patient:'Sara Ahmed',     type:'high', msg:'4th inhaler use detected — overuse risk',        time:'9m ago',  icon:<Wind size={14}/>,         read:false },
    { id:3, pid:'P-012', patient:'Mohammad Khan',  type:'high', msg:'AQI exceeded 150 — active trigger zone',          time:'22m ago', icon:<CloudFog size={14}/>,     read:false },
    { id:4, pid:'P-025', patient:'Bilal Chaudhry', type:'mod',  msg:'Risk rising to 63% — chest tightness reported',  time:'1h ago',  icon:<AlertTriangle size={14}/>,read:true  },
    { id:5, pid:'P-027', patient:'Fatima Noor',    type:'mod',  msg:'Wheezing reported — risk escalating',             time:'2h ago',  icon:<Activity size={14}/>,     read:true  },
    { id:6, pid:'P-038', patient:'Zara Butt',      type:'low',  msg:'Daily check-in complete — all clear',             time:'3h ago',  icon:<CheckCircle2 size={14}/>, read:true  },
    { id:7, pid:'P-008', patient:'Ali Javed',      type:'low',  msg:'Risk decreased to 14% — good trend',             time:'5h ago',  icon:<TrendingDown size={14}/>, read:true  },
  ]);

  const [weekData] = useState<WeekData[]>([
    { day:'Mon', high:4,  mod:11, low:28 },
    { day:'Tue', high:3,  mod:12, low:27 },
    { day:'Wed', high:5,  mod:13, low:26 },
    { day:'Thu', high:6,  mod:14, low:25 },
    { day:'Fri', high:5,  mod:12, low:27 },
    { day:'Sat', high:7,  mod:13, low:24 },
    { day:'Now', high:2,  mod:3,  low:4  },
  ]);

  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const date = now.toLocaleDateString('en-GB', { weekday:'short', day:'2-digit', month:'short' });
      const time = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
      setCurrentTime(`${date} · ${time}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const high = patients.filter(p => p.risk >= 61).length;
    const mod  = patients.filter(p => p.risk >= 31 && p.risk < 61).length;
    const low  = patients.filter(p => p.risk < 31).length;
    setStats({ totalPatients: patients.length, lowRisk: low, moderateRisk: mod, highRisk: high });
  }, [patients]);

  /* Environmental snapshot derived from patient data */
  const maxAQI     = Math.max(...patients.map(p => p.aqi));
  const avgHumidity = Math.round(patients.reduce((s, p) => s + p.humidity, 0) / patients.length);
  const highPollen  = patients.filter(p => p.pollen === 'High').length;
  const pollenLevel = highPollen >= 4 ? 'High' : highPollen >= 2 ? 'Moderate' : 'Low';
  const avgTemp     = Math.round(patients.reduce((s, p) => s + p.temp, 0) / patients.length);

  const unread = alerts.filter(a => !a.read).length;

  const [selectedPatient, setSelectedPatient] = useState<DirectoryPatient | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePatientClick = (p: Patient) => {
    // Map dashboard patient to directory patient structure for drawer
    const mapped: DirectoryPatient = {
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender === 'F' ? 'Female' : 'Male',
      blood: 'O+', // fallback
      condition: p.cond,
      status: p.risk >= 61 ? 'critical' : p.risk >= 31 ? 'watch' : 'stable',
      lastActive: 'Now',
      phone: '',
      email: '',
      city: 'Gujrat',
      initials: p.av,
      avatarBg: p.color,
      avatarColor: '#FFFFFF',
      allergies: [],
      triggers: [],
      vitals: { spo2: '98%', peakFlow: '450', heartRate: '72', temp: '37' },
      risk: { level: p.risk >= 61 ? 'High' : p.risk >= 31 ? 'Medium' : 'Low', score: p.risk, factors: [] },
      symptoms: [],
      medications: [{ name: p.med, dose: 'As prescribed', freq: 'Daily' }],
      ai: [],
      history: []
    };
    setSelectedPatient(mapped);
    setIsDrawerOpen(true);
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
        <StatCard icon={<Users size={22}/>}        value={stats.totalPatients} label="Total Patients"  subLabel="6 checked in today"                   color="blue"  delay={0}    />
        <StatCard icon={<ShieldCheck size={22}/>}  value={stats.lowRisk}       label="Low Risk"        subLabel="Stable · Safe today"                  color="green" delay={0.06} />
        <StatCard icon={<AlertTriangle size={22}/>} value={stats.moderateRisk} label="Moderate Risk"   subLabel="Monitor closely"                      color="amber" delay={0.12} />
        <StatCard icon={<AlertOctagon size={22}/>} value={stats.highRisk}      label="High Risk"       subLabel={`${unread} unread alert${unread!==1?'s':''}`} color="red" delay={0.18} />
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
            High pollen levels and elevated AQI ({maxAQI}) detected in Gujrat — directly correlating with rising respiratory risk in {stats.highRisk + stats.moderateRisk} patients.
            Sara Ahmed (78%) and Mohammad Khan (71%) are at imminent risk. Preventive inhaler protocols and indoor advisories recommended immediately.
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
        onEditProfile={(p) => alert(`Editing profile for ${p.name}`)}
        onSendUrgentAlert={(p) => alert(`URGENT ALERT SENT to ${p.name}`)}
      />
    </div>
  );
};

export default Overview;