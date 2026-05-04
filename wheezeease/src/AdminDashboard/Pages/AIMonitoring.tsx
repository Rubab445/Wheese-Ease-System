// AIMonitoring.tsx - Complete Working Component
import React, { useState } from 'react';
import '../Admin.module.css/AIMonitoring.css'

interface LogEntry {
  id: string;
  patient: string;
  trigger: string;
  confidence: string;
  assessment: string;
  timestamp: string;
  severity: string;
  details: string;
}

const AIMonitoring: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleRetrain = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("✨ Neural weights re-calibrated successfully!");
    }, 2000);
  };

  const handleViewLogs = () => {
    setIsLogsModalOpen(true);
  };

  const handleViewLogDetail = (log: LogEntry) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsLogsModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedLog(null);
  };

  // Sample logs data
  const logsData = [
    { id: '#9021', patient: 'Zeeshan Ali', trigger: 'PM2.5 Peak', confidence: '98.4%', assessment: 'High Alert', timestamp: '14:20:05', severity: 'danger', details: 'Patient location shows high PM2.5 concentration (156 µg/m³). AI predicts 92% chance of asthma attack within next 2 hours. Immediate intervention recommended.' },
    { id: '#9022', patient: 'Amna Khan', trigger: 'Pollen Lvl 4', confidence: '82.1%', assessment: 'Pre-emptive', timestamp: '14:22:12', severity: 'warning', details: 'Pollen count is at level 4 (High). Patient has history of pollen allergies. Recommendation: Pre-emptive medication advised.' },
    { id: '#9023', patient: 'Rahul Sharma', trigger: 'Humidity Spike', confidence: '91.3%', assessment: 'Moderate Risk', timestamp: '14:25:30', severity: 'info', details: 'Humidity levels increased by 40% in last 3 hours. Patient shows early symptoms. Monitoring recommended.' },
    { id: '#9024', patient: 'Sana Mirza', trigger: 'Temperature Drop', confidence: '87.6%', assessment: 'Watch', timestamp: '14:28:45', severity: 'warning', details: 'Temperature dropped 12°C in 6 hours. Cold air induced bronchoconstriction risk elevated.' },
  ];

  return (
    <div className="ai-dashboard-root">
      {/* Header */}
      <header className="glass-header">
        <div className="header-meta">
          <h3>AI Monitoring</h3>
          <p>Real-time predictive analytics and model performance monitoring for WheezeEase</p>
        </div>
        <div className="header-controls">
          <button 
            className={`btn-gradient ${isSyncing ? 'pulse' : ''}`} 
            onClick={handleRetrain}
          >
            {isSyncing ? '🔄 Syncing Weights...' : '⚡ Retrain Engine'}
          </button>
        </div>
      </header>

      {/* Stats Cards - Colorful */}
      <div className="stats-grid-row">
        <div className="stat-card-wrapped stat-emerald">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-tag">System Uptime</span>
            <h2 className="stat-num">99.98%</h2>
            <div className="stat-footer">✅ Live tracking active</div>
          </div>
        </div>
        <div className="stat-card-wrapped stat-violet">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <span className="stat-tag">Total Predictions</span>
            <h2 className="stat-num">12,402</h2>
            <div className="stat-footer">📈 +23% this week</div>
          </div>
        </div>
        <div className="stat-card-wrapped stat-cyan">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <span className="stat-tag">Avg API Latency</span>
            <h2 className="stat-num">24ms</h2>
            <div className="stat-footer">🚀 Ultra-fast</div>
          </div>
        </div>
        <div className="stat-card-wrapped stat-rose">
          <div className="stat-icon">🖥️</div>
          <div className="stat-content">
            <span className="stat-tag">Active Instances</span>
            <h2 className="stat-num">04</h2>
            <div className="stat-footer">🔗 All operational</div>
          </div>
        </div>
      </div>

      <div className='ai-monitoring-cards'>
        {/* Graph Card */}
        <div className="card-wrapper">
          <div className="card-inner-header">
            <h3>📈 Correlation Analysis: Smog vs. Attack Risk</h3>
            <div className="viz-legend-custom">
              <span className="l-item"><i className="v-dot"></i> Forecasted Risk</span>
              <span className="l-item"><i className="c-dot"></i> Environmental Load</span>
            </div>
          </div>
          <div className="svg-container">
            <svg viewBox="0 0 800 220" className="pro-svg">
              <defs>
                <linearGradient id="violetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor:'rgba(124, 58, 237, 0.3)', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'rgba(124, 58, 237, 0)', stopOpacity:1}} />
                </linearGradient>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{stopColor:'rgba(6, 182, 212, 0.2)', stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:'rgba(6, 182, 212, 0)', stopOpacity:1}} />
                </linearGradient>
              </defs>
              <path d="M0,180 Q100,160 200,120 T400,80 T600,60 T800,40" fill="url(#violetGradient)" />
              <path d="M0,180 Q100,160 200,120 T400,80 T600,60 T800,40" fill="none" stroke="#7c3aed" strokeWidth="3" />
              <path d="M0,200 Q150,190 300,160 T500,140 T800,100" fill="url(#cyanGradient)" />
              <path d="M0,200 Q150,190 300,160 T500,140 T800,100" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6,4" />
              <circle cx="200" cy="120" r="5" fill="#7c3aed" className="ping-dot" />
              <circle cx="400" cy="80" r="5" fill="#7c3aed" className="ping-dot" style={{animationDelay: '0.5s'}} />
              <circle cx="600" cy="60" r="5" fill="#7c3aed" className="ping-dot" style={{animationDelay: '1s'}} />
            </svg>
          </div>
        </div>

        {/* Neural Health Card */}
        <div className="card-wrapper health-span">
          <div className="card-inner-header">
            <h3>🧠 Neural Health Scaling</h3>
          </div>
          <div className="health-metrics-list">
            <div className="m-group">
              <div className="m-text"><span>🤖 Random Forest (AQI)</span> <span className="t-emerald">94.2%</span></div>
              <div className="progress-track">
                <div className="progress-fill bg-emerald" style={{width: '94.2%'}}></div>
              </div>
            </div>
            <div className="m-group">
              <div className="m-text"><span>🕰️ LSTM (Time-Series)</span> <span className="t-amber">88.5%</span></div>
              <div className="progress-track">
                <div className="progress-fill bg-amber" style={{width: '88.5%'}}></div>
              </div>
            </div>
            <div className="m-group">
              <div className="m-text"><span>⚡ Recall Optimization</span> <span className="t-violet">91.0%</span></div>
              <div className="progress-track">
                <div className="progress-fill bg-violet" style={{width: '91.0%'}}></div>
              </div>
            </div>
            <div className="m-group">
              <div className="m-text"><span>🎯 Precision Score</span> <span className="t-cyan">89.3%</span></div>
              <div className="progress-track">
                <div className="progress-fill bg-cyan" style={{width: '89.3%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="card-wrapper full-span">
          <div className="card-inner-header">
            <h3>📋 Recent Inference Activity Logs</h3>
            <button className="btn-small" onClick={handleViewLogs}>📂 View Full Logs</button>
          </div>
          <div className="table-container">
            <table className="data-table-pro">
              <thead>
                <tr>
                  <th>Trace ID</th>
                  <th>Patient Profile</th>
                  <th>Dominant Trigger</th>
                  <th>Confidence</th>
                  <th>AI Assessment</th>
                  <th>Timestamp</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {logsData.map((log, idx) => (
                  <tr key={idx}>
                    <td><strong>{log.id}</strong></td>
                    <td>{log.patient}</td>
                    <td><span className="trigger-pill">{log.trigger}</span></td>
                    <td><span className={`confidence-${log.severity === 'danger' ? 'high' : 'mid'}`}>{log.confidence}</span></td>
                    <td><span className={`badge-status ${log.severity}`}>{log.assessment}</span></td>
                    <td>{log.timestamp}</td>
                    <td>
                      <button className="view-detail-btn" onClick={() => handleViewLogDetail(log)}>
                        🔍 View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      {isLogsModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span>📋</span> All Inference Logs
                <span className="alert-count-badge">{logsData.length} Records</span>
              </div>
              <button className="modal-close" onClick={handleCloseModals}>✕</button>
            </div>
            <div className="modal-body">
              <div className="logs-list">
                {logsData.map((log, idx) => (
                  <div key={idx} className="log-item" onClick={() => handleViewLogDetail(log)}>
                    <div className="log-header">
                      <span className="log-id">{log.id}</span>
                      <span className={`log-badge ${log.severity}`}>{log.assessment}</span>
                    </div>
                    <div className="log-patient">{log.patient}</div>
                    <div className="log-details">
                      <span>🎯 {log.trigger}</span>
                      <span>📊 {log.confidence}</span>
                      <span>⏰ {log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button export" onClick={() => alert('📊 Exporting logs as CSV...')}>
                📥 Export as CSV
              </button>
              <button className="modal-button close" onClick={handleCloseModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Log Detail Modal */}
      {isDetailModalOpen && selectedLog && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span>🔍</span> Log Details: {selectedLog.id}
              </div>
              <button className="modal-close" onClick={handleCloseModals}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-card">
                <div className="detail-row">
                  <span className="detail-label">Patient:</span>
                  <span className="detail-value">{selectedLog.patient}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trigger:</span>
                  <span className="detail-value"><span className="trigger-pill">{selectedLog.trigger}</span></span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Confidence:</span>
                  <span className="detail-value confidence-value">{selectedLog.confidence}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Assessment:</span>
                  <span className={`badge-status ${selectedLog.severity}`}>{selectedLog.assessment}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Timestamp:</span>
                  <span className="detail-value">{selectedLog.timestamp}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">AI Analysis:</span>
                  <p className="detail-description">{selectedLog.details}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-button escalate" onClick={() => alert(`⚠️ Alert escalated for ${selectedLog.patient}`)}>
                🚨 Escalate Alert
              </button>
              <button className="modal-button resolve" onClick={handleCloseModals}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIMonitoring;