from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import sys
from dotenv import load_dotenv
load_dotenv()

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from step8_live_api import (
    predict_with_live_data,
    get_weather,
    get_aqi,
    CITY_COORDS
)

app = FastAPI(
    title="WheezeEase API",
    description="AI-powered asthma risk prediction — OpenWeatherMap only",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUEST / RESPONSE MODELS
class LoginRequest(BaseModel):
    identifier: str
    password:   str

class PredictionRequest(BaseModel):
    city:                  str   = "Gujrat"
    aqi_city:              str   = "Gujrat"
    wheezing:              int
    coughing:              int
    chest_tightness:       int
    inhaler_usage:         int
    breathing_difficulty:  int
    medication_adherence:  int
    past_attacks:          int
    lung_function_fev1:    float
    lung_function_fvc:     float
    bmi:                   float
    smoking:               int
    physical_activity:     float
    family_history_asthma: int
    history_of_allergies:  int
    hay_fever:             int
    eczema:                int
    dust_exposure:         float

class PredictionResponse(BaseModel):
    risk_level:    str
    icon:          str
    color:         str
    confidence:    float
    probabilities: dict
    advice:        str
    reasons:       List[str]
    alerts:        List[str]
    environment:   dict
    models_used:   str

# DEMO DOCTOR ACCOUNTS
DOCTORS = {
    "doctor@wheezeease.com": {
        "password": "doctor123",
        "name":     "Dr. A. Rahman",
        "id":       1,
        "role":     "Pulmonologist"
    },
    "admin@wheezeease.com": {
        "password": "admin123",
        "name":     "Dr. Sara Ali",
        "id":       2,
        "role":     "General Physician"
    },
    "test@test.com": {
        "password": "test123",
        "name":     "Dr. Test User",
        "id":       3,
        "role":     "Pulmonologist"
    }
}

# ENDPOINTS

@app.get("/", tags=["Root"])
async def root():
    return {
        "name":    "WheezeEase API v2.0",
        "weather": "OpenWeatherMap (weather + air quality)",
        "endpoints": {
            "health":        "/health",
            "environment":   "/environment?city=Gujrat",
            "predict":       "/predict (POST)",
            "quick_predict": "/quick-predict (GET)",
            "login":         "/api/login (POST)",
            "cities":        "/cities",
            "docs":          "/docs"
        }
    }


@app.get("/health", tags=["Health"])
async def health():
    return {
        "status":  "ok",
        "message": "WheezeEase API is running",
        "version": "2.0.0",
        "api":     "OpenWeatherMap (weather + air quality)"
    }


@app.get("/cities", tags=["Info"])
async def get_supported_cities():
    """Returns list of Pakistan cities with coordinates"""
    return {
        "cities": [
            {"name": city.title(), "lat": coords[0], "lon": coords[1]}
            for city, coords in CITY_COORDS.items()
        ]
    }


@app.get("/environment", tags=["Environment"])
async def get_environment_data(city: str = "Gujrat"):
    """
    Fetch live weather + air quality for a Pakistan city.
    """
    try:
        weather = get_weather(city)
        aqi     = get_aqi(city)

        print(f"DEBUG weather: {weather}")
        print(f"DEBUG aqi: {aqi}")

        aqi_value = int(aqi.get("aqi", 50))

        if aqi_value > 150:   aqi_category = "Unhealthy"
        elif aqi_value > 100: aqi_category = "Moderate"
        elif aqi_value > 50:  aqi_category = "Acceptable"
        else:                  aqi_category = "Good"

        return {
            "city":         city,
            "temperature":  float(weather.get("temperature", 22.0)),
            "humidity":     float(weather.get("humidity", 60.0)),
            "description":  str(weather.get("description", "Unknown")).title(),
            "aqi":          aqi_value,
            "aqi_category": aqi_category,
            "pm25":         float(aqi.get("pm25", 15.0)),
            "no2":          float(aqi.get("no2",  25.0)),
            "pm10":         float(aqi.get("pm10", 20.0)),
            "pollen_count": int(aqi.get("pollen_estimate", 30)),
        }

    except Exception as e:
        print(f"Environment endpoint error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict", tags=["Prediction"], response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Full AI prediction — fetches live air quality automatically.
    Uses OpenWeatherMap Air Pollution API for PM2.5 and NO2.
    """
    try:
        patient_data = {
            "wheezing":              request.wheezing,
            "coughing":              request.coughing,
            "chest_tightness":       request.chest_tightness,
            "inhaler_usage":         request.inhaler_usage,
            "breathing_difficulty":  request.breathing_difficulty,
            "medication_adherence":  request.medication_adherence,
            "past_attacks":          request.past_attacks,
            "lung_function_fev1":    request.lung_function_fev1,
            "lung_function_fvc":     request.lung_function_fvc,
            "bmi":                   request.bmi,
            "smoking":               request.smoking,
            "physical_activity":     request.physical_activity,
            "family_history_asthma": request.family_history_asthma,
            "history_of_allergies":  request.history_of_allergies,
            "hay_fever":             request.hay_fever,
            "eczema":                request.eczema,
            "dust_exposure":         request.dust_exposure,
        }

        result = predict_with_live_data(
            weather_city=request.city,
            patient_symptoms=patient_data,
            aqi_city=request.aqi_city or request.city
        )

        return {
            "risk_level":    result["risk_level"],
            "icon":          result["icon"],
            "color":         result["color"],
            "confidence":    result["confidence"],
            "probabilities": result["probabilities"],
            "advice":        result["advice"],
            "reasons":       result["reasons"],
            "alerts":        result["alerts"],
            "environment":   result["environment"],
            "models_used":   result["models_used"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/quick-predict", tags=["Prediction"])
async def quick_predict(
    city:                  str   = "Gujrat",
    wheezing:              int   = 0,
    coughing:              int   = 0,
    chest_tightness:       int   = 0,
    inhaler_usage:         int   = 0,
    breathing_difficulty:  int   = 1,
    medication_adherence:  int   = 1,
    past_attacks:          int   = 0,
    lung_function_fev1:    float = 2.5,
    lung_function_fvc:     float = 3.8,
    bmi:                   float = 24.0,
    smoking:               int   = 0,
    physical_activity:     float = 5.0,
    family_history_asthma: int   = 0,
    history_of_allergies:  int   = 0,
    hay_fever:             int   = 0,
    eczema:                int   = 0,
    dust_exposure:         float = 3.0
):
    """Home screen live refresh — lightweight prediction every 9 seconds"""
    try:
        patient_data = {
            "wheezing": wheezing, "coughing": coughing,
            "chest_tightness": chest_tightness,
            "inhaler_usage": inhaler_usage,
            "breathing_difficulty": breathing_difficulty,
            "medication_adherence": medication_adherence,
            "past_attacks": past_attacks,
            "lung_function_fev1": lung_function_fev1,
            "lung_function_fvc": lung_function_fvc,
            "bmi": bmi, "smoking": smoking,
            "physical_activity": physical_activity,
            "family_history_asthma": family_history_asthma,
            "history_of_allergies": history_of_allergies,
            "hay_fever": hay_fever, "eczema": eczema,
            "dust_exposure": dust_exposure,
        }

        result = predict_with_live_data(
            weather_city=city,
            patient_symptoms=patient_data
        )

        risk_percent = round(
            result["probabilities"]["high"]   * 100 +
            result["probabilities"]["medium"] * 40
        )

        return {
            "risk_level":   result["risk_level"],
            "risk_percent": min(risk_percent, 99),
            "icon":         result["icon"],
            "color":        result["color"],
            "confidence":   result["confidence"],
            "environment":  result["environment"],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/login", tags=["Auth"])
async def login(request: LoginRequest):
    """Login endpoint for WheezeEase web and mobile apps"""
    doctor = DOCTORS.get(request.identifier.lower().strip())
    if not doctor or doctor["password"] != request.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials. Please check your email and password."
        )
    return {
        "token": f"token_{doctor['id']}_{request.identifier}",
        "user": {
            "id":    doctor["id"],
            "name":  doctor["name"],
            "email": request.identifier,
            "role":  doctor["role"]
        }
    }


# RUN
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("WheezeEase API v2.0")
    print("Weather + Air Quality: OpenWeatherMap only")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")