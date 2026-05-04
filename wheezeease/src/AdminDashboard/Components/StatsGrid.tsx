import { Users, Brain, Wind, Activity, TrendingUp } from 'lucide-react';
import '../Admin.module.css/Dashboard.css'

export default function StatsGrid() {
  const stats = [
    {
      title: 'Patient Wellness',
      value: '87%',
      change: '+5.2%',
      icon: Users,
      color: '#3B82F6'
    },
    {
      title: 'AI Risk Forecast',
      value: '23',
      change: 'Next 24h',
      icon: Brain,
      color: '#8B5CF6'
    },
    {
      title: 'Regional Air Quality',
      value: '142 AQI',
      change: 'Unhealthy',
      icon: Wind,
      color: '#EF4444'
    },
    {
      title: 'Active Doctors',
      value: '87',
      change: 'Online Now',
      icon: Activity,
      color: '#10B981'
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <Icon size={24} />
            </div>
            <div className="stat-info">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <div className="stat-change">
                <TrendingUp size={14} />
                <span>{stat.change}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
