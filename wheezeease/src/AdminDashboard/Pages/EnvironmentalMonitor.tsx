import { useState } from 'react';
import { RefreshCw, Settings, MapPin, Wind, Droplets, Thermometer, Flower2, Activity } from 'lucide-react';
import LiveMetricTiles from '../Components/LiveMetricTiles';
import TrendAnalysisChart from '../Components/TrendAnalysisChart';
import ZoneMonitorTable from '../Components/ZoneMonitorTable';
import ThresholdConfigModal from '../Components/ThresholdConfigModal';
import '../Admin.module.css/EnvironmentalMonitor.css';

interface EnvironmentalData {
  location: string;
  aqi: number;
  pm25: number;
  pm10: number;
  pollenCount: number;
  humidity: number;
  temperature: number;
  so2: number;
  co: number;
  lastUpdated: string;
}

interface ZoneData {
  id: string;
  sector: string;
  aqi: number;
  status: 'Clear' | 'Moderate' | 'Unhealthy' | 'Hazardous';
  pm25: number;
  pollenCount: number;
  lastUpdate: string;
}

export default function EnvironmentalMonitor() {
  const [selectedLocation, setSelectedLocation] = useState('Gujrat, Pakistan');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  const environmentalData: EnvironmentalData = {
    location: 'Gujrat, Pakistan',
    aqi: 187,
    pm25: 89,
    pm10: 145,
    pollenCount: 312,
    humidity: 68,
    temperature: 28,
    so2: 45,
    co: 12,
    lastUpdated: '5 minutes ago'
  };

  const zones: ZoneData[] = [
    {
      id: 'GJ-A',
      sector: 'Gujrat Sector A - Industrial Zone',
      aqi: 203,
      status: 'Hazardous',
      pm25: 125,
      pollenCount: 245,
      lastUpdate: '2 min ago'
    },
    {
      id: 'GJ-B',
      sector: 'Gujrat Sector B - Residential',
      aqi: 165,
      status: 'Unhealthy',
      pm25: 78,
      pollenCount: 198,
      lastUpdate: '3 min ago'
    },
    {
      id: 'GJ-C',
      sector: 'Gujrat Sector C - Commercial',
      aqi: 142,
      status: 'Unhealthy',
      pm25: 65,
      pollenCount: 287,
      lastUpdate: '5 min ago'
    },
    {
      id: 'GJ-D',
      sector: 'Gujrat Sector D - Green Belt',
      aqi: 95,
      status: 'Moderate',
      pm25: 42,
      pollenCount: 412,
      lastUpdate: '4 min ago'
    },
    {
      id: 'GJ-E',
      sector: 'Gujrat Sector E - Suburbs',
      aqi: 68,
      status: 'Clear',
      pm25: 28,
      pollenCount: 156,
      lastUpdate: '6 min ago'
    },
  ];

  const trendData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59'],
    smog: [145, 158, 172, 189, 201, 195, 187],
    pollen: [245, 268, 298, 325, 312, 289, 275]
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // TODO: API call to refresh environmental data
    console.log('Refreshing environmental data...');
    setTimeout(() => {
      setIsRefreshing(false);
      alert('Environmental data refreshed successfully!');
    }, 1500);
  };

  const getAQIStatus = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: 'good' };
    if (aqi <= 100) return { level: 'Moderate', color: 'moderate' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'unhealthy' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'very-unhealthy' };
    return { level: 'Hazardous', color: 'hazardous' };
  };

  const aqiStatus = getAQIStatus(environmentalData.aqi);

  return (
    <div className="environmental-monitor-page">
      <div className="environmental-header">
        <div className="header-left">
          <h2 className="page-title">Environmental Monitoring</h2>
          
        </div>
        <div className="header-actions">
          <div className="location-selector">
            <MapPin size={18} />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="location-select"
            >
              <option value="Gujrat, Pakistan">Gujrat, Pakistan</option>
              <option value="Lahore, Pakistan">Lahore, Pakistan</option>
              <option value="Karachi, Pakistan">Karachi, Pakistan</option>
              <option value="Islamabad, Pakistan">Islamabad, Pakistan</option>
            </select>
          </div>
          <button
            className="btn-action refresh"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
            Refresh Data
          </button>
          <button
            className="btn-action settings"
            onClick={() => setIsThresholdModalOpen(true)}
          >
            <Settings size={18} />
            Thresholds
          </button>
        </div>
      </div>

      {/* AQI Hero Section */}
      <div className="aqi-hero-section">
        <div className="aqi-gauge-container">
          <div className={`aqi-gauge aqi-${aqiStatus.color}`}>
            <div className="aqi-value">{environmentalData.aqi}</div>
            <div className="aqi-label">AQI Index</div>
          </div>
          <div className="aqi-details">
            <h3 className="aqi-location">{environmentalData.location}</h3>
            <span className={`aqi-status-badge status-${aqiStatus.color}`}>
              {aqiStatus.level}
            </span>
            <p className="aqi-update-time">
              <Activity size={14} />
              Updated {environmentalData.lastUpdated}
            </p>
          </div>
        </div>

        <div className="quick-stats-grid">
          <div className="quick-stat-card">
            <div className="stat-icon-box blue">
              <Wind size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">PM2.5</span>
              <span className="stat-value-environmental">{environmentalData.pm25} µg/m³</span>
            </div>
          </div>

          <div className="quick-stat-card">
            <div className="stat-icon-box purple">
              <Flower2 size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pollen Count</span>
              <span className="stat-value-environmental">{environmentalData.pollenCount}</span>
            </div>
          </div>

          <div className="quick-stat-card">
            <div className="stat-icon-box cyan">
              <Droplets size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Humidity</span>
              <span className="stat-value-environmental">{environmentalData.humidity}%</span>
            </div>
          </div>

          <div className="quick-stat-card">
            <div className="stat-icon-box orange">
              <Thermometer size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Temperature</span>
              <span className="stat-value-environmental">{environmentalData.temperature}°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <LiveMetricTiles data={environmentalData} />

      {/* Trend Analysis */}
      <TrendAnalysisChart data={trendData} />

      {/* Zone Monitoring */}
      <ZoneMonitorTable zones={zones} />

      {/* Threshold Configuration Modal */}
      <ThresholdConfigModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
      />
    </div>
  );
}
