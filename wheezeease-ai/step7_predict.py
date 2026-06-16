import pickle
import numpy as np
import tensorflow as tf
from datetime import datetime
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

from dotenv import load_dotenv
load_dotenv()

from model_loader import nn_model, rf_model, scaler, feature_columns

# FEATURE ENGINEERING
def engineer_features(data: dict) -> np.ndarray:
    
    data['env_risk_index'] = (
        (data['AQI'] / 400)          * 0.40 +
        (data['pollen_count'] / 200) * 0.30 +
        (data['humidity'] / 100)     * 0.20 +
        (data['temperature'] / 45)   * 0.10   
    )
    data['symptom_severity'] = (
        data['wheezing'] +
        data['coughing'] +
        data['chest_tightness'] +
        (data['breathing_difficulty'] - 1) / 2
    )
    data['pollution_combo'] = data['PM2_5'] * 0.6 + data['NO2'] * 0.4
    data['inhaler_overuse'] = 1 if data['inhaler_usage'] >= 3 else 0

    row = [data[col] for col in feature_columns]
    return np.array([row])


# PLAIN ENGLISH REASONS
def get_plain_reasons(data: dict) -> list:
    importances = rf_model.feature_importances_
    reasons = []

    checks = [
        ("lung_function_fev1",
         lambda v: v < 2.0,
         "Your lungs are working at reduced capacity right now — breathing takes more effort than normal"),

        ("lung_function_fev1",
         lambda v: 2.0 <= v < 2.5,
         "Your lung capacity is slightly below normal — your airways may be partially narrowed"),

        ("AQI",
         lambda v: v > 150,
         f"The air outside is unhealthy today (pollution level: {data.get('AQI')}) — breathing outdoor air will irritate your airways"),

        ("AQI",
         lambda v: 100 < v <= 150,
         f"Air quality in your area is moderate today (level: {data.get('AQI')}) — sensitive people like you should be cautious"),

        ("wheezing",
         lambda v: v == 1,
         "You are wheezing — this means your airways are narrowed and inflamed right now"),

        ("chest_tightness",
         lambda v: v == 1,
         "You have chest tightness — your airways are under stress and may be struggling to move air properly"),

        ("breathing_difficulty",
         lambda v: v == 3,
         "You are having severe difficulty breathing — this is a serious warning sign that needs immediate attention"),

        ("breathing_difficulty",
         lambda v: v == 2,
         "You are having moderate breathing difficulty — your airways are not working at full capacity"),

        ("smoking",
         lambda v: v == 1,
         "Smoking significantly damages your airways over time — this is making your asthma much harder to control"),

        ("PM2_5",
         lambda v: v > 55,
         f"The air contains tiny invisible particles (dust and pollution) that get deep into your lungs and trigger inflammation"),

        ("dust_exposure",
         lambda v: v > 5,
         f"You have been exposed to high levels of dust today ({data.get('dust_exposure')}/10) — dust is one of the strongest asthma triggers"),

        ("family_history_asthma",
         lambda v: v == 1,
         "Asthma runs in your family — this means your airways are naturally more sensitive than average"),

        ("hay_fever",
         lambda v: v == 1,
         "You have hay fever — this and asthma affect the same airways, and when one flares up the other often follows"),

        ("eczema",
         lambda v: v == 1,
         "You have eczema — this is connected to asthma through the same overactive immune response in your body"),

        ("medication_adherence",
         lambda v: v == 0,
         "You have not taken your medication today — skipping medication leaves your airways unprotected and dramatically increases your risk"),

        ("bmi",
         lambda v: v > 30,
         f"Your weight (BMI: {data.get('bmi', 0):.1f}) puts extra pressure on your lungs — losing weight would significantly improve your breathing"),

        ("inhaler_usage",
         lambda v: v >= 3,
         f"You have used your inhaler {data.get('inhaler_usage')} times today — this level of usage suggests your asthma is not well controlled right now"),

        ("pollen_count",
         lambda v: v > 100,
         f"Pollen levels are high today ({data.get('pollen_count')}) — pollen is a major trigger that causes airways to swell and narrow"),

        ("humidity",
         lambda v: v > 80,
         f"Humidity is very high today ({data.get('humidity')}%) — moist air makes airways more irritated and prone to spasms"),

        ("past_attacks",
         lambda v: v > 4,
         f"You have had {data.get('past_attacks')} asthma attacks in the past — this history means your airways are more reactive than average"),
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
        val = data.get(feat, 0)
        if condition(val):
            reasons.append(reason)
            seen_features.add(feat)
        if len(reasons) >= 4:
            break

    return reasons if reasons else ["All your health indicators are within safe range right now"]


# PERSONALIZED RECOMMENDATIONS
def get_personalized_advice(data: dict, risk_level: str) -> dict:
    hour = datetime.now().hour
    time_of_day = (
        "morning"   if 5  <= hour < 12 else
        "afternoon" if 12 <= hour < 17 else
        "evening"   if 17 <= hour < 21 else
        "night"
    )

    aqi          = data.get('AQI', 50)
    pm25         = data.get('PM2_5', 15)
    humidity     = data.get('humidity', 60)
    pollen       = data.get('pollen_count', 30)
    wheezing     = data.get('wheezing', 0)
    chest        = data.get('chest_tightness', 0)
    breathing    = data.get('breathing_difficulty', 1)
    inhaler      = data.get('inhaler_usage', 0)
    medication   = data.get('medication_adherence', 1)
    smoking      = data.get('smoking', 0)
    dust         = data.get('dust_exposure', 0)

    env_driven     = aqi > 100 or pm25 > 55 or pollen > 100
    symptom_driven = wheezing == 1 or chest == 1 or breathing >= 2
    both_driven    = env_driven and symptom_driven

    recommendations = []

    if medication == 0:
        recommendations.append(
            f"Take your preventer inhaler right now — skipping it today has left your airways unprotected"
        )
    elif inhaler >= 3:
        doctor_name = data.get('assigned_doctor', 'your doctor')
        recommendations.append(
            f"You have used your rescue inhaler {inhaler} times today — contact {doctor_name} as this suggests your condition needs review"
        )

    if breathing == 3 or (wheezing == 1 and chest == 1):
        recommendations.append(
            "Use your rescue inhaler (blue one) immediately — take 2 puffs now and sit upright to help your breathing"
        )
    elif wheezing == 1 or chest == 1:
        recommendations.append(
            "Keep your rescue inhaler within reach — use it if your breathing gets worse in the next hour"
        )

    if both_driven:
        recommendations.append(
            f"Stay indoors completely today — you have active symptoms AND the air quality is poor. This is a dangerous combination"
        )
    elif env_driven:
        if time_of_day == "morning":
            recommendations.append(
                "Air quality is poor this morning — delay any outdoor activity until the afternoon when pollution levels typically drop"
            )
        elif time_of_day == "afternoon":
            recommendations.append(
                "Air quality is at its worst right now in the afternoon — stay indoors and keep windows closed until evening"
            )
        else:
            recommendations.append(
                f"Air pollution is elevated this {time_of_day} — avoid going outside and keep your home well ventilated"
            )

    if pollen > 100:
        recommendations.append(
            "Pollen count is high today — keep windows and doors closed, shower after any outdoor exposure, and wear sunglasses outside"
        )

    if humidity > 80:
        recommendations.append(
            "High humidity is making the air heavier and harder to breathe — use an air conditioner or dehumidifier if you have one"
        )

    if dust > 7:
        recommendations.append(
            "You have been exposed to significant dust today — wear an N95 mask if you need to go outside, and rinse your nose with saline"
        )

    if smoking == 1:
        recommendations.append(
            "Do not smoke today — with your current risk level, smoking will make your airways significantly worse within minutes"
        )

    if time_of_day == "night" and risk_level in ["HIGH", "MEDIUM"]:
        recommendations.append(
            "Keep your inhaler on your bedside table tonight — asthma symptoms often worsen between midnight and 4am"
        )

    if risk_level == "HIGH":
        recommendations.append(
            "If your breathing gets significantly worse or you cannot speak in full sentences — go to the emergency room immediately or call for help"
        )

    return recommendations[:4]


# PLAIN ENGLISH ALERTS
def get_plain_alerts(data: dict) -> list:
    alerts = []
    if data.get('AQI', 0) > 150:
        alerts.append(f"Air outside is unhealthy right now — pollution at dangerous levels")
    elif data.get('AQI', 0) > 100:
        alerts.append(f"Air quality is poor today — avoid unnecessary outdoor exposure")
    if data.get('pollen_count', 0) > 100:
        alerts.append(f"High pollen in the air today — keep windows closed")
    if data.get('humidity', 0) > 80:
        alerts.append(f"Air is very humid — this makes breathing harder for asthma patients")
    if data.get('PM2_5', 0) > 55:
        alerts.append(f"Invisible harmful particles in the air today — wear a mask outdoors")
    if data.get('dust_exposure', 0) > 7:
        alerts.append(f"High dust levels detected — a major trigger for asthma attacks")
    if data.get('inhaler_usage', 0) >= 3:
        alerts.append(f"You have used your inhaler {data.get('inhaler_usage')} times today — this is more than normal")
    if data.get('medication_adherence', 1) == 0:
        alerts.append("Medication not taken today — your airways are currently unprotected")
    return alerts


# INPUT VALIDATION
def validate_input(data: dict):
    required = {
        'AQI': (0, 500), 'humidity': (0, 100),
        'breathing_difficulty': (1, 3),
        'lung_function_fev1': (0.5, 6.0)
    }
    for field, (min_val, max_val) in required.items():
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
        if not (min_val <= data[field] <= max_val):
            raise ValueError(f"{field}={data[field]} outside valid range [{min_val}, {max_val}]")


# MAIN PREDICTION FUNCTION
def predict_risk(patient_data: dict) -> dict:
    validate_input(patient_data)

    features_raw    = engineer_features(patient_data)
    features_scaled = scaler.transform(features_raw)

    # Neural Network — primary predictor
    nn_proba = nn_model.predict(features_scaled, verbose=0)[0]

    if nn_proba[2] >= 0.25:   prediction = 2
    elif nn_proba[0] >= 0.45: prediction = 0
    else:                      prediction = 1

    
    rf_proba    = rf_model.predict_proba(features_scaled)[0]   
    rf_override = False
    if rf_proba[2] >= 0.25 and prediction != 2:
        prediction  = 2
        rf_override = True

    label_map = {0: 'LOW',   1: 'MEDIUM',  2: 'HIGH'}
    color_map = {0: 'green', 1: 'orange',  2: 'red'}

    main_message_map = {
        0: "You are safe right now. Your breathing conditions look good today.",
        1: "Your risk is moderate. Take some precautions to stay safe.",
        2: "Your risk is high. Take action now to protect your breathing."
    }

    risk_level   = label_map[prediction]
    confidence   = float(nn_proba[prediction])
    reasons      = get_plain_reasons(patient_data)
    advice       = get_personalized_advice(patient_data, risk_level)
    alerts       = get_plain_alerts(patient_data)
    main_message = main_message_map[prediction]

    return {
        'risk_level':    risk_level,
        'color':         color_map[prediction],
        'main_message':  main_message,
        'confidence':    round(confidence, 3),
        'rf_override':   rf_override,
        'rf_high_prob':  round(float(rf_proba[2]), 3),   # added for transparency
        'probabilities': {
            'low':    round(float(nn_proba[0]), 3),
            'medium': round(float(nn_proba[1]), 3),
            'high':   round(float(nn_proba[2]), 3),
        },
        'reasons':       reasons,
        'advice':        advice,
        'alerts':        alerts,
        'models_used':   'Neural Network (primary) + Random Forest (safety veto @ 0.25 threshold)'
    }



if __name__ == '__main__':
    print("=" * 60)
    print("STEP 7: PLAIN ENGLISH PREDICTION DEMO")
    print("=" * 60)

    patient_A = {
        'AQI': 185, 'pollen_count': 140, 'humidity': 88,
        'temperature': 8, 'PM2_5': 95, 'NO2': 130,
        'dust_exposure': 8.5,
        'wheezing': 1, 'coughing': 1, 'chest_tightness': 1,
        'inhaler_usage': 4, 'breathing_difficulty': 3,
        'medication_adherence': 0, 'past_attacks': 6,
        'lung_function_fev1': 1.3, 'lung_function_fvc': 2.1,
        'bmi': 32, 'smoking': 1, 'physical_activity': 2.0,
        'family_history_asthma': 1, 'history_of_allergies': 1,
        'hay_fever': 1, 'eczema': 1
    }

    patient_B = {
        'AQI': 40, 'pollen_count': 15, 'humidity': 45,
        'temperature': 24, 'PM2_5': 10, 'NO2': 25,
        'dust_exposure': 1.2,
        'wheezing': 0, 'coughing': 0, 'chest_tightness': 0,
        'inhaler_usage': 0, 'breathing_difficulty': 1,
        'medication_adherence': 1, 'past_attacks': 0,
        'lung_function_fev1': 3.8, 'lung_function_fvc': 5.5,
        'bmi': 22, 'smoking': 0, 'physical_activity': 8.5,
        'family_history_asthma': 0, 'history_of_allergies': 0,
        'hay_fever': 0, 'eczema': 0
    }

    for name, patient in [('Patient A (High Risk)', patient_A),
                           ('Patient B (Low Risk)',  patient_B)]:
        result = predict_risk(patient)
        print(f"  Risk Level   : {result['risk_level']}")
        print(f"  Message      : {result['main_message']}")
        print(f"  Confidence   : {result['confidence']:.1%}")
        print(f"  RF High Prob : {result['rf_high_prob']:.3f}  (threshold: 0.25)")
        if result.get('rf_override'):
            print(f"  RF Override  : True (Safety Net Triggered)")

        print(f"\n  Why is your risk {result['risk_level']}?")
        for i, reason in enumerate(result['reasons'], 1):
            print(f"    {i}. {reason}")

        print(f"\n  What you should do now:")
        for i, tip in enumerate(result['advice'], 1):
            print(f"    {i}. {tip}")

        if result['alerts']:
            print(f"\n  Current alerts:")
            for alert in result['alerts']:
                print(f"    • {alert}")

    