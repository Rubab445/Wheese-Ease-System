export interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  dob: string;
  patientId: string;
  condition: string;
  severity: "critical" | "warning" | "stable" | "done";
  lastVisit: string;
  medications: Medication[];
  vitals?: {
    spo2: string;
    peakFlow: string;
  };
}

export interface Medication {
  id: number;
  name: string;
  category: "controller" | "reliever" | "biologic";
  dosage: string;
  frequency: string;
  duration: string;
  adherence: number;
  status: "active" | "draft" | "sent";
  lastTaken?: string[];
}

export interface DrugSuggestion {
  name: string;
  cat: string;
  dose: string;
}

export interface AIAlert {
  id: number;
  title: string;
  message: string;
  severity: "critical" | "warning" | "info";
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}