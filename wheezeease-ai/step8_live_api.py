from dotenv import load_dotenv
load_dotenv()
import requests
import pickle
import numpy as np
import tensorflow as tf
import os
from datetime import datetime
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

# FETCH WEATHER

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


# FETCH AQI
# 
def get_aqi(city: str) -> dict:
    """Fetches AQI, PM2.5, NO2 using OpenWeatherMap Air Pollution API."""
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
            aqi_index  = data["list"][0]["main"]["aqi"]

            aqi_map = {1: 25, 2: 75, 3: 125, 4: 200, 5: 350}
            aqi     = aqi_map.get(aqi_index, 50)

            pm25 = round(float(components.get("pm2_5", 15)), 2)
            no2  = round(float(components.get("no2",   25)), 2)
            pm10 = round(float(components.get("pm10",  20)), 2)

            pollen_estimate = min(int(pm10 * 1.5), 200)

            result = {
                "aqi":             aqi,
                "pm25":            pm25,
                "no2":             no2,
                "pm10":            pm10,
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

    return {
        "aqi": 50, "pm25": 15.0, "no2": 25.0,
        "pm10": 20.0, "pollen_estimate": 30
    }


# GET COMBINED ENVIRONMENT DATA
def get_environment(weather_city: str, aqi_city: str = None) -> dict:
    print(f"\n🌍 Fetching live environmental data...")
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


# FETCH WEATHER BY COORDINATES
def get_weather_by_coords(lat: float, lon: float) -> dict:
    """Fetches current temperature and humidity using lat/lon coordinates."""
    try:
        r = requests.get(
            "https://api.openweathermap.org/data/2.5/weather",
            params={
                "lat":   lat,
                "lon":   lon,
                "appid": _get_key(),
                "units": "metric"
            },
            timeout=8
        )
        if r.status_code == 200:
            d = r.json()
            weather = {
                "city":        d.get("name", "Unknown"),
                "temperature": round(d["main"]["temp"], 1),
                "humidity":    round(d["main"]["humidity"], 1),
                "description": d["weather"][0]["description"],
            }
            print(f" Weather fetched for coords ({lat}, {lon}) → {weather['city']}")
            return weather
        else:
            print(f" Weather API error (coords): {r.status_code}")
    except Exception as e:
        print(f" Weather exception (coords): {e}")
    return {"city": "Unknown", "temperature": 22.0, "humidity": 60.0, "description": "unknown"}


# FETCH AQI BY COORDINATES
def get_aqi_by_coords(lat: float, lon: float) -> dict:
    """Fetches AQI, PM2.5, NO2 using lat/lon coordinates directly."""
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
            aqi_index  = data["list"][0]["main"]["aqi"]

            aqi_map = {1: 25, 2: 75, 3: 125, 4: 200, 5: 350}
            aqi     = aqi_map.get(aqi_index, 50)

            pm25 = round(float(components.get("pm2_5", 15)), 2)
            no2  = round(float(components.get("no2",   25)), 2)
            pm10 = round(float(components.get("pm10",  20)), 2)

            pollen_estimate = min(int(pm10 * 1.5), 200)

            result = {
                "aqi":             aqi,
                "pm25":            pm25,
                "no2":             no2,
                "pm10":            pm10,
                "pollen_estimate": pollen_estimate,
            }

            print(f"\n Air quality fetched for coords ({lat}, {lon})")
            print(f"   AQI Index : {aqi_index}/5 → {aqi} (standard scale)")
            print(f"   PM2.5     : {pm25} μg/m³")
            return result

        else:
            print(f" Air Pollution API error (coords): {r.status_code}")

    except Exception as e:
        print(f" Air Pollution exception (coords): {e}")

    return {
        "aqi": 50, "pm25": 15.0, "no2": 25.0,
        "pm10": 20.0, "pollen_estimate": 30
    }


# GET COMBINED ENVIRONMENT DATA BY COORDINATES
def get_environment_by_coords(lat: float, lon: float) -> dict:
    """Fetches combined environment data using raw lat/lon coordinates."""
    print(f"\n🌍 Fetching live environmental data by coords ({lat}, {lon})...")
    print("─" * 40)

    weather = get_weather_by_coords(lat, lon)
    aqi     = get_aqi_by_coords(lat, lon)

    return {
        "city":         weather.get("city", "Unknown"),
        "AQI":          aqi["aqi"],
        "pollen_count": aqi["pollen_estimate"],
        "humidity":     weather["humidity"],
        "temperature":  weather["temperature"],
        "PM2_5":        aqi["pm25"],
        "NO2":          aqi["no2"],
        "description":  weather.get("description", "Unknown"),
    }


# PLAIN ENGLISH REASONS
def get_top_reasons(full_data: dict) -> list:
    """
    Returns reasons in plain language any patient can understand.
    No FEV1, PM2.5, NO2 jargon — everything explained simply.
    """
    importances = rf_model.feature_importances_
    reasons     = []

    checks = [
        ("lung_function_fev1",
         lambda v: v < 2.0,
         "Your lungs are working at reduced capacity — breathing takes more effort than normal"),

        ("lung_function_fev1",
         lambda v: 2.0 <= v < 2.5,
         "Your lung capacity is slightly below normal — your airways may be partially narrowed"),

        ("AQI",
         lambda v: v > 150,
         f"The air outside is unhealthy today (pollution level: {full_data.get('AQI')}) — breathing it will irritate your airways"),

        ("AQI",
         lambda v: 100 < v <= 150,
         f"Air quality in your area is poor today — people with asthma like you are more vulnerable"),

        ("wheezing",
         lambda v: v == 1,
         "You are wheezing right now — this means your airways are narrowed and inflamed"),

        ("chest_tightness",
         lambda v: v == 1,
         "You have chest tightness — your airways are under stress and struggling to move air properly"),

        ("breathing_difficulty",
         lambda v: v == 3,
         "You are having severe difficulty breathing — this is a serious warning sign that needs immediate attention"),

        ("breathing_difficulty",
         lambda v: v == 2,
         "You are having moderate breathing difficulty — your airways are not working at full capacity"),

        ("smoking",
         lambda v: v == 1,
         "Smoking is damaging your airways — this is making your asthma significantly harder to control"),

        ("PM2_5",
         lambda v: v > 55,
         "The air contains tiny invisible harmful particles today that get deep into your lungs and trigger inflammation"),

        ("dust_exposure",
         lambda v: v > 5,
         f"You have been exposed to high dust levels today ({full_data.get('dust_exposure')}/10) — dust is one of the strongest asthma triggers"),

        ("family_history_asthma",
         lambda v: v == 1,
         "Asthma runs in your family — your airways are naturally more sensitive than the average person"),

        ("hay_fever",
         lambda v: v == 1,
         "You have hay fever — this and asthma affect the same airways and often flare up together"),

        ("eczema",
         lambda v: v == 1,
         "You have eczema — this is connected to asthma through the same overactive immune response in your body"),

        ("medication_adherence",
         lambda v: v == 0,
         "You have not taken your medication today — skipping it leaves your airways completely unprotected"),

        ("bmi",
         lambda v: v > 30,
         f"Your weight (BMI: {full_data.get('bmi', 0):.1f}) puts extra pressure on your lungs — this makes breathing harder"),

        ("inhaler_usage",
         lambda v: v >= 3,
         f"You have used your inhaler {full_data.get('inhaler_usage')} times today — this level of usage means your asthma is not well controlled right now"),

        ("pollen_count",
         lambda v: v > 100,
         f"Pollen levels are high today ({full_data.get('pollen_count')}) — pollen causes airways to swell and narrow"),

        ("humidity",
         lambda v: v > 80,
         f"Humidity is very high today ({full_data.get('humidity')}%) — heavy moist air makes breathing harder and triggers airway spasms"),

        ("past_attacks",
         lambda v: v > 4,
         f"You have had {full_data.get('past_attacks')} asthma attacks before — this history means your airways are more reactive than average"),
    ]

    sorted_checks = sorted(
        checks,
        key=lambda x: importances[feature_columns.index(x[0])]
        if x[0] in feature_columns else 0,
        reverse=True
    )

    seen_features = set()
    for feat, condition, reason in sorted_checks:
        if feat in seen_features:
            continue
        val = full_data.get(feat, 0)
        if condition(val):
            reasons.append(reason)
            seen_features.add(feat)
        if len(reasons) >= 4:
            break

    return reasons if reasons else ["All your health indicators are within safe range right now"]


# PERSONALIZED ADVICE
def get_personalized_advice(full_data: dict, prediction: int) -> str:
    """
    Generates specific actionable advice based on:
    - What triggered the risk (symptoms vs environment vs both)
    - Time of day
    - Specific patient conditions
    """
    hour = datetime.now().hour
    time_of_day = (
        "morning"   if 5  <= hour < 12 else
        "afternoon" if 12 <= hour < 17 else
        "evening"   if 17 <= hour < 21 else
        "night"
    )

    aqi       = full_data.get("AQI", 50)
    pollen    = full_data.get("pollen_count", 30)
    humidity  = full_data.get("humidity", 60)
    wheezing  = full_data.get("wheezing", 0)
    chest     = full_data.get("chest_tightness", 0)
    breathing = full_data.get("breathing_difficulty", 1)
    inhaler   = full_data.get("inhaler_usage", 0)
    medication = full_data.get("medication_adherence", 1)
    smoking   = full_data.get("smoking", 0)

    env_driven     = aqi > 100 or pollen > 100
    symptom_driven = wheezing == 1 or chest == 1 or breathing >= 2

    # HIGH RISK
    if prediction == 2:
        if env_driven and symptom_driven:
            return (
                f"Stay completely indoors this {time_of_day}. "
                "You have active symptoms AND the air quality is poor outside — "
                "this is a dangerous combination for your lungs. "
                "Use your rescue inhaler (blue one) now and contact Dr. Rahman immediately."
            )
        elif symptom_driven:
            return (
                "Use your rescue inhaler (2 puffs) right now and sit upright — "
                "this position makes breathing easier. "
                "Rest completely, avoid any physical activity. "
                "If breathing does not improve within 15 minutes, call Dr. Rahman or go to emergency."
            )
        elif medication == 0:
            return (
                "Take your preventer inhaler immediately — you skipped it today "
                "and your risk has risen to dangerous levels as a result. "
                f"Stay indoors this {time_of_day} and keep your rescue inhaler in your pocket at all times."
            )
        else:
            return (
                f"Air pollution is dangerously high this {time_of_day}. "
                "Stay indoors with all windows closed. "
                "Take your preventer inhaler now and keep your rescue inhaler nearby. "
                "If you must go outside, wear an N95 mask."
            )

    # MEDIUM RISK
    elif prediction == 1:
        if medication == 0:
            return (
                "Take your preventer inhaler now — you have not taken it today "
                "and this is raising your risk significantly. "
                f"Limit outdoor activity this {time_of_day} and monitor your breathing every hour."
            )
        elif env_driven and symptom_driven:
            return (
                f"Both your symptoms and the outdoor air are working against you this {time_of_day}. "
                "Rest indoors, keep windows closed, and keep your inhaler within arm's reach. "
                "If symptoms worsen in the next 2 hours, use your rescue inhaler."
            )
        elif env_driven:
            if time_of_day == "morning":
                return (
                    "Air quality is poor this morning — delay any outdoor activity until the afternoon "
                    "when pollution levels typically drop. Keep windows closed and take your medication on time."
                )
            elif time_of_day == "afternoon":
                return (
                    "Air quality is at its worst right now in the afternoon. "
                    "Stay indoors, keep windows closed, and avoid any exercise outside. "
                    "Check air quality again this evening before going out."
                )
            else:
                return (
                    f"Air quality is elevated this {time_of_day}. "
                    "Avoid going outside unnecessarily and keep your home well ventilated. "
                    "Take your medication on schedule."
                )
        elif symptom_driven:
            return (
                "Your symptoms are building up — rest and avoid anything that triggers your asthma. "
                "Keep your rescue inhaler within reach. "
                "Take your medication on time and avoid cold air, dust, and physical exertion."
            )
        elif smoking == 1:
            return (
                "Do not smoke today — with your current moderate risk, "
                "smoking will spike your airways into high risk within minutes. "
                "Take your medication on time and stay in clean air environments."
            )
        else:
            return (
                "Your risk is building up — take your medication on time and monitor your symptoms. "
                f"Avoid known triggers this {time_of_day} and keep your inhaler accessible."
            )

    # LOW RISK
    else:
        if time_of_day == "night":
            return (
                "You are doing well tonight. "
                "Keep your inhaler on your bedside table just in case — "
                "asthma symptoms can sometimes worsen between midnight and 4am. "
                "Take your preventer inhaler before bed if prescribed."
            )
        else:
            return (
                f"You are doing well this {time_of_day}. "
                "Continue your normal medication routine, stay hydrated, "
                "and avoid known triggers like dust, cold air, and smoke."
            )


# PLAIN ENGLISH ALERTS 
# 
def get_plain_alerts(full_data: dict) -> list:
    """Environmental and health alerts in plain language."""
    alerts = []

    if full_data["AQI"] > 150:
        alerts.append("Air outside is unhealthy right now — stay indoors as much as possible")
    elif full_data["AQI"] > 100:
        alerts.append("Air quality is poor today — avoid unnecessary outdoor exposure")

    if full_data["pollen_count"] > 100:
        alerts.append("High pollen in the air today — keep windows and doors closed")

    if full_data["humidity"] > 80:
        alerts.append(f"Air is very humid ({full_data['humidity']}%) — this makes breathing harder for asthma patients")

    if full_data["PM2_5"] > 55:
        alerts.append("Harmful invisible particles in the air today — wear a mask if going outside")

    if full_data.get("dust_exposure", 0) > 7:
        alerts.append("Very high dust levels today — a major trigger for asthma attacks")

    if full_data["inhaler_usage"] >= 3:
        alerts.append(f"You have used your inhaler {full_data['inhaler_usage']} times today — more than normal, consider calling your doctor")

    if full_data["medication_adherence"] == 0:
        alerts.append("Medication not taken today — your airways are currently unprotected")

    return alerts


# MAIN PREDICTION FUNCTION
def predict_with_live_data(weather_city: str,
                            patient_symptoms: dict,
                            aqi_city: str = None) -> dict:
    # Get live environmental data
    env = get_environment(weather_city, aqi_city or weather_city)

    # Merge with patient symptoms
    full_data = {**env, **patient_symptoms}

    print(f"\n Running AI prediction...")

    # Feature Engineering
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

    features_scaled = scaler.transform(features)

    # Neural Network — primary
    nn_proba = nn_model.predict(features_scaled, verbose=0)[0]

    if nn_proba[2] >= 0.25:   prediction = 2
    elif nn_proba[0] >= 0.45: prediction = 0
    else:                      prediction = 1

    # Random Forest safety override
    rf_pred = rf_model.predict(features_scaled)[0]
    if rf_pred == 2 and prediction != 2:
        prediction = 2

    label_map = {0: "LOW",   1: "MEDIUM",  2: "HIGH"}
    icon_map  = {0: "✅",    1: "⚠️",      2: "🚨"}
    color_map = {0: "green", 1: "orange",  2: "red"}

    main_message_map = {
        0: "You are safe right now. Your breathing conditions look good today.",
        1: "Your risk is moderate. Take some precautions to stay safe.",
        2: "Your risk is high. Take action now to protect your breathing."
    }

    risk_level   = label_map[prediction]
    confidence   = float(nn_proba[prediction])
    reasons      = get_top_reasons(full_data)
    advice       = get_personalized_advice(full_data, prediction)
    alerts       = get_plain_alerts(full_data)
    main_message = main_message_map[prediction]

    return {
        "city":          weather_city,
        "risk_level":    risk_level,
        "main_message":  main_message,
        "icon":          icon_map[prediction],
        "color":         color_map[prediction],
        "confidence":    round(confidence, 3),
        "probabilities": {
            "low":    round(float(nn_proba[0]), 3),
            "medium": round(float(nn_proba[1]), 3),
            "high":   round(float(nn_proba[2]), 3),
        },
        "advice":      advice,
        "reasons":     reasons,
        "alerts":      alerts,
        "environment": env,
        "models_used": "Neural Network (primary) + Random Forest (safety + explanation)"
    }


# DEMO
if __name__ == "__main__":
    print("=" * 55)
    print("STEP 8: LIVE API PREDICTION DEMO")
    print("=" * 55)

    patient = {
        "wheezing":              1,
        "coughing":              1,
        "chest_tightness":       0,
        "inhaler_usage":         2,
        "breathing_difficulty":  2,
        "medication_adherence":  1,
        "past_attacks":          3,
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

    result = predict_with_live_data("Gujrat", patient)

    print(f"\n{'=' * 55}")
    print(f"  {result['icon']}  RISK ASSESSMENT — {result['city'].upper()}")
    print(f"{'=' * 55}")
    print(f"  {result['main_message']}")
    print(f"\n  Risk Level : {result['risk_level']}")
    print(f"  Confidence : {result['confidence']:.1%}")

    print(f"\n  Why is your risk {result['risk_level']}?")
    for i, r in enumerate(result['reasons'], 1):
        print(f"    {i}. {r}")

    print(f"\n  What you should do now:")
    print(f"    {result['advice']}")

    if result['alerts']:
        print(f"\n  Current alerts:")
        for a in result['alerts']:
            print(f"    • {a}")

    print(f"\n  Live Environment:")
    for k, v in result['environment'].items():
        print(f"    {k:15} : {v}")