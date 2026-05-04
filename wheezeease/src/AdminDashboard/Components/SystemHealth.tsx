import '../Admin.module.css/Dashboard.css'

export default function SystemHealth() {
  const systems = [
    { name: 'FastAPI Backend', status: 'Online', metric: '99.8% Uptime' },
    { name: 'ML Model', status: 'Active', metric: '94.2% Accuracy' },
    { name: 'Environmental API', status: 'Synced', metric: '2 min ago' },
  ];

  return (
    <div className="system-health-container">
      <h3 className="section-title">System Health</h3>
      <div className="system-list">
        {systems.map((system, index) => (
          <div key={index} className="system-item">
            <div className="system-info">
              <span className="system-name">{system.name}</span>
              <span className="system-metric">{system.metric}</span>
            </div>
            <span className="system-status online">{system.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
