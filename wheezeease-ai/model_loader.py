import pickle
import os
import tensorflow as tf
from keras.models import load_model

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

_BASE = os.path.dirname(os.path.abspath(__file__))
_DATA = os.path.join(_BASE, 'data')

nn_model = None
rf_model = None
scaler = None
feature_columns = []

# Load scaler
try:
    with open(os.path.join(_DATA, 'scaler.pkl'), 'rb') as f:
        scaler = pickle.load(f)
    print("  ✓ Scaler loaded")
except Exception as e:
    print(f"  ✗ Scaler load error: {e}")

# Load feature columns from processed data
try:
    with open(os.path.join(_DATA, 'processed_data.pkl'), 'rb') as f:
        processed = pickle.load(f)

    _target_cols = {'risk_level', 'AsthmaRisk', 'RiskLevel', 'label', 'target', 'y', 'Risk'}

    if hasattr(processed, 'columns'):
        feature_columns = [c for c in processed.columns if c not in _target_cols]
    elif isinstance(processed, dict):
        feature_columns = processed.get('feature_columns', [])

    print(f"  ✓ Feature columns loaded ({len(feature_columns)} features)")
except Exception as e:
    print(f"  ✗ Feature columns load error: {e}")

# Load Random Forest
try:
    with open(os.path.join(_DATA, 'model_rf.pkl'), 'rb') as f:
        rf_model = pickle.load(f)
    print("  ✓ Random Forest loaded")
except Exception as e:
    print(f"  ✗ Random Forest load error: {e}")

# Load Neural Network
try:
    nn_model = load_model(os.path.join(_DATA, 'model_nn.h5'), compile=False)
    print("  ✓ Neural Network loaded")
except Exception as e:
    print(f"  ✗ Neural Network load error: {e}")
