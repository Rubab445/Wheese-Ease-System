import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, roc_auc_score, recall_score, classification_report
import tensorflow as tf
import sys

print("=" * 50)
print("STEP 6: MODEL COMPARISON")
print("=" * 50)

# 6.1 LOAD DATA
with open('data/processed_data.pkl', 'rb') as f:
    data = pickle.load(f)

X_test  = data['X_test']
y_test  = data['y_test'].values

# 6.2 LOAD ALL 3 MODELS
try:
    with open('data/model_lr.pkl', 'rb') as f:
        model_lr = pickle.load(f)
except FileNotFoundError:
    print("model_lr.pkl not found! Run step3 first.")
    sys.exit(1)

try:
    with open('data/model_rf.pkl', 'rb') as f:
        model_rf = pickle.load(f)
except FileNotFoundError:
    print("model_rf.pkl not found! Run step4 first.")
    sys.exit(1)

try:
    model_nn = tf.keras.models.load_model('data/model_nn.h5')
except Exception:
    print("model_nn.h5 not found! Run step5 first.")
    sys.exit(1)

print(" All 3 models loaded")

# 6.3 PREDICT WITH EACH MODEL
results = {}

# Logistic Regression
lr_pred  = model_lr.predict(X_test)
lr_proba = model_lr.predict_proba(X_test)
results['Logistic Regression'] = {
    'pred':  lr_pred,
    'proba': lr_proba,
    'accuracy': accuracy_score(y_test, lr_pred),
    'auc':      roc_auc_score(y_test, lr_proba, multi_class='ovr')
}

# Random Forest
rf_proba = model_rf.predict_proba(X_test)
rf_pred = []
for proba in rf_proba:
    if proba[2] >= 0.25 and proba[2] > proba[0]:
        rf_pred.append(2)
    elif proba[0] >= 0.45:
        rf_pred.append(0)
    else:
        rf_pred.append(1)
rf_pred = np.array(rf_pred)

results['Random Forest'] = {
    'pred':  rf_pred,
    'proba': rf_proba,
    'accuracy': accuracy_score(y_test, rf_pred),
    'auc':      roc_auc_score(y_test, rf_proba, multi_class='ovr')
}

# Neural Network
nn_proba = model_nn.predict(X_test, verbose=0)
nn_pred = []
for proba in nn_proba:
    if proba[2] >= 0.25 and proba[2] > proba[0]:
        nn_pred.append(2)
    elif proba[0] >= 0.45:
        nn_pred.append(0)
    else:
        nn_pred.append(1)
nn_pred = np.array(nn_pred)

results['Neural Network'] = {
    'pred':  nn_pred,
    'proba': nn_proba,
    'accuracy': accuracy_score(y_test, nn_pred),
    'auc':      roc_auc_score(y_test, nn_proba, multi_class='ovr')
}

# 6.4 PRINT COMPARISON TABLE
print("\n" + "=" * 55)
print(f"{'Model':<22} {'Accuracy':>10} {'ROC-AUC':>10}")
print("-" * 55)

best_model_name = None
best_score = 0

for name, res in results.items():
    acc = res['accuracy']
    auc = res['auc']
    high_risk_recall = recall_score(y_test, res['pred'], labels=[2], average='macro')
    composite = auc * 0.5 + high_risk_recall * 0.3 + acc * 0.2
    
    print(f"{name:<22} {acc:>9.2%} {auc:>10.4f}")
    if composite > best_score:
        best_score = composite
        best_model_name = name

print("=" * 55)
print(f"\n Best Model (by composite score): {best_model_name}")

print("\nHigh Risk Recall per Model:")
for name, res in results.items():
    report = classification_report(
        y_test, res['pred'],
        target_names=['Low','Medium','High'],
        output_dict=True
    )
    high_recall = report['High']['recall']
    high_prec   = report['High']['precision']
    print(f"  {name:<22} Recall: {high_recall:.2%}  Precision: {high_prec:.2%}")

# 6.5 COMPARISON BAR CHART
model_names = list(results.keys())
accuracies  = [results[m]['accuracy'] * 100 for m in model_names]
aucs        = [results[m]['auc'] for m in model_names]

x     = np.arange(len(model_names))
width = 0.35

fig, ax1 = plt.subplots(figsize=(10, 6))
ax2 = ax1.twinx()

bars1 = ax1.bar(x - width/2, accuracies, width, label='Accuracy', color='steelblue')
bars2 = ax2.bar(x + width/2, aucs, width, label='ROC-AUC', color='coral')

ax1.set_xlabel('Model')
ax1.set_ylabel('Accuracy (%)')
ax2.set_ylabel('ROC-AUC Score')
ax1.set_title('WheezeEase — Model Comparison')
ax1.set_xticks(x)
ax1.set_xticklabels(model_names)
ax1.set_ylim(0, 110)
ax2.set_ylim(0.5, 1.05)

# Add legends for both axes
lines, labels = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax2.legend(lines + lines2, labels + labels2, loc='upper right')

# Add value labels on bars
for bar in bars1:
    ax1.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + 0.5,
            f'{bar.get_height():.1f}%',
            ha='center', va='bottom', fontsize=9)

for bar in bars2:
    ax2.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + 0.005,
            f'{bar.get_height():.3f}',
            ha='center', va='bottom', fontsize=9)

plt.tight_layout()
plt.savefig('data/model_comparison.png', dpi=150)
print("\n Saved: data/model_comparison.png")

# 6.6 SAVE BEST MODEL NAME
with open('data/best_model_name.txt', 'w') as f:
    f.write(best_model_name)

print(f" Best model saved as: {best_model_name}")

