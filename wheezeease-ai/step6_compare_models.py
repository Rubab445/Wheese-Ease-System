import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from sklearn.metrics import accuracy_score, roc_auc_score
import tensorflow as tf

print("=" * 50)
print("STEP 6: MODEL COMPARISON")
print("=" * 50)

# 6.1 LOAD DATA
with open('data/processed_data.pkl', 'rb') as f:
    data = pickle.load(f)

X_test  = data['X_test']
y_test  = data['y_test'].values

# 6.2 LOAD ALL 3 MODELS
with open('data/model_lr.pkl', 'rb') as f:
    model_lr = pickle.load(f)

with open('data/model_rf.pkl', 'rb') as f:
    model_rf = pickle.load(f)

model_nn = tf.keras.models.load_model('data/model_nn.h5')
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
rf_pred  = model_rf.predict(X_test)
rf_proba = model_rf.predict_proba(X_test)
results['Random Forest'] = {
    'pred':  rf_pred,
    'proba': rf_proba,
    'accuracy': accuracy_score(y_test, rf_pred),
    'auc':      roc_auc_score(y_test, rf_proba, multi_class='ovr')
}

# Neural Network
nn_proba = model_nn.predict(X_test, verbose=0)
nn_pred  = np.argmax(nn_proba, axis=1)
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
best_accuracy   = 0

for name, res in results.items():
    acc = res['accuracy']
    auc = res['auc']
    marker = " ← BEST" if acc == max(r['accuracy'] for r in results.values()) else ""
    print(f"{name:<22} {acc:>9.2%} {auc:>10.4f}{marker}")
    if acc > best_accuracy:
        best_accuracy   = acc
        best_model_name = name

print("=" * 55)
print(f"\n Best Model: {best_model_name} ({best_accuracy:.2%} accuracy)")

# 6.5 COMPARISON BAR CHART
model_names = list(results.keys())
accuracies  = [results[m]['accuracy'] * 100 for m in model_names]
aucs        = [results[m]['auc'] for m in model_names]

x     = np.arange(len(model_names))
width = 0.35

fig, ax = plt.subplots(figsize=(10, 6))
bars1 = ax.bar(x - width/2, accuracies, width, label='Accuracy (%)',  color='steelblue')
bars2 = ax.bar(x + width/2, [a * 100 for a in aucs], width,
               label='ROC-AUC (×100)', color='coral')

ax.set_xlabel('Model')
ax.set_ylabel('Score')
ax.set_title('WheezeEase — Model Comparison')
ax.set_xticks(x)
ax.set_xticklabels(model_names)
ax.set_ylim(0, 115)
ax.legend()
ax.grid(axis='y', alpha=0.3)

# Add value labels on bars
for bar in bars1:
    ax.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + 0.5,
            f'{bar.get_height():.1f}%',
            ha='center', va='bottom', fontsize=9)

for bar in bars2:
    ax.text(bar.get_x() + bar.get_width()/2,
            bar.get_height() + 0.5,
            f'{bar.get_height()/100:.3f}',
            ha='center', va='bottom', fontsize=9)

plt.tight_layout()
plt.savefig('data/model_comparison.png', dpi=150)
print("\n Saved: data/model_comparison.png")

# 6.6 SAVE BEST MODEL NAME
with open('data/best_model_name.txt', 'w') as f:
    f.write(best_model_name)

print(f" Best model saved as: {best_model_name}")

