import { useState, useEffect, useRef, useCallback } from "react";

// ── GLOBAL STYLES ──────────────────────────────────────────────────────────────
const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Syne:wght@400;600;700;800&display=swap');`;

const CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Mono',monospace;background:#070d1a;color:#e8f4ff;overflow:hidden;}
  ::-webkit-scrollbar{width:4px;height:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(99,179,237,0.18);border-radius:2px;}
  input,textarea{font-family:'DM Mono',monospace;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.82)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
  @keyframes ripple{0%{transform:scale(0);opacity:.6}100%{transform:scale(4);opacity:0}}
  .fade-up{animation:fadeUp .45s ease both;}
  .slide-in{animation:slideIn .35s ease both;}
  .pulse-dot{animation:pulse 2s infinite;}
`;

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const INIT_PATIENTS = [
  { id:"P-0041", name:"Sara Ahmed",      age:34, gender:"F", condition:"Asthma",           risk:78, trend:"up",   inhalerToday:4, lastSymptom:"Wheezing",       aqi:158, pollen:"High", humidity:67, temp:34, dust:"Med",  medication:"Salbutamol + Fluticasone", lastVisit:"2026-02-18", alerts:3, checkedIn:true,  avatar:"SA", notes:"Patient reported worsening symptoms this week. High pollen exposure." },
  { id:"P-0012", name:"Mohammad Khan",   age:52, gender:"M", condition:"COPD + Allergy",   risk:71, trend:"up",   inhalerToday:3, lastSymptom:"Shortness of breath", aqi:142, pollen:"High",temp:33, humidity:70, dust:"High", medication:"Tiotropium + Montelukast",  lastVisit:"2026-02-22", alerts:2, checkedIn:true,  avatar:"MK", notes:"History of severe attacks in spring. Monitor closely." },
  { id:"P-0027", name:"Fatima Noor",     age:28, gender:"F", condition:"Seasonal Allergy", risk:55, trend:"up",   inhalerToday:1, lastSymptom:"Coughing",          aqi:112, pollen:"High",temp:31, humidity:62, dust:"Low",  medication:"Cetirizine + Fluticasone",  lastVisit:"2026-03-01", alerts:1, checkedIn:false, avatar:"FN", notes:"Pollen allergy flare expected this week due to weather." },
  { id:"P-0033", name:"Usman Iqbal",     age:45, gender:"M", condition:"Asthma",           risk:47, trend:"stable",inhalerToday:1, lastSymptom:"Mild wheeze",       aqi:95,  pollen:"Med", temp:30, humidity:58, dust:"Low",  medication:"Budesonide + Formoterol",   lastVisit:"2026-02-28", alerts:0, checkedIn:true,  avatar:"UI", notes:"Stable. Continue current medication regimen." },
  { id:"P-0019", name:"Zara Butt",       age:19, gender:"F", condition:"Dust Allergy",     risk:22, trend:"down",  inhalerToday:0, lastSymptom:"Sneezing",          aqi:78,  pollen:"Low", temp:29, humidity:55, dust:"Low",  medication:"Loratadine",                lastVisit:"2026-03-03", alerts:0, checkedIn:false, avatar:"ZB", notes:"Responding well to treatment. Reduce exposure at home." },
  { id:"P-0008", name:"Ali Javed",       age:61, gender:"M", condition:"Asthma",           risk:14, trend:"down",  inhalerToday:0, lastSymptom:"None reported",     aqi:72,  pollen:"Low", temp:28, humidity:52, dust:"Low",  medication:"Salmeterol + Fluticasone",  lastVisit:"2026-03-05", alerts:0, checkedIn:true,  avatar:"AJ", notes:"Excellent control. Reduce steroid dose next visit." },
  { id:"P-0015", name:"Hina Malik",      age:39, gender:"F", condition:"Allergy",          risk:9,  trend:"down",  inhalerToday:0, lastSymptom:"None",              aqi:65,  pollen:"Low", temp:27, humidity:50, dust:"Low",  medication:"Fexofenadine",              lastVisit:"2026-03-06", alerts:0, checkedIn:false, avatar:"HM", notes:"Patient in remission. Seasonal monitoring advised." },
  { id:"P-0055", name:"Bilal Chaudhry", age:31, gender:"M", condition:"Asthma + Allergy", risk:63, trend:"up",   inhalerToday:2, lastSymptom:"Chest tightness",  aqi:130, pollen:"Med", temp:32, humidity:65, dust:"Med",  medication:"Montelukast + Salbutamol",  lastVisit:"2026-02-25", alerts:1, checkedIn:true,  avatar:"BC", notes:"Stress-induced flares. Advised breathing exercises." },
  { id:"P-0061", name:"Ayesha Raza",    age:24, gender:"F", condition:"Seasonal Allergy", risk:38, trend:"stable",inhalerToday:0, lastSymptom:"Eye irritation",   aqi:88,  pollen:"Med", temp:30, humidity:60, dust:"Low",  medication:"Azelastine nasal spray",    lastVisit:"2026-03-02", alerts:0, checkedIn:false, avatar:"AR", notes:"Mild nasal symptoms. Indoor air filter recommended." },
];

const INIT_ALERTS = [
  { id:1, patientId:"P-0041", patient:"Sara Ahmed",    type:"high",   msg:"Risk jumped to 78% — possible attack imminent", time:"4 min ago",  read:false, icon:"🚨" },
  { id:2, patientId:"P-0041", patient:"Sara Ahmed",    type:"high",   msg:"4th inhaler use detected today — overuse risk",  time:"9 min ago",  read:false, icon:"💨" },
  { id:3, patientId:"P-0012", patient:"Mohammad Khan", type:"high",   msg:"AQI exceeded 150 — active trigger zone",         time:"22 min ago", read:false, icon:"🌫️" },
  { id:4, patientId:"P-0055", patient:"Bilal Chaudhry",type:"mod",    msg:"Risk rising to 63% — chest tightness reported",  time:"1h ago",     read:true,  icon:"⚠️" },
  { id:5, patientId:"P-0027", patient:"Fatima Noor",   type:"mod",    msg:"Wheezing reported — risk escalating to 55%",     time:"2h ago",     read:true,  icon:"🫁" },
  { id:6, patientId:"P-0019", patient:"Zara Butt",     type:"low",    msg:"Daily check-in completed — all clear",           time:"3h ago",     read:true,  icon:"✅" },
  { id:7, patientId:"P-0008", patient:"Ali Javed",     type:"low",    msg:"Risk decreased to 14% — good trend",             time:"5h ago",     read:true,  icon:"📉" },
];

const WEEK_DATA = [
  { day:"Mon", high:4,  mod:11, low:28 },
  { day:"Tue", high:3,  mod:12, low:27 },
  { day:"Wed", high:5,  mod:13, low:26 },
  { day:"Thu", high:6,  mod:14, low:25 },
  { day:"Fri", high:5,  mod:12, low:27 },
  { day:"Sat", high:7,  mod:13, low:24 },
  { day:"Now", high:6,  mod:13, low:29 },
];

const SYMPTOM_HISTORY = [
  { date:"Feb 25", cough:2, wheeze:1, breath:0, inhaler:1 },
  { date:"Feb 27", cough:3, wheeze:2, breath:1, inhaler:2 },
  { date:"Mar 01", cough:1, wheeze:1, breath:0, inhaler:1 },
  { date:"Mar 03", cough:4, wheeze:3, breath:2, inhaler:3 },
  { date:"Mar 05", cough:3, wheeze:2, breath:1, inhaler:2 },
  { date:"Mar 06", cough:5, wheeze:4, breath:3, inhaler:4 },
  { date:"Mar 07", cough:4, wheeze:4, breath:2, inhaler:4 },
];

// ── COLORS & HELPERS ──────────────────────────────────────────────────────────
const C = {
  bg:"#070d1a", surface:"#0d1626", surface2:"#111e33", surface3:"#162540",
  border:"rgba(99,179,237,0.12)", teal:"#00d4b4", tealDim:"rgba(0,212,180,0.13)",
  amber:"#f6a623", amberDim:"rgba(246,166,35,0.13)", red:"#ff4d6d", redDim:"rgba(255,77,109,0.13)",
  blue:"#4da6ff", blueDim:"rgba(77,166,255,0.1)", muted:"#6b8cad", dim:"#3a5570",
};

const riskColor = r => r >= 61 ? C.red : r >= 31 ? C.amber : C.teal;
const riskLabel = r => r >= 61 ? "High" : r >= 31 ? "Moderate" : "Low";
const riskDim   = r => r >= 61 ? C.redDim : r >= 31 ? C.amberDim : C.tealDim;
const trendIcon = t => t === "up" ? "↑" : t === "down" ? "↓" : "→";
const trendClr  = t => t === "up" ? C.red : t === "down" ? C.teal : C.amber;

const avatarColors = [
  ["#1a3a5c","#00d4b4"],["#3a1a2c","#ff4d6d"],["#1a3a1a","#4dd47a"],
  ["#3a2a1a","#f6a623"],["#1a2a3a","#4da6ff"],["#2a1a3a","#b47aff"],
];
const avatarStyle = (name) => {
  const i = name.charCodeAt(0) % avatarColors.length;
  return { background: `linear-gradient(135deg, ${avatarColors[i][0]}, ${avatarColors[i][1]}33)`, color: avatarColors[i][1], border: `1.5px solid ${avatarColors[i][1]}55` };
};

// ── SUB-COMPONENTS ────────────────────────────────────────────────────────────

function Badge({ risk }) {
  return (
    <span style={{ padding:"3px 9px", borderRadius:20, fontSize:10, fontWeight:600,
      textTransform:"uppercase", letterSpacing:"0.05em", whiteSpace:"nowrap",
      background: riskDim(risk), color: riskColor(risk),
      border: `1px solid ${riskColor(risk)}44` }}>
      {riskLabel(risk)}
    </span>
  );
}

function RiskGauge({ value, size = 180 }) {
  const r = 75, cx = 90, cy = 90;
  const arcLen = Math.PI * r;
  const filled = (value / 100) * arcLen;
  const offset = arcLen - filled;
  const clr = riskColor(value);
  const angle = -180 + (value / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + r * Math.cos(rad);
  const ny = cy + r * Math.sin(rad);

  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 180 100">
      <defs>
        <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={C.teal}/>
          <stop offset="45%" stopColor={C.amber}/>
          <stop offset="100%" stopColor={C.red}/>
        </linearGradient>
      </defs>
      <path d={`M 15 90 A 75 75 0 0 1 165 90`} fill="none" stroke="rgba(99,179,237,0.1)" strokeWidth="14" strokeLinecap="round"/>
      <path d={`M 15 90 A 75 75 0 0 1 165 90`} fill="none" stroke="url(#g1)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={arcLen} strokeDashoffset={offset} style={{transition:"stroke-dashoffset 0.8s ease"}}/>
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={clr} strokeWidth="2.5" strokeLinecap="round"
        style={{transition:"all 0.8s ease"}}/>
      <circle cx={cx} cy={cy} r="5" fill={clr}/>
      <text x="12" y="100" fontSize="9" fill={C.dim} fontFamily="DM Mono">0</text>
      <text x="83" y="18" fontSize="9" fill={C.dim} fontFamily="DM Mono">50</text>
      <text x="160" y="100" fontSize="9" fill={C.dim} fontFamily="DM Mono">100</text>
    </svg>
  );
}

function Spinner() {
  return <div style={{ width:20, height:20, border:`2px solid ${C.border}`, borderTopColor:C.teal,
    borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,13,26,0.85)", backdropFilter:"blur(6px)",
      zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}
      onClick={onClose}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14,
        padding:24, minWidth:420, maxWidth:600, maxHeight:"80vh", overflow:"auto",
        animation:"fadeUp 0.3s ease" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:15 }}>{title}</div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted,
            fontSize:18, cursor:"pointer", lineHeight:1 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:12 }}>
      {label && <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>{label}</div>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8,
          padding:"9px 12px", fontSize:12, color:"#e8f4ff", outline:"none" }}/>
    </div>
  );
}

// ── OVERVIEW PAGE ──────────────────────────────────────────────────────────────
function OverviewPage({ patients, alerts, setSelectedPatient, setPage }) {
  const high = patients.filter(p => p.risk >= 61).length;
  const mod  = patients.filter(p => p.risk >= 31 && p.risk < 61).length;
  const low  = patients.filter(p => p.risk < 31).length;
  const unread = alerts.filter(a => !a.read).length;
  const checkedIn = patients.filter(p => p.checkedIn).length;

  const stats = [
    { label:"Total Patients", value:patients.length, color:C.blue,  sub:`${checkedIn} checked in today`, icon:"👥" },
    { label:"Low Risk",       value:low,              color:C.teal,  sub:`${Math.round(low/patients.length*100)}% of patients`, icon:"✅" },
    { label:"Moderate Risk",  value:mod,              color:C.amber, sub:`Monitor closely`, icon:"⚠️" },
    { label:"High Risk",      value:high,             color:C.red,   sub:`${unread} unread alerts`, icon:"🚨" },
  ];

  const maxVal = Math.max(...WEEK_DATA.map(d => d.high + d.mod + d.low));

  return (
    <div style={{ padding:"20px 24px", overflowY:"auto", height:"100%", display:"flex", flexDirection:"column", gap:16 }}>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {stats.map((s,i) => (
          <div key={i} className="fade-up" style={{ background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:12, padding:"16px 18px", position:"relative", overflow:"hidden", animationDelay:`${i*0.06}s`,
            cursor:"default" }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${s.color},transparent)` }}/>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</div>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:32, color:s.color, margin:"6px 0 4px" }}>{s.value}</div>
            <div style={{ fontSize:10, color:C.dim }}>{s.sub}</div>
            <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", fontSize:30, opacity:0.07 }}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:16, flex:1, minHeight:0 }}>

        {/* Patient Feed */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>Patient Risk Feed</div>
            <button onClick={() => setPage("patients")}
              style={{ background:"none", border:"none", color:C.teal, fontSize:10, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.06em" }}>
              View All →
            </button>
          </div>
          <div style={{ overflow:"auto", flex:1 }}>
            {[...patients].sort((a,b) => b.risk - a.risk).map((p,i) => (
              <div key={p.id} onClick={() => { setSelectedPatient(p); setPage("patients"); }}
                style={{ display:"grid", gridTemplateColumns:"36px 1fr auto auto auto", alignItems:"center",
                  gap:10, padding:"11px 18px", borderBottom:`1px solid rgba(99,179,237,0.06)`,
                  cursor:"pointer", transition:"background 0.15s", animationDelay:`${i*0.04}s` }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(77,166,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center",
                  justifyContent:"center", fontSize:11, fontWeight:600, ...avatarStyle(p.name) }}>
                  {p.avatar}
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:500 }}>{p.name}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{p.id} · {p.gender} · {p.age}y · {p.condition}</div>
                </div>
                <Badge risk={p.risk}/>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13,
                  color:riskColor(p.risk), minWidth:36, textAlign:"right" }}>{p.risk}%</div>
                <div style={{ fontSize:12, color:trendClr(p.trend), fontWeight:700 }}>{trendIcon(p.trend)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Chart + Quick Alerts */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

          {/* Bar Chart */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>7-Day Risk Distribution</div>
            </div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:5, height:90 }}>
              {WEEK_DATA.map((d,i) => {
                const total = d.high + d.mod + d.low;
                const scale = 80 / maxVal;
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                    <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:1, justifyContent:"flex-end", height:80 }}>
                      <div style={{ width:"100%", height:d.high*scale, background:C.red, borderRadius:"2px 2px 0 0",
                        boxShadow:i===6?`0 0 6px ${C.red}88`:"none", opacity:0.9 }}/>
                      <div style={{ width:"100%", height:d.mod*scale, background:C.amber, opacity:0.9 }}/>
                      <div style={{ width:"100%", height:d.low*scale, background:C.teal, opacity:0.7 }}/>
                    </div>
                    <div style={{ fontSize:9, color:i===6?C.teal:C.dim }}>{d.day}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"flex-end", marginTop:8 }}>
              {[["Low",C.teal],["Moderate",C.amber],["High",C.red]].map(([l,c]) => (
                <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.muted }}>
                  <div style={{ width:8, height:8, borderRadius:2, background:c }}/>
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Alert Summary */}
          <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden", flex:1 }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>Recent Alerts</div>
              <button onClick={() => setPage("alerts")} style={{ background:"none", border:"none", color:C.teal, fontSize:10, cursor:"pointer" }}>See All →</button>
            </div>
            {alerts.slice(0,5).map(a => (
              <div key={a.id} style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"11px 16px",
                borderBottom:`1px solid rgba(99,179,237,0.06)`, background:!a.read?"rgba(255,77,109,0.03)":"transparent" }}>
                <div className={a.type==="high"?"pulse-dot":""} style={{ width:8, height:8, borderRadius:"50%", marginTop:4, flexShrink:0,
                  background:a.type==="high"?C.red:a.type==="mod"?C.amber:C.teal,
                  boxShadow:a.type==="high"?`0 0 5px ${C.red}99`:"none" }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:11, lineHeight:1.4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{a.msg}</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{a.patient}</div>
                </div>
                <div style={{ fontSize:10, color:C.dim, whiteSpace:"nowrap" }}>{a.time}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── PATIENTS PAGE ─────────────────────────────────────────────────────────────
function PatientsPage({ patients, setPatients, selectedPatient, setSelectedPatient, alerts }) {
  const [search, setSearch]       = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [msgPatient, setMsgPatient]     = useState(null);
  const [msgText, setMsgText]           = useState("");
  const [msgSent, setMsgSent]           = useState(false);
  const [newPt, setNewPt] = useState({ name:"", age:"", gender:"M", condition:"", medication:"", notes:"" });

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchRisk = filterRisk==="all" || (filterRisk==="high"&&p.risk>=61) || (filterRisk==="mod"&&p.risk>=31&&p.risk<61) || (filterRisk==="low"&&p.risk<31);
    return matchSearch && matchRisk;
  });

  const patAlerts = selectedPatient ? alerts.filter(a => a.patientId === selectedPatient.id) : [];
  const ptSymptoms = SYMPTOM_HISTORY;

  const addPatient = () => {
    if (!newPt.name || !newPt.age) return;
    const id = `P-${String(Math.floor(1000+Math.random()*9000))}`;
    const avatar = newPt.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    setPatients(prev => [...prev, { ...newPt, id, risk:Math.floor(10+Math.random()*30), trend:"stable",
      inhalerToday:0, lastSymptom:"None", aqi:80, pollen:"Low", humidity:55, temp:28, dust:"Low",
      checkedIn:false, alerts:0, avatar, lastVisit: new Date().toISOString().slice(0,10), age:parseInt(newPt.age) }]);
    setShowAddModal(false);
    setNewPt({ name:"", age:"", gender:"M", condition:"", medication:"", notes:"" });
  };

  const sendMsg = () => {
    setMsgSent(true);
    setTimeout(() => { setMsgSent(false); setShowMsgModal(false); setMsgText(""); }, 1500);
  };

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>

      {/* Patient List Panel */}
      <div style={{ width:340, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>Patients ({patients.length})</div>
            <button onClick={() => setShowAddModal(true)}
              style={{ background:C.tealDim, border:`1px solid ${C.teal}44`, color:C.teal,
                padding:"5px 10px", borderRadius:7, fontSize:10, cursor:"pointer", fontFamily:"DM Mono,monospace" }}>
              + Add Patient
            </button>
          </div>
          <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8,
            display:"flex", alignItems:"center", gap:8, padding:"8px 12px", marginBottom:10 }}>
            <span style={{ fontSize:12, color:C.dim }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name or ID..."
              style={{ background:"none", border:"none", outline:"none", fontSize:12, color:"#e8f4ff", width:"100%" }}/>
          </div>
          <div style={{ display:"flex", gap:6 }}>
            {["all","high","mod","low"].map(f => (
              <button key={f} onClick={() => setFilterRisk(f)}
                style={{ flex:1, padding:"5px 0", borderRadius:6, border:`1px solid ${filterRisk===f?riskColor(f==="high"?80:f==="mod"?45:10):C.border}`,
                  background:filterRisk===f?riskDim(f==="high"?80:f==="mod"?45:10):"transparent",
                  color:filterRisk===f?riskColor(f==="high"?80:f==="mod"?45:10):C.muted,
                  fontSize:10, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:"DM Mono,monospace" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ overflow:"auto", flex:1 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelectedPatient(p)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                borderBottom:`1px solid rgba(99,179,237,0.06)`, cursor:"pointer", transition:"background 0.15s",
                background:selectedPatient?.id===p.id?C.blueDim:"transparent",
                borderLeft:selectedPatient?.id===p.id?`2px solid ${C.blue}`:"2px solid transparent" }}
              onMouseEnter={e=>{ if(selectedPatient?.id!==p.id) e.currentTarget.style.background="rgba(77,166,255,0.03)" }}
              onMouseLeave={e=>{ if(selectedPatient?.id!==p.id) e.currentTarget.style.background="transparent" }}>
              <div style={{ width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:12, fontWeight:600, flexShrink:0, ...avatarStyle(p.name) }}>
                {p.avatar}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500, display:"flex", alignItems:"center", gap:6 }}>
                  {p.name}
                  {p.alerts>0 && <span style={{ background:C.redDim, color:C.red, fontSize:9, padding:"1px 5px", borderRadius:10, border:`1px solid ${C.red}44` }}>{p.alerts}</span>}
                </div>
                <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>{p.condition} · {p.age}y</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, color:riskColor(p.risk) }}>{p.risk}%</div>
                <div style={{ fontSize:10, color:trendClr(p.trend) }}>{trendIcon(p.trend)}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding:32, textAlign:"center", color:C.dim, fontSize:12 }}>No patients match your search</div>
          )}
        </div>
      </div>

      {/* Patient Detail */}
      <div style={{ flex:1, overflow:"auto", padding:"20px 24px" }}>
        {!selectedPatient ? (
          <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
            flexDirection:"column", gap:12, color:C.dim }}>
            <div style={{ fontSize:40, opacity:0.3 }}>👤</div>
            <div style={{ fontSize:13 }}>Select a patient to view details</div>
          </div>
        ) : (
          <div className="slide-in" style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", gap:16, background:C.surface,
              border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
              <div style={{ width:56, height:56, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:18, fontWeight:700, flexShrink:0, ...avatarStyle(selectedPatient.name) }}>
                {selectedPatient.avatar}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18 }}>{selectedPatient.name}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>
                  {selectedPatient.id} · {selectedPatient.gender === "M" ? "Male" : "Female"} · {selectedPatient.age} yrs · {selectedPatient.condition}
                </div>
                <div style={{ fontSize:11, color:C.dim, marginTop:2 }}>Last Visit: {selectedPatient.lastVisit} · Medication: {selectedPatient.medication}</div>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={() => { setMsgPatient(selectedPatient); setShowMsgModal(true); }}
                  style={{ background:C.blueDim, border:`1px solid ${C.blue}44`, color:C.blue,
                    padding:"8px 14px", borderRadius:8, fontSize:11, cursor:"pointer", fontFamily:"DM Mono,monospace" }}>
                  ✉ Send Advice
                </button>
                <Badge risk={selectedPatient.risk}/>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14 }}>

              {/* Risk Gauge Card */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18,
                display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:12, alignSelf:"flex-start" }}>Risk Score</div>
                <RiskGauge value={selectedPatient.risk}/>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:38,
                  color:riskColor(selectedPatient.risk), lineHeight:1 }}>{selectedPatient.risk}%</div>
                <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>Current Risk Level</div>
                <div style={{ padding:"5px 14px", borderRadius:20, fontSize:10, fontWeight:600, textTransform:"uppercase",
                  background:riskDim(selectedPatient.risk), color:riskColor(selectedPatient.risk),
                  border:`1px solid ${riskColor(selectedPatient.risk)}44`,
                  ...(selectedPatient.risk>=61?{animation:"pulse 2s infinite"}:{}) }}>
                  {riskLabel(selectedPatient.risk)} Risk
                </div>
              </div>

              {/* Vitals */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:12, marginBottom:12 }}>Vitals & Usage</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    ["Inhaler Today", `${selectedPatient.inhalerToday}x`, selectedPatient.inhalerToday>=3?C.red:C.teal],
                    ["Last Symptom", selectedPatient.lastSymptom, C.amber],
                    ["AQI (Local)",  `${selectedPatient.aqi}`, selectedPatient.aqi>150?C.red:selectedPatient.aqi>100?C.amber:C.teal],
                    ["Humidity",     `${selectedPatient.humidity}%`, C.blue],
                    ["Pollen",       selectedPatient.pollen, selectedPatient.pollen==="High"?C.red:selectedPatient.pollen==="Med"?C.amber:C.teal],
                    ["Temperature",  `${selectedPatient.temp}°C`, selectedPatient.temp>33?C.amber:C.teal],
                  ].map(([l,v,c]) => (
                    <div key={l} style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>{l}</div>
                      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:16, color:c, marginTop:4 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environment + AI Recs */}
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:18, display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:12 }}>AI Recommendations</div>
                <div style={{ background:riskDim(selectedPatient.risk), border:`1px solid ${riskColor(selectedPatient.risk)}33`,
                  borderRadius:8, padding:"10px 12px", flex:1 }}>
                  <div style={{ fontSize:9, color:riskColor(selectedPatient.risk), textTransform:"uppercase",
                    letterSpacing:"0.07em", marginBottom:8, fontWeight:600 }}>⚡ Based on current data</div>
                  <div style={{ fontSize:11, lineHeight:1.8, color:"#e8f4ff" }}>
                    {selectedPatient.risk >= 61 ? (
                      <>• Carry rescue inhaler at all times<br/>• Avoid outdoor activities (AQI high)<br/>• Wear N95 mask if going outside<br/>• Follow corticosteroid schedule<br/>• Contact doctor if symptoms worsen</>
                    ) : selectedPatient.risk >= 31 ? (
                      <>• Monitor symptoms closely today<br/>• Limit strenuous outdoor activity<br/>• Take antihistamines as prescribed<br/>• Check pollen count before going out</>
                    ) : (
                      <>• Continue current medication plan<br/>• Maintain air quality at home<br/>• Regular exercise is safe today<br/>• Next check-in as scheduled</>
                    )}
                  </div>
                </div>
                {selectedPatient.notes && (
                  <div style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:"10px 12px" }}>
                    <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Doctor Notes</div>
                    <div style={{ fontSize:11, color:"#c8dff0", lineHeight:1.6 }}>{selectedPatient.notes}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Symptom Chart */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"16px 18px" }}>
              <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:14 }}>Symptom & Inhaler History (7 days)</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
                {ptSymptoms.map((d,i) => (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:1, justifyContent:"flex-end", height:80 }}>
                      <div style={{ width:"100%", height:d.breath*12, background:C.red, borderRadius:"2px 2px 0 0", opacity:0.85 }}/>
                      <div style={{ width:"100%", height:d.wheeze*10, background:C.amber, opacity:0.85 }}/>
                      <div style={{ width:"100%", height:d.cough*8, background:C.blue, opacity:0.7 }}/>
                    </div>
                    <div style={{ fontSize:8, color:C.dim, textAlign:"center" }}>{d.date.slice(-2)}/{d.date.slice(0,3)}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:14, marginTop:8, justifyContent:"flex-end" }}>
                {[["Cough",C.blue],["Wheeze",C.amber],["Breath Diff.",C.red]].map(([l,c]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:C.muted }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:c }}/>{l}
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Alerts */}
            {patAlerts.length > 0 && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>Alert History</div>
                </div>
                {patAlerts.map(a => (
                  <div key={a.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 18px",
                    borderBottom:`1px solid rgba(99,179,237,0.06)` }}>
                    <span style={{ fontSize:16 }}>{a.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12 }}>{a.msg}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{a.time}</div>
                    </div>
                    <div className={a.type==="high"?"pulse-dot":""} style={{ width:8, height:8, borderRadius:"50%",
                      background:a.type==="high"?C.red:a.type==="mod"?C.amber:C.teal }}/>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <Modal title="Add New Patient" onClose={() => setShowAddModal(false)}>
          <Input label="Full Name" value={newPt.name} onChange={v=>setNewPt(p=>({...p,name:v}))} placeholder="e.g. Tariq Mehmood"/>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            <Input label="Age" type="number" value={newPt.age} onChange={v=>setNewPt(p=>({...p,age:v}))}/>
            <div>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Gender</div>
              <select value={newPt.gender} onChange={e=>setNewPt(p=>({...p,gender:e.target.value}))}
                style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8,
                  padding:"9px 12px", fontSize:12, color:"#e8f4ff", outline:"none", fontFamily:"DM Mono,monospace" }}>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            </div>
          </div>
          <Input label="Condition" value={newPt.condition} onChange={v=>setNewPt(p=>({...p,condition:v}))} placeholder="e.g. Asthma, Allergy"/>
          <Input label="Medication" value={newPt.medication} onChange={v=>setNewPt(p=>({...p,medication:v}))} placeholder="e.g. Salbutamol"/>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Notes</div>
            <textarea value={newPt.notes} onChange={e=>setNewPt(p=>({...p,notes:e.target.value}))}
              rows={3} placeholder="Optional notes..."
              style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8,
                padding:"9px 12px", fontSize:12, color:"#e8f4ff", outline:"none", resize:"none", fontFamily:"DM Mono,monospace" }}/>
          </div>
          <button onClick={addPatient}
            style={{ width:"100%", background:C.tealDim, border:`1px solid ${C.teal}55`, color:C.teal,
              padding:"11px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"DM Mono,monospace", fontWeight:500 }}>
            Add Patient →
          </button>
        </Modal>
      )}

      {/* Message Modal */}
      {showMsgModal && msgPatient && (
        <Modal title={`Send Advice — ${msgPatient.name}`} onClose={() => setShowMsgModal(false)}>
          <div style={{ background:C.surface2, borderRadius:8, padding:"10px 12px", marginBottom:14, fontSize:11, color:C.muted }}>
            Sending to: <span style={{ color:"#e8f4ff" }}>{msgPatient.name}</span> · Risk: <span style={{ color:riskColor(msgPatient.risk) }}>{msgPatient.risk}%</span>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Quick Templates</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {["Carry your rescue inhaler today.", "Please avoid outdoor activity — AQI is high.", "Take your prescribed medication as scheduled.", "Book a follow-up appointment this week."].map(t => (
                <div key={t} onClick={() => setMsgText(t)}
                  style={{ padding:"8px 12px", background:C.surface2, border:`1px solid ${msgText===t?C.blue:C.border}`,
                    borderRadius:7, fontSize:11, cursor:"pointer", color:msgText===t?C.blue:"#e8f4ff",
                    transition:"border-color 0.15s" }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>Custom Message</div>
            <textarea value={msgText} onChange={e=>setMsgText(e.target.value)} rows={3}
              placeholder="Type your advice here..."
              style={{ width:"100%", background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8,
                padding:"9px 12px", fontSize:12, color:"#e8f4ff", outline:"none", resize:"none", fontFamily:"DM Mono,monospace" }}/>
          </div>
          <button onClick={sendMsg} disabled={!msgText}
            style={{ width:"100%", background:msgSent?"rgba(0,212,180,0.15)":C.blueDim,
              border:`1px solid ${msgSent?C.teal:C.blue}55`, color:msgSent?C.teal:C.blue,
              padding:"11px", borderRadius:8, fontSize:12, cursor:"pointer", fontFamily:"DM Mono,monospace", fontWeight:500, transition:"all 0.3s" }}>
            {msgSent ? "✓ Message Sent!" : "Send Advice →"}
          </button>
        </Modal>
      )}
    </div>
  );
}

// ── ALERTS PAGE ───────────────────────────────────────────────────────────────
function AlertsPage({ alerts, setAlerts }) {
  const [filter, setFilter] = useState("all");

  const filtered = alerts.filter(a => filter==="all" || a.type===filter || (filter==="unread"&&!a.read));

  const markAll = () => setAlerts(prev => prev.map(a => ({ ...a, read:true })));
  const markOne = id => setAlerts(prev => prev.map(a => a.id===id ? { ...a, read:true } : a));
  const delOne  = id => setAlerts(prev => prev.filter(a => a.id!==id));

  const unread = alerts.filter(a=>!a.read).length;

  return (
    <div style={{ padding:"20px 24px", overflowY:"auto", height:"100%" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18 }}>
          Alerts & Notifications
          {unread>0 && <span style={{ marginLeft:10, background:C.redDim, color:C.red, fontSize:11,
            padding:"2px 8px", borderRadius:10, border:`1px solid ${C.red}44` }}>{unread} new</span>}
        </div>
        <button onClick={markAll} style={{ background:C.surface2, border:`1px solid ${C.border}`, color:C.muted,
          padding:"7px 14px", borderRadius:8, fontSize:11, cursor:"pointer", fontFamily:"DM Mono,monospace" }}>
          Mark All Read
        </button>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {["all","unread","high","mod","low"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${filter===f?(f==="high"?C.red:f==="mod"?C.amber:f==="low"?C.teal:C.blue):C.border}`,
              background:filter===f?(f==="high"?C.redDim:f==="mod"?C.amberDim:f==="low"?C.tealDim:C.blueDim):"transparent",
              color:filter===f?(f==="high"?C.red:f==="mod"?C.amber:f==="low"?C.teal:C.blue):C.muted,
              fontSize:10, cursor:"pointer", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:"DM Mono,monospace" }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding:40, textAlign:"center", color:C.dim, fontSize:13 }}>No alerts matching this filter</div>
        ) : filtered.map((a,i) => (
          <div key={a.id} className="fade-up" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 20px",
            borderBottom:`1px solid rgba(99,179,237,0.06)`, background:!a.read?"rgba(255,77,109,0.02)":"transparent",
            animationDelay:`${i*0.04}s` }}>
            <span style={{ fontSize:22 }}>{a.icon}</span>
            <div className={a.type==="high"&&!a.read?"pulse-dot":""} style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
              background:a.type==="high"?C.red:a.type==="mod"?C.amber:C.teal }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:a.read?400:500 }}>{a.msg}</div>
              <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>
                <span style={{ color:riskColor(a.type==="high"?80:a.type==="mod"?45:10) }}>{a.patient}</span>
                {" · "}{a.time}
                {!a.read && <span style={{ marginLeft:8, background:C.redDim, color:C.red, fontSize:9,
                  padding:"1px 6px", borderRadius:8 }}>NEW</span>}
              </div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              {!a.read && (
                <button onClick={() => markOne(a.id)}
                  style={{ padding:"5px 10px", borderRadius:6, border:`1px solid ${C.border}`,
                    background:"transparent", color:C.muted, fontSize:10, cursor:"pointer", fontFamily:"DM Mono,monospace" }}>
                  Mark Read
                </button>
              )}
              <button onClick={() => delOne(a.id)}
                style={{ padding:"5px 10px", borderRadius:6, border:`1px solid rgba(255,77,109,0.2)`,
                  background:C.redDim, color:C.red, fontSize:10, cursor:"pointer", fontFamily:"DM Mono,monospace" }}>
                Dismiss
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ANALYTICS PAGE ────────────────────────────────────────────────────────────
function AnalyticsPage({ patients }) {
  const high = patients.filter(p=>p.risk>=61).length;
  const mod  = patients.filter(p=>p.risk>=31&&p.risk<61).length;
  const low  = patients.filter(p=>p.risk<31).length;
  const avgRisk = Math.round(patients.reduce((s,p)=>s+p.risk,0)/patients.length);
  const topTriggers = [
    { name:"High AQI (>150)", count:patients.filter(p=>p.aqi>150).length, max:patients.length },
    { name:"High Pollen",     count:patients.filter(p=>p.pollen==="High").length, max:patients.length },
    { name:"High Humidity",   count:patients.filter(p=>p.humidity>65).length, max:patients.length },
    { name:"Inhaler Overuse", count:patients.filter(p=>p.inhalerToday>=3).length, max:patients.length },
    { name:"High Dust",       count:patients.filter(p=>p.dust==="High").length, max:patients.length },
  ];
  const conditions = {};
  patients.forEach(p => { conditions[p.condition] = (conditions[p.condition]||0)+1; });

  return (
    <div style={{ padding:"20px 24px", overflowY:"auto", height:"100%", display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18 }}>Analytics & Insights</div>

      {/* Summary Cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {[
          ["Average Risk", `${avgRisk}%`, C.blue, "Across all patients"],
          ["High Risk %", `${Math.round(high/patients.length*100)}%`, C.red, `${high} patients`],
          ["Safe Today", `${low}`, C.teal, "Below 30% risk"],
          ["Total Alerts", "7", C.amber, "This session"],
        ].map(([l,v,c,s],i)=>(
          <div key={i} className="fade-up" style={{ background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:12, padding:"16px 18px", animationDelay:`${i*0.06}s` }}>
            <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${c},transparent)`, borderRadius:"12px 12px 0 0" }}/>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:"0.08em" }}>{l}</div>
            <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:30, color:c, margin:"6px 0 4px" }}>{v}</div>
            <div style={{ fontSize:10, color:C.dim }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>

        {/* Risk Distribution Donut-style */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:14 }}>Risk Distribution</div>
          <div style={{ display:"flex", alignItems:"center", gap:24 }}>
            <svg width={130} height={130} viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke={C.teal} strokeWidth="4"
                strokeDasharray={`${(low/patients.length)*100} ${100-(low/patients.length)*100}`}
                strokeDashoffset="25" opacity="0.85"/>
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke={C.amber} strokeWidth="4"
                strokeDasharray={`${(mod/patients.length)*100} ${100-(mod/patients.length)*100}`}
                strokeDashoffset={`${25-(low/patients.length)*100}`} opacity="0.85"/>
              <circle cx="21" cy="21" r="15.915" fill="transparent" stroke={C.red} strokeWidth="4"
                strokeDasharray={`${(high/patients.length)*100} ${100-(high/patients.length)*100}`}
                strokeDashoffset={`${25-(low/patients.length)*100-(mod/patients.length)*100}`} opacity="0.85"/>
              <text x="21" y="19" textAnchor="middle" fontSize="5" fill="#e8f4ff" fontFamily="Syne,sans-serif" fontWeight="800">{patients.length}</text>
              <text x="21" y="24" textAnchor="middle" fontSize="3.5" fill={C.muted} fontFamily="DM Mono,monospace">patients</text>
            </svg>
            <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10 }}>
              {[["Low Risk",low,C.teal],["Moderate",mod,C.amber],["High Risk",high,C.red]].map(([l,v,c])=>(
                <div key={l}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                    <span style={{ color:C.muted }}>{l}</span>
                    <span style={{ color:c, fontFamily:"Syne,sans-serif", fontWeight:700 }}>{v} <span style={{ fontSize:10, color:C.dim }}>({Math.round(v/patients.length*100)}%)</span></span>
                  </div>
                  <div style={{ height:5, background:C.surface2, borderRadius:3 }}>
                    <div style={{ height:"100%", width:`${v/patients.length*100}%`, background:c, borderRadius:3, transition:"width 1s ease" }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Triggers */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:14 }}>Environmental Triggers</div>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {topTriggers.map((t,i)=>(
              <div key={i}>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:4 }}>
                  <span style={{ color:"#c8dff0" }}>{t.name}</span>
                  <span style={{ color:C.amber, fontFamily:"Syne,sans-serif", fontWeight:700 }}>{t.count}/{t.max}</span>
                </div>
                <div style={{ height:6, background:C.surface2, borderRadius:3 }}>
                  <div style={{ height:"100%", width:`${t.count/t.max*100}%`,
                    background:`linear-gradient(90deg,${C.amber},${C.red})`, borderRadius:3, transition:"width 1s ease" }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions Breakdown */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:14 }}>Condition Breakdown</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {Object.entries(conditions).sort((a,b)=>b[1]-a[1]).map(([cond,cnt],i)=>{
              const colors=[C.blue,C.teal,C.amber,C.red,"#b47aff","#4dd47a"];
              return (
                <div key={cond} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:10, height:10, borderRadius:2, background:colors[i%colors.length], flexShrink:0 }}/>
                  <div style={{ flex:1, fontSize:12 }}>{cond}</div>
                  <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, color:colors[i%colors.length] }}>{cnt}</div>
                  <div style={{ width:80, height:6, background:C.surface2, borderRadius:3 }}>
                    <div style={{ height:"100%", width:`${cnt/patients.length*100}%`, background:colors[i%colors.length], borderRadius:3 }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly trend bars */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:14 }}>Weekly High-Risk Trend</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:100 }}>
            {WEEK_DATA.map((d,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontFamily:"Syne,sans-serif", fontSize:11, fontWeight:700, color:i===6?C.red:C.muted }}>{d.high}</div>
                <div style={{ width:"100%", height:d.high*10, background:i===6?C.red:`${C.red}88`,
                  borderRadius:"3px 3px 0 0", boxShadow:i===6?`0 0 8px ${C.red}66`:"none", transition:"height 0.6s ease" }}/>
                <div style={{ fontSize:9, color:i===6?C.teal:C.dim }}>{d.day}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11, color:C.muted, marginTop:10, textAlign:"center" }}>
            High-risk patients per day — today shows <span style={{ color:C.red }}>highest count (6)</span> this week
          </div>
        </div>

      </div>
    </div>
  );
}

