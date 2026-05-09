# STEP 1C: INTEGRATE REAL ENVIRONMENTAL DATASET (UPDATED)

import pandas as pd
import numpy as np

print("=" * 55)
print("STEP 1C: INTEGRATING ENVIRONMENTAL DATASET")
print("=" * 55)

# ---- Define label function FIRST ----
def score_to_label(score):
    if score < 0.25:    return 'low'
    elif score < 0.55:  return 'medium'
    else:               return 'high'

# 1. LOAD DATASETS
try:
    patient_df = pd.read_csv('data/asthma_dataset.csv')
    print(f"\n Patient dataset loaded    : {len(patient_df)} rows")
except FileNotFoundError:
    print(" asthma_dataset.csv not found! Run step1b first.")
    exit()

try:
    env_df = pd.read_csv('data/global_air_pollution_dataset.csv')
    print(f" Environmental dataset loaded: {len(env_df)} rows")
except FileNotFoundError:
    try:
        env_df = pd.read_csv('data/global-air-pollution-dataset.csv')
        print(f" Environmental dataset loaded: {len(env_df)} rows")
    except FileNotFoundError:
        print(" Environmental dataset not found!")
        exit()

# 2. CLEAN ENVIRONMENTAL DATASET
print("\n--- Cleaning environmental dataset ---")

env_df = env_df.rename(columns={
    'AQI Value':       'AQI',
    'PM2.5 AQI Value': 'PM2_5',
    'NO2 AQI Value':   'NO2',
    'City':            'city',
    'Country':         'country'
})

env_clean = env_df[['city', 'country', 'AQI', 'PM2_5', 'NO2']].copy()
env_clean.dropna(inplace=True)
env_clean = env_clean.groupby('city').agg({
    'country': 'first',
    'AQI':     'mean',
    'PM2_5':   'mean',
    'NO2':     'mean'
}).reset_index()

env_clean['AQI']   = env_clean['AQI'].round(1)
env_clean['PM2_5'] = env_clean['PM2_5'].round(1)
env_clean['NO2']   = env_clean['NO2'].round(1)
print(f" Unique cities available: {len(env_clean)}")

# 3. PAKISTAN CITIES
pakistan = env_clean[env_clean['country'].str.contains('Pakistan', case=False, na=False)]
print(f"\n🇵🇰 Pakistan cities: {len(pakistan)}")
if len(pakistan) > 0:
    print(pakistan[['city', 'AQI', 'PM2_5', 'NO2']].to_string(index=False))

# 4. REPLACE ENV VALUES - BIASED BY RISK LEVEL
print("\n--- Replacing with real environmental data (biased by risk) ---")
np.random.seed(42)

# Separate high and low AQI cities for intelligent assignment
high_aqi_cities = env_clean[env_clean['AQI'] > 150].copy()
low_aqi_cities  = env_clean[env_clean['AQI'] <= 150].copy()

print(f"   High AQI cities (>150): {len(high_aqi_cities)}")
print(f"   Low AQI cities (≤150):  {len(low_aqi_cities)}")

# Count high-risk patients (from existing risk_label if available, else use wheezing as proxy)
if 'risk_label' in patient_df.columns:
    high_risk = (patient_df['risk_label'] == 'high').sum()
    medium_risk = (patient_df['risk_label'] == 'medium').sum()
    low_risk = (patient_df['risk_label'] == 'low').sum()
    print(f"   High-risk patients: {high_risk}, Medium: {medium_risk}, Low: {low_risk}")
else:
    high_risk = 0
    medium_risk = 0
    low_risk = len(patient_df)

# Bias environmental assignment: high-risk → high AQI, low-risk → low AQI
if high_risk > 0 and len(high_aqi_cities) > 0:
    high_samples = high_aqi_cities[['AQI', 'PM2_5', 'NO2']].sample(
        n=high_risk, replace=True, random_state=42
    ).reset_index(drop=True)
    patient_df.loc[patient_df['risk_label'] == 'high', ['AQI', 'PM2_5', 'NO2']] = high_samples.values

