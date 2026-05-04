import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  AlertTriangle,
  Wind,
  Stethoscope,
  User,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import '../../../styles/RightUtilityBar.css'

interface Patient {
  id: number;
  initials: string;
  name: string;
  time: string;
  type: string;
  severity: "critical" | "warning" | "stable" | "done";
  condition: string;
  peak_flow?: string;
  spo2?: string;
  avatarGrad: string;
}

interface RightUtilityBarProps {
  onLogout: () => void;
}

// Critical Alerts Only - 3 alerts, no scroll
const CRITICAL_ALERTS: Patient[] = [
  {
    id: 1,
    initials: "MS",
    name: "Matt Smith",
    time: "09:00 AM",
    type: "Emergency Flare-up",
    severity: "critical",
    condition: "Severe Asthma Attack",
    peak_flow: "210 L/min",
    spo2: "91%",
    avatarGrad: "linear-gradient(135deg,#dc2626,#ef4444)",
  },
  {
    id: 2,
    initials: "AK",
    name: "Ayesha Khan",
    time: "10:15 AM",
    type: "Severe Wheezing",
    severity: "critical",
    condition: "Acute Asthma Exacerbation",
    peak_flow: "195 L/min",
    spo2: "89%",
    avatarGrad: "linear-gradient(135deg,#dc2626,#ef4444)",
  },
  {
    id: 3,
    initials: "FN",
    name: "Fatima Noor",
    time: "11:30 AM",
    type: "Emergency",
    severity: "critical",
    condition: "Respiratory Distress",
    peak_flow: "180 L/min",
    spo2: "87%",
    avatarGrad: "linear-gradient(135deg,#dc2626,#ef4444)",
  },
];

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function SeverityIcon() {
  return (
    <div className="severity-icon critical">
      <AlertTriangle size={12} color="#dc2626" />
    </div>
  );
}

function PatientCard({ p }: { p: Patient }) {
  return (
    <div className="patient-card critical-card">
      <div className="critical-indicator" />
      <div className="patient-avatar" style={{ background: p.avatarGrad }}>
        {p.initials}
      </div>
      <div className="patient-info">
        <div className="patient-header">
          <span className="patient-name">{p.name}</span>
          <SeverityIcon />
        </div>
        <div className="patient-meta">{p.time} · {p.type}</div>
        <div className="patient-condition critical">
          <Stethoscope size={9} />
          <span>{p.condition}</span>
        </div>
        <div className="patient-vitals">
          <span className="vital-peakflow">PF: {p.peak_flow}</span>
          <span className="vital-spo2 critical">SpO₂: {p.spo2}</span>
        </div>
      </div>
    </div>
  );
}

export default function RightUtilityBar({ onLogout }: RightUtilityBarProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Current date - dynamic for calendar
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  
  // State for calendar view
  const [viewYear, setViewYear] = useState(currentYear);
  const [viewMonth, setViewMonth] = useState(currentMonth);
  
  // Reset to current month/year when component mounts
  useEffect(() => {
    setViewYear(currentYear);
    setViewMonth(currentMonth);
  }, []);
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  
  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }
  
  const monthLabel = `${MONTHS[viewMonth]} ${viewYear}`;
  
  const goToPreviousMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };
  
  const handleProfileClick = () => {
    setDropdownOpen(false);
    navigate('/settings');
  };
  
  const handleLogoutClick = () => {
    setDropdownOpen(false);
    onLogout();
  };
  
  const handleSeeAllAlerts = () => {
    navigate('/alerts');
  };
  
  return (
    <div className="right-utility-bar">
      <div className="utility-inner">
        {/* Profile Section - Extreme Right Corner */}
        <div className="profile-section">
          <div className="profile-dropdown">
            <div onClick={() => setDropdownOpen(!dropdownOpen)} className="profile-trigger">
              <div className="profile-avatar-small">UA</div>
              <div className="profile-info-small">
                <div className="doctor-name-small">Dr. Ahmad</div>
                <div className="doctor-specialty-small">Pulmonologist</div>
              </div>
              {dropdownOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
            
            {dropdownOpen && (
              <div className="dropdown-content">
                <div className="dropdown-item" onClick={handleProfileClick}>
                  <User size={12} />
                  <span>My Profile</span>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item logout" onClick={handleLogoutClick}>
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Calendar - Full Month View */}
        <div className="calendar-wrapper">
          <div className="calendar-header">
            <span className="calendar-title">{monthLabel}</span>
            <div className="calendar-controls">
              <button onClick={goToPreviousMonth} className="cal-nav-btn">
                <ChevronLeft size={12} />
              </button>
              <button onClick={goToNextMonth} className="cal-nav-btn">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
          <div className="calendar-grid">
            {DAYS_SHORT.map(day => (
              <div key={day} className="calendar-weekday">{day}</div>
            ))}
            {calendarDays.map((day, index) => {
              const isToday = day === currentDate && viewMonth === currentMonth && viewYear === currentYear;
              return (
                <div key={index} className={`calendar-day ${isToday ? "today" : ""} ${!day ? "empty" : ""}`}>
                  {day || ""}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Today's Schedule - Critical Alerts Only, No Scroll */}
        <div className="schedule-wrapper">
          <div className="schedule-header">
            <h3 className="schedule-title">Critical Alerts</h3>
            <button className="see-all-link" onClick={handleSeeAllAlerts}>
              See all <ArrowRight size={10} />
            </button>
          </div>
          
          <div className="patients-list no-scroll">
            {CRITICAL_ALERTS.map(patient => (
              <PatientCard key={patient.id} p={patient} />
            ))}
          </div>
        </div>
        
        {/* AI Environmental Forecast */}
        <div className="forecast-wrapper">
          <div className="forecast-card">
            <div className="forecast-header">
              <span className="forecast-label">🌍 AI Environmental Forecast</span>
              <span className="must-read">Must Read</span>
            </div>
            <div className="aqi-section">
              <div className="aqi-value">
                148
                <span className="aqi-label">AQI</span>
              </div>
              <span className="aqi-status-badge">Unhealthy</span>
            </div>
            <div className="location-info">
              <Wind size={10} /> Gujrat, Punjab · Updated 2 min ago
            </div>
            <div className="warning-message">
              <span className="warning-text">⚠️ AI Warning:</span> Elevated PM2.5 detected. Asthma flare-up risk is <strong>+38% higher</strong> than baseline.
            </div>
            <div className="pollen-tags">
              <span className="pollen-tag high">🌾 Grass Pollen · High</span>
              <span className="pollen-tag moderate">🌿 Tree · Moderate</span>
              <span className="pollen-tag low">💨 Dust · Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}