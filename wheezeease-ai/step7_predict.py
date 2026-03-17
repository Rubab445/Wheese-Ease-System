import pickle
import numpy as np
import tensorflow as tf

# Suppress TensorFlow warnings
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# 7.1 LOAD BOTH MODELS + SCALER
with open('data/model_nn.h5', 'rb') as f:
    pass  # just checking

nn_model = tf.keras.models.load_model('data/model_nn.h5', compile=False)

with open('data/model_rf.pkl', 'rb') as f:
    rf_model = pickle.load(f)

with open('data/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('data/processed_data.pkl', 'rb') as f:
    meta = pickle.load(f)
    feature_columns = meta['feature_columns']

# 7.2 FEATURE ENGINEERING
def engineer_features(data: dict) -> np.ndarray:
    """Applies same feature engineering as step2_preprocess.py"""

    env_risk_index = (
        data['AQI']          * 0.40 +
        data['pollen_count'] * 0.30 +
        data['humidity']     * 0.20 +
        data['temperature']  * 0.10
    )

    symptom_severity = (
        data['wheezing'] +
        data['coughing'] +
        data['chest_tightness'] +
        data['breathing_difficulty']
    )

    pollution_combo = data['PM2_5'] * 0.6 + data['NO2'] * 0.4
    inhaler_overuse = 1 if data['inhaler_usage'] >= 3 else 0

    features = [
        # Environmental
        data['AQI'], data['pollen_count'], data['humidity'],
        data['temperature'], data['PM2_5'], data['NO2'],
        data['dust_exposure'],
        # Core symptoms
        data['wheezing'], data['coughing'], data['chest_tightness'],
        data['inhaler_usage'], data['breathing_difficulty'],
        data['medication_adherence'], data['past_attacks'],
        # Clinical features
        data['lung_function_fev1'], data['lung_function_fvc'],
        data['bmi'], data['smoking'], data['physical_activity'],
        data['family_history_asthma'], data['history_of_allergies'],
        data['hay_fever'], data['eczema'],
        # Engineered
        env_risk_index, symptom_severity, pollution_combo, inhaler_overuse
    ]

    return np.array([features])

# 7.3 GET TOP REASONS FROM RANDOM FOREST
def get_top_reasons(data: dict, features_scaled: np.ndarray) -> list:
    """
    Uses Random Forest feature importance + patient values
    to explain WHY the risk level was assigned.
    """
    importances = rf_model.feature_importances_
    reasons     = []

    # Check each important feature and generate human-readable reason
    feature_checks = {
        'lung_function_fev1': (
            data.get('lung_function_fev1', 3),
            lambda v: v < 2.0,
            f"Low lung function (FEV1: {data.get('lung_function_fev1', '?')}L) — reduced breathing capacity"
        ),
        'lung_function_fvc': (
            data.get('lung_function_fvc', 4),
            lambda v: v < 3.0,
            f"Low lung capacity (FVC: {data.get('lung_function_fvc', '?')}L)"
        ),
        'AQI': (
            data.get('AQI', 50),
            lambda v: v > 100,
            f"Poor air quality (AQI: {data.get('AQI', '?')}) — breathing hazard"
        ),
        'wheezing': (
            data.get('wheezing', 0),
            lambda v: v == 1,
            "Wheezing detected — active airway inflammation"
        ),
        'smoking': (
            data.get('smoking', 0),
            lambda v: v == 1,
            "Smoking history — damages airways significantly"
        ),
        'breathing_difficulty': (
            data.get('breathing_difficulty', 1),
            lambda v: v >= 2,
            f"Breathing difficulty level {data.get('breathing_difficulty', '?')} — moderate to severe"
        ),
        'PM2_5': (
            data.get('PM2_5', 10),
            lambda v: v > 55,
            f"High PM2.5 ({data.get('PM2_5', '?')} μg/m³) — fine particles in air"
        ),
        'dust_exposure': (
            data.get('dust_exposure', 0),
            lambda v: v > 5,
            f"High dust exposure ({data.get('dust_exposure', '?')}/10) — major trigger"
        ),
        'family_history_asthma': (
            data.get('family_history_asthma', 0),
            lambda v: v == 1,
            "Family history of asthma — genetic risk factor present"
        ),
        'hay_fever': (
            data.get('hay_fever', 0),
            lambda v: v == 1,
            "Hay fever present — linked to asthma attacks"
        ),
        'eczema': (
            data.get('eczema', 0),
            lambda v: v == 1,
            "Eczema present — part of atopic triad with asthma"
        ),
        'inhaler_usage': (
            data.get('inhaler_usage', 0),
            lambda v: v >= 3,
            f"High inhaler usage ({data.get('inhaler_usage', '?')} times) — uncontrolled symptoms"
        ),
        'medication_adherence': (
            data.get('medication_adherence', 1),
            lambda v: v == 0,
            "Medication not taken — significantly increases risk"
        ),
        'bmi': (
            data.get('bmi', 22),
            lambda v: v > 30,
            f"High BMI ({data.get('bmi', '?')}) — obesity increases asthma severity"
        ),
        'pollen_count': (
            data.get('pollen_count', 0),
            lambda v: v > 100,
            f"High pollen count ({data.get('pollen_count', '?')}) — allergy trigger"
        ),
    }

    # Sort by feature importance
    sorted_features = sorted(
        feature_checks.items(),
        key=lambda x: importances[feature_columns.index(x[0])]
        if x[0] in feature_columns else 0,
        reverse=True
    )

    # Collect triggered reasons
    for feat_name, (value, condition, reason) in sorted_features:
        if condition(value):
            reasons.append(reason)
        if len(reasons) >= 4:  # top 4 reasons max
            break

    if not reasons:
        reasons.append("All indicators within normal range")

    return reasons

# 7.4 MAIN PREDICTION FUNCTION
def predict_risk(patient_data: dict) -> dict:
    """
    Main prediction function for your Flutter app.

    Required keys:
        AQI, pollen_count, humidity, temperature, PM2_5, NO2,
        dust_exposure, wheezing, coughing, chest_tightness,
        inhaler_usage, breathing_difficulty, medication_adherence,
        past_attacks, lung_function_fev1, lung_function_fvc,
        bmi, smoking, physical_activity, family_history_asthma,
        history_of_allergies, hay_fever, eczema
    """

    # Engineer features
    features_raw    = engineer_features(patient_data)
    features_scaled = scaler.transform(features_raw)

    #  Neural Network prediction (primary)
    nn_proba   = nn_model.predict(features_scaled, verbose=0)[0]

    # Apply threshold adjustment for medical safety
    if nn_proba[2] >= 0.25:      # High risk
        prediction = 2
    elif nn_proba[0] >= 0.45:    # Low risk
        prediction = 0
    else:                         # Medium risk
        prediction = 1

    #  Random Forest safety check 
    rf_pred = rf_model.predict(features_scaled)[0]
    if rf_pred == 2 and prediction != 2:
        # If RF says High but NN doesn't — flag as High for safety
        prediction = 2

    #  Labels and messaging 
    label_map  = {0: 'LOW',    1: 'MEDIUM',   2: 'HIGH'}
    icon_map   = {0: '✅',     1: '⚠️',       2: '🚨'}
    color_map  = {0: 'green',  1: 'orange',   2: 'red'}
    advice_map = {
        0: 'Conditions are safe. Continue normal medication routine. Stay hydrated.',
        1: 'Limit outdoor exposure. Keep inhaler accessible. Monitor symptoms closely.',
        2: 'URGENT: Avoid all outdoor activity. Use rescue inhaler. Contact your doctor immediately.'
    }

    risk_level = label_map[prediction]
    confidence = float(nn_proba[prediction])

    # Get reasons from Random Forest
    reasons = get_top_reasons(patient_data, features_scaled)

    # Environmental alerts 
    alerts = []
    if patient_data.get('AQI', 0) > 150:
        alerts.append(f"AQI {patient_data['AQI']} — air quality is unhealthy")
    if patient_data.get('pollen_count', 0) > 100:
        alerts.append(f"High pollen ({patient_data['pollen_count']}) — allergy risk")
    if patient_data.get('humidity', 0) > 80:
        alerts.append(f"High humidity ({patient_data['humidity']}%) — airway irritation")
    if patient_data.get('PM2_5', 0) > 75:
        alerts.append(f"PM2.5 elevated ({patient_data['PM2_5']}) — dangerous particles")
    if patient_data.get('dust_exposure', 0) > 7:
        alerts.append(f"Very high dust exposure ({patient_data['dust_exposure']}/10)")

    return {
        'risk_level':    risk_level,
        'icon':          icon_map[prediction],
        'color':         color_map[prediction],
        'confidence':    round(confidence, 3),
        'probabilities': {
            'low':    round(float(nn_proba[0]), 3),
            'medium': round(float(nn_proba[1]), 3),
            'high':   round(float(nn_proba[2]), 3),
        },
        'advice':        advice_map[prediction],
        'reasons':       reasons,       # ← from Random Forest
        'alerts':        alerts,
        'models_used':   'Neural Network (primary) + Random Forest (safety + explanation)'
    }

# 7.5 DEMO
if __name__ == '__main__':
    print("=" * 55)
    print("STEP 7: COMBINED PREDICTION ENGINE DEMO")
    print("=" * 55)

    # High risk patient
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

    # Low risk patient
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

        print(f"\n{'─' * 50}")
        print(f"  {result['icon']}  {name}")
        print(f"{'─' * 50}")
        print(f"  Risk Level   : {result['risk_level']}")
        print(f"  Confidence   : {result['confidence']:.1%}")
        print(f"  Probabilities:")
        print(f"    Low    → {result['probabilities']['low']:.1%}")
        print(f"    Medium → {result['probabilities']['medium']:.1%}")
        print(f"    High   → {result['probabilities']['high']:.1%}")
        print(f"\n  Advice: {result['advice']}")
        print(f"\n  Why this risk level (from Random Forest):")
        for i, reason in enumerate(result['reasons'], 1):
            print(f"    {i}. {reason}")
        if result['alerts']:
            print(f"\n  Environmental Alerts:")
            for alert in result['alerts']:
                print(f"    • {alert}")
        print(f"\n  Models: {result['models_used']}")

    print("\n Combined prediction engine working!")