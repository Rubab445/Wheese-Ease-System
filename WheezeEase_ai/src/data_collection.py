"""
Step 1: Data Collection
Creates synthetic training dataset with realistic patterns
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os

class DataCollector:
    def __init__(self, n_samples=500, n_patients=50):
        self.n_samples = n_samples
        self.n_patients = n_patients
        self.seed = 42
        random.seed(self.seed)
        np.random.seed(self.seed)
        
    def create_training_dataset(self):
        
        print("="*60)
        print("STEP 1: DATA COLLECTION")
        print("="*60)
        print(f"\nGenerating {self.n_samples} records for {self.n_patients} patients...")
        
        data = []
        
        for i in range(self.n_samples):
            record = self._generate_single_record(i)
            data.append(record)
        
        df = pd.DataFrame(data)
        
        # Save to CSV
        os.makedirs('data/raw', exist_ok=True)
        filepath = 'data/raw/training_data.csv'
        df.to_csv(filepath, index=False)
        
        # Display statistics
        self._display_statistics(df)
        
        print(f"\n✓ Dataset saved to: {filepath}")
        print(f"✓ Total records: {len(df)}")
        
        return df
    
    def _generate_single_record(self, index):
        """Generate a single patient record with realistic correlations"""
        
        # Patient Demographics
        age = random.randint(5, 70)
        has_asthma = random.choice([0, 1])
        severity = random.choices([0, 1, 2], weights=[0.4, 0.4, 0.2])[0]  # More mild/moderate
        
        # Allergies (correlated)
        allergy_pollen = random.choice([0, 1])
        allergy_dust = random.choice([0, 1])
        allergy_pollution = random.choice([0, 1])
        allergy_pets = random.choice([0, 1])
        
        # Environmental Data (realistic ranges for Pakistan)
        month = random.randint(1, 12)
        is_spring = 1 if month in [3, 4, 5] else 0
        is_winter = 1 if month in [12, 1, 2] else 0
        
        # Temperature varies by season
        if is_spring:
            temperature = round(random.uniform(20, 35), 1)
        elif is_winter:
            temperature = round(random.uniform(8, 20), 1)
        else:
            temperature = round(random.uniform(25, 40), 1)
        
        humidity = round(random.uniform(20, 90), 1)
        aqi = random.choices([1, 2, 3, 4, 5], weights=[0.1, 0.2, 0.3, 0.3, 0.1])[0]
        
        # Higher pollen in spring
        if is_spring:
            pollen_level = random.choices([0, 1, 2], weights=[0.2, 0.3, 0.5])[0]
        else:
            pollen_level = random.choices([0, 1, 2], weights=[0.5, 0.3, 0.2])[0]
        
        # Symptoms (correlated with environmental factors and patient profile)
        base_symptom_probability = 0.3
        if aqi >= 4:
            base_symptom_probability += 0.3
        if pollen_level == 2 and allergy_pollen:
            base_symptom_probability += 0.3
        if has_asthma:
            base_symptom_probability += 0.2
        
        symptom_wheezing = random.randint(0, int(7 * min(base_symptom_probability, 1.0)))
        symptom_coughing = random.randint(0, int(7 * min(base_symptom_probability, 1.0)))
        symptom_shortness_breath = random.randint(0, int(7 * min(base_symptom_probability, 1.0)))
        symptom_chest_tightness = random.randint(0, int(7 * min(base_symptom_probability, 1.0)))
        
        # Medication Usage (higher if more symptoms)
        total_symptoms = symptom_wheezing + symptom_coughing + symptom_shortness_breath + symptom_chest_tightness
        inhaler_usage_week = int(total_symptoms * random.uniform(0.3, 0.8))
        medication_adherence = round(random.uniform(0.5, 1.0), 2)
        
        record = {
            # Patient Info
            'patient_id': f'P{index % self.n_patients:03d}',
            'age': age,
            'gender': random.choice([0, 1]),  # 0=Male, 1=Female
            'has_asthma': has_asthma,
            'severity': severity,
            
            # Allergies
            'allergy_pollen': allergy_pollen,
            'allergy_dust': allergy_dust,
            'allergy_pollution': allergy_pollution,
            'allergy_pets': allergy_pets,
            
            # Environmental
            'temperature': temperature,
            'humidity': humidity,
            'aqi': aqi,
            'pollen_level': pollen_level,
            
            # Symptoms (days per week)
            'symptom_wheezing': symptom_wheezing,
            'symptom_coughing': symptom_coughing,
            'symptom_shortness_breath': symptom_shortness_breath,
            'symptom_chest_tightness': symptom_chest_tightness,
            
            # Medication
            'inhaler_usage_week': inhaler_usage_week,
            'medication_adherence': medication_adherence,
            
            # Time features
            'month': month,
            'is_spring': is_spring,
            'is_winter': is_winter,
        }
        
        # Calculate Risk Level (TARGET)
        record['risk_level'] = self._calculate_risk_level(record)
        
        return record
    
    def _calculate_risk_level(self, record):
        """Calculate risk level based on multiple factors"""
        
        risk_score = 0
        
        # Environmental factors (40% weight)
        if record['aqi'] >= 4:
            risk_score += 3
        elif record['aqi'] == 3:
            risk_score += 1
        
        if record['pollen_level'] == 2:
            risk_score += 2
            if record['allergy_pollen']:
                risk_score += 1
        elif record['pollen_level'] == 1:
            risk_score += 1
        
        if record['humidity'] < 30 or record['humidity'] > 80:
            risk_score += 1
        
        # Symptom frequency (30% weight)
        symptom_sum = (
            record['symptom_wheezing'] + 
            record['symptom_coughing'] + 
            record['symptom_shortness_breath'] + 
            record['symptom_chest_tightness']
        )
        
        if symptom_sum > 18:
            risk_score += 3
        elif symptom_sum > 10:
            risk_score += 2
        elif symptom_sum > 5:
            risk_score += 1
        
        # Inhaler usage (20% weight)
        if record['inhaler_usage_week'] > 10:
            risk_score += 2
        elif record['inhaler_usage_week'] > 5:
            risk_score += 1
        
        # Patient profile (10% weight)
        risk_score += record['severity']
        if record['has_asthma']:
            risk_score += 1
        
        # Determine final risk level
        if risk_score >= 8:
            return 2  # High Risk
        elif risk_score >= 4:
            return 1  # Medium Risk
        else:
            return 0  # Low Risk
    
    def _display_statistics(self, df):
        """Display dataset statistics"""
        
        print("\n" + "="*60)
        print("DATASET STATISTICS")
        print("="*60)
        
        print(f"\nShape: {df.shape}")
        print(f"Features: {df.shape[1]}")
        
        print("\n--- Risk Level Distribution ---")
        risk_dist = df['risk_level'].value_counts().sort_index()
        for level, count in risk_dist.items():
            level_name = ['Low', 'Medium', 'High'][level]
            percentage = (count / len(df)) * 100
            print(f"{level_name:8s}: {count:3d} ({percentage:5.1f}%)")
        
        print("\n--- Asthma Distribution ---")
        print(f"Has Asthma: {df['has_asthma'].sum()} ({df['has_asthma'].mean()*100:.1f}%)")
        
        print("\n--- Environmental Ranges ---")
        print(f"Temperature: {df['temperature'].min():.1f}°C - {df['temperature'].max():.1f}°C")
        print(f"Humidity: {df['humidity'].min():.1f}% - {df['humidity'].max():.1f}%")
        print(f"AQI: {df['aqi'].min()} - {df['aqi'].max()}")
        
        print("\n--- Missing Values ---")
        missing = df.isnull().sum().sum()
        print(f"Total missing values: {missing}")


if __name__ == "__main__":
    collector = DataCollector(n_samples=500, n_patients=50)
    df = collector.create_training_dataset()
    
