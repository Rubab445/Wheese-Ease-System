
// APIs Used:
//   1. OpenWeatherMap Current Weather  → /data/2.5/weather
//   2. OpenWeatherMap Air Pollution    → /data/2.5/air_pollution
//   3. OpenWeatherMap 5-Day Forecast   → /data/2.5/forecast
//   4. OpenWeatherMap One Call (UV)    → /data/3.0/onecall
//   5. Ambee Pollen API               → /latest/pollen/by-lat-lng

import React, { useState } from 'react';
import AQIPollutantsPanel from '../../AdminDashboard/Components/AQIPollutantsPanel'
import PollenPanel from '../../AdminDashboard/Components/PollenPanel'
import APISourcesPanel from '../../AdminDashboard/Components/APISourcesPanel'
import '../Admin.module.css/EnvironmentalMonitor.css'

// ── KPI Card data
// Sources: OpenWeatherMap /data/2.5/weather + /data/2.5/air_pollution + /data/3.0/onecall
interface KPIItem {
  icon: string;
  label: string;
  value: string | number;
  unit?: string;
  sublabel: string;
  statusText: string;
  statusClass: string;
  accentColor: string;
}

const kpiItems: KPIItem[] = [
  {
    icon: '🌡️',
    label: 'Temperature',
    value: 34,
    unit: '°C',
    sublabel: 'Feels like 37°C',
    statusText: 'Hot',
    statusClass: 'status-warning',
    accentColor: '#fb923c',
    // OWM field: main.temp, main.feels_like
  },
  {
    icon: '💧',
    label: 'Humidity',
    value: 62,
    unit: '%',
    sublabel: 'Dew point 26°C',
    statusText: 'Moderate Risk',
    statusClass: 'status-moderate',
    accentColor: '#3b82f6',
    // OWM field: main.humidity
  },
  {
    icon: '💨',
    label: 'Wind Speed',
    value: 14,
    unit: 'km/h',
    sublabel: 'Direction: SW',
    statusText: 'Spreading Pollen',
    statusClass: 'status-warning',
    accentColor: '#00d4b4',
    // OWM field: wind.speed, wind.deg
  },
  {
    icon: '👁️',
    label: 'Visibility',
    value: 7.4,
    unit: 'km',
    sublabel: 'Slight haze',
    statusText: 'Reduced',
    statusClass: 'status-moderate',
    accentColor: '#8b5cf6',
    // OWM field: visibility
  },
  {
    icon: '☀️',
    label: 'UV Index',
    value: 8,
    unit: '',
    sublabel: 'Peak: 12pm–3pm',
    statusText: 'Very High',
    statusClass: 'status-danger',
    accentColor: '#f59e0b',
    // OWM One Call field: current.uvi
  },
  {
    icon: '📊',
    label: 'Pressure',
    value: 1008,
    unit: ' hPa',
    sublabel: 'Falling slowly',
    statusText: 'Normal',
    statusClass: 'status-good',
    accentColor: '#10b981',
    // OWM field: main.pressure
  },
];

// ── Forecast data
// Source: OpenWeatherMap /data/2.5/forecast → list[].dt_txt, list[].main.temp, list[].pop
const forecastData = [
  { day: 'Today', icon: '⛅', high: 34, low: 27, rain: '10%', today: true  },
  { day: 'Thu',   icon: '☀️', high: 36, low: 28, rain: '5%',  today: false },
  { day: 'Fri',   icon: '🌦️', high: 31, low: 25, rain: '60%', today: false },
  { day: 'Sat',   icon: '🌧️', high: 28, low: 23, rain: '80%', today: false },
  { day: 'Sun',   icon: '⛅', high: 30, low: 24, rain: '30%', today: false },
];

// ── Alert data (generated from threshold logic in FastAPI)
const alertsData = [
  {
    type: 'danger',
    icon: '⚠️',
    title: 'High Tree Pollen Alert',
    desc: 'Pollen count exceeded 300 grains/m³. 18 at-risk patients notified via push notification.',
    time: '2m ago',
  },
  {
    type: 'warning',
    icon: '🌫️',
    title: 'AQI Approaching Unhealthy',
    desc: 'AQI at 87 (Moderate). Threshold 100 — monitoring closely.',
    time: '15m ago',
  },
  {
    type: 'info',
    icon: '💧',
    title: 'Humidity Above 60%',
    desc: 'High humidity may worsen asthma symptoms. Preventive tips sent to 42 patients.',
    time: '1h ago',
  },
];

// ── API footer items
const apiFooterItems = [
  { name: 'OWM Weather',  color: '#00d4b4' },
  { name: 'OWM AQI',      color: '#f59e0b' },
  { name: 'OWM Forecast', color: '#3b82f6' },
  { name: 'Ambee Pollen', color: '#8b5cf6' },
  { name: 'OWM UV Index', color: '#fb923c' },
];

const EnvironmentalModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'warnings' | 'info'>('all');

  const filteredAlerts = activeTab === 'all'
    ? alertsData
    : activeTab === 'warnings'
      ? alertsData.filter(a => a.type === 'danger' || a.type === 'warning')
      : alertsData.filter(a => a.type === 'info');

  return (
    <div className="env-module">
      <div className="env-container">

        {/* ── PAGE HEADER ── */}
        <div className="env-header">
          <div className="env-header-left">
            <h1 className="env-title">
              Environmental <span>Monitoring</span>
            </h1>
            <p className="env-subtitle">
              Real-time air quality, pollen & weather — powering the WheezeEase AI engine
            </p>
          </div>
          <div className="env-header-right">
            <div className="env-sync-badge">
              <span className="sync-dot" />
              Live · Auto-refresh every 10 min
            </div>
            <div className="env-location">
              📍 Gujrat, Punjab, Pakistan · Lat 32.5744 · Lon 74.0791
            </div>
          </div>
        </div>

        {/* ── SECTION: KPI CARDS ── */}
        <div className="section-label">
          <span className="section-label-text">Live Conditions</span>
          <span className="section-label-line" />
          <span className="section-label-api">OWM /weather + /onecall</span>
        </div>

        <div className="kpi-grid">
          {kpiItems.map((item) => (
            <div
              className="kpi-card"
              key={item.label}
              style={{ '--card-accent': item.accentColor } as React.CSSProperties}
            >
              <span className="kpi-card-icon">{item.icon}</span>
              <div className="kpi-label">{item.label}</div>
              <div className="kpi-value">
                {item.value}
                <span className="kpi-unit">{item.unit}</span>
              </div>
              <div className="kpi-sublabel">{item.sublabel}</div>
              <div className={`kpi-status ${item.statusClass}`}>
                {item.statusText}
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION: MAIN PANELS ── */}
        <div className="section-label">
          <span className="section-label-text">Air Quality · Pollen · Data Sources</span>
          <span className="section-label-line" />
          <span className="section-label-api">OWM /air_pollution · Ambee Pollen</span>
        </div>

        <div className="main-grid">
          {/* AQI Panel — OWM Air Pollution API */}
          <AQIPollutantsPanel aqi={87} />

          {/* Pollen Panel — Ambee API */}
          <PollenPanel />

          {/* API Sources Panel */}
          <APISourcesPanel />
        </div>

        {/* ── SECTION: FORECAST + ALERTS ── */}
        <div className="section-label">
          <span className="section-label-text">Forecast · Alerts</span>
          <span className="section-label-line" />
          <span className="section-label-api">OWM /forecast · Internal Thresholds</span>
        </div>

        <div className="bottom-grid">

          {/* 5-Day Forecast */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">5-Day Forecast</div>
                <div className="panel-subtitle">Used by AI to pre-warn patients of upcoming high-risk days</div>
              </div>
              <span className="api-tag api-tag-blue">OWM /forecast</span>
            </div>
            <div className="forecast-strip">
              {forecastData.map((day) => (
                <div key={day.day} className={`forecast-day${day.today ? ' today' : ''}`}>
                  <div className="forecast-day-label">{day.day}</div>
                  <span className="forecast-icon">{day.icon}</span>
                  <div className="forecast-temp-high">{day.high}°</div>
                  <div className="forecast-temp-low">{day.low}°</div>
                  <div className="forecast-rain">🌧 {day.rain}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">Environmental Alerts</div>
                <div className="panel-subtitle">Auto-generated when API data crosses patient thresholds</div>
              </div>
              <span className="api-tag">FastAPI · Postgresql</span>
            </div>

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {(['all', 'warnings', 'info'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '5px 12px',
                    borderRadius: 100,
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: activeTab === tab ? 'var(--accent-teal)' : 'var(--bg-glass)',
                    borderColor: activeTab === tab ? 'var(--accent-teal)' : 'var(--border-subtle)',
                    color: activeTab === tab ? '#0a0f1e' : 'var(--text-muted)',
                    fontWeight: activeTab === tab ? 600 : 400,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="alerts-list">
              {filteredAlerts.map((alert, i) => (
                <div key={i} className={`alert-item alert-${alert.type}`}>
                  <span className="alert-icon">{alert.icon}</span>
                  <div className="alert-content">
                    <div className="alert-title">{alert.title}</div>
                    <div className="alert-desc">{alert.desc}</div>
                  </div>
                  <span className="alert-time">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── API FOOTER STRIP ── */}
        <div className="api-footer-strip">
          <span className="api-footer-label">Data Providers</span>
          <div className="api-footer-items">
            {apiFooterItems.map((item) => (
              <div key={item.name} className="api-footer-item">
                <div className="api-footer-dot" style={{ background: item.color }} />
                <span className="api-footer-text">{item.name}</span>
              </div>
            ))}
          </div>
          <span className="api-footer-right">
          </span>
        </div>

      </div>
    </div>
  );
};

export default EnvironmentalModule;