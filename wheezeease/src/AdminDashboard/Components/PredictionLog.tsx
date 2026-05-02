import React from 'react';

const PredictionLog: React.FC = () => {
  const data = [
    { patient: "P-882", result: "High Risk", conf: "98.2%", time: "14:55" },
    { patient: "P-104", result: "Stable", conf: "94.1%", time: "14:48" },
    { patient: "P-332", result: "Guarded", conf: "89.5%", time: "14:30" },
    { patient: "P-901", result: "High Risk", conf: "97.8%", time: "14:15" },
  ];

  return (
    <div className="log-container">
      <h3>Inference Activity</h3>
      <table className="ai-table-light">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Status</th>
            <th>Confidence</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td><strong>{item.patient}</strong></td>
              <td>
                <span className={`status-pill ${item.result.replace(" ", "").toLowerCase()}`}>
                  {item.result}
                </span>
              </td>
              <td>{item.conf}</td>
              <td className="text-muted">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PredictionLog;