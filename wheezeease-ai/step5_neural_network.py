import pickle
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

import tensorflow as tf
from tensorflow import keras
from sklearn.metrics import (
    accuracy_score, classification_report, confusion_matrix
)

print("=" * 50)
print("STEP 5: NEURAL NETWORK (TensorFlow)")
print("=" * 50)
print(f"TensorFlow version: {tf.__version__}")

# 5.1 LOAD DATA
with open('data/processed_data.pkl', 'rb') as f:
    data = pickle.load(f)

X_train = data['X_train']
X_test  = data['X_test']
y_train = data['y_train'].values
y_test  = data['y_test'].values
print(f"\n Data loaded: {len(X_train)} train, {len(X_test)} test samples")
print(f"   Input features: {X_train.shape[1]}")

# 5.2 BUILD NEURAL NETWORK
print("\n--- 5.2 Building Neural Network Architecture ---")

model = keras.Sequential([
    # Input layer (shape = number of features)
    keras.layers.Input(shape=(X_train.shape[1],)),

    # Hidden layer 1 — 64 neurons
    keras.layers.Dense(64, activation='relu'),
    keras.layers.BatchNormalization(),   # stabilizes training
    keras.layers.Dropout(0.3),          # prevents overfitting

    # Hidden layer 2 — 32 neurons
    keras.layers.Dense(32, activation='relu'),
    keras.layers.BatchNormalization(),
    keras.layers.Dropout(0.2),

    # Hidden layer 3 — 16 neurons
    keras.layers.Dense(16, activation='relu'),

    # Output layer — 3 neurons (low, medium, high)
    keras.layers.Dense(3, activation='softmax')
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# 5.3 TRAIN MODEL
print("\n--- 5.3 Training Neural Network ---")

# Stop early if validation loss stops improving
early_stop = keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=10,           # wait 10 epochs before stopping
    restore_best_weights=True
)

history = model.fit(
    X_train, y_train,
    epochs=100,
    batch_size=32,
    validation_split=0.1,  # 10% of train used for validation
    callbacks=[early_stop],
    verbose=1
)

print("\n Training complete!")

# 5.4 EVALUATE
print("\n--- 5.4 Model Evaluation ---")

loss, accuracy = model.evaluate(X_test, y_test, verbose=0)
print(f"\n Test Loss     : {loss:.4f}")
print(f" Test Accuracy : {accuracy:.2%}")

y_pred_proba = model.predict(X_test)
y_pred       = np.argmax(y_pred_proba, axis=1)

print("\n Classification Report:")
print(classification_report(
    y_test, y_pred,
    target_names=['Low Risk', 'Medium Risk', 'High Risk']
))

# 5.5 PLOT TRAINING HISTORY
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))

# Accuracy over epochs
ax1.plot(history.history['accuracy'],     label='Train Accuracy', color='blue')
ax1.plot(history.history['val_accuracy'], label='Val Accuracy',   color='orange')
ax1.set_title('Neural Network — Accuracy over Epochs')
ax1.set_xlabel('Epoch')
ax1.set_ylabel('Accuracy')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Loss over epochs
ax2.plot(history.history['loss'],     label='Train Loss', color='blue')
ax2.plot(history.history['val_loss'], label='Val Loss',   color='orange')
ax2.set_title('Neural Network — Loss over Epochs')
ax2.set_xlabel('Epoch')
ax2.set_ylabel('Loss')
ax2.legend()
ax2.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('data/nn_training_history.png', dpi=150)
print("\n Saved: data/nn_training_history.png")

# 5.6 CONFUSION MATRIX

cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(7, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Purples',
            xticklabels=['Low', 'Medium', 'High'],
            yticklabels=['Low', 'Medium', 'High'])
plt.title('Neural Network — Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
plt.savefig('data/nn_confusion_matrix.png', dpi=150)
print(" Saved: data/nn_confusion_matrix.png")

# 5.7 SAVE MODEL
model.save('data/model_nn.h5')
print(" Saved model: data/model_nn.h5")
print(f"\n Neural Network Accuracy: {accuracy:.2%}")
