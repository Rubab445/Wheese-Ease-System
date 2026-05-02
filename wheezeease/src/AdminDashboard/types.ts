export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseId: string;
  experience: number;
  status: 'Verified' | 'Pending' | 'Suspended';
  avatar: string;
  phone: string;
  activePatients: number;
  consultationHours: string;
  education: string;
  bio: string;
  joinDate: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  email: string;
  phone: string;
  riskLevel: 'Critical' | 'Guarded' | 'Stable';
  location: string;
  aqi: number;
  assignedDoctor: string;
  lastAttack: string;
  avatar: string;
  bloodType?: string;
  knownTriggers?: string[];
  medications?: string[];
  peakFlowData?: number[];
  medicalHistory?: string;
}
export interface Message {
  id: number;
  text: string;
  time: string;
  sent: boolean;
  status: 'sent' | 'delivered' | 'seen';
}

export interface Chat {
  id: number;
  name: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  online: boolean;
  messages: Message[];
}