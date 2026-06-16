import pickle
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, classification_report,
    confusion_matrix, roc_auc_score
)
import matplotlib
matplotlib.use('Agg')  # non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns

print("STEP 3: LOGISTIC REGRESSION")

with open('data/processed_data.pkl', 'rb') as f:
    data = pickle.load(f)

X_train = data['X_train']
X_test  = data['X_test']
y_train = data['y_train']
y_test  = data['y_test']
print(f"\n Data loaded: {len(X_train)} train, {len(X_test)} test samples")

# CREATE & TRAIN MODEL
print("\n--- Training Logistic Regression ---")

model = LogisticRegression(
    max_iter=1000,         
    random_state=42,
    class_weight='balanced'  # pays more attention to rare classes

)

model.fit(X_train, y_train)
print(" Training complete!")

# MAKE PREDICTIONS
y_pred        = model.predict(X_test)
y_pred_proba  = model.predict_proba(X_test)  # gives [low%, medium%, high%]

# EVALUATE MODEL
print("\n--- 3.4 Model Evaluation ---")

accuracy = accuracy_score(y_test, y_pred)
print(f"\n Accuracy: {accuracy:.2%}")

print("\n Classification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=['Low Risk', 'Medium Risk', 'High Risk']
))

# ROC-AUC (one-vs-rest for multiclass)
auc = roc_auc_score(y_test, y_pred_proba, multi_class='ovr')
print(f" ROC-AUC Score: {auc:.4f}")

print("\n--- 3.5 Sample Predictions ---")
label_names = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}

for i in range(5):
    actual    = label_names[y_test.iloc[i]]
    predicted = label_names[y_pred[i]]
    proba     = y_pred_proba[i]
    print(f"Sample {i+1}: Actual={actual:6} | Predicted={predicted:6} | "
          f"Proba: Low={proba[0]:.2f} Med={proba[1]:.2f} High={proba[2]:.2f}")

# CONFUSION MATRIX PLOT
cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(7, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Low', 'Medium', 'High'],
            yticklabels=['Low', 'Medium', 'High'])
plt.title('Logistic Regression — Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
plt.savefig('data/lr_confusion_matrix.png', dpi=150)
print("\n Saved confusion matrix: data/lr_confusion_matrix.png")

with open('data/model_lr.pkl', 'wb') as f:
    pickle.dump(model, f)

print(" Saved model: data/model_lr.pkl")
print(f"\n Logistic Regression Accuracy: {accuracy:.2%}")
