"""
Step 3: Model Training
Trains and compares multiple ML models
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

class ModelTrainer:
    def __init__(self):
        self.models = {}
        self.histories = {}
        self.results = {}
        
    def load_data(self):
        """Load prepared datasets"""
        print("Loading prepared data...")
        
        X_train = np.load('data/processed/X_train.npy')
        X_test = np.load('data/processed/X_test.npy')
        y_train = np.load('data/processed/y_train.npy')
        y_test = np.load('data/processed/y_test.npy')
        
        print(f"✓ Training set: {X_train.shape}")
        print(f"✓ Testing set: {X_test.shape}\n")
        
        return X_train, X_test, y_train, y_test
    
    def train_all_models(self, X_train, X_test, y_train, y_test):
        """Train all models and compare"""
        
        print("="*60)
        print("STEP 3: MODEL TRAINING & COMPARISON")
        print("="*60)
        
        # Model 1: Logistic Regression
        print("\n" + "-"*60)
        print("1. LOGISTIC REGRESSION")
        print("-"*60)
        self._train_logistic_regression(X_train, X_test, y_train, y_test)
        
        # Model 2: Random Forest
        print("\n" + "-"*60)
        print("2. RANDOM FOREST")
        print("-"*60)
        self._train_random_forest(X_train, X_test, y_train, y_test)
        
        # Model 3: Neural Network
        print("\n" + "-"*60)
        print("3. NEURAL NETWORK (TensorFlow)")
        print("-"*60)
        self._train_neural_network(X_train, X_test, y_train, y_test)
        
        # Compare models
        self._compare_models()
        
        # Save all models
        self._save_models()
        
    def _train_logistic_regression(self, X_train, X_test, y_train, y_test):
        """Train Logistic Regression model"""
        
        print("Training Logistic Regression...")
        
        model = LogisticRegression(
            max_iter=1000,
            random_state=42,
            multi_class='multinomial',
            solver='lbfgs'
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = model.predict(X_train)
        test_pred = model.predict(X_test)
        
        train_acc = accuracy_score(y_train, train_pred)
        test_acc = accuracy_score(y_test, test_pred)
        
        self.models['logistic_regression'] = model
        self.results['logistic_regression'] = {
            'train_accuracy': train_acc,
            'test_accuracy': test_acc,
            'predictions': test_pred
        }
        
        print(f"\n✓ Training completed")
        print(f"  Training Accuracy: {train_acc:.4f} ({train_acc*100:.2f}%)")
        print(f"  Testing Accuracy:  {test_acc:.4f} ({test_acc*100:.2f}%)")
        print(f"  Overfitting Gap:   {(train_acc - test_acc):.4f}")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(
            y_test, test_pred, 
            target_names=['Low', 'Medium', 'High'],
            digits=3
        ))
    
    def _train_random_forest(self, X_train, X_test, y_train, y_test):
        """Train Random Forest model"""
        
        print("Training Random Forest...")
        
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced',
            n_jobs=-1
        )
        
        model.fit(X_train, y_train)
        
        # Evaluate
        train_pred = model.predict(X_train)
        test_pred = model.predict(X_test)
        
        train_acc = accuracy_score(y_train, train_pred)
        test_acc = accuracy_score(y_test, test_pred)
        
        self.models['random_forest'] = model
        self.results['random_forest'] = {
            'train_accuracy': train_acc,
            'test_accuracy': test_acc,
            'predictions': test_pred,
            'feature_importance': model.feature_importances_
        }
        
        print(f"\n✓ Training completed")
        print(f"  Training Accuracy: {train_acc:.4f} ({train_acc*100:.2f}%)")
        print(f"  Testing Accuracy:  {test_acc:.4f} ({test_acc*100:.2f}%)")
        print(f"  Overfitting Gap:   {(train_acc - test_acc):.4f}")
        
        # Feature importance
        feature_names = joblib.load('data/models/feature_names.pkl')
        importance_df = pd.DataFrame({
            'feature': feature_names,
            'importance': model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\nTop 10 Important Features:")
        for idx, row in importance_df.head(10).iterrows():
            print(f"  {row['feature']:30s}: {row['importance']:.4f}")
        
        # Classification report
        print("\nClassification Report:")
        print(classification_report(
            y_test, test_pred, 
            target_names=['Low', 'Medium', 'High'],
            digits=3
        ))
    
    def _train_neural_network(self, X_train, X_test, y_train, y_test):
        """Train Neural Network model"""
        
        print("Building Neural Network architecture...")
        print("  Input Layer:  21 features")
        print("  Hidden Layer 1: 64 neurons (ReLU) + Dropout(0.3)")
        print("  Hidden Layer 2: 32 neurons (ReLU) + Dropout(0.2)")
        print("  Hidden Layer 3: 16 neurons (ReLU)")
        print("  Output Layer: 3 neurons (Softmax)")
        
        # Build model
        model = keras.Sequential([
            layers.Input(shape=(X_train.shape[1],)),
            layers.Dense(64, activation='relu', name='hidden1'),
            layers.Dropout(0.3),
            layers.Dense(32, activation='relu', name='hidden2'),
            layers.Dropout(0.2),
            layers.Dense(16, activation='relu', name='hidden3'),
            layers.Dense(3, activation='softmax', name='output')
        ])
        
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='sparse_categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print("\nTraining Neural Network...")
        print("  Epochs: 50")
        print("  Batch Size: 32")
        print("  Optimizer: Adam")
        print("  Learning Rate: 0.001\n")
        
        # Train with validation split
        history = model.fit(
            X_train, y_train,
            epochs=50,
            batch_size=32,
            validation_split=0.2,
            verbose=0,
            callbacks=[
                keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=10,
                    restore_best_weights=True
                )
            ]
        )
        
        # Evaluate
        train_loss, train_acc = model.evaluate(X_train, y_train, verbose=0)
        test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
        
        test_pred = np.argmax(model.predict(X_test, verbose=0), axis=1)
        
        self.models['neural_network'] = model
        self.histories['neural_network'] = history
        self.results['neural_network'] = {
            'train_accuracy': train_acc,
            'test_accuracy': test_acc,
            'train_loss': train_loss,
            'test_loss': test_loss,
            'predictions': test_pred
        }
        
        print(f"✓ Training completed")
        print(f"  Training Accuracy: {train_acc:.4f} ({train_acc*100:.2f}%)")
        print(f"  Testing Accuracy:  {test_acc:.4f} ({test_acc*100:.2f}%)")
        print(f"  Overfitting Gap:   {(train_acc - test_acc):.4f}")
        print(f"  Training Loss:     {train_loss:.4f}")
        print(f"  Testing Loss:      {test_loss:.4f}")
        
        # Classification report
        print("\nClassification Report:")
        y_test = np.load('data/processed/y_test.npy')
        print(classification_report(
            y_test, test_pred, 
            target_names=['Low', 'Medium', 'High'],
            digits=3
        ))
    
    def _compare_models(self):
        """Compare all trained models"""
        
        print("\n" + "="*60)
        print("MODEL COMPARISON RESULTS")
        print("="*60)
        
        comparison_data = []
        for name, results in self.results.items():
            comparison_data.append({
                'Model': name.replace('_', ' ').title(),
                'Train Acc': f"{results['train_accuracy']:.4f}",
                'Test Acc': f"{results['test_accuracy']:.4f}",
                'Overfit': f"{results['train_accuracy'] - results['test_accuracy']:.4f}"
            })
        
        comparison_df = pd.DataFrame(comparison_data)
        print("\n" + comparison_df.to_string(index=False))
        
        # Determine best model
        best_model_name = max(
            self.results.items(),
            key=lambda x: x[1]['test_accuracy']
        )[0]
        
        best_acc = self.results[best_model_name]['test_accuracy']
        
        print("\n" + "-"*60)
        print(f" BEST MODEL: {best_model_name.replace('_', ' ').title()}")
        print(f"   Test Accuracy: {best_acc:.4f} ({best_acc*100:.2f}%)")
        print("-"*60)
        
        # Save best model info
        with open('data/models/best_model_info.txt', 'w') as f:
            f.write(f"Best Model: {best_model_name}\n")
            f.write(f"Test Accuracy: {best_acc:.4f}\n")
        
        return best_model_name
    
    def _save_models(self):
        """Save all trained models"""
        
        print("\n" + "="*60)
        print("SAVING MODELS")
        print("="*60)
        
        os.makedirs('data/models', exist_ok=True)
        
        # Save scikit-learn models
        joblib.dump(
            self.models['logistic_regression'], 
            'data/models/logistic_regression_model.pkl'
        )
        print("✓ Saved: logistic_regression_model.pkl")
        
        joblib.dump(
            self.models['random_forest'], 
            'data/models/random_forest_model.pkl'
        )
        print("✓ Saved: random_forest_model.pkl")
        
        # Save neural network
        self.models['neural_network'].save('data/models/neural_network_model.h5')
        print("✓ Saved: neural_network_model.h5")
        
        # Save best model (usually Random Forest)
        best_model_name = max(
            self.results.items(),
            key=lambda x: x[1]['test_accuracy']
        )[0]
        
        if best_model_name == 'neural_network':
            self.models[best_model_name].save('data/models/best_model.h5')
        else:
            joblib.dump(
                self.models[best_model_name],
                'data/models/best_model.pkl'
            )
        
        print(f"✓ Saved: best_model.pkl (from {best_model_name})")
        
        # Save all results
        joblib.dump(self.results, 'data/models/training_results.pkl')
        print("✓ Saved: training_results.pkl")


if __name__ == "__main__":
    trainer = ModelTrainer()
    X_train, X_test, y_train, y_test = trainer.load_data()
    trainer.train_all_models(X_train, X_test, y_train, y_test)
    
    