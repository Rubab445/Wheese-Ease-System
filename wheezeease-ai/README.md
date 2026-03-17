# WheezeEase AI — Step by Step Guide

## Setup
```bash
pip install pandas numpy scikit-learn tensorflow matplotlib seaborn
```

## Run In This Order

| Step | File | What it does |
|------|------|-------------|
| 1 | `python step1_generate_data.py` | Creates 1000 patient records in `data/` |
| 2 | `python step2_preprocess.py` | Cleans data, engineers features, scales, splits |
| 3 | `python step3_logistic_regression.py` | Trains baseline model (~78% accuracy) |
| 4 | `python step4_random_forest.py` | Trains best model (~89% accuracy) |
| 5 | `python step5_neural_network.py` | Trains neural network (~87% accuracy) |
| 6 | `python step6_compare_models.py` | Compares all 3, picks best |
| 7 | `python step7_predict.py` | Runs live prediction demo |

## Output Files

After running all steps, `data/` will contain:
- `asthma_dataset.csv` — raw dataset
- `processed_data.pkl` — cleaned train/test splits
- `scaler.pkl` — feature scaler
- `model_lr.pkl` — Logistic Regression model
- `model_rf.pkl` — Random Forest model
- `model_nn.h5` — Neural Network model
- `lr_confusion_matrix.png` — LR evaluation chart
- `rf_confusion_matrix.png` — RF evaluation chart
- `rf_feature_importance.png` — which features matter most
- `nn_confusion_matrix.png` — NN evaluation chart
- `nn_training_history.png` — training curve
- `model_comparison.png` — side-by-side comparison

## Using the Prediction Function

```python
from step7_predict import predict_risk

result = predict_risk({
    'AQI': 170, 'pollen_count': 120, 'humidity': 85,
    'temperature': 10, 'PM2_5': 75, 'NO2': 100,
    'wheezing': 1, 'coughing': 1, 'chest_tightness': 0,
    'inhaler_usage': 3, 'breathing_difficulty': 2,
    'medication_adherence': 0, 'past_attacks': 4
})

print(result['risk_level'])   # HIGH
print(result['advice'])       # 🚨 HIGH RISK: Avoid all outdoor...
print(result['alerts'])       # list of specific warnings
```
