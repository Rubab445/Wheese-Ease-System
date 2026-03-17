# STEP 1B : COMBINE REAL + SYNTHETIC DATASETS
import pandas as pd
import numpy as np

print("=" * 55)
print("STEP 1B: COMBINING REAL + SYNTHETIC DATASETS")
print("=" * 55)

try:
    real_df = pd.read_csv('data/asthma_disease_data.csv')
    print(f"\n Real dataset loaded     : {real_df.shape[0]} rows")
except FileNotFoundError:
    print(" asthma_disease_data.csv not found in data/ folder")
    exit()

try:
    synthetic_df = pd.read_csv('data/asthma_dataset.csv')
    print(f" Synthetic dataset loaded : {synthetic_df.shape[0]} rows")
except FileNotFoundError:
    print(" asthma_dataset.csv not found! Run step1 first.")
    exit()

print("\n--- Mapping real dataset columns ---")
mapped_df = pd.DataFrame()

mapped_df['AQI']          = (real_df['PollutionExposure'] * 40).clip(0, 400).round()
mapped_df['pollen_count'] = (real_df['PollenExposure'] * 20).clip(0, 200).round()
mapped_df['humidity']     = (real_df['PollutionExposure'] * 3 + real_df['DustExposure'] * 2 + 40).clip(20, 100).round()
mapped_df['PM2_5']        = (real_df['PollutionExposure'] * 12).clip(5, 150).round(1)
mapped_df['NO2']          = (real_df['PollutionExposure'] * 15 + real_df['Smoking'] * 20).clip(10, 200).round(1)
np.random.seed(42)
mapped_df['temperature']  = np.random.randint(10, 40, len(real_df))

mapped_df['wheezing']             = real_df['Wheezing'].astype(int)
mapped_df['coughing']             = real_df['Coughing'].astype(int)
mapped_df['chest_tightness']      = real_df['ChestTightness'].astype(int)
mapped_df['medication_adherence'] = (real_df['SleepQuality'] > 5).astype(int)
mapped_df['past_attacks']         = (real_df['Diagnosis'].astype(int) * 3 + real_df['HistoryOfAllergies'].astype(int) * 2).clip(0, 9)
mapped_df['inhaler_usage']        = (real_df['Wheezing'] + real_df['ShortnessOfBreath'] + real_df['ChestTightness'] + real_df['NighttimeSymptoms']).clip(0, 5)
mapped_df['breathing_difficulty'] = pd.cut(real_df['ShortnessOfBreath'].astype(int) + real_df['ExerciseInduced'].astype(int), bins=[-1, 0, 1, 3], labels=[1, 2, 3]).astype(int)

# NEW clinical features
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

print(" Mapped 10 new clinical features:")
new_features = ['lung_function_fev1','lung_function_fvc','bmi','smoking',
                'physical_activity','family_history_asthma','history_of_allergies',
                'dust_exposure','hay_fever','eczema']
for f in new_features:
    print(f"   + {f}")

symptom_score = (
    real_df['Wheezing'].astype(int)            * 0.15 +
    real_df['ShortnessOfBreath'].astype(int)   * 0.12 +
    real_df['ChestTightness'].astype(int)      * 0.12 +
    real_df['Coughing'].astype(int)            * 0.08 +
    real_df['NighttimeSymptoms'].astype(int)   * 0.08 +
    real_df['ExerciseInduced'].astype(int)     * 0.08 +
    (real_df['PollutionExposure'] / 10)        * 0.08 +
    real_df['Diagnosis'].astype(int)           * 0.10 +
    real_df['Smoking'].astype(int)             * 0.05 +
    real_df['FamilyHistoryAsthma'].astype(int) * 0.05 +
    real_df['HayFever'].astype(int)            * 0.04 +
    (1 - real_df['LungFunctionFEV1'] / 4.0)   * 0.05
).clip(0, 1)

def score_to_label(score):
    if score < 0.3:   return 'low'
    elif score < 0.7: return 'medium'
    else:             return 'high'

mapped_df['risk_score'] = symptom_score
mapped_df['risk_label'] = symptom_score.apply(score_to_label)

print("\n--- Adding new features to synthetic dataset ---")
n = len(synthetic_df)
np.random.seed(123)
synthetic_df['lung_function_fev1']    = np.round(np.random.uniform(1.0, 4.0, n), 3)
synthetic_df['lung_function_fvc']     = np.round(np.random.uniform(1.5, 6.0, n), 3)
synthetic_df['bmi']                   = np.round(np.random.uniform(15, 40, n), 2)
synthetic_df['smoking']               = np.random.randint(0, 2, n)
synthetic_df['physical_activity']     = np.round(np.random.uniform(0, 10, n), 2)
synthetic_df['family_history_asthma'] = np.random.randint(0, 2, n)
synthetic_df['history_of_allergies']  = np.random.randint(0, 2, n)
synthetic_df['dust_exposure']         = np.round(np.random.uniform(0, 10, n), 2)
synthetic_df['hay_fever']             = np.random.randint(0, 2, n)
synthetic_df['eczema']                = np.random.randint(0, 2, n)
print(" New features added to synthetic data")

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

feature_cols = [c for c in combined_df.columns if c not in ['risk_score','risk_label']]
print(f"\n All Features ({len(feature_cols)} total):")
for i, col in enumerate(feature_cols, 1):
    print(f"   {i:2}. {col}")

print(f"\n Risk Label Distribution:")
dist  = combined_df['risk_label'].value_counts()
total = len(combined_df)
for label, count in dist.items():
    bar = "█" * int(count / total * 40)
    print(f"   {label:6} : {count:4} ({count/total:.1%})  {bar}")

combined_df.to_csv('data/asthma_dataset.csv', index=False)
print(f"\n Saved: data/asthma_dataset.csv")
