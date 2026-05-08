export interface SymptomLog {
  date: string;
  severityColor: 'green' | 'amber' | 'rose';
  desc: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  age: number;
  gender: string;
  city: string;
  conditions: string[];
  severity: string;
  riskLevel: 'high' | 'medium' | 'low';
  lastActive: string;
  assignedSince: string;
  symptomCountThisWeek: number;
  status: 'active' | 'inactive';
  recentLogs: SymptomLog[];
  envData: {
    aqi: number;
    aqiColor: 'high' | 'medium' | 'low';
    pollen: string;
    pollenColor: 'high' | 'medium' | 'low';
    note: string;
  };
}
