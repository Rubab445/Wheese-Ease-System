# STEP 1: GENERATE SYNTHETIC DATASET 

import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000

print("STEP 1: GENERATING SYNTHETIC DATASET")


AQI           = np.random.randint(20, 400, n).astype(float)
pollen_count  = np.random.randint(0, 200, n).astype(float)
humidity      = np.random.randint(20, 100, n).astype(float)
temperature   = np.random.randint(5, 45, n).astype(float)
PM2_5         = np.round(np.random.uniform(5, 150, n), 2)
NO2           = np.round(np.random.uniform(10, 200, n), 2)

# Pollution pressure (0-1 scale) — drives respiratory symptoms
pollution_pressure = (AQI / 400) * 0.6 + (PM2_5 / 150) * 0.4

# Wheezing: base 30% chance, goes up to ~75% at max pollution
wheeze_prob = np.clip(0.30 + pollution_pressure * 0.45, 0, 1)
wheezing    = (np.random.uniform(0, 1, n) < wheeze_prob).astype(int)

# Chest tightness: correlated with wheezing (if wheezing, 65% chance of tightness)
tight_prob      = np.where(wheezing == 1,
                            np.clip(0.45 + pollution_pressure * 0.20, 0, 1),
                            np.clip(0.10 + pollution_pressure * 0.15, 0, 1))
chest_tightness = (np.random.uniform(0, 1, n) < tight_prob).astype(int)

# Coughing: correlated with both pollution and wheezing
cough_prob = np.clip(0.25 + pollution_pressure * 0.30 + wheezing * 0.20, 0, 1)
coughing   = (np.random.uniform(0, 1, n) < cough_prob).astype(int)

# Breathing difficulty: 1=mild, 2=moderate, 3=severe
# Driven by wheezing + chest tightness combo
severity_score = wheezing * 0.5 + chest_tightness * 0.3 + pollution_pressure * 0.2
bd_probs = np.column_stack([
    np.clip(1 - severity_score * 1.2, 0.1, 1),   # P(mild)
    np.clip(severity_score * 0.8, 0.1, 0.8),      # P(moderate)
    np.clip(severity_score * 0.4, 0, 0.5),         # P(severe)
])
bd_probs = bd_probs / bd_probs.sum(axis=1, keepdims=True)  # normalize rows
breathing_difficulty = np.array([
    np.random.choice([1, 2, 3], p=bd_probs[i]) for i in range(n)
])

# Inhaler usage: high when symptomatic — FEV1 low patients use more
# (FEV1 generated below, so proxy here: severe breathing → more inhaler use)
inhaler_base = np.where(breathing_difficulty == 3, 3,
               np.where(breathing_difficulty == 2, 1, 0))
inhaler_noise   = np.random.randint(0, 3, n)
inhaler_usage   = np.clip(inhaler_base + inhaler_noise, 0, 5)

# Medication adherence: slightly inversely correlated with severity
# (sicker patients sometimes miss medication)
med_prob           = np.clip(0.75 - severity_score * 0.30, 0.3, 0.9)
medication_adherence = (np.random.uniform(0, 1, n) < med_prob).astype(int)

# Past attacks: correlated with chronic severity
past_attacks = np.clip(
    (breathing_difficulty - 1) * 2 + wheezing * 2 + np.random.randint(0, 4, n),
    0, 9
)

# FEV1: lower when more symptomatic (high wheeze/severity → lower lung function)
fev1_base = np.clip(3.5 - severity_score * 2.0, 1.0, 4.0)
lung_function_fev1 = np.round(
    np.clip(fev1_base + np.random.normal(0, 0.3, n), 0.8, 4.2), 3
)

# FVC: loosely follows FEV1 (FVC always >= FEV1 clinically)
lung_function_fvc = np.round(
    np.clip(lung_function_fev1 + np.random.uniform(0.3, 1.8, n), 1.5, 6.0), 3
)

# BMI: mild correlation with breathing difficulty
bmi = np.round(np.clip(
    22 + (breathing_difficulty - 1) * 3 + np.random.normal(0, 4, n),
    15, 45
), 2)