// ── MESSAGES PAGE ─────────────────────────────────────────────────────────────
function MessagesPage({ patients }) {
  const [selected, setSelected] = useState(null);
  const [input, setInput]       = useState("");
  const [chats, setChats]       = useState({});
  const bottomRef = useRef(null);

  const msgs = selected ? (chats[selected.id] || []) : [];

  const send = () => {
    if (!input.trim() || !selected) return;
    const msg = { from:"doctor", text:input, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) };
    setChats(prev => ({ ...prev, [selected.id]: [...(prev[selected.id]||[]), msg] }));
    setInput("");
    setTimeout(() => {
      const reply = { from:"patient", text:`Thank you, Dr. Rahman. I'll follow your advice regarding: "${input.slice(0,40)}..."`,
        time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) };
      setChats(prev => ({ ...prev, [selected.id]: [...(prev[selected.id]||[]), reply] }));
    }, 1200);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  return (
    <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
      <div style={{ width:280, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"14px 16px", borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>Patient Messages</div>
        </div>
        <div style={{ overflow:"auto", flex:1 }}>
          {patients.map(p=>(
            <div key={p.id} onClick={() => setSelected(p)}
              style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px",
                borderBottom:`1px solid rgba(99,179,237,0.06)`, cursor:"pointer",
                background:selected?.id===p.id?C.blueDim:"transparent",
                borderLeft:selected?.id===p.id?`2px solid ${C.blue}`:"2px solid transparent",
                transition:"background 0.15s" }}
              onMouseEnter={e=>{ if(selected?.id!==p.id) e.currentTarget.style.background="rgba(77,166,255,0.04)" }}
              onMouseLeave={e=>{ if(selected?.id!==p.id) e.currentTarget.style.background="transparent" }}>
              <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:11, fontWeight:600, flexShrink:0, ...avatarStyle(p.name) }}>
                {p.avatar}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, fontWeight:500 }}>{p.name}</div>
                <div style={{ fontSize:10, color:C.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                  {chats[p.id]?.length ? chats[p.id][chats[p.id].length-1].text.slice(0,28)+"..." : "No messages yet"}
                </div>
              </div>
              <div style={{ width:8, height:8, borderRadius:"50%", background:riskColor(p.risk), flexShrink:0 }}/>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        {!selected ? (
          <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, color:C.dim }}>
            <div style={{ fontSize:40, opacity:0.3 }}>💬</div>
            <div style={{ fontSize:13 }}>Select a patient to start messaging</div>
          </div>
        ) : (
          <>
            <div style={{ padding:"14px 20px", borderBottom:`1px solid ${C.border}`,
              display:"flex", alignItems:"center", gap:12, background:C.surface }}>
              <div style={{ width:34, height:34, borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:11, fontWeight:600, ...avatarStyle(selected.name) }}>
                {selected.avatar}
              </div>
              <div>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13 }}>{selected.name}</div>
                <div style={{ fontSize:10, color:C.muted }}>{selected.condition} · Risk: <span style={{ color:riskColor(selected.risk) }}>{selected.risk}%</span></div>
              </div>
            </div>

            <div style={{ flex:1, overflow:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:10 }}>
              {msgs.length === 0 ? (
                <div style={{ textAlign:"center", color:C.dim, fontSize:12, marginTop:40 }}>
                  Start a conversation with {selected.name}
                </div>
              ) : msgs.map((m,i) => (
                <div key={i} style={{ display:"flex", justifyContent:m.from==="doctor"?"flex-end":"flex-start" }}>
                  <div style={{ maxWidth:"70%", background:m.from==="doctor"?C.blueDim:C.surface2,
                    border:`1px solid ${m.from==="doctor"?`${C.blue}44`:C.border}`,
                    borderRadius:m.from==="doctor"?"12px 12px 0 12px":"12px 12px 12px 0",
                    padding:"10px 14px" }}>
                    <div style={{ fontSize:12, lineHeight:1.5 }}>{m.text}</div>
                    <div style={{ fontSize:9, color:C.dim, marginTop:4, textAlign:"right" }}>{m.time}</div>
                  </div>
                </div>
              ))}
              <div ref={bottomRef}/>
            </div>

            <div style={{ padding:"14px 20px", borderTop:`1px solid ${C.border}`, display:"flex", gap:10 }}>
              <input value={input} onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&send()}
                placeholder={`Send advice to ${selected.name}...`}
                style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10,
                  padding:"10px 14px", fontSize:12, color:"#e8f4ff", outline:"none" }}/>
              <button onClick={send}
                style={{ background:C.blueDim, border:`1px solid ${C.blue}44`, color:C.blue,
                  padding:"10px 18px", borderRadius:10, fontSize:12, cursor:"pointer", fontFamily:"DM Mono,monospace" }}>
                Send →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── SETTINGS PAGE ─────────────────────────────────────────────────────────────
