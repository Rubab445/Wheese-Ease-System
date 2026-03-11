"""
Step 2: Data Preparation & Cleaning
Prepares data for machine learning models
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

class DataPreparator:
    def __init__(self, data_path='data/raw/training_data.csv'):
        self.data_path = data_path
        self.scaler = StandardScaler()
        self.feature_columns = None
        
    def prepare_data(self):
        """Main data preparation pipeline"""
        
        print("="*60)
        print("STEP 2: DATA PREPARATION & CLEANING")
        print("="*60)
        
        # 1. Load data
        print("\n1. Loading data...")
        df = pd.read_csv(self.data_path)
        print(f"   ✓ Loaded {len(df)} records")
        
        # 2. Handle missing values
        print("\n2. Checking for missing values...")
        missing = df.isnull().sum().sum()
        print(f"   Missing values: {missing}")
        
        if missing > 0:
            print("   Removing rows with missing values...")
            df = df.dropna()
            print(f"   ✓ Remaining records: {len(df)}")
        
        # 3. Remove duplicates
        print("\n3. Removing duplicates...")
        before = len(df)
        df = df.drop_duplicates()
        removed = before - len(df)
        print(f"   ✓ Removed {removed} duplicates")
        
        # 4. Feature selection
        print("\n4. Selecting features...")
        self.feature_columns = [
            'age', 'gender', 'has_asthma', 'severity',
            'allergy_pollen', 'allergy_dust', 'allergy_pollution', 'allergy_pets',
            'temperature', 'humidity', 'aqi', 'pollen_level',
            'symptom_wheezing', 'symptom_coughing', 
            'symptom_shortness_breath', 'symptom_chest_tightness',
            'inhaler_usage_week', 'medication_adherence',
            'month', 'is_spring', 'is_winter'
        ]
        
        X = df[self.feature_columns]
        y = df['risk_level']
        
        print(f"   ✓ Selected {len(self.feature_columns)} features")
        print(f"   Features: {', '.join(self.feature_columns[:5])}...")
        
        # 5. Train-test split
        print("\n5. Splitting data into train and test sets...")
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=0.2, 
            random_state=42, 
            stratify=y
        )
        
        print(f"   Training set: {X_train.shape[0]} samples")
        print(f"   Testing set: {X_test.shape[0]} samples")
        
        print("\n   Class distribution in training set:")
        for level in [0, 1, 2]:
            count = (y_train == level).sum()
            percentage = (count / len(y_train)) * 100
            level_name = ['Low', 'Medium', 'High'][level]
            print(f"   {level_name:8s}: {count:3d} ({percentage:5.1f}%)")
        
        # 6. Feature scaling
        print("\n6. Scaling features...")
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        print("   ✓ Applied StandardScaler normalization")
        
        # 7. Save processed data
        print("\n7. Saving processed data...")
        os.makedirs('data/processed', exist_ok=True)
        os.makedirs('data/models', exist_ok=True)
        
        np.save('data/processed/X_train.npy', X_train_scaled)
        np.save('data/processed/X_test.npy', X_test_scaled)
        np.save('data/processed/y_train.npy', y_train)
        np.save('data/processed/y_test.npy', y_test)
        
        # Save original (unscaled) for analysis
        X_train.to_csv('data/processed/X_train_original.csv', index=False)
        X_test.to_csv('data/processed/X_test_original.csv', index=False)
        
        # Save scaler and feature names
        joblib.dump(self.scaler, 'data/models/scaler.pkl')
        joblib.dump(self.feature_columns, 'data/models/feature_names.pkl')
        
        print("   ✓ Saved processed datasets")
        print("   ✓ Saved scaler model")
        print("   ✓ Saved feature names")
        
        # 8. Display summary
        self._display_summary(X_train_scaled, X_test_scaled, y_train, y_test)
        
        return X_train_scaled, X_test_scaled, y_train, y_test
    
    def _display_summary(self, X_train, X_test, y_train, y_test):
        """Display preparation summary"""
        
        print("\n" + "="*60)
        print("DATA PREPARATION SUMMARY")
        print("="*60)
        
        print(f"\nTraining Data Shape: {X_train.shape}")
        print(f"Testing Data Shape: {X_test.shape}")
        print(f"Number of Features: {X_train.shape[1]}")
        print(f"Number of Classes: {len(np.unique(y_train))}")
        
        print("\nFeature Scaling Applied:")
        print(f"  Mean: ~0 (normalized)")
        print(f"  Std: ~1 (standardized)")
        
        print("\nFiles Created:")
        print("  ✓ data/processed/X_train.npy")
        print("  ✓ data/processed/X_test.npy")
        print("  ✓ data/processed/y_train.npy")
        print("  ✓ data/processed/y_test.npy")
        print("  ✓ data/models/scaler.pkl")
        print("  ✓ data/models/feature_names.pkl")


if __name__ == "__main__":
    preparator = DataPreparator()
    X_train, X_test, y_train, y_test = preparator.prepare_data()
    
