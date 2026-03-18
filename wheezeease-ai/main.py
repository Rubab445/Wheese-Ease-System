from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os

# Suppress TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from step8_live_api import predict_with_live_data, get_weather, get_aqi

app = FastAPI(
    title="WheezeEase API",
    description="AI-powered asthma risk prediction for mobile app",
    version="1.0.0"
)

# Enable CORS for Flutter app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REQUEST / RESPONSE MODELS

class PredictionRequest(BaseModel):
    """Request body for prediction endpoint"""
    # Location
    city:     str = "Gujrat"
    aqi_city: str = "Lahore"

    # Symptoms
    wheezing:              int
    coughing:              int
    chest_tightness:       int
    inhaler_usage:         int
    breathing_difficulty:  int
    medication_adherence:  int
    past_attacks:          int

    # Clinical features
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
    """Response body for prediction endpoint"""
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


class EnvironmentResponse(BaseModel):
    """Response body for environment endpoint"""
    temperature:  float
    humidity:     float
    aqi:          int
    pollen_level: str
    dust_level:   str
    weather:      str
    pm25:         float
    no2:          float


# ENDPOINTS

#  1. Root 
@app.get("/", tags=["Root"])
async def root() -> dict:
    return {
        "name":        "WheezeEase API",
        "version":     "1.0.0",
        "description": "AI-powered asthma risk prediction",
        "endpoints": {
            "health":       "/health",
            "environment":  "/environment?city=Gujrat&aqi_city=Lahore",
            "predict":      "/predict (POST)",
            "quick_predict": "/quick-predict (GET)",
            "docs":         "/docs"
        }
    }


#  2. Health check
@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Check if server is running — Flutter calls this on app start"""
    return {
        "status":  "ok",
        "message": "WheezeEase API is running",
        "version": "1.0.0"
    }


#  3. Environment data 
@app.get("/environment", tags=["Environment"], response_model=EnvironmentResponse)
async def get_environment_data(
    city:     str = "Gujrat",
    aqi_city: str = "Lahore"
) -> dict:
    """
    Flutter home screen calls this on load.
    Returns live weather + AQI for the AQI chips.
    """
    try:
        weather = get_weather(city)
        aqi     = get_aqi(aqi_city)

        if not weather or not aqi:
            return {
                "temperature":  22.0,
                "humidity":     60.0,
                "aqi":          50,
                "pollen_level": "LOW",
                "dust_level":   "LOW",
                "weather":      "Unknown",
                "pm25":         15.0,
                "no2":          25.0,
            }

        aqi_value = aqi.get("aqi", 50)

        if aqi_value > 150:
            pollen_level = "HIGH"
            dust_level   = "HIGH"
        elif aqi_value > 100:
            pollen_level = "MEDIUM"
            dust_level   = "MEDIUM"
        else:
            pollen_level = "LOW"
            dust_level   = "LOW"

        return {
            "temperature":  weather.get("temperature", 22.0),
            "humidity":     weather.get("humidity", 60.0),
            "aqi":          aqi_value,
            "pollen_level": pollen_level,
            "dust_level":   dust_level,
            "weather":      weather.get("description", "Unknown").title(),
            "pm25":         float(aqi.get("pm25", 15.0)),
            "no2":          float(aqi.get("no2", 25.0)),
        }

    except Exception as e:
        print(f"Environment endpoint error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching environment data: {str(e)}"
        )


#  4. Full prediction 
@app.post("/predict", tags=["Prediction"], response_model=PredictionResponse)
async def predict(request: PredictionRequest) -> dict:
    """
    Flutter check-in screen calls this when patient submits form.
    Returns full risk assessment with reasons, advice and alerts.
    """
    try:
        patient_data = {
            "wheezing":             request.wheezing,
            "coughing":             request.coughing,
            "chest_tightness":      request.chest_tightness,
            "inhaler_usage":        request.inhaler_usage,
            "breathing_difficulty": request.breathing_difficulty,
            "medication_adherence": request.medication_adherence,
            "past_attacks":         request.past_attacks,
            "lung_function_fev1":   request.lung_function_fev1,
            "lung_function_fvc":    request.lung_function_fvc,
            "bmi":                  request.bmi,
            "smoking":              request.smoking,
            "physical_activity":    request.physical_activity,
            "family_history_asthma": request.family_history_asthma,
            "history_of_allergies": request.history_of_allergies,
            "hay_fever":            request.hay_fever,
            "eczema":               request.eczema,
            "dust_exposure":        request.dust_exposure,
        }

        result = predict_with_live_data(
            weather_city=request.city,
            patient_symptoms=patient_data,
            aqi_city=request.aqi_city
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
        print(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )


# 5. Quick predict (home screen live refresh)

@app.get("/quick-predict", tags=["Prediction"])
async def quick_predict(
    city:                  str   = "Gujrat",
    aqi_city:              str   = "Lahore",
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
    """
    Flutter home screen calls this every 9 seconds.
    Refreshes the live risk score shown in the hero card.
    Lighter response — only what the home screen needs.
    """
    try:
        patient_data = {
            "wheezing":             wheezing,
            "coughing":             coughing,
            "chest_tightness":      chest_tightness,
            "inhaler_usage":        inhaler_usage,
            "breathing_difficulty": breathing_difficulty,
            "medication_adherence": medication_adherence,
            "past_attacks":         past_attacks,
            "lung_function_fev1":   lung_function_fev1,
            "lung_function_fvc":    lung_function_fvc,
            "bmi":                  bmi,
            "smoking":              smoking,
            "physical_activity":    physical_activity,
            "family_history_asthma": family_history_asthma,
            "history_of_allergies": history_of_allergies,
            "hay_fever":            hay_fever,
            "eczema":               eczema,
            "dust_exposure":        dust_exposure,
        }

        result = predict_with_live_data(
            weather_city=city,
            patient_symptoms=patient_data,
            aqi_city=aqi_city
        )

        # Calculate risk percentage for home screen progress bar
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
        print(f"Quick predict error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Quick predict error: {str(e)}"
        )

# ── Login Models ──
class LoginRequest(BaseModel):
    identifier: str  # email or phone
    password:   str

# ── Demo doctor accounts (replace with database later) ──
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

# ── Login endpoint ──
@app.post("/api/login", tags=["Auth"])
async def login(request: LoginRequest):
    """
    Login endpoint for WheezeEase web and mobile apps.
    Accepts email + password, returns token and user info.
    """
    # Check if doctor exists
    doctor = DOCTORS.get(request.identifier.lower().strip())

    # Validate credentials
    if not doctor or doctor["password"] != request.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials. Please check your email and password."
        )

    # Return success response
    return {
        "token": f"token_{doctor['id']}_{request.identifier}",
        "user": {
            "id":   doctor["id"],
            "name": doctor["name"],
            "email": request.identifier,
            "role": doctor["role"]
        }
    }
# RUN SERVER

if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("WheezeEase API Server")
    print("=" * 60)
    print("Starting on  : http://0.0.0.0:8000")
    print("Docs at      : http://localhost:8000/docs")
    print("=" * 60)

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
