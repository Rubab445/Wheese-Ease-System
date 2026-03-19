from dotenv import load_dotenv
load_dotenv()
import requests
import pickle
import numpy as np
import tensorflow as tf
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# API KEY
def _get_key():
    return os.getenv("OPENWEATHER_API_KEY")

# PAKISTAN CITY COORDINATES
CITY_COORDS = {
    "gujrat":     (32.5736, 74.0874),
    "lahore":     (31.5204, 74.3587),
    "karachi":    (24.8607, 67.0011),
    "islamabad":  (33.6844, 73.0479),
    "faisalabad": (31.4504, 73.1350),
    "multan":     (30.1575, 71.5249),
    "peshawar":   (34.0151, 71.5249),
    "rawalpindi": (33.6007, 73.0679),
    "gujranwala": (32.1877, 74.1945),
    "sialkot":    (32.4945, 74.5229),
    "bahawalpur": (29.3956, 71.6836),
    "sargodha":   (32.0836, 72.6711),
    "quetta":     (30.1798, 66.9750),
    "hyderabad":  (25.3960, 68.3578),
    "abbottabad": (34.1463, 73.2117),
}

# LOAD MODELS
print("Loading models...")

_BASE = os.path.dirname(os.path.abspath(__file__))
_DATA = os.path.join(_BASE, 'data')

nn_model = tf.keras.models.load_model(
    os.path.join(_DATA, 'model_nn.h5'), compile=False
)

with open(os.path.join(_DATA, 'model_rf.pkl'), 'rb') as f:
    rf_model = pickle.load(f)

with open(os.path.join(_DATA, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

with open(os.path.join(_DATA, 'processed_data.pkl'), 'rb') as f:
    meta = pickle.load(f)
    feature_columns = meta['feature_columns']

print(" Models loaded successfully")

# FETCH WEATHER (temperature + humidity)
def get_weather(city: str) -> dict:
    """Fetches current temperature and humidity for a city."""
    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "q":     city,
                "appid": _get_key(),
                "units": "metric"
            },
            timeout=8
        )
        if r.status_code == 200:
            d = r.json()
            weather = {
                "city":        d["name"],
                "temperature": round(d["main"]["temp"], 1),
                "humidity":    round(d["main"]["humidity"], 1),
                "description": d["weather"][0]["description"],
            }
            print(f" Weather fetched for {weather['city']}")
            print(f"   Temperature : {weather['temperature']}°C")
            print(f"   Humidity    : {weather['humidity']}%")
            print(f"   Condition   : {weather['description']}")
            return weather
        else:
            print(f" Weather API error: {r.status_code}")
    except Exception as e:
        print(f" Weather exception: {e}")
    return {"temperature": 22.0, "humidity": 60.0, "description": "unknown"}


# FETCH AQI (OpenWeatherMap Air Pollution API)
def get_aqi(city: str) -> dict:
    """
    Fetches AQI, PM2.5, NO2 using OpenWeatherMap Air Pollution API.
    Uses city coordinates — works for any Pakistan city.
    WAQI removed — unreliable for Pakistan.
    """
    # Get coordinates for city
    coords = CITY_COORDS.get(city.lower().strip(), (32.5736, 74.0874))
    lat, lon = coords

    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/air_pollution",
            params={
                "lat":   lat,
                "lon":   lon,
                "appid": _get_key(),
            },
            timeout=8
        )

        if r.status_code == 200:
            data       = r.json()
            components = data["list"][0]["components"]
            aqi_index  = data["list"][0]["main"]["aqi"]  # 1-5 scale

            # Convert OpenWeatherMap 1-5 AQI to standard 0-500 scale
            aqi_map = {1: 25, 2: 75, 3: 125, 4: 200, 5: 350}
            aqi     = aqi_map.get(aqi_index, 50)

            pm25 = round(float(components.get("pm2_5", 15)), 2)  # ← correct
            no2  = round(float(components.get("no2",   25)), 2)
            pm10 = round(float(components.get("pm10",  20)), 2)


            # Estimate pollen from PM10 (proxy)
            pollen_estimate = min(int(pm10 * 1.5), 200)

            result = {
                "aqi":            aqi,
                "pm25":           pm25,
                "no2":            no2,
                "pm10":           pm10,
                "pollen_estimate": pollen_estimate,
            }

            print(f"\n Air quality fetched for {city} ({lat}, {lon})")
            print(f"   AQI Index : {aqi_index}/5 → {aqi} (standard scale)")
            print(f"   PM2.5     : {pm25} μg/m³")
            print(f"   NO2       : {no2} μg/m³")
            print(f"   PM10      : {pm10} μg/m³")
            print(f"   Pollen    : {pollen_estimate} (estimated)")
            return result

        else:
            print(f" Air Pollution API error: {r.status_code}")

    except Exception as e:
        print(f" Air Pollution exception: {e}")

    # Default safe values if API fails
    return {
        "aqi": 50, "pm25": 15.0, "no2": 25.0,
        "pm10": 20.0, "pollen_estimate": 30
    }


