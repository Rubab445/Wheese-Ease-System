"""
WheezeEase AI Service
REST API for AI predictions and recommendations
"""

import os
import sys
from datetime import datetime
from typing import List, Optional

import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add src folder to path if running as backend module
sys.path.append(os.path.dirname(__file__))

# Load configuration from root .env
from config import OPENWEATHER_API_KEY, API_HOST, API_PORT

# Import EnvironmentalDataCollector
from environmental_api import EnvironmentalDataCollector

# Initialize FastAPI
app = FastAPI(
    title="WheezeEase AI API",
    description="AI-powered asthma and allergy risk prediction system",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data/models")
try:
    best_model = joblib.load(os.path.join(MODEL_DIR, 'best_model.pkl'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
    feature_names = joblib.load(os.path.join(MODEL_DIR, 'feature_names.pkl'))
    print("✓ Models loaded successfully")
except Exception as e:
    print(f"⚠️ Error loading models: {e}")
    best_model = None
    scaler = None
    feature_names = None

# Initialize EnvironmentalDataCollector
try:
    env_collector = EnvironmentalDataCollector(api_key=OPENWEATHER_API_KEY)
except Exception as e:
    print(f"⚠️ EnvironmentalDataCollector initialization failed: {e}")
    env_collector = None

# ----------------- Pydantic Models -----------------
class PatientProfile(BaseModel):
    age: int = Field(..., ge=0, le=120)
    gender: str
    has_asthma: bool
    severity: str
    allergies: List[str]

class SymptomData(BaseModel):
    symptom_wheezing: int = Field(0, ge=0, le=7)
    symptom_coughing: int = Field(0, ge=0, le=7)
    symptom_shortness_breath: int = Field(0, ge=0, le=7)
    symptom_chest_tightness: int = Field(0, ge=0, le=7)
    inhaler_usage_week: int = Field(0, ge=0)
    medication_adherence: float = Field(1.0, ge=0.0, le=1.0)

class PredictionRequest(BaseModel):
    patient: PatientProfile
    symptoms: SymptomData
    city: Optional[str] = "Lahore,PK"

class PredictionResponse(BaseModel):
    success: bool
    risk_level: str
    confidence: float
    probabilities: dict
    triggers: List[str]
    recommendations: List[str]
    environmental_data: dict
    timestamp: str

# ----------------- API Endpoints -----------------
@app.get("/")
def root():
    return {
        "name": "WheezeEase AI API",
        "version": "1.0.0",
        "status": "operational",
        "model_loaded": best_model is not None,
        "endpoints": {
            "POST /predict": "Get risk prediction and recommendations",
            "GET /environmental-data/{city}": "Get current environmental data",
            "GET /health": "Health check"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy" if best_model else "degraded",
        "model_loaded": best_model is not None,
        "scaler_loaded": scaler is not None,
        "features_count": len(feature_names) if feature_names else 0,
        "env_collector_ready": env_collector is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/environmental-data/{city}")
def get_environmental_data(city: str = "Lahore,PK"):
    if not env_collector:
        raise HTTPException(status_code=503, detail="Environmental API not available")
    try:
        data = env_collector.get_current_weather(city)
        if not data:
            raise HTTPException(status_code=503, detail=f"Cannot fetch environmental data for {city}")
        return {"success": True, "city": city, "data": data, "timestamp": datetime.now().isoformat()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict", response_model=PredictionResponse)
def predict_risk(request: PredictionRequest):
    if not best_model or not scaler:
        raise HTTPException(status_code=503, detail="AI model not available")
    if not env_collector:
        raise HTTPException(status_code=503, detail="Environmental API not available")

    try:
        env_data = env_collector.get_formatted_for_ml(request.city)
        if not env_data:
            raise HTTPException(status_code=503, detail="Unable to fetch environmental data")

        # Feature preparation
        severity_map = {"Mild": 0, "Moderate": 1, "Severe": 2}
        gender_map = {"Male": 0, "Female": 1}

        features = np.array([[ 
            request.patient.age,
            gender_map.get(request.patient.gender, 0),
            int(request.patient.has_asthma),
            severity_map.get(request.patient.severity, 0),
            int('pollen' in request.patient.allergies),
            int('dust' in request.patient.allergies),
            int('pollution' in request.patient.allergies),
            int('pets' in request.patient.allergies),
            env_data['temperature'],
            env_data['humidity'],
            env_data['aqi'],
            env_data['pollen_level'],
            request.symptoms.symptom_wheezing,
            request.symptoms.symptom_coughing,
            request.symptoms.symptom_shortness_breath,
            request.symptoms.symptom_chest_tightness,
            request.symptoms.inhaler_usage_week,
            request.symptoms.medication_adherence,
            env_data['month'],
            env_data['is_spring'],
            env_data['is_winter']
        ]])

        features_scaled = scaler.transform(features)
        prediction = best_model.predict(features_scaled)[0]
        probabilities = best_model.predict_proba(features_scaled)[0]

        risk_levels = ['Low', 'Medium', 'High']
        risk_level = risk_levels[prediction]

        triggers = generate_triggers(env_data['raw_data'], request.patient.allergies)
        recommendations = generate_recommendations(risk_level, env_data['raw_data'], request.patient.allergies, request.patient.has_asthma)

        return PredictionResponse(
            success=True,
            risk_level=risk_level,
            confidence=round(float(max(probabilities) * 100), 2),
            probabilities={ "low": round(float(probabilities[0]*100),2),
                            "medium": round(float(probabilities[1]*100),2),
                            "high": round(float(probabilities[2]*100),2)},
            triggers=triggers,
            recommendations=recommendations,
            environmental_data=env_data['raw_data'],
            timestamp=datetime.now().isoformat()
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------- Helper Functions -----------------
def generate_triggers(env_data, allergies):
    triggers = []
    if env_data['aqi'] >= 4:
        triggers.append("Poor air quality (AQI: Unhealthy)")
        if 'pollution' in allergies:
            triggers.append("Air pollution matches your allergy profile")
    elif env_data['aqi'] == 3:
        triggers.append("Moderate air quality")
    if env_data['pollen_level'] == "High":
        triggers.append("High pollen levels detected")
        if 'pollen' in allergies:
            triggers.append("Pollen matches your allergy profile")
    elif env_data['pollen_level'] == "Medium":
        triggers.append("Moderate pollen levels")
    if env_data['humidity'] < 40:
        triggers.append("Low humidity (dry air)")
    elif env_data['humidity'] > 80:
        triggers.append("High humidity")
    if env_data['temperature'] > 32:
        triggers.append("High temperature")
    elif env_data['temperature'] < 10:
        triggers.append("Cold weather")
    return triggers if triggers else ["No significant triggers detected"]

def generate_recommendations(risk_level, env_data, allergies, has_asthma):
    recommendations = []
    if risk_level == "High":
        recommendations.append("⚠️ HIGH RISK: Stay indoors if possible")
        if env_data['aqi'] >= 4:
            recommendations.append("Use air purifier indoors")
            recommendations.append("Wear N95 mask if going outside")
        if env_data['pollen_level'] == "High" and 'pollen' in allergies:
            recommendations.append("Take antihistamine medication")
            recommendations.append("Keep windows closed")
        if has_asthma:
            recommendations.append("Keep rescue inhaler nearby at all times")
    elif risk_level == "Medium":
        recommendations.append("⚡ MEDIUM RISK: Take precautions")
        if env_data['aqi'] >= 3:
            recommendations.append("Limit prolonged outdoor exertion")
        if has_asthma:
            recommendations.append("Have rescue inhaler accessible")
        if 'pollen' in allergies:
            recommendations.append("Consider taking antihistamine")
        recommendations.append("Monitor symptoms closely")
    else:
        recommendations.append("✓ LOW RISK: Conditions are favorable")
        recommendations.append("Continue regular activities")
        recommendations.append("Maintain medication routine")
    if env_data['humidity'] < 40:
        recommendations.append("Stay hydrated due to low humidity")
    return recommendations[:5]

# ----------------- Run Uvicorn -----------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT)
