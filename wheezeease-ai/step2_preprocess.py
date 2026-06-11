import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import pickle

print("STEP 2: DATA PREPROCESSING")

# 2.1 LOAD DATA
df = pd.read_csv('data/asthma_dataset.csv')
print(f"\n Loaded dataset: {df.shape[0]} rows, {df.shape[1]} columns")

# 2.2 DATA CLEANING
print("\n--- 2.2 Data Cleaning ---")

missing = df.isnull().sum()
print(f"Missing values found:\n{missing[missing > 0]}")

for col in df.select_dtypes(include=[np.number]).columns:
    if df[col].isnull().any():
        df[col].fillna(df[col].mean(), inplace=True)
        print(f"   Filled missing values in '{col}' with mean")

before = len(df)
df.drop_duplicates(inplace=True)
after = len(df)
print(f"Removed {before - after} duplicate rows")

df = df[df['AQI'] >= 0]
df = df[df['humidity'].between(0, 100)]
df = df[df['breathing_difficulty'].between(1, 3)]
print(f"Rows after cleaning: {len(df)}")

# 2.3 FEATURE ENGINEERING
print("\n--- 2.3 Feature Engineering ---")

df['env_risk_index'] = (
    (df['AQI'] / 400)           * 0.40 +
    (df['pollen_count'] / 200)  * 0.30 +
    (df['humidity'] / 100)      * 0.20 +
    (df['temperature'] / 45)    * 0.10          # <-- LOCKED: do not change
)
print(" Created: env_risk_index  [temperature/45 normalization]")

df['symptom_severity'] = (
    df['wheezing'] +
    df['coughing'] +
    df['chest_tightness'] +
    (df['breathing_difficulty'] - 1) / 2
)
print(" Created: symptom_severity")

df['pollution_combo'] = df['PM2_5'] * 0.6 + df['NO2'] * 0.4
print(" Created: pollution_combo")

df['inhaler_overuse'] = (df['inhaler_usage'] >= 3).astype(int)
print(" Created: inhaler_overuse (1 if used 3+ times)")

print("\n--- Checking dust_exposure ---")
print("Missing dust_exposure values:", df['dust_exposure'].isnull().sum())
print(df['dust_exposure'].describe())

# 2.4 SELECT FINAL FEATURES
feature_columns = [
    # Environmental
    'AQI', 'pollen_count', 'humidity', 'temperature',
    'PM2_5', 'NO2', 'dust_exposure',
    # Core symptoms
    'wheezing', 'coughing', 'chest_tightness',
    'inhaler_usage', 'breathing_difficulty', 'medication_adherence',
    'past_attacks',
    # Clinical features
    'lung_function_fev1', 'lung_function_fvc',
    'bmi', 'smoking', 'physical_activity',
    'family_history_asthma', 'history_of_allergies',
    'hay_fever', 'eczema',
    # Engineered features
    'env_risk_index', 'symptom_severity', 'pollution_combo', 'inhaler_overuse'
]

X = df[feature_columns]
y_label = df['risk_label']

# 2.5 ENCODE LABELS
label_map = {'low': 0, 'medium': 1, 'high': 2}
y = y_label.map(label_map)

print(f"\nLabel encoding: {label_map}")
print(f"Class distribution:\n{y.value_counts().sort_index().rename({0:'low',1:'medium',2:'high'}).to_string()}")

# 2.6 FEATURE SCALING
print("\n--- 2.6 Feature Scaling ---")
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
print(" Applied StandardScaler to all features")

# 2.7 TRAIN / TEST SPLIT + SMOTE
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)
print("\n--- Balancing classes with SMOTE ---")
print(f"Before SMOTE: {dict(pd.Series(y_train).value_counts().sort_index())}")

smote = SMOTE(random_state=42)
X_train, y_train = smote.fit_resample(X_train, y_train)

print(f"After SMOTE:  {dict(pd.Series(y_train).value_counts().sort_index())}")
print(" Classes are now balanced")

print(f"\n Train/Test Split:")
print(f"   Training samples : {len(X_train)} (80%)")
print(f"   Testing samples  : {len(X_test)}  (20%)")

# 2.8 SAVE PROCESSED DATA
with open('data/processed_data.pkl', 'wb') as f:
    pickle.dump({
        'X_train': X_train,
        'X_test':  X_test,
        'y_train': y_train,
        'y_test':  y_test,
        'feature_columns': feature_columns,
        'label_map': label_map
    }, f)

with open('data/scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)

print("\n Saved: data/processed_data.pkl")
print(" Saved: data/scaler.pkl")