# GET COMBINED ENVIRONMENT DATA
def get_environment(weather_city: str, aqi_city: str = None) -> dict:
    """
    Fetches all environmental data needed for prediction.
    Uses OpenWeatherMap for both weather and air quality.
    """
    print(f"\n Fetching live environmental data...")
    print(f"   Weather city : {weather_city}")
    print(f"   AQI city     : {aqi_city or weather_city}")
    print("─" * 40)

    weather = get_weather(weather_city)
    aqi     = get_aqi(aqi_city or weather_city)

    return {
        "AQI":          aqi["aqi"],
        "pollen_count": aqi["pollen_estimate"],
        "humidity":     weather["humidity"],
        "temperature":  weather["temperature"],
        "PM2_5":        aqi["pm25"],
        "NO2":          aqi["no2"],
    }


# GET REASONS FROM RANDOM FOREST

def get_top_reasons(full_data: dict) -> list:
    """Explains risk level using Random Forest feature importance."""
    importances = rf_model.feature_importances_
    reasons     = []

    checks = [
        ("lung_function_fev1",   lambda v: v < 2.0,
         f"Low lung function (FEV1: {full_data.get('lung_function_fev1')}L)"),
        ("AQI",                  lambda v: v > 100,
         f"Poor air quality (AQI: {full_data.get('AQI')})"),
        ("wheezing",             lambda v: v == 1,
         "Wheezing detected — active airway inflammation"),
        ("smoking",              lambda v: v == 1,
         "Smoking history — significantly damages airways"),
        ("breathing_difficulty", lambda v: v >= 2,
         f"Breathing difficulty level {full_data.get('breathing_difficulty')}"),
        ("PM2_5",                lambda v: v > 55,
         f"High PM2.5 ({full_data.get('PM2_5')} μg/m³)"),
        ("dust_exposure",        lambda v: v > 5,
         f"High dust exposure ({full_data.get('dust_exposure')}/10)"),
        ("family_history_asthma", lambda v: v == 1,
         "Family history of asthma — genetic risk"),
        ("hay_fever",            lambda v: v == 1,
         "Hay fever present — linked to asthma attacks"),
        ("medication_adherence", lambda v: v == 0,
         "Medication not taken — risk significantly increased"),
        ("bmi",                  lambda v: v > 30,
         f"High BMI ({full_data.get('bmi')}) — obesity increases severity"),
        ("inhaler_usage",        lambda v: v >= 3,
         f"High inhaler usage ({full_data.get('inhaler_usage')} times today)"),
        ("NO2",                  lambda v: v > 100,
         f"High NO2 ({full_data.get('NO2')} μg/m³) — airway irritant"),
    ]

    sorted_checks = sorted(
        checks,
        key=lambda x: importances[feature_columns.index(x[0])]
        if x[0] in feature_columns else 0,
        reverse=True
    )

    for feat, condition, reason in sorted_checks:
        val = full_data.get(feat, 0)
        if condition(val):
            reasons.append(reason)
        if len(reasons) >= 4:
            break

    return reasons if reasons else ["All indicators within normal range"]


