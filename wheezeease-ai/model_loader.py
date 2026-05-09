import pickle
import tensorflow as tf
import os

_BASE = os.path.dirname(os.path.abspath(__file__))
_DATA = os.path.join(_BASE, 'data')

nn_model       = tf.keras.models.load_model(os.path.join(_DATA, 'model_nn.h5'), compile=False)
rf_model       = pickle.load(open(os.path.join(_DATA, 'model_rf.pkl'), 'rb'))
scaler         = pickle.load(open(os.path.join(_DATA, 'scaler.pkl'), 'rb'))
feature_columns = pickle.load(open(os.path.join(_DATA, 'processed_data.pkl'), 'rb'))['feature_columns']
