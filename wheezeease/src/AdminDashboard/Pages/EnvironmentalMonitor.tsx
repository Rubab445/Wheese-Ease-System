import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import '../Admin.module.css/EnvironmentalMonitor.css';

// Import newly extracted components
import LiveConditionsKPI from '../Components/Environmental/LiveConditionsKPI';
import AQIPanel from '../Components/Environmental/AQIPanel';
import ForecastPanel from '../Components/Environmental/ForecastPanel';
import TrendsChart from '../Components/Environmental/TrendsChart';
import AlertsPanel from '../Components/Environmental/AlertsPanel';
import APIStatusPanel from '../Components/Environmental/APIStatusPanel';
import DataLogTable from '../Components/Environmental/DataLogTable';

const LOCATIONS = [
  { id: 'gujrat', name: 'Gujrat, Punjab', lat: 32.5744, lon: 74.0791, patients: 412 },
  { id: 'lahore', name: 'Lahore, Punjab', lat: 31.5204, lon: 74.3587, patients: 1250 },
  { id: 'islamabad', name: 'Islamabad, Capital', lat: 33.6844, lon: 73.0479, patients: 840 },
  { id: 'faisalabad', name: 'Faisalabad, Punjab', lat: 31.4504, lon: 73.1350, patients: 630 },
  { id: 'karachi', name: 'Karachi, Sindh', lat: 24.8607, lon: 67.0011, patients: 2100 },
];

const EnvironmentalModule: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  
  const currentAQI = 87; // Mock Current AQI
  
  const getAQIColor = (val: number) => {
    if (val <= 50) return '#10B981';
    if (val <= 100) return '#F59E0B';
    if (val <= 150) return '#F97316';
    return '#EF4444';
  };
  const gaugeColor = getAQIColor(currentAQI);

  return (
    <div className="env-module">
      <div className="env-container">

        {/* ── HEADER & SECTION 8: LOCATION SELECTOR ── */}
        <div className="env-header">
          <div className="env-header-left">
            <h1 className="env-title">Environmental <span>Monitoring</span></h1>
            <p className="env-subtitle">Real-time data pipeline powering the WheezeEase AI prediction engine</p>
          </div>
          <div className="env-header-right">
            <div className="env-sync-badge">
              <span className="sync-dot" /> Live · Auto-refresh 10m
            </div>
            <div className="location-selector">
              <MapPin size={16} color="#64748B" />
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {LOCATIONS.map(loc => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.patients} patients)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── SECTION 1: LIVE CONDITIONS (KPI CARDS) ── */}
        <LiveConditionsKPI currentAQI={currentAQI} gaugeColor={gaugeColor} />

        {/* ── SECTION 2 & 3: AQI PANEL & FORECAST ── */}
        <div className="section-label">
          <span className="section-label-text">Air Quality & Forecast</span>
          <span className="section-label-line" />
        </div>

        <div className="grid-2-col">
          <AQIPanel currentAQI={currentAQI} gaugeColor={gaugeColor} />
          <ForecastPanel />
        </div>

        {/* ── SECTION 4 & 5: TRENDS & ALERTS ── */}
        <div className="section-label">
          <span className="section-label-text">Analytics & Alerts</span>
          <span className="section-label-line" />
        </div>

        <div className="grid-2-col">
          <TrendsChart />
          <AlertsPanel />
        </div>

        {/* ── SECTION 6: API STATUS ── */}
        <APIStatusPanel />

        {/* ── SECTION 7: DATA LOG TABLE ── */}
        <DataLogTable />

      </div>
    </div>
  );
};

export default EnvironmentalModule;