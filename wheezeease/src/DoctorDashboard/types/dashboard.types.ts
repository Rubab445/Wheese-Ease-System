import React from 'react';

export interface Patient {
  id: string;
  name: string;
  av: string;
  age: number;
  gender: 'M' | 'F';
  cond: string;
  risk: number;
  trend: 'up' | 'down' | 'flat';
  inhaler: number;
  aqi: number;
  pollen: 'Low' | 'Med' | 'High';
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
  icon: React.ReactNode;
  read: boolean;
}

export interface WeekData {
  day: string;
  high: number;
  mod: number;
  low: number;
}

export interface DashboardStats {
  totalPatients: number;
  lowRisk: number;
  moderateRisk: number;
  highRisk: number;
}