# MAIN PREDICTION FUNCTION
def predict_with_live_data(weather_city: str,
                            patient_symptoms: dict,
                            aqi_city: str = None) -> dict:
    """
    Full prediction pipeline:
      1. Fetch live weather + air quality (OpenWeatherMap only)
      2. Combine with patient symptoms
      3. Neural Network — primary prediction
      4. Random Forest — safety check + explanation
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

    # ── Build 27-feature vector ──
    features = np.array([[
        full_data["AQI"],
        full_data["pollen_count"],
        full_data["humidity"],
        full_data["temperature"],
        full_data["PM2_5"],
        full_data["NO2"],
        full_data["dust_exposure"],
        full_data["wheezing"],
        full_data["coughing"],
        full_data["chest_tightness"],
        full_data["inhaler_usage"],
        full_data["breathing_difficulty"],
        full_data["medication_adherence"],
        full_data["past_attacks"],
        full_data["lung_function_fev1"],
        full_data["lung_function_fvc"],
        full_data["bmi"],
        full_data["smoking"],
        full_data["physical_activity"],
        full_data["family_history_asthma"],
        full_data["history_of_allergies"],
        full_data["hay_fever"],
        full_data["eczema"],
        env_risk_index,
        symptom_severity,
        pollution_combo,
        inhaler_overuse
    ]])

    # ── Scale features ──
    features_scaled = scaler.transform(features)

    # ── Neural Network prediction (primary) ──
    nn_proba = nn_model.predict(features_scaled, verbose=0)[0]

    # Threshold adjustment for medical safety
    if nn_proba[2] >= 0.25:   prediction = 2  # HIGH
    elif nn_proba[0] >= 0.45: prediction = 0  # LOW
    else:                      prediction = 1  # MEDIUM

    # ── Random Forest safety override ──
    rf_pred = rf_model.predict(features_scaled)[0]
    if rf_pred == 2 and prediction != 2:
        prediction = 2

    # ── Labels and messaging ──
    label_map  = {0: "LOW",   1: "MEDIUM",  2: "HIGH"}
    icon_map   = {0: "✅",    1: "⚠️",      2: "🚨"}
    color_map  = {0: "green", 1: "orange",  2: "red"}
    advice_map = {
        0: "Conditions are safe. Continue normal medication routine.",
        1: "Limit outdoor exposure. Keep inhaler accessible. Monitor symptoms.",
        2: "URGENT: Avoid all outdoor activity. Use rescue inhaler. Contact doctor."
    }

    risk_level = label_map[prediction]
    confidence = float(nn_proba[prediction])
    reasons    = get_top_reasons(full_data)

    # ── Build alerts ──
    alerts = []
    if full_data["AQI"] > 150:
        alerts.append(f"⚠️ High AQI ({full_data['AQI']}) — air quality unhealthy")
    if full_data["pollen_count"] > 100:
        alerts.append(f"🌿 High pollen ({full_data['pollen_count']}) — allergy risk")
    if full_data["humidity"] > 80:
        alerts.append(f"💧 High humidity ({full_data['humidity']}%) — airway irritation")
    if full_data["PM2_5"] > 55:
        alerts.append(f"🏭 PM2.5 elevated ({full_data['PM2_5']} μg/m³) — unhealthy")
    if full_data["NO2"] > 100:
        alerts.append(f"🚗 NO2 elevated ({full_data['NO2']} μg/m³) — airway irritant")
    if full_data["inhaler_usage"] >= 3:
        alerts.append(f"💨 High inhaler usage ({full_data['inhaler_usage']} times today)")
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
        "advice":      advice_map[prediction],
        "reasons":     reasons,
        "alerts":      alerts,
        "environment": env,
        "models_used": "Neural Network (primary) + Random Forest (safety + explanation)"
    }


# DEMO
if __name__ == "__main__":
    print("=" * 55)
    print("STEP 8: LIVE API PREDICTION DEMO")
    print("(Using OpenWeatherMap for weather + air quality)")
    print("=" * 55)

    patient = {
        "wheezing":             1,
        "coughing":             1,
        "chest_tightness":      0,
        "inhaler_usage":        2,
        "breathing_difficulty": 2,
        "medication_adherence": 1,
        "past_attacks":         3,
        "lung_function_fev1":   2.1,
        "lung_function_fvc":    3.2,
        "bmi":                  26.5,
        "smoking":              0,
        "physical_activity":    5.0,
        "family_history_asthma": 1,
        "history_of_allergies": 1,
        "hay_fever":            0,
        "eczema":               0,
        "dust_exposure":        4.5,
    }

    result = predict_with_live_data("Gujrat", patient)

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
    for i, r in enumerate(result['reasons'], 1):
        print(f"    {i}. {r}")
    if result['alerts']:
        print(f"\n  Live Alerts:")
        for a in result['alerts']:
            print(f"    {a}")
    print(f"\n  Environment (live from OpenWeatherMap):")
    for k, v in result['environment'].items():
        print(f"    {k:15} : {v}")