import '../Admin.module.css/Dashboard.css'

export default function AnalyticalChart() {
  const chartData = [
    { day: 'Mon', value1: 45, value2: 32 },
    { day: 'Tue', value1: 52, value2: 41 },
    { day: 'Wed', value1: 61, value2: 50 },
    { day: 'Thu', value1: 55, value2: 45 },
    { day: 'Fri', value1: 68, value2: 58 },
    { day: 'Sat', value1: 72, value2: 62 },
    { day: 'Sun', value1: 65, value2: 53 },
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3 className="chart-title">Weekly Health Trends</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot blue"></span>
            <span>Environmental Data</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot cyan"></span>
            <span>Patient Symptoms</span>
          </div>
        </div>
      </div>
      <div className="chart-area">
        {chartData.map((data, index) => {
          const height1 = (data.value1 / 80) * 200;
          const height2 = (data.value2 / 80) * 200;

          return (
            <div key={index} className="chart-bar-group">
              <div className="chart-bars">
                <div
                  className="chart-bar blue"
                  style={{ height: `${height1}px` }}
                ></div>
                <div
                  className="chart-bar cyan"
                  style={{ height: `${height2}px` }}
                ></div>
              </div>
              <span className="chart-label">{data.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
