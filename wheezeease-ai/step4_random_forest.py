import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, roc_auc_score
)

print("STEP 4: RANDOM FOREST")

# LOAD DATA
with open('data/processed_data.pkl', 'rb') as f:
    data = pickle.load(f)

X_train          = data['X_train']
X_test           = data['X_test']
y_train          = data['y_train']
y_test           = data['y_test']
feature_columns  = data['feature_columns']
print(f"\n Data loaded: {len(X_train)} train, {len(X_test)} test samples")

# CREATE & TRAIN MODEL
print("\n--- Training Random Forest (500 trees) ---")

model = RandomForestClassifier(
    n_estimators=500,
    max_depth=20,              
    min_samples_split=5,       
    min_samples_leaf=2,        
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

y_pred_proba = model.predict_proba(X_test)

y_pred_adjusted = []
for proba in y_pred_proba:
    if proba[2] >= 0.25 and proba[2] > proba[0]: 
        y_pred_adjusted.append(2)
    elif proba[0] >= 0.45:    
        y_pred_adjusted.append(0)
    else:
        y_pred_adjusted.append(1)  

y_pred = np.array(y_pred_adjusted)

# EVALUATE
print("\n---  Model Evaluation ---")

accuracy = accuracy_score(y_test, y_pred)
print(f"\n Test Accuracy: {accuracy:.2%}")
print(f" Train Accuracy: {accuracy_score(y_train, model.predict(X_train)):.2%}")

print("\n Classification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=['Low Risk', 'Medium Risk', 'High Risk']
))

auc = roc_auc_score(y_test, y_pred_proba, multi_class='ovr')
print(f" ROC-AUC Score: {auc:.4f}")

#  FEATURE IMPORTANCE
print("\n---  Feature Importance ---")

importances = model.feature_importances_
indices     = np.argsort(importances)[::-1]

print("\nTop 10 Most Important Features:")
for i in range(min(10, len(feature_columns))):
    print(f"  {i+1:2}. {feature_columns[indices[i]]:25} -> {importances[indices[i]]:.4f}")

# Plot feature importance
plt.figure(figsize=(10, 6))
bars = plt.barh(
    [feature_columns[i] for i in indices[:10]][::-1],
    [importances[i] for i in indices[:10]][::-1],
    color='steelblue'
)
plt.bar_label(bars, fmt='%.3f', padding=3)
plt.xlabel('Importance Score')
plt.title('Random Forest — Top 10 Feature Importances')
plt.tight_layout()
plt.savefig('data/rf_feature_importance.png', dpi=150)
print("\n Saved: data/rf_feature_importance.png")

# CONFUSION MATRIX
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(7, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Greens',
            xticklabels=['Low', 'Medium', 'High'],
            yticklabels=['Low', 'Medium', 'High'])
plt.title('Random Forest — Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
plt.savefig('data/rf_confusion_matrix.png', dpi=150)
print(" Saved: data/rf_confusion_matrix.png")

print("\n--- 4.7 Example Single Tree Logic ---")
print("One tree out of 500 might reason like this:")
print("""
IF AQI > 150
   AND pollen_count > 80
   AND wheezing = 1
   -> HIGH RISK (confidence: 0.82)

IF AQI < 80
   AND symptom_severity < 2
   AND medication_adherence = 1
   -> LOW RISK (confidence: 0.91)
""")
print("All 500 trees vote, and the majority wins.")

with open('data/model_rf.pkl', 'wb') as f:
    pickle.dump(model, f)

print(" Saved model: data/model_rf.pkl")
print(f"\n Random Forest Accuracy: {accuracy:.2%}")
