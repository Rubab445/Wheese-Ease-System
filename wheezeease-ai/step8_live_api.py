import requests
import pickle
import numpy as np
import tensorflow as tf
import os
from dotenv import load_dotenv
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from typing import Optional
from datetime import datetime, timedelta
import threading

# Load environment variables from .env file
load_dotenv()

# 8.1 API KEYS (from environment variables)
OPENWEATHER_KEY = os.getenv('OPENWEATHER_API_KEY', 'your-key-here')
WAQI_KEY = os.getenv('WAQI_API_KEY', 'your-key-here')

# 8.2 CACHE FOR ENVIRONMENT DATA
_env_cache = {}
_cache_lock = threading.Lock()
CACHE_EXPIRY = 60  # seconds

# 8.3 LOAD MODELS + SCALER
print("Loading models...")

nn_model = tf.keras.models.load_model('data/model_nn.h5', compile=False)

with open('data/model_rf.pkl', 'rb') as f:
    rf_model = pickle.load(f)

with open('data/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('data/processed_data.pkl', 'rb') as f:
    meta = pickle.load(f)
    feature_columns = meta['feature_columns']

print(" Models loaded successfully")


# 8.4 FETCH WEATHER DATA
def get_weather(city: str) -> Optional[dict]:
    """Fetches current temperature and humidity for a city."""
    url    = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q":     city,
        "appid": OPENWEATHER_KEY,
        "units": "metric"
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code != 200:
            print(f" Weather API error: {response.status_code}")
            return None

        data    = response.json()
        weather = {
            "city":        data["name"],
            "temperature": round(data["main"]["temp"], 1),
            "humidity":    round(data["main"]["humidity"], 1),
            "description": data["weather"][0]["description"],
        }

        print(f" ✓ Weather fetched: {weather['temperature']}°C")
        return weather

    except requests.Timeout:
        print(f" ⚠ Weather API timeout (5s)")
        return None
    except Exception as e:
        print(f" ⚠ Weather error: {str(e)[:50]}")
        return None


# 8.5 FETCH AQI DATA
def get_aqi(city: str) -> Optional[dict]:
    """Fetches current AQI and pollutant data for a city."""
    url    = f"https://api.waqi.info/feed/{city}/"
    params = {"token": WAQI_KEY}

    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code != 200:
            print(f" AQI API error: {response.status_code}")
            return None

        data = response.json()
        if data["status"] != "ok":
            return None

        iaqi     = data["data"].get("iaqi", {})
        aqi_data = {
            "aqi":  data["data"].get("aqi", 50),
            "pm25": iaqi.get("pm25", {}).get("v", 20),
            "no2":  iaqi.get("no2",  {}).get("v", 30),
            "pm10": iaqi.get("pm10", {}).get("v", 40),
        }

        aqi_data["pollen_estimate"] = min(int(aqi_data["pm10"] * 1.5), 200)

        print(f" ✓ AQI fetched: {aqi_data['aqi']}")
        return aqi_data

    except requests.Timeout:
        print(f" ⚠ AQI API timeout (5s)")
        return None
    except Exception as e:
        print(f" ⚠ AQI error: {str(e)[:50]}")
        return None


# 8.6 GET COMBINED ENVIRONMENT DATA (with caching & parallel calls)
def get_environment(weather_city: str, aqi_city: str) -> dict:
    """
    Fetches environment data with caching.
    Uses parallel API calls for speed.
    """
    cache_key = f"{weather_city}_{aqi_city}"
    
    # Check cache
    with _cache_lock:
        if cache_key in _env_cache:
            cached_data, cached_time = _env_cache[cache_key]
            if (datetime.now() - cached_time).total_seconds() < CACHE_EXPIRY:
                print(f" ✓ Using cached data ({CACHE_EXPIRY}s)")
                return cached_data
    
    print(f" Fetching live data for {weather_city}/{aqi_city}...")
    
    # Parallel API calls
    weather = None
    aqi = None
    
    weather_thread = threading.Thread(target=lambda: locals().update({"weather": get_weather(weather_city)}), daemon=True)
    aqi_thread = threading.Thread(target=lambda: locals().update({"aqi": get_aqi(aqi_city)}), daemon=True)
    
    weather_thread.start()
    aqi_thread.start()
    
    weather_thread.join(timeout=6)
    aqi_thread.join(timeout=6)
    
    weather = get_weather(weather_city)
    aqi = get_aqi(aqi_city)
    
    default_data = {
        "AQI":          50,
        "pollen_count": 30,
        "humidity":     60,
        "temperature":  22,
        "PM2_5":        15.0,
        "NO2":          25.0,
    }
    
    if not weather and not aqi:
        print(" Using defaults (both APIs failed)")
        return default_data
    
    result = {
        "AQI":          aqi["aqi"] if aqi else 50,
        "pollen_count": aqi["pollen_estimate"] if aqi else 30,
        "humidity":     weather["humidity"] if weather else 60,
        "temperature":  weather["temperature"] if weather else 22,
        "PM2_5":        float(aqi["pm25"]) if aqi else 15.0,
        "NO2":          float(aqi["no2"]) if aqi else 25.0,
    }
    
    # Cache the result
    with _cache_lock:
        _env_cache[cache_key] = (result, datetime.now())
    
    return result


# 8.7 GET TOP REASONS FROM RANDOM FOREST
def get_top_reasons(full_data: dict) -> list:
    """Explains why the risk level was assigned using RF importance."""
    importances = rf_model.feature_importances_
    reasons     = []

    checks = {
        'lung_function_fev1': (
            full_data.get('lung_function_fev1', 3),
            lambda v: v < 2.0,
            f"Low lung function (FEV1: {full_data.get('lung_function_fev1')}L)"
        ),
        'AQI': (
            full_data.get('AQI', 50),
            lambda v: v > 100,
            f"Poor air quality (AQI: {full_data.get('AQI')})"
        ),
        'wheezing': (
            full_data.get('wheezing', 0),
            lambda v: v == 1,
            "Wheezing detected — active airway inflammation"
        ),
        'smoking': (
            full_data.get('smoking', 0),
            lambda v: v == 1,
            "Smoking history — significantly damages airways"
        ),
        'breathing_difficulty': (
            full_data.get('breathing_difficulty', 1),
            lambda v: v >= 2,
            f"Breathing difficulty level {full_data.get('breathing_difficulty')}"
        ),
        'PM2_5': (
            full_data.get('PM2_5', 10),
            lambda v: v > 55,
            f"High PM2.5 ({full_data.get('PM2_5')} μg/m³)"
        ),
        'dust_exposure': (
            full_data.get('dust_exposure', 0),
            lambda v: v > 5,
            f"High dust exposure ({full_data.get('dust_exposure')}/10)"
        ),
        'family_history_asthma': (
            full_data.get('family_history_asthma', 0),
            lambda v: v == 1,
            "Family history of asthma — genetic risk factor"
        ),
        'hay_fever': (
            full_data.get('hay_fever', 0),
            lambda v: v == 1,
            "Hay fever present — linked to asthma attacks"
        ),
        'medication_adherence': (
            full_data.get('medication_adherence', 1),
            lambda v: v == 0,
            "Medication not taken — increases risk significantly"
        ),
        'bmi': (
            full_data.get('bmi', 22),
            lambda v: v > 30,
            f"High BMI ({full_data.get('bmi')}) — obesity increases severity"
        ),
        'inhaler_usage': (
            full_data.get('inhaler_usage', 0),
            lambda v: v >= 3,
            f"High inhaler usage ({full_data.get('inhaler_usage')} times today)"
        ),
    }

    sorted_checks = sorted(
        checks.items(),
        key=lambda x: importances[feature_columns.index(x[0])]
        if x[0] in feature_columns else 0,
        reverse=True
    )

    for feat_name, (value, condition, reason) in sorted_checks:
        if condition(value):
            reasons.append(reason)
        if len(reasons) >= 4:
            break

    if not reasons:
        reasons.append("All indicators within normal range")

    return reasons

# 8.7 FULL PREDICTION WITH LIVE DATA
def predict_with_live_data(weather_city: str,
                            patient_symptoms: dict,
                            aqi_city: str = None) -> dict:
    """
    Full pipeline:
      1. Fetch live AQI + weather
      2. Combine with patient symptoms
      3. Run Neural Network (primary)
      4. Run Random Forest (explanation)
      5. Return complete result
    """

    # Get live environmental data
    env = get_environment(weather_city, aqi_city or weather_city)

    # Merge with patient symptoms
    full_data = {**env, **patient_symptoms}

    print(f"\n Running AI prediction...")

    # ── Feature Engineering ──
    env_risk_index = (
        full_data["AQI"]          * 0.40 +
        full_data["pollen_count"] * 0.30 +
        full_data["humidity"]     * 0.20 +
        full_data["temperature"]  * 0.10
    )

    symptom_severity = (
        full_data["wheezing"] +
        full_data["coughing"] +
        full_data["chest_tightness"] +
        full_data["breathing_difficulty"]
    )

    pollution_combo = full_data["PM2_5"] * 0.6 + full_data["NO2"] * 0.4
    inhaler_overuse = 1 if full_data["inhaler_usage"] >= 3 else 0

    #  Build feature vector (27 features)
    features = np.array([[
        # Environmental
        full_data["AQI"],
        full_data["pollen_count"],
        full_data["humidity"],
        full_data["temperature"],
        full_data["PM2_5"],
        full_data["NO2"],
        full_data["dust_exposure"],
        # Core symptoms
        full_data["wheezing"],
        full_data["coughing"],
        full_data["chest_tightness"],
        full_data["inhaler_usage"],
        full_data["breathing_difficulty"],
        full_data["medication_adherence"],
        full_data["past_attacks"],
        # Clinical features
        full_data["lung_function_fev1"],
        full_data["lung_function_fvc"],
        full_data["bmi"],
        full_data["smoking"],
        full_data["physical_activity"],
        full_data["family_history_asthma"],
        full_data["history_of_allergies"],
        full_data["hay_fever"],
        full_data["eczema"],
        # Engineered features
        env_risk_index,
        symptom_severity,
        pollution_combo,
        inhaler_overuse
    ]])

    #  Scale features 
    features_scaled = scaler.transform(features)

    #  Neural Network prediction (primary) 
    nn_proba = nn_model.predict(features_scaled, verbose=0)[0]

    # Apply threshold adjustment for medical safety
    if nn_proba[2] >= 0.25:
        prediction = 2   # High
    elif nn_proba[0] >= 0.45:
        prediction = 0   # Low
    else:
        prediction = 1   # Medium

    #  Random Forest safety check 
    rf_pred = rf_model.predict(features_scaled)[0]
    if rf_pred == 2 and prediction != 2:
        prediction = 2   # Safety override

    #  Labels 
    label_map  = {0: 'LOW',   1: 'MEDIUM',  2: 'HIGH'}
    icon_map   = {0: '✅',    1: '⚠️',      2: '🚨'}
    color_map  = {0: 'green', 1: 'orange',  2: 'red'}
    advice_map = {
        0: 'Conditions are safe. Continue normal medication routine.',
        1: 'Limit outdoor exposure. Keep inhaler accessible. Monitor symptoms.',
        2: 'URGENT: Avoid all outdoor activity. Use rescue inhaler. Contact doctor.'
    }

    risk_level = label_map[prediction]
    confidence = float(nn_proba[prediction])

    #  Get reasons from Random Forest 
    reasons = get_top_reasons(full_data)

    #  Environmental alerts 
    alerts = []
    if full_data["AQI"] > 150:
        alerts.append(f"⚠️ High AQI ({full_data['AQI']}) — air quality unhealthy")
    if full_data["pollen_count"] > 100:
        alerts.append(f"🌿 High pollen ({full_data['pollen_count']}) — allergy risk")
    if full_data["humidity"] > 80:
        alerts.append(f"💧 High humidity ({full_data['humidity']}%) — airway irritation")
    if full_data["PM2_5"] > 75:
        alerts.append(f"🏭 PM2.5 elevated ({full_data['PM2_5']}) — dangerous particles")
    if full_data.get("dust_exposure", 0) > 7:
        alerts.append(f"🌪️ Very high dust exposure ({full_data['dust_exposure']}/10)")
    if full_data["inhaler_usage"] >= 3:
        alerts.append("💨 High inhaler usage — possible uncontrolled asthma")
    if full_data["medication_adherence"] == 0:
        alerts.append("💊 Medication not taken — risk significantly increased")

    return {
        "city":          weather_city,
        "risk_level":    risk_level,
        "icon":          icon_map[prediction],
        "color":         color_map[prediction],
        "confidence":    round(confidence, 3),
        "probabilities": {
            "low":    round(float(nn_proba[0]), 3),
            "medium": round(float(nn_proba[1]), 3),
            "high":   round(float(nn_proba[2]), 3),
        },
        "advice":        advice_map[prediction],
        "reasons":       reasons,
        "alerts":        alerts,
        "environment":   env,
        "models_used":   "Neural Network (primary) + Random Forest (safety + explanation)"
    }


# 8.8 DEMO
if __name__ == "__main__":
    print("=" * 55)
    print("STEP 8: LIVE API PREDICTION DEMO")
    print("=" * 55)

    #  Patient symptoms 
    patient = {
        # Core symptoms
        "wheezing":             1,
        "coughing":             1,
        "chest_tightness":      0,
        "inhaler_usage":        2,
        "breathing_difficulty": 2,
        "medication_adherence": 1,
        "past_attacks":         3,
        # Clinical features
        "lung_function_fev1":    2.1,
        "lung_function_fvc":     3.2,
        "bmi":                   26.5,
        "smoking":               0,
        "physical_activity":     5.0,
        "family_history_asthma": 1,
        "history_of_allergies":  1,
        "hay_fever":             0,
        "eczema":                0,
        "dust_exposure":         4.5,
    }

    #  Cities 
    weather_city = "Gujrat"   # your city for weather
    aqi_city     = "Lahore"   # nearest major city for AQI

    #  Run prediction 
    result = predict_with_live_data(weather_city, patient, aqi_city)

    #  Print result 
    print(f"\n{'=' * 55}")
    print(f"  {result['icon']}  RISK ASSESSMENT — {result['city'].upper()}")
    print(f"{'=' * 55}")
    print(f"  Risk Level   : {result['risk_level']}")
    print(f"  Confidence   : {result['confidence']:.1%}")
    print(f"  Probabilities:")
    print(f"    Low    → {result['probabilities']['low']:.1%}")
    print(f"    Medium → {result['probabilities']['medium']:.1%}")
    print(f"    High   → {result['probabilities']['high']:.1%}")
    print(f"\n  Advice: {result['advice']}")
    print(f"\n  Why this risk level:")
    for i, reason in enumerate(result['reasons'], 1):
        print(f"    {i}. {reason}")
    if result['alerts']:
        print(f"\n  Live Alerts:")
        for alert in result['alerts']:
            print(f"    {alert}")
    print(f"\n  Live Environment ({weather_city}/{aqi_city}):")
    for k, v in result['environment'].items():
        print(f"    {k:15} : {v}")
    print(f"\n  Models: {result['models_used']}")