# Smoking: independent but increases pollution pressure effect
smoking = np.random.randint(0, 2, n)

# Physical activity: inversely correlated with severity
activity_base = np.clip(8 - severity_score * 6, 1, 10)
physical_activity = np.round(
    np.clip(activity_base + np.random.normal(0, 1.5, n), 0, 10), 2
)

# Binary risk factors: independent (no strong correlation needed)
family_history_asthma = np.random.randint(0, 2, n)
history_of_allergies  = np.random.randint(0, 2, n)
dust_exposure         = np.round(np.random.uniform(0, 10, n), 2)
hay_fever             = np.random.randint(0, 2, n)
eczema                = np.random.randint(0, 2, n)

risk_score = (
    (AQI / 400)                              * 0.15 +
    (pollen_count / 200)                     * 0.10 +
    (PM2_5 / 150)                            * 0.05 +
    (wheezing)                               * 0.25 +
    (chest_tightness)                        * 0.20 +
    (breathing_difficulty / 3)              * 0.20 +
    (inhaler_usage / 5)                      * 0.05
).clip(0, 1)

def score_to_label(score):
    if score < 0.25:   return 'low'
    elif score < 0.55: return 'medium'
    else:              return 'high'

risk_label = pd.Series(risk_score).apply(score_to_label)

# Clinical overrides — same logic that step1b/1c use, consistent
high_mask = (
    (wheezing == 1) &
    (breathing_difficulty == 3) &
    (inhaler_usage >= 4)
)
low_mask = (
    (wheezing == 0) &
    (chest_tightness == 0) &
    (breathing_difficulty == 1) &
    (inhaler_usage == 0)
)
risk_label[high_mask] = 'high'
risk_label[low_mask]  = 'low'

# ─────────────────────────────────────────────
# BUILD DATAFRAME
# ─────────────────────────────────────────────
df = pd.DataFrame({
    'AQI':                  AQI,
    'pollen_count':         pollen_count,
    'humidity':             humidity,
    'temperature':          temperature,
    'PM2_5':                PM2_5,
    'NO2':                  NO2,
    'wheezing':             wheezing,
    'coughing':             coughing,
    'chest_tightness':      chest_tightness,
    'inhaler_usage':        inhaler_usage,
    'breathing_difficulty': breathing_difficulty,
    'medication_adherence': medication_adherence,
    'past_attacks':         past_attacks,
    'lung_function_fev1':   lung_function_fev1,
    'lung_function_fvc':    lung_function_fvc,
    'bmi':                  bmi,
    'smoking':              smoking,
    'physical_activity':    physical_activity,
    'family_history_asthma': family_history_asthma,
    'history_of_allergies': history_of_allergies,
    'dust_exposure':        dust_exposure,
    'hay_fever':            hay_fever,
    'eczema':               eczema,
    'risk_score':           risk_score,
    'risk_label':           risk_label
})

df.to_csv('data/asthma_dataset.csv', index=False)

print(f"\n Dataset created: data/asthma_dataset.csv")
print(f"   Total records : {len(df)}")
print(f"   Features      : {len(df.columns) - 2}")

print(f"\n Risk Label Distribution:")
dist  = df['risk_label'].value_counts()
total = len(df)
for label, count in dist.items():
    bar = "█" * int(count / total * 40)
    print(f"   {label:6} : {count:4} ({count/total:.1%})  {bar}")

print(f"\n Clinical Correlation Check (sanity):")
print(f"   High AQI(>200) → wheeze rate  : {df[df['AQI']>200]['wheezing'].mean():.1%}  (should be >50%)")
print(f"   Low AQI(<100)  → wheeze rate  : {df[df['AQI']<100]['wheezing'].mean():.1%}  (should be <40%)")
print(f"   Wheezing=1     → avg FEV1     : {df[df['wheezing']==1]['lung_function_fev1'].mean():.2f}  (should be <2.5)")
print(f"   Wheezing=0     → avg FEV1     : {df[df['wheezing']==0]['lung_function_fev1'].mean():.2f}  (should be >2.5)")