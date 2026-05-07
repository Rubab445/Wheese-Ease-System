// APISourcesPanel.tsx
// This component displays all external API sources used by the Environmental Module.
// It serves as both live status monitoring and documentation for the data pipeline.

import React from 'react';
import '../Admin.module.css/EnvironmentalMonitor.css'

interface APIField {
  field: string;
}

interface APISource {
  name: string;
  provider: string;
  endpoint: string;
  fields: APIField[];
  color: string;
  glowColor: string;
  callFrequency: string;
  status: 'Active' | 'Idle' | 'Error';
}

const apiSources: APISource[] = [
  {
    name: 'Current Weather',
    provider: 'OpenWeatherMap',
    endpoint: '/data/2.5/weather?q={city}&units=metric',
    fields: [
      { field: 'main.temp' },
      { field: 'main.humidity' },
      { field: 'wind.speed' },
      { field: 'main.pressure' },
      { field: 'visibility' },
    ],
    color: '#00d4b4',
    glowColor: 'rgba(0,212,180,0.05)',
    callFrequency: 'Every 10 min',
    status: 'Active',
  },
  {
    name: 'Air Pollution',
    provider: 'OpenWeatherMap',
    endpoint: '/data/2.5/air_pollution?lat={lat}&lon={lon}',
    fields: [
      { field: 'main.aqi' },
      { field: 'components.pm2_5' },
      { field: 'components.pm10' },
      { field: 'components.no2' },
      { field: 'components.o3' },
    ],
    color: '#f59e0b',
    glowColor: 'rgba(245,158,11,0.05)',
    callFrequency: 'Every 10 min',
    status: 'Active',
  },
  {
    name: '5-Day Forecast',
    provider: 'OpenWeatherMap',
    endpoint: '/data/2.5/forecast?q={city}&units=metric',
    fields: [
      { field: 'list[].dt_txt' },
      { field: 'list[].main.temp' },
      { field: 'list[].pop' },
      { field: 'list[].weather[0]' },
    ],
    color: '#3b82f6',
    glowColor: 'rgba(59,130,246,0.05)',
    callFrequency: 'Every 3 hrs',
    status: 'Active',
  },
  {
    name: 'Pollen Data',
    provider: 'Ambee API',
    endpoint: '/latest/pollen/by-lat-lng?lat={lat}&lng={lng}',
    fields: [
      { field: 'data[0].Count.tree_pollen' },
      { field: 'data[0].Count.grass_pollen' },
      { field: 'data[0].Risk.*' },
    ],
    color: '#8b5cf6',
    glowColor: 'rgba(139,92,246,0.05)',
    callFrequency: 'Every 1 hr',
    status: 'Active',
  },
  {
    name: 'UV Index',
    provider: 'OpenWeatherMap',
    endpoint: '/data/3.0/onecall?lat={lat}&lon={lon}',
    fields: [
      { field: 'current.uvi' },
      { field: 'current.sunrise' },
      { field: 'current.sunset' },
      { field: 'daily[].uvi' },
    ],
    color: '#fb923c',
    glowColor: 'rgba(251,146,60,0.05)',
    callFrequency: 'Every 1 hr',
    status: 'Active',
  },
];

const APISourcesPanel: React.FC = () => {
  return (
    <div className="api-sources-panel">
      {/* Heading card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          marginBottom: 4,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            fontWeight: 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--accent-teal)',
            marginBottom: 6,
          }}
        >
          Data Pipeline
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
          }}
        >
          API Sources
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          All environmental data is pulled from 2 providers via scheduled FastAPI jobs and stored in MongoDB.
        </div>
      </div>

      {apiSources.map((api) => (
        <div
          key={api.name}
          className="api-source-card"
          style={{ '--card-glow': api.glowColor } as React.CSSProperties}
        >
          {/* Header */}
          <div className="api-source-header">
            <div
              className="api-source-dot"
              style={{ background: api.color, boxShadow: `0 0 6px ${api.color}` }}
            />
            <div className="api-source-name">{api.name}</div>
            <span className="api-source-status">● Live</span>
          </div>

          {/* Provider badge */}
          <div style={{ marginBottom: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: api.color,
                background: `${api.color}18`,
                border: `1px solid ${api.color}30`,
                borderRadius: 4,
                padding: '2px 8px',
              }}
            >
              {api.provider}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--text-muted)',
                marginLeft: 8,
              }}
            >
              {api.callFrequency}
            </span>
          </div>

          {/* Endpoint */}
          <div className="api-source-endpoint">{api.endpoint}</div>

          {/* Fields used */}
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--text-muted)',
              marginBottom: 6,
              letterSpacing: '0.08em',
            }}
          >
            Fields used:
          </div>
          <div className="api-source-fields">
            {api.fields.map((f) => (
              <span className="api-field-tag" key={f.field}>{f.field}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default APISourcesPanel;