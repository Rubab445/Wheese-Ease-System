// PollenPanel.tsx
// Data Source: Ambee Pollen API
// Endpoint: GET https://api.ambeedata.com/latest/pollen/by-lat-lng?lat={lat}&lng={lng}
// Headers: x-api-key: {AMBEE_API_KEY}, Content-Type: application/json
// Fields used: data[0].Count.tree_pollen, data[0].Count.grass_pollen,
//              data[0].Count.weed_pollen, data[0].Risk.*

import React from 'react';
import '../Admin.module.css/EnvironmentalMonitor.css'

interface PollenType {
  key: string;
  name: string;
  scientificNote: string;
  icon: string;
  // Source: data[0].Count.*
  count: number;
  // Source: data[0].Risk.*
  risk: 'Low' | 'Medium' | 'High' | 'Very High';
  color: string;
  bgColor: string;
  maxCount: number;
  description: string;
}

interface ForecastDay {
  day: string;
  treeRisk: 'Low' | 'Medium' | 'High';
  grassRisk: 'Low' | 'Medium' | 'High';
  weedRisk: 'Low' | 'Medium' | 'High';
}

interface PollenPanelProps {
  pollenData?: PollenType[];
  forecast?: ForecastDay[];
  lastUpdated?: string;
}

const defaultPollenData: PollenType[] = [
  {
    key: 'tree',
    name: 'Tree Pollen',
    scientificNote: 'Mainly Acacia & Eucalyptus in Punjab region',
    icon: '🌳',
    count: 342,   // data[0].Count.tree_pollen
    risk: 'High',
    color: '#fb923c',
    bgColor: 'rgba(251,146,60,0.12)',
    maxCount: 700,
    description: 'Primary trigger for seasonal allergic rhinitis. Peaks in spring & early summer.',
  },
  {
    key: 'grass',
    name: 'Grass Pollen',
    scientificNote: 'Bermuda grass — dominant in urban Pakistan',
    icon: '🌾',
    count: 178,   // data[0].Count.grass_pollen
    risk: 'Medium',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.12)',
    maxCount: 700,
    description: 'Common allergen affecting 80% of asthma patients in the region.',
  },
  {
    key: 'weed',
    name: 'Weed Pollen',
    scientificNote: 'Parthenium & Chenopodium — rural spread',
    icon: '🌿',
    count: 64,    // data[0].Count.weed_pollen
    risk: 'Low',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.12)',
    maxCount: 700,
    description: 'Lower counts today. Affects patients with cross-reactive food allergies.',
  },
];

const defaultForecast: ForecastDay[] = [
  { day: 'Today', treeRisk: 'High',   grassRisk: 'Medium', weedRisk: 'Low'    },
  { day: 'Thu',   treeRisk: 'High',   grassRisk: 'High',   weedRisk: 'Low'    },
  { day: 'Fri',   treeRisk: 'Medium', grassRisk: 'Medium', weedRisk: 'Medium' },
  { day: 'Sat',   treeRisk: 'Low',    grassRisk: 'Medium', weedRisk: 'Low'    },
];

const RISK_COLORS: Record<string, string> = {
  'Low':       '#10b981',
  'Medium':    '#f59e0b',
  'High':      '#f43f5e',
  'Very High': '#a855f7',
};

const riskClass = (risk: string) => {
  if (risk === 'Low')    return 'risk-low';
  if (risk === 'Medium') return 'risk-medium';
  return 'risk-high';
};

const PollenPanel: React.FC<PollenPanelProps> = ({
  pollenData = defaultPollenData,
  forecast = defaultForecast,
  lastUpdated = '2 min ago',
}) => {
  return (
    <div className="panel">
      {/* Header */}
      <div className="panel-header">
        <div>
          <div className="panel-title">Pollen Monitor</div>
          <div className="panel-subtitle">Tree · Grass · Weed — live counts & risk</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span className="api-tag api-tag-violet">Ambee Pollen API</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-muted)' }}>
            /latest/pollen/by-lat-lng
          </span>
        </div>
      </div>

      {/* API field reference */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: 'var(--text-muted)',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 6,
          padding: '6px 12px',
          marginBottom: 20,
          letterSpacing: '0.04em',
          lineHeight: 1.6,
        }}
      >
        Fields: <span style={{ color: '#8b5cf6' }}>data[0].Count.*</span> ·{' '}
        <span style={{ color: '#8b5cf6' }}>data[0].Risk.*</span> · Updated {lastUpdated}
      </div>

      {/* Pollen Types */}
      <div className="pollen-types">
        {pollenData.map((pollen) => (
          <div key={pollen.key}>
            <div className="pollen-item">
              {/* Icon */}
              <div
                className="pollen-icon-wrap"
                style={{ background: pollen.bgColor }}
              >
                {pollen.icon}
              </div>

              {/* Info */}
              <div className="pollen-info">
                <div className="pollen-name">{pollen.name}</div>
                <div className="pollen-desc">{pollen.scientificNote}</div>
              </div>

              {/* Count + Risk */}
              <div className="pollen-right">
                <div className="pollen-count" style={{ color: RISK_COLORS[pollen.risk] }}>
                  {pollen.count.toLocaleString()}
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 400 }}> grains/m³</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
                  <span className={`pollen-risk ${riskClass(pollen.risk)}`}>{pollen.risk}</span>
                </div>
              </div>
            </div>

            {/* Progress track */}
            <div className="pollen-track" style={{ marginLeft: 60, marginTop: 8, marginBottom: 4 }}>
              <div
                className="pollen-track-fill"
                style={{
                  width: `${Math.min((pollen.count / pollen.maxCount) * 100, 100)}%`,
                  background: `linear-gradient(90deg, ${pollen.color}80, ${pollen.color})`,
                }}
              />
            </div>

            {/* Description */}
            <div
              style={{
                marginLeft: 60,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                lineHeight: 1.5,
                marginBottom: 4,
              }}
            >
              {pollen.description}
            </div>

            {/* Divider (except last) */}
            {pollen.key !== pollenData[pollenData.length - 1].key && (
              <div style={{ height: 1, background: 'var(--border-subtle)', margin: '12px 0' }} />
            )}
          </div>
        ))}
      </div>

      {/* 4-day pollen forecast */}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '20px 0' }} />
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-muted)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 14,
        }}
      >
        4-Day Pollen Outlook
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
        {forecast.map((day, i) => (
          <div
            key={day.day}
            style={{
              background: i === 0 ? 'rgba(139,92,246,0.08)' : 'var(--bg-glass)',
              border: `1px solid ${i === 0 ? 'rgba(139,92,246,0.25)' : 'var(--border-subtle)'}`,
              borderRadius: 10,
              padding: '12px 8px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: i === 0 ? '#8b5cf6' : 'var(--text-muted)',
                marginBottom: 8,
              }}
            >
              {day.day}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { label: '🌳', risk: day.treeRisk },
                { label: '🌾', risk: day.grassRisk },
                { label: '🌿', risk: day.weedRisk },
              ].map(({ label, risk }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                  <span style={{ fontSize: 10 }}>{label}</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: RISK_COLORS[risk],
                      fontWeight: 600,
                    }}
                  >
                    {risk}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollenPanel;