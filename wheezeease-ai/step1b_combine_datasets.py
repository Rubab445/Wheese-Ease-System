import pandas as pd
import numpy as np

print("STEP 1B: COMBINING REAL + SYNTHETIC DATASETS")

try:
    real_df = pd.read_csv('data/asthma_disease_data.csv')
    print(f"\n Real dataset loaded      : {real_df.shape[0]} rows")
except FileNotFoundError:
    print(" asthma_disease_data.csv not found in data/ folder")
    exit()

try:
    synthetic_df = pd.read_csv('data/asthma_dataset.csv')
    print(f" Synthetic dataset loaded : {synthetic_df.shape[0]} rows")
except FileNotFoundError:
    print(" asthma_dataset.csv not found! Run step1 first.")
    exit()

def score_to_label(score):
    if score < 0.25:   return 'low'
    elif score < 0.55: return 'medium'
    else:              return 'high'

print("\n--- Mapping real dataset columns ---")
mapped_df = pd.DataFrame()

# Environmental features
mapped_df['AQI']          = (real_df['PollutionExposure'] * 40).clip(0, 400).round()
mapped_df['pollen_count'] = (real_df['PollenExposure'] * 20).clip(0, 200).round()
mapped_df['humidity']     = (real_df['PollutionExposure'] * 3 + real_df['DustExposure'] * 2 + 40).clip(20, 100).round()
mapped_df['PM2_5']        = (real_df['PollutionExposure'] * 12).clip(5, 150).round(1)
mapped_df['NO2']          = (real_df['PollutionExposure'] * 15 + real_df['Smoking'] * 20).clip(10, 200).round(1)
np.random.seed(42)
mapped_df['temperature']  = np.random.randint(10, 40, len(real_df))

# Symptom features
mapped_df['wheezing']             = real_df['Wheezing'].astype(int)
mapped_df['coughing']             = real_df['Coughing'].astype(int)
mapped_df['chest_tightness']      = real_df['ChestTightness'].astype(int)
mapped_df['medication_adherence'] = (real_df['SleepQuality'] > 5).astype(int)
mapped_df['past_attacks']         = (real_df['Diagnosis'].astype(int) * 3 + real_df['HistoryOfAllergies'].astype(int) * 2).clip(0, 9)
mapped_df['inhaler_usage']        = (real_df['Wheezing'] + real_df['ShortnessOfBreath'] + real_df['ChestTightness'] + real_df['NighttimeSymptoms']).clip(0, 5)
mapped_df['breathing_difficulty'] = pd.cut(
    real_df['ShortnessOfBreath'].astype(int) + real_df['ExerciseInduced'].astype(int),
    bins=[-1, 0, 1, 3], labels=[1, 2, 3]
).astype(int)

# Clinical features — from real data directly (these are real measurements, no randomness)
mapped_df['lung_function_fev1']    = real_df['LungFunctionFEV1'].round(3)
mapped_df['lung_function_fvc']     = real_df['LungFunctionFVC'].round(3)
mapped_df['bmi']                   = real_df['BMI'].round(2)
mapped_df['smoking']               = real_df['Smoking'].astype(int)
mapped_df['physical_activity']     = real_df['PhysicalActivity'].round(2)
mapped_df['family_history_asthma'] = real_df['FamilyHistoryAsthma'].astype(int)
mapped_df['history_of_allergies']  = real_df['HistoryOfAllergies'].astype(int)
mapped_df['dust_exposure']         = real_df['DustExposure'].round(2)
mapped_df['hay_fever']             = real_df['HayFever'].astype(int)
mapped_df['eczema']                = real_df['Eczema'].astype(int)

print(" Mapped 10 clinical features from real dataset")

symptom_score = (
    (mapped_df['AQI'] / 400)                              * 0.15 +
    (mapped_df['pollen_count'] / 200)                     * 0.10 +
    (mapped_df['PM2_5'] / 150)                            * 0.05 +
    (mapped_df['wheezing'])                               * 0.25 +
    (mapped_df['chest_tightness'])                        * 0.20 +
    (mapped_df['breathing_difficulty'] / 3)              * 0.20 +
    (mapped_df['inhaler_usage'] / 5)                      * 0.05
).clip(0, 1)

mapped_df['risk_score'] = symptom_score
mapped_df['risk_label'] = symptom_score.apply(score_to_label)

# Clinical overrides — same conditions as step1 and step1c
high_risk_mask = (
    ((real_df['Wheezing'] == 1) &
     (real_df['ShortnessOfBreath'] == 1) &
     (real_df['NighttimeSymptoms'] == 1)) |
    ((real_df['LungFunctionFEV1'] < 1.5) &
     (real_df['Wheezing'] == 1)) |
    ((real_df['Diagnosis'] == 1) &
     (real_df['Wheezing'] == 1) &
     (real_df['ShortnessOfBreath'] == 1) &
     (real_df['ChestTightness'] == 1)) |
    ((real_df['ExerciseInduced'] == 1) &
     (real_df['Wheezing'] == 1) &
     (real_df['NighttimeSymptoms'] == 1) &
     (real_df['Diagnosis'] == 1))
)
low_risk_mask = (
    (real_df['Wheezing'] == 0) &
    (real_df['ShortnessOfBreath'] == 0) &
    (real_df['ChestTightness'] == 0) &
    (real_df['NighttimeSymptoms'] == 0) &
    (real_df['LungFunctionFEV1'] > 3.0) &
    (real_df['Diagnosis'] == 0)
)

mapped_df.loc[high_risk_mask, 'risk_label'] = 'high'
mapped_df.loc[low_risk_mask,  'risk_label'] = 'low'

print("\n--- Combining datasets ---")
synthetic_df['source'] = 'synthetic'
mapped_df['source']    = 'real'
combined_df = pd.concat([synthetic_df, mapped_df], ignore_index=True)
combined_df.drop(columns=['source'], inplace=True)

before = len(combined_df)
combined_df.dropna(inplace=True)
combined_df.drop_duplicates(inplace=True)
print(f" Removed {before - len(combined_df)} bad rows")
print(f" Final: {len(combined_df)} rows × {len(combined_df.columns)} columns")

print(f"\n Risk Label Distribution:")
dist  = combined_df['risk_label'].value_counts()
total = len(combined_df)
for label, count in dist.items():
    bar = "█" * int(count / total * 40)
    print(f"   {label:6} : {count:4} ({count/total:.1%})  {bar}")

combined_df.to_csv('data/asthma_dataset.csv', index=False)
print(f"\n Saved: data/asthma_dataset.csv")