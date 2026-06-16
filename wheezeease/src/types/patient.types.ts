export interface Vitals {
  spo2: string;
  peakFlow: string;
  heartRate: string;
  temp: string;
}

export interface Symptom {
  name: string;
  severity: number;
  time: string;
  icon: string;
}

export interface Medication {
  name: string;
  dose: string;
  freq: string;
}

export interface AIRecommendation {
  type: 'warn' | 'info' | 'ok';
  icon: string;
  title: string;
  desc: string;
  conf: number;
}

export interface HistoryRecord {
  date: string;
  title: string;
  note: string;
}

export interface Risk {
  level: 'High' | 'Medium' | 'Low';
  score: number;
  factors: string[];
}

export interface Patient {
  id: string;
  supabaseId: string;
  name: string;
  age: number;
  gender: string;
  blood: string;
  condition: string;
  status: 'critical' | 'watch' | 'stable';
  lastActive: string;
  phone: string;
  email: string;
  city: string;
  initials: string;
  avatarBg: string;
  avatarColor: string;
  allergies: string[];
  triggers: string[];
  vitals: Vitals;
  risk: Risk;
  symptoms: Symptom[];
  medications: Medication[];
  ai: AIRecommendation[];
  history: HistoryRecord[];
}