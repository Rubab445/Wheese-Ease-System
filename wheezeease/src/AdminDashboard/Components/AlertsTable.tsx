import '../Admin.module.css/Dashboard.css'

export default function AlertsTable() {
  const alerts = [
    { id: 'PT-1024', name: 'Ahmed Khan', risk: 94, location: 'Sector G-15', status: 'Critical' },
    { id: 'PT-1087', name: 'Sara Malik', risk: 87, location: 'Jinnah Road', status: 'High' },
    { id: 'PT-1142', name: 'Ali Raza', risk: 79, location: 'Model Town', status: 'High' },
    { id: 'PT-1203', name: 'Fatima Noor', risk: 72, location: 'Civil Lines', status: 'Moderate' },
  ];

  return (
    <div className="alerts-table-container">
      <h3 className="section-title">Critical Patient Alerts</h3>
      <table className="alerts-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Name</th>
            <th>Risk Score</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td className="patient-id">{alert.id}</td>
              <td className="patient-name">{alert.name}</td>
              <td>
                <span className="risk-score" style={{
                  color: alert.risk >= 90 ? '#F5365C' : alert.risk >= 75 ? '#FB6340' : '#FFB547'
                }}>
                  {alert.risk}%
                </span>
              </td>
              <td className="location">{alert.location}</td>
              <td>
                <span className={`status-badge ${alert.status.toLowerCase()}`}>
                  {alert.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
