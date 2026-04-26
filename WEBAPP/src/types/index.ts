// src/types/index.ts
export interface Doctor {
  id: string;
  name: string;
  init: string;
  spec: string;
  hosp: string;
  patients: number;
  response: string;
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  email: string;
  phone: string;
  color: string;
  joined: string;
}

export interface Patient {
  id: string;
  name: string;
  init: string;
  age: number;
  gender: 'M' | 'F';
  cond: string;
  risk: number;
  doctor: string;
  lastCI: string;
  color: string;
  med: string;
  phone: string;
  city: string;
}

export interface Alert {
  id: number;
  type: string;
  icon: string;
  msg: string;
  patient: string;
  time: string;
  read: boolean;
  tag: string;
}

export interface Activity {
  icon: string;
  msg: string;
  time: string;
}

export interface BroadcastHistory {
  icon: string;
  title: string;
  to: string;
  time: string;
}

export interface MessageChat {
  from: 'out' | 'in';
  text: string;
  time: string;
}

export interface NewDoctorData {
  name: string;
  specialty: string;
  email: string;
  phone: string;
  hospital: string;
  notes?: string;
}

export interface NewPatientData {
  name: string;
  age: number;
  gender: 'M' | 'F';
  condition: string;
  phone: string;
  city: string;
  doctorId?: string;
}