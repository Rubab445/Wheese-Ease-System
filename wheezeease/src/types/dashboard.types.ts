export interface DashboardStats {
    totalPatients: number;
    highRiskPatients: number;
    pendingAIRecommendations: number;
    unreadAlerts: number;
    trends: {
        totalPatients: number;
        highRiskPatients: number;
        pendingAIRecommendations: number;
        unreadAlerts: number;
    };
}

export interface ActivityItem {
    id: string;
    patientName: string;
    patientId: string;
    time: string;
    eventType: 'symptom_logged' | 'new_patient' | 'alert_triggered' | 'medication_missed';
    description: string;
    severity?: 'low' | 'medium' | 'high';
}

export interface HighRiskPatient {
    id: string;
    name: string;
    riskPercentage: number;
    mainTrigger: string;
    lastSeen: string;
    patientId: string;
}

export interface EnvironmentalData {
    aqi: number;
    aqiLevel: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
    pollenCount: number;
    pollenLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
    humidity: number;
    temperature: number;
    condition: string;
}

export interface AIInsight {
    message: string;
    affectedPatients: number;
    recommendation: string;
    timestamp: string;
}

export interface SymptomTrend {
    date: string;
    symptomCount: number;
    aqi: number;
    pollenCount: number;
}