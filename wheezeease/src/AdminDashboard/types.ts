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

// --- Report Module Types ---

export type ReportSeverity = "critical" | "high" | "medium" | "low";
export type ReportStatus = "open" | "inprogress" | "resolved" | "closed";
export type ReporterRole = "patient" | "doctor";

export type ReportType =
  | "App Bug / Technical Issue"
  | "Wrong AI Recommendation"
  | "Incorrect Symptom Data"
  | "Prescription/Medication Error"
  | "Account or Access Problem"
  | "Environmental Data Mismatch"
  | "Other";

export interface ReportMessage {
  id: string;
  senderName: string;
  senderRole: 'admin' | ReporterRole;
  text: string;
  timestamp: string;
}

export interface ReportTimelineEvent {
  id: string;
  text: string;
  timestamp: string;
  type: 'status_change' | 'assignment' | 'comment' | 'submission';
}

export interface InternalNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface Report {
  id: string;
  subject: string;
  description: string;
  type: ReportType;
  severity: ReportSeverity;
  status: ReportStatus;
  reporterName: string;
  reporterRole: ReporterRole;
  reporterInitials: string;
  patientId?: string;
  dateSubmitted: string;
  assignedTo?: string;
  messages: ReportMessage[];
  timeline: ReportTimelineEvent[];
  internalNotes: InternalNote[];
}