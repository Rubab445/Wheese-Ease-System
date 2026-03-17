import pandas as pd
import numpy as np

np.random.seed(42)
n = 1000  # number of patient records

print("Generating dataset...")

# ---- Create raw patient + environment data ----
data = {
    # Environmental features
    'AQI':                  np.random.randint(20, 400, n),
    'pollen_count':         np.random.randint(0, 200, n),
    'humidity':             np.random.randint(20, 100, n),
    'temperature':          np.random.randint(5, 45, n),
    'PM2_5':                np.round(np.random.uniform(5, 150, n), 2),
    'NO2':                  np.round(np.random.uniform(10, 200, n), 2),

    # Patient health features
    'wheezing':             np.random.randint(0, 2, n),       # 0=no, 1=yes
    'coughing':             np.random.randint(0, 2, n),       # 0=no, 1=yes
    'chest_tightness':      np.random.randint(0, 2, n),       # 0=no, 1=yes
    'inhaler_usage':        np.random.randint(0, 6, n),       # times used today
    'breathing_difficulty': np.random.randint(1, 4, n),       # 1=mild, 2=moderate, 3=severe
    'medication_adherence': np.random.randint(0, 2, n),       # 0=no, 1=yes
    'past_attacks':         np.random.randint(0, 10, n),      # number of past attacks
}

df = pd.DataFrame(data)

# ---- Create risk score using domain logic ----
# Higher AQI, pollen, symptoms = higher risk
df['risk_score'] = (
    (df['AQI'] / 400)                    * 0.25 +
    (df['pollen_count'] / 200)           * 0.15 +
    (df['PM2_5'] / 150)                  * 0.10 +
    (df['wheezing'])                     * 0.15 +
    (df['chest_tightness'])              * 0.10 +
    (df['breathing_difficulty'] / 3)     * 0.15 +
    (df['inhaler_usage'] / 5)            * 0.10
).clip(0, 1)  # keep between 0 and 1

# ---- Convert score to label ----
def score_to_label(score):
    if score < 0.3:
        return 'low'
    elif score < 0.7:
        return 'medium'
    else:
        return 'high'

df['risk_label'] = df['risk_score'].apply(score_to_label)

# ---- Save to CSV ----
df.to_csv('data/asthma_dataset.csv', index=False)

# ---- Summary ----
print("\n Dataset created: data/asthma_dataset.csv")
print(f"   Total records   : {len(df)}")
print(f"   Features        : {len(df.columns) - 2}")
print("\n Risk Label Distribution:")
print(df['risk_label'].value_counts().to_string())
print("\n Sample Data (first 3 rows):")
print(df.head(3).to_string())
