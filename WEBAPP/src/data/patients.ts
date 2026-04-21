export interface Patient {
  id: string;
  name: string;
  av: string;
  age: number;
  gender: string;
  cond: string;
  risk: number;
  trend: 'up' | 'down' | 'flat';
  inhaler: number;
  aqi: number;
  pollen: 'High' | 'Med' | 'Low';
  humidity: number;
  temp: number;
  med: string;
  lastVisit: string;
  notes: string;
  color: string;
}

export interface Alert {
  id: number;
  pid: string;
  patient: string;
  type: 'high' | 'mod' | 'low';
  msg: string;
  time: string;
  icon: string;
  read: boolean;
}

export interface WeekData {
  day: string;
  high: number;
  mod: number;
  low: number;
}

export interface ChatMessage {
  from: 'out' | 'in';
  text: string;
  time: string;
}

export const PATIENTS: Patient[] = [
  { id: 'P-041', name: 'Sara Ahmed', av: 'SA', age: 34, gender: 'F', cond: 'Asthma', risk: 78, trend: 'up', inhaler: 4, aqi: 158, pollen: 'High', humidity: 67, temp: 34, med: 'Salbutamol + Fluticasone', lastVisit: 'Feb 18', notes: 'Worsening this week. High pollen exposure. Monitor daily.', color: '#e84393' },
  { id: 'P-012', name: 'Mohammad Khan', av: 'MK', age: 52, gender: 'M', cond: 'COPD + Allergy', risk: 71, trend: 'up', inhaler: 3, aqi: 142, pollen: 'High', humidity: 70, temp: 33, med: 'Tiotropium + Montelukast', lastVisit: 'Feb 22', notes: 'History of severe attacks in spring. Close monitoring needed.', color: '#e84343' },
  { id: 'P-055', name: 'Bilal Chaudhry', av: 'BC', age: 31, gender: 'M', cond: 'Asthma + Allergy', risk: 63, trend: 'up', inhaler: 2, aqi: 130, pollen: 'Med', humidity: 65, temp: 32, med: 'Montelukast + Salbutamol', lastVisit: 'Feb 25', notes: 'Stress-induced flares. Advised breathing exercises.', color: '#9b43e8' },
  { id: 'P-027', name: 'Fatima Noor', av: 'FN', age: 28, gender: 'F', cond: 'Seasonal Allergy', risk: 55, trend: 'up', inhaler: 1, aqi: 112, pollen: 'High', humidity: 62, temp: 31, med: 'Cetirizine + Fluticasone', lastVisit: 'Mar 01', notes: 'Pollen allergy flare expected this week.', color: '#f5a623' },
  { id: 'P-033', name: 'Usman Iqbal', av: 'UI', age: 45, gender: 'M', cond: 'Asthma', risk: 47, trend: 'flat', inhaler: 1, aqi: 95, pollen: 'Med', humidity: 58, temp: 30, med: 'Budesonide + Formoterol', lastVisit: 'Feb 28', notes: 'Stable. Continue current regimen.', color: '#3a8eff' },
  { id: 'P-061', name: 'Ayesha Raza', av: 'AR', age: 24, gender: 'F', cond: 'Seasonal Allergy', risk: 38, trend: 'flat', inhaler: 0, aqi: 88, pollen: 'Med', humidity: 60, temp: 30, med: 'Azelastine nasal spray', lastVisit: 'Mar 02', notes: 'Mild symptoms. Indoor air filter recommended.', color: '#20b2aa' },
  { id: 'P-019', name: 'Zara Butt', av: 'ZB', age: 19, gender: 'F', cond: 'Dust Allergy', risk: 22, trend: 'down', inhaler: 0, aqi: 78, pollen: 'Low', humidity: 55, temp: 29, med: 'Loratadine', lastVisit: 'Mar 03', notes: 'Responding well. Reduce home dust exposure.', color: '#22c87a' },
  { id: 'P-008', name: 'Ali Javed', av: 'AJ', age: 61, gender: 'M', cond: 'Asthma', risk: 14, trend: 'down', inhaler: 0, aqi: 72, pollen: 'Low', humidity: 52, temp: 28, med: 'Salmeterol + Fluticasone', lastVisit: 'Mar 05', notes: 'Excellent control. Consider reducing steroid dose.', color: '#22c87a' },
  { id: 'P-015', name: 'Hina Malik', av: 'HM', age: 39, gender: 'F', cond: 'Allergy', risk: 9, trend: 'down', inhaler: 0, aqi: 65, pollen: 'Low', humidity: 50, temp: 27, med: 'Fexofenadine', lastVisit: 'Mar 06', notes: 'In remission. Seasonal monitoring advised.', color: '#22c87a' },
];

export const ALERTS: Alert[] = [
  { id: 1, pid: 'P-041', patient: 'Sara Ahmed', type: 'high', msg: 'Risk jumped to 78% — possible attack imminent', time: '4 min ago', icon: '🚨', read: false },
  { id: 2, pid: 'P-041', patient: 'Sara Ahmed', type: 'high', msg: '4th inhaler use detected today — overuse risk', time: '9 min ago', icon: '💨', read: false },
  { id: 3, pid: 'P-012', patient: 'Mohammad Khan', type: 'high', msg: 'AQI exceeded 150 — active trigger zone', time: '22 min ago', icon: '🌫️', read: false },
  { id: 4, pid: 'P-055', patient: 'Bilal Chaudhry', type: 'mod', msg: 'Risk rising to 63% — chest tightness reported', time: '1h ago', icon: '⚠️', read: true },
  { id: 5, pid: 'P-027', patient: 'Fatima Noor', type: 'mod', msg: 'Wheezing reported — risk escalating', time: '2h ago', icon: '🫁', read: true },
  { id: 6, pid: 'P-019', patient: 'Zara Butt', type: 'low', msg: 'Daily check-in complete — all clear', time: '3h ago', icon: '✅', read: true },
  { id: 7, pid: 'P-008', patient: 'Ali Javed', type: 'low', msg: 'Risk decreased to 14% — good trend', time: '5h ago', icon: '📉', read: true },
];

export const WEEK: WeekData[] = [
  { day: 'Mon', high: 4, mod: 11, low: 28 },
  { day: 'Tue', high: 3, mod: 12, low: 27 },
  { day: 'Wed', high: 5, mod: 13, low: 26 },
  { day: 'Thu', high: 6, mod: 14, low: 25 },
  { day: 'Fri', high: 5, mod: 12, low: 27 },
  { day: 'Sat', high: 7, mod: 13, low: 24 },
  { day: 'Now', high: 2, mod: 3, low: 4 },
];

export const CHATS: Record<string, ChatMessage[]> = {};