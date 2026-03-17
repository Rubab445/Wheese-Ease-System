# STEP 1: GENERATE SYNTHETIC DATASET

import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

print("Generating dataset...")

# ---- Define label function FIRST before using it ----
def score_to_label(score):
    if score < 0.25:
        return 'low'
    elif score < 0.55:
        return 'medium'
    else:
        return 'high'

# ---- Create raw patient + environment data ----
data = {
    'AQI':                  np.random.randint(20, 400, n),
    'pollen_count':         np.random.randint(0, 200, n),
    'humidity':             np.random.randint(20, 100, n),
    'temperature':          np.random.randint(5, 45, n),
    'PM2_5':                np.round(np.random.uniform(5, 150, n), 2),
    'NO2':                  np.round(np.random.uniform(10, 200, n), 2),
    'wheezing':             np.random.randint(0, 2, n),
    'coughing':             np.random.randint(0, 2, n),
    'chest_tightness':      np.random.randint(0, 2, n),
    'inhaler_usage':        np.random.randint(0, 6, n),
    'breathing_difficulty': np.random.randint(1, 4, n),
    'medication_adherence': np.random.randint(0, 2, n),
    'past_attacks':         np.random.randint(0, 10, n),
}

df = pd.DataFrame(data)

# ---- Create risk score ----
df['risk_score'] = (
    (df['AQI'] / 400)                * 0.15 +
    (df['pollen_count'] / 200)       * 0.10 +
    (df['PM2_5'] / 150)              * 0.05 +
    (df['wheezing'])                 * 0.25 +
    (df['chest_tightness'])          * 0.20 +
    (df['breathing_difficulty'] / 3) * 0.20 +
    (df['inhaler_usage'] / 5)        * 0.05
).clip(0, 1)

# ---- Apply score-based labels ----
df['risk_label'] = df['risk_score'].apply(score_to_label)

# ---- Clinical override rules ----
high_mask = (
    (df['wheezing'] == 1) &
    (df['breathing_difficulty'] == 3) &
    (df['inhaler_usage'] >= 4)
)

low_mask = (
    (df['wheezing'] == 0) &
    (df['chest_tightness'] == 0) &
    (df['breathing_difficulty'] == 1) &
    (df['inhaler_usage'] == 0)
)

df.loc[high_mask, 'risk_label'] = 'high'
df.loc[low_mask,  'risk_label'] = 'low'

# ---- Save ----
df.to_csv('data/asthma_dataset.csv', index=False)

print("\n Dataset created: data/asthma_dataset.csv")
print(f"   Total records : {len(df)}")
print(f"   Features      : {len(df.columns) - 2}")
print("\n Risk Label Distribution:")
dist  = df['risk_label'].value_counts()
total = len(df)
for label, count in dist.items():
    bar = "█" * int(count / total * 40)
    print(f"   {label:6} : {count:4} ({count/total:.1%})  {bar}")