if medium_risk > 0:
    medium_samples = env_clean[['AQI', 'PM2_5', 'NO2']].sample(
        n=medium_risk, replace=True, random_state=42
    ).reset_index(drop=True)
    patient_df.loc[patient_df['risk_label'] == 'medium', ['AQI', 'PM2_5', 'NO2']] = medium_samples.values

if low_risk > 0 and len(low_aqi_cities) > 0:
    low_samples = low_aqi_cities[['AQI', 'PM2_5', 'NO2']].sample(
        n=low_risk, replace=True, random_state=42
    ).reset_index(drop=True)
    patient_df.loc[patient_df['risk_label'] == 'low', ['AQI', 'PM2_5', 'NO2']] = low_samples.values

print(f" Assigned environmental data with risk-aware bias")

# Validation: Check NO2 scale
print(f"\n--- NO2 Scale Validation ---")
print(f"   NO2 range: {patient_df['NO2'].min():.1f} – {patient_df['NO2'].max():.1f}")
if patient_df['NO2'].max() > 300:
    print(f"   ℹ NO2 is on AQI scale (0-500)")
else:
    print(f"   ℹ NO2 is on concentration scale (μg/m³, ~10-200)")

# 5. RECALCULATE RISK — INCLUDES NEW CLINICAL FEATURES FROM STEP1B
print("\n--- Recalculating risk labels with complete clinical features ---")

patient_df['risk_score'] = (
    (patient_df['AQI'] / 400)                              * 0.12 +
    (patient_df['pollen_count'] / 200)                     * 0.08 +
    (patient_df['PM2_5'] / 150)                            * 0.05 +
    (patient_df['wheezing'])                               * 0.20 +
    (patient_df['chest_tightness'])                        * 0.15 +
    (patient_df['breathing_difficulty'] / 3)              * 0.15 +
    (patient_df['inhaler_usage'] / 5)                      * 0.05 +
    (1 - patient_df['lung_function_fev1'].clip(1, 4) / 4) * 0.10 +
    (patient_df['smoking'])                                * 0.05 +
    (patient_df['family_history_asthma'])                  * 0.05
).clip(0, 1)

patient_df['risk_label'] = patient_df['risk_score'].apply(score_to_label)

# ── Clinical override rules (enhanced with step1b logic) ──
high_mask = (
    (
        (patient_df['wheezing'] == 1) &
        (patient_df['breathing_difficulty'] == 3) &
        (patient_df['inhaler_usage'] >= 4)
    ) |
    (
        (patient_df['lung_function_fev1'] < 1.5) &
        (patient_df['wheezing'] == 1)
    )
)
low_mask = (
    (patient_df['wheezing'] == 0) &
    (patient_df['chest_tightness'] == 0) &
    (patient_df['breathing_difficulty'] == 1) &
    (patient_df['inhaler_usage'] == 0) &
    (patient_df['lung_function_fev1'] > 3.0)
)

patient_df.loc[high_mask, 'risk_label'] = 'high'
patient_df.loc[low_mask,  'risk_label'] = 'low'

print(f" Clinical overrides: {high_mask.sum()} forced HIGH, {low_mask.sum()} forced LOW")

# 6. FINAL STATS
print(f"\n Final Dataset Summary:")
print(f"   Total records : {len(patient_df)}")
print(f"   AQI range     : {patient_df['AQI'].min():.0f} – {patient_df['AQI'].max():.0f}")

print(f"\n Risk Label Distribution:")
dist  = patient_df['risk_label'].value_counts()
total = len(patient_df)
for label, count in dist.items():
    bar = "█" * int(count / total * 40)
    print(f"   {label:6} : {count:4} ({count/total:.1%})  {bar}")

# 7. SAVE
patient_df.to_csv('data/asthma_dataset.csv', index=False)
print(f"\n Saved: data/asthma_dataset.csv")
