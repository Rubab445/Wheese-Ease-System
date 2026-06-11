
import pandas as pd
import numpy as np

print("STEP 1C: INTEGRATING ENVIRONMENTAL DATASET ")

def score_to_label(score):
    if score < 0.25:   return 'low'
    elif score < 0.55: return 'medium'
    else:              return 'high'

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

# Pakistan cities (informational)
pakistan = env_clean[env_clean['country'].str.contains('Pakistan', case=False, na=False)]
print(f"\n Pakistan cities: {len(pakistan)}")
if len(pakistan) > 0:
    print(pakistan[['city', 'AQI', 'PM2_5', 'NO2']].to_string(index=False))

print("\n--- Replacing with real environmental data (RANDOM assignment — bias removed) ---")
np.random.seed(42)

env_samples = env_clean[['AQI', 'PM2_5', 'NO2']].sample(
    n=len(patient_df), replace=True, random_state=42
).reset_index(drop=True)

patient_df['AQI']   = env_samples['AQI'].values
patient_df['PM2_5'] = env_samples['PM2_5'].values
patient_df['NO2']   = env_samples['NO2'].values

print(f" Assigned environmental data RANDOMLY (no risk-label bias)")
print(f"   AQI   range: {patient_df['AQI'].min():.0f} – {patient_df['AQI'].max():.0f}")
print(f"   PM2.5 range: {patient_df['PM2_5'].min():.1f} – {patient_df['PM2_5'].max():.1f}")
print(f"   NO2   range: {patient_df['NO2'].min():.1f} – {patient_df['NO2'].max():.1f}")

print("\n--- Recalculating risk labels ---")

patient_df['risk_score'] = (
    (patient_df['AQI'] / 400)                              * 0.15 +
    (patient_df['pollen_count'] / 200)                     * 0.10 +
    (patient_df['PM2_5'] / 150)                            * 0.05 +
    (patient_df['wheezing'])                               * 0.25 +
    (patient_df['chest_tightness'])                        * 0.20 +
    (patient_df['breathing_difficulty'] / 3)              * 0.20 +
    (patient_df['inhaler_usage'] / 5)                      * 0.05
).clip(0, 1)

patient_df['risk_label'] = patient_df['risk_score'].apply(score_to_label)

# Clinical overrides — same as step1 and step1b
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

# 4. FINAL STATS
print(f"\n Final Dataset Summary:")
print(f"   Total records : {len(patient_df)}")

print(f"\n Risk Label Distribution:")
dist  = patient_df['risk_label'].value_counts()
total = len(patient_df)
for label, count in dist.items():
    bar = "█" * int(count / total * 40)
    print(f"   {label:6} : {count:4} ({count/total:.1%})  {bar}")

# 5. SAVE
patient_df.to_csv('data/asthma_dataset.csv', index=False)
print(f"\n Saved: data/asthma_dataset.csv")