function SettingsPage() {
  const [form, setForm] = useState({ name:"Dr. A. Rahman", email:"rahman@wheezeease.health", phone:"+92 300 1234567", hospital:"Gujranwala General Hospital", specialty:"Pulmonology" });
  const [notifs, setNotifs] = useState({ highRisk:true, moderateRisk:true, inhalerOveruse:true, aqiAlert:true, dailyReport:false });
  const [saved, setSaved] = useState(false);

  const save = () => { setSaved(true); setTimeout(()=>setSaved(false), 2000); };

  return (
    <div style={{ padding:"20px 24px", overflowY:"auto", height:"100%", display:"flex", flexDirection:"column", gap:20, maxWidth:700 }}>
      <div style={{ fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:18 }}>Settings</div>

      {/* Profile */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:16 }}>Doctor Profile</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <Input label="Full Name" value={form.name} onChange={v=>setForm(p=>({...p,name:v}))}/>
          <Input label="Email" value={form.email} onChange={v=>setForm(p=>({...p,email:v}))}/>
          <Input label="Phone" value={form.phone} onChange={v=>setForm(p=>({...p,phone:v}))}/>
          <Input label="Hospital" value={form.hospital} onChange={v=>setForm(p=>({...p,hospital:v}))}/>
          <Input label="Specialty" value={form.specialty} onChange={v=>setForm(p=>({...p,specialty:v}))}/>
        </div>
      </div>

      {/* Notifications */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px" }}>
        <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:13, marginBottom:16 }}>Notification Preferences</div>
        {Object.entries({ highRisk:"High Risk Alerts (>60%)", moderateRisk:"Moderate Risk Alerts (31-60%)",
          inhalerOveruse:"Inhaler Overuse Warnings", aqiAlert:"Air Quality Index Alerts", dailyReport:"Daily Summary Report" }).map(([k,l])=>(
          <div key={k} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 0", borderBottom:`1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize:12 }}>{l}</div>
              <div style={{ fontSize:10, color:C.dim, marginTop:2 }}>Receive alerts when this condition is triggered</div>
            </div>
            <div onClick={() => setNotifs(p=>({...p,[k]:!p[k]}))}
              style={{ width:42, height:24, borderRadius:12, background:notifs[k]?C.teal:C.surface2,
                border:`1px solid ${notifs[k]?C.teal:C.border}`, cursor:"pointer", position:"relative", transition:"all 0.25s" }}>
              <div style={{ width:18, height:18, borderRadius:"50%", background:"#fff",
                position:"absolute", top:2, left:notifs[k]?22:3, transition:"left 0.25s",
                boxShadow:"0 1px 4px rgba(0,0,0,0.4)" }}/>
            </div>
          </div>
        ))}
      </div>

      <button onClick={save}
        style={{ background:saved?C.tealDim:C.blueDim, border:`1px solid ${saved?C.teal:C.blue}55`,
          color:saved?C.teal:C.blue, padding:"12px", borderRadius:10, fontSize:13,
          cursor:"pointer", fontFamily:"DM Mono,monospace", fontWeight:500, transition:"all 0.3s", alignSelf:"flex-start", minWidth:180 }}>
        {saved ? "✓ Changes Saved!" : "Save Settings →"}
      </button>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONT + CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [page, setPage]                   = useState("overview");
  const [patients, setPatients]           = useState(INIT_PATIENTS);
  const [alerts, setAlerts]               = useState(INIT_ALERTS);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [tick, setTick]                   = useState(0);
  const [time, setTime]                   = useState(new Date());

  // Simulate live risk updates every 12s
  useEffect(() => {
    const id = setInterval(() => {
      setPatients(prev => prev.map(p => {
        const delta = Math.floor(Math.random()*7) - 3;
        return { ...p, risk: Math.max(5, Math.min(95, p.risk + delta)),
          trend: delta > 1 ? "up" : delta < -1 ? "down" : "stable" };
      }));
      setTick(t => t+1);
    }, 12000);
    return () => clearInterval(id);
  }, []);

  // Clock
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const unreadAlerts = alerts.filter(a=>!a.read).length;

  const NAV = [
    { id:"overview",  icon:"🏠", label:"Overview" },
    { id:"patients",  icon:"👥", label:"Patients" },
    { id:"alerts",    icon:"🔔", label:"Alerts", badge: unreadAlerts },
    { id:"analytics", icon:"📊", label:"Analytics" },
    { id:"messages",  icon:"💬", label:"Messages" },
  ];

  const pages = {
    overview:  <OverviewPage patients={patients} alerts={alerts} setSelectedPatient={setSelectedPatient} setPage={setPage}/>,
    patients:  <PatientsPage patients={patients} setPatients={setPatients} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} alerts={alerts}/>,
    alerts:    <AlertsPage alerts={alerts} setAlerts={setAlerts}/>,
    analytics: <AnalyticsPage patients={patients}/>,
    messages:  <MessagesPage patients={patients}/>,
    settings:  <SettingsPage/>,
  };

  return (
    <div style={{ display:"flex", height:"100vh", width:"100vw", overflow:"hidden", background:C.bg, fontFamily:"'DM Mono',monospace" }}>

      {/* SIDEBAR */}
      <aside style={{ width:68, background:C.surface, borderRight:`1px solid ${C.border}`,
        display:"flex", flexDirection:"column", alignItems:"center", padding:"18px 0", gap:6, flexShrink:0, zIndex:10 }}>
        <div style={{ width:40, height:40, background:`linear-gradient(135deg, ${C.teal}, #0099cc)`,
          borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily:"Syne,sans-serif", fontWeight:800, fontSize:13, color:"#000", marginBottom:14,
          boxShadow:`0 0 18px ${C.teal}44`, cursor:"pointer" }}>
          WE
        </div>
        {NAV.map(n => (
          <div key={n.id} onClick={() => setPage(n.id)} title={n.label}
            style={{ width:44, height:44, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:18, position:"relative", transition:"all 0.18s",
              background:page===n.id?C.tealDim:"transparent",
              color:page===n.id?C.teal:C.muted }}
            onMouseEnter={e=>{ if(page!==n.id){ e.currentTarget.style.background=C.surface2; e.currentTarget.style.color="#e8f4ff"; } }}
            onMouseLeave={e=>{ if(page!==n.id){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color=C.muted; } }}>
            {n.icon}
            {n.badge > 0 && (
              <div className="pulse-dot" style={{ position:"absolute", top:6, right:6, width:8, height:8,
                background:C.red, borderRadius:"50%", border:`1.5px solid ${C.bg}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:7, color:"#fff", fontWeight:700 }}/>
            )}
          </div>
        ))}
        <div style={{ marginTop:"auto", display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div onClick={() => setPage("settings")} title="Settings"
            style={{ width:44, height:44, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:18, color:page==="settings"?C.teal:C.muted,
              background:page==="settings"?C.tealDim:"transparent", transition:"all 0.18s" }}>
            ⚙️
          </div>
          <div title="Dr. A. Rahman"
            style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#1a3a5c,#2a5a8c)",
              border:`2px solid ${C.teal}66`, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:11, color:C.teal, fontWeight:600, cursor:"pointer" }}>
            DR
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>

        {/* TOPBAR */}
        <header style={{ height:54, background:C.surface, borderBottom:`1px solid ${C.border}`,
          display:"flex", alignItems:"center", padding:"0 22px", gap:14, flexShrink:0 }}>
          <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:15 }}>
            Wheeze<span style={{ color:C.teal }}>Ease</span>
          </div>
          <div style={{ width:1, height:18, background:C.border }}/>
          <div style={{ fontSize:11, color:C.muted }}>
            {["Overview","Patients","Alerts","Analytics","Messages","Settings"][["overview","patients","alerts","analytics","messages","settings"].indexOf(page)]} Dashboard
          </div>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, background:C.tealDim,
              border:`1px solid ${C.teal}33`, borderRadius:20, padding:"4px 12px", fontSize:10, color:C.teal }}>
              <div className="pulse-dot" style={{ width:6, height:6, background:C.teal, borderRadius:"50%" }}/>
              Live · {tick > 0 ? `Updated ${tick * 12}s ago` : "Real-time"}
            </div>
            <div style={{ fontSize:11, color:C.dim, fontFamily:"DM Mono,monospace" }}>
              {time.toLocaleDateString("en-GB",{weekday:"short",day:"2-digit",month:"short",year:"numeric"})}
              {" · "}
              {time.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </div>
            <div style={{ position:"relative", width:32, height:32, background:C.surface2, border:`1px solid ${C.border}`,
              borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer", fontSize:14, color:C.muted }}
              onClick={() => setPage("alerts")}>
              🔔
              {unreadAlerts > 0 && (
                <div className="pulse-dot" style={{ position:"absolute", top:-3, right:-3, background:C.red,
                  color:"#fff", fontSize:8, width:16, height:16, borderRadius:"50%",
                  display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700,
                  border:`1.5px solid ${C.bg}` }}>
                  {unreadAlerts}
                </div>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1a4a7a,#2d6faa)",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:C.teal, fontWeight:600,
                border:`1.5px solid ${C.teal}55` }}>
                DR
              </div>
              <div>
                <div style={{ fontSize:11 }}>Dr. A. Rahman</div>
                <div style={{ fontSize:9, color:C.muted }}>Pulmonologist</div>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ flex:1, overflow:"hidden" }} key={page}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}
