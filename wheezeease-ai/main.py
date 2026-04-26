# Run: uvicorn main:app --reload --host 0.0.0.0 --port 8000
from dotenv import load_dotenv
load_dotenv()                    

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from get_recommendation import router as recommendation_router, get_activity_recommendation, get_trip_risk_recommendation
import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from step8_live_api import (
    predict_with_live_data,
    get_weather,
    get_aqi,
    get_environment,   
    CITY_COORDS
)

app = FastAPI(
    title="WheezeEase API",
    description="AI-powered asthma risk prediction — OpenWeatherMap only",
    version="2.0.0"
)
app.include_router(recommendation_router)

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
    main_message:  str       
    confidence:    float
    probabilities: dict
    advice:        str
    reasons:       List[str]
    alerts:        List[str]
    environment:   dict
    models_used:   str

# ── UPDATED: symptoms_reported replaces had_symptoms ──
class ExerciseLogRequest(BaseModel):
    exercise_type:     str            # walking, running, cycling, swimming
    duration:          int            # minutes
    intensity:         str            # mild, moderate, intense
    indoor:            bool           # True = indoor, False = outdoor
    used_inhaler:      bool           # used inhaler before exercise
    # Structured symptom fields (replaces had_symptoms: bool)
    symptoms_reported: List[str]  = []    # e.g. ["Wheezing", "Coughing"]
    symptom_severity:  Optional[str] = None  # "Mild" / "Moderate" / "Severe"
    symptom_notes:     Optional[str] = None  # free-text from patient
    city:              str        = "Gujrat"

class HouseholdActivityRequest(BaseModel):
    activity_type:     str            # cleaning, cooking, painting, gardening
    duration:          int            # minutes
    wore_mask:         bool
    # Structured symptom fields (replaces had_symptoms: bool)
    symptoms_reported: List[str]  = []
    symptom_severity:  Optional[str] = None
    symptom_notes:     Optional[str] = None
    city:              str        = "Gujrat"


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

