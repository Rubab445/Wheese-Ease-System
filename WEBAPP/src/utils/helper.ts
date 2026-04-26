// src/utils/helpers.ts
export const riskBgCls = (r: number): string => 
  r >= 61 ? 'badge-red' : (r >= 31 ? 'badge-amber' : 'badge-green');

export const riskLabel = (r: number): string => 
  r >= 61 ? 'High' : (r >= 31 ? 'Moderate' : 'Low');

export const riskColor = (r: number): string => 
  r >= 61 ? 'var(--red)' : (r >= 31 ? 'var(--amber)' : 'var(--green)');