import { Patient } from '../data/patients';

export const riskColor = (r: number): string => 
  r >= 61 ? 'var(--red)' : r >= 31 ? 'var(--amber)' : 'var(--green)';

export const riskBg = (r: number): string => 
  r >= 61 ? 'var(--red-bg)' : r >= 31 ? 'var(--amber-bg)' : 'var(--green-bg)';

export const riskLabel = (r: number): string => 
  r >= 61 ? 'High' : r >= 31 ? 'Moderate' : 'Low';

export const riskClass = (r: number): string => 
  r >= 61 ? 'high' : r >= 31 ? 'mod' : 'low';

export const trendArrow = (t: string): string => 
  t === 'up' ? '↑' : t === 'down' ? '↓' : '→';

export const trendClass = (t: string): string => 
  t === 'up' ? 'up' : t === 'down' ? 'down' : 'flat';

export const getRiskStats = (patients: Patient[]) => ({
  high: patients.filter(p => p.risk >= 61).length,
  mod: patients.filter(p => p.risk >= 31 && p.risk < 61).length,
  low: patients.filter(p => p.risk < 31).length,
  total: patients.length,
});