# Trigger mapping for household activities
HOUSEHOLD_TRIGGERS = {
    "cleaning":  {"trigger": "Dust & Allergens",      "description": "Cleaning stirs up dust mites, pet dander, and mold spores — all major asthma triggers."},
    "cooking":   {"trigger": "Smoke & Fumes",          "description": "Cooking produces smoke, steam, and strong odors (especially frying/grilling) that can irritate airways."},
    "painting":  {"trigger": "VOCs & Chemical Fumes",  "description": "Paint, varnish, and solvents release volatile organic compounds that severely irritate the respiratory system."},
    "gardening": {"trigger": "Pollen & Outdoor Allergens", "description": "Gardening exposes you to pollen, grass, mold spores, and soil dust."},
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
    return {
        "cities": [
            {"name": city.title(), "lat": coords[0], "lon": coords[1]}
            for city, coords in CITY_COORDS.items()
        ]
    }


@app.get("/environment", tags=["Environment"])
async def get_environment_data(city: str = "Gujrat"):
    try:
        weather = get_weather(city)
        aqi     = get_aqi(city)
        aqi_value = aqi.get("aqi", 50)

        if aqi_value > 150:   aqi_category = "Unhealthy"
        elif aqi_value > 100: aqi_category = "Moderate"
        elif aqi_value > 50:  aqi_category = "Acceptable"
        else:                  aqi_category = "Good"

        return {
            "city":         city,
            "temperature":  weather.get("temperature", 22.0),
            "humidity":     weather.get("humidity", 60.0),
            "description":  weather.get("description", "Unknown").title(),
            "aqi":          aqi_value,
            "aqi_category": aqi_category,
            "pm25":         aqi.get("pm25", 15.0),
            "no2":          aqi.get("no2",  25.0),
            "pm10":         aqi.get("pm10", 20.0),
            "pollen_count": aqi.get("pollen_estimate", 30),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict", tags=["Prediction"], response_model=PredictionResponse)
async def predict(request: PredictionRequest):
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
            "main_message":  result["main_message"],
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


@app.get("/trip-risk", tags=["Prediction"])
async def trip_risk(
    destination:           str,
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

        env = get_environment(destination, destination)
        result = predict_with_live_data(
            weather_city=destination,
            patient_symptoms=patient_data,
            aqi_city=destination
        )

        # Build patient profile for context
        patient_profile = {
            "recent_attacks": past_attacks,
            "medication_adherence": medication_adherence,
            "smoking": smoking,
        }

        # Get Gemini-powered trip recommendation
        ai_rec = await get_trip_risk_recommendation(
            destination=destination,
            risk_level=result["risk_level"],
            environment=env,
            patient_profile=patient_profile,
            symptom_history=f"Recent asthma activity: {breathing_difficulty}/3 breathing difficulty"
        )

        return {
            "destination":             destination,
            "trip_verdict":            result["risk_level"],
            "risk_level":              result["risk_level"],
            "confidence":              result["confidence"],
            "reasons":                 result["reasons"],
            "alerts":                  result["alerts"],
            "destination_environment": {
                "AQI":         env["AQI"],
                "temperature": env["temperature"],
                "humidity":    env["humidity"],
                "PM2_5":       env["PM2_5"],
                "NO2":         env["NO2"],
                "pollen":      env.get("pollen_count", 0),
            },
            "ai_recommendation": ai_rec,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── ACTIVITY LOGGING ENDPOINTS ───────────────────────────────────────

def _determine_exercise_risk(request: ExerciseLogRequest, aqi, temp, humidity, pm25):
    """Determine risk level based on exercise parameters and environment."""
    risk_level = "LOW"
    had_symptoms = len(request.symptoms_reported) > 0

    if not request.indoor:
        if aqi > 150:   risk_level = "HIGH"
        elif aqi > 100: risk_level = "MEDIUM"
        if temp > 38 or temp < 5:
            if risk_level == "LOW": risk_level = "MEDIUM"

    if request.intensity == "intense" and not request.used_inhaler:
        if risk_level == "LOW": risk_level = "MEDIUM"

    # Bump risk if patient reported symptoms — severity makes it worse
    if had_symptoms:
        if request.symptom_severity == "Severe":
            risk_level = "HIGH"
        elif request.symptom_severity == "Moderate" and risk_level == "LOW":
            risk_level = "MEDIUM"
        elif risk_level == "LOW":
            risk_level = "MEDIUM"

    return risk_level


def _determine_household_risk(request: HouseholdActivityRequest, aqi, pollen):
    """Determine risk level based on household activity and environment."""
    activity   = request.activity_type.lower()
    risk_level = "LOW"
    had_symptoms = len(request.symptoms_reported) > 0

    if activity == "cleaning":
        if request.duration > 30 or not request.wore_mask: risk_level = "MEDIUM"
    elif activity == "cooking":
        if request.duration > 45: risk_level = "MEDIUM"
    elif activity == "painting":
        risk_level = "MEDIUM"
        if not request.wore_mask or request.duration > 30: risk_level = "HIGH"
    elif activity == "gardening":
        if pollen > 50 or aqi > 100:  risk_level = "MEDIUM"
        if aqi > 150:                  risk_level = "HIGH"
        if not request.wore_mask and risk_level == "LOW": risk_level = "MEDIUM"

    # Bump risk based on reported symptoms + severity
    if had_symptoms:
        if request.symptom_severity == "Severe":
            risk_level = "HIGH"
        elif request.symptom_severity == "Moderate" and risk_level == "LOW":
            risk_level = "MEDIUM"
        elif risk_level == "LOW":
            risk_level = "MEDIUM"

    return risk_level


@app.post("/activity/exercise", tags=["Activities"])
async def log_exercise(request: ExerciseLogRequest):
    """
    Logs an exercise session and returns Gemini-powered safety recommendations
    based on current environmental conditions and exercise parameters.
    """
    try:
        weather  = get_weather(request.city)
        aqi_data = get_aqi(request.city)
        aqi      = aqi_data.get("aqi", 50)
        temp     = weather.get("temperature", 25.0)
        humidity = weather.get("humidity", 60.0)
        pm25     = aqi_data.get("pm25", 15.0)

        risk_level = _determine_exercise_risk(request, aqi, temp, humidity, pm25)

        env_data = {
            "aqi":         aqi,
            "temperature": temp,
            "humidity":    humidity,
            "pm25":        pm25,
        }

        ai_rec = await get_activity_recommendation(
            activity_type=request.exercise_type,
            duration=request.duration,
            risk_level=risk_level,
            environment=env_data,
            is_exercise=True,
            intensity=request.intensity,
            indoor=request.indoor,
            used_inhaler=request.used_inhaler,
            # Pass structured symptom data — no more bool
            symptoms_reported=request.symptoms_reported,
            symptom_severity=request.symptom_severity,
            symptom_notes=request.symptom_notes,
        )

        return {
            "risk_level":  risk_level,
            "exercise": {
                "type":          request.exercise_type,
                "duration":      request.duration,
                "intensity":     request.intensity,
                "indoor":        request.indoor,
                "symptoms":      request.symptoms_reported,
                "symptom_severity": request.symptom_severity,
            },
            "environment":      env_data,
            "ai_recommendation": ai_rec,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/activity/household", tags=["Activities"])
async def log_household_activity(request: HouseholdActivityRequest):
    """
    Logs a household activity and returns Gemini-powered trigger-aware 
    safety recommendations.
    """
    try:
        activity     = request.activity_type.lower()
        trigger_info = HOUSEHOLD_TRIGGERS.get(activity, {
            "trigger":     "General Irritants",
            "description": "This activity may expose you to airborne irritants."
        })

        weather  = get_weather(request.city)
        aqi_data = get_aqi(request.city)
        aqi      = aqi_data.get("aqi", 50)
        pollen   = aqi_data.get("pollen_estimate", 30)

        risk_level = _determine_household_risk(request, aqi, pollen)

        env_data = {
            "aqi":    aqi,
            "pollen": pollen,
        }

        ai_rec = await get_activity_recommendation(
            activity_type=request.activity_type,
            duration=request.duration,
            risk_level=risk_level,
            environment=env_data,
            is_exercise=False,
            wore_mask=request.wore_mask,
            # Pass structured symptom data — no more bool
            symptoms_reported=request.symptoms_reported,
            symptom_severity=request.symptom_severity,
            symptom_notes=request.symptom_notes,
            trigger=trigger_info["trigger"],
            trigger_description=trigger_info["description"],
        )

        return {
            "risk_level":        risk_level,
            "trigger":           trigger_info["trigger"],
            "trigger_description": trigger_info["description"],
            "activity": {
                "type":             request.activity_type,
                "duration":         request.duration,
                "wore_mask":        request.wore_mask,
                "symptoms":         request.symptoms_reported,
                "symptom_severity": request.symptom_severity,
            },
            "environment":       env_data,
            "ai_recommendation": ai_rec,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# RUN
if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("WheezeEase API v2.0")
    print("Weather + Air Quality: OpenWeatherMap only")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")