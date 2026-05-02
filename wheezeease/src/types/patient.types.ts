export interface SymptomLog {
    date: string;
    severity: number;
    symptom: string;
    time?: string;
}

export interface AIPrediction {
    date: string;
    riskLevel: 'low' | 'medium' | 'high';
    predictedTrigger: string;
    recommendation: string;
}

export interface MedicationLog {
    name: string;
    dosage: string;
    frequency: string;
    lastTaken?: string;
}

export interface EmergencyContact {
    name: string;
    relationship: string;
    phone: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    patientId: string;
    lastSync: string;
    lastSyncTimestamp: Date;
    riskLevel: 'critical' | 'warning' | 'stable';
    primaryTrigger: string;
    triggerIcon: string;
    location: string;
    asthmaType: string;
    medications: MedicationLog[];
    pastERVisits: number;
    adherenceRate: number;
    preventiveUsage: number;
    rescueUsage: number;
    symptoms: SymptomLog[];
    triggers: string[];
    isInactive: boolean;
    email?: string;
    phone?: string;
    emergencyContact?: EmergencyContact;
    aiPredictions?: AIPrediction[];
    recentLocations?: string[];
    peakFlowReadings?: { date: string; value: number }[];
}