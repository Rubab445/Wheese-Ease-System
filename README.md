# WheezeEase — AI-Powered Asthma Risk Prediction System

An intelligent healthcare system that monitors, predicts, and manages 
asthma risk by combining patient health data with real-time environmental 
conditions.

## System Components

| Component | Technology | Description |
|---|---|---|
| AI Models | Python, TensorFlow, Scikit-learn | Risk prediction engine |
| Backend API | FastAPI | REST API connecting app to AI |
| Patient App | Flutter | Mobile app for patients |
| Doctor Dashboard | React + TypeScript | Web app for doctors |

## AI Models

- Logistic Regression — 98.67% accuracy
- Random Forest — 96.47% accuracy  
- Neural Network — 97.50% accuracy
- Combined NN + RF for production (accuracy + explainability)

## Features

- Real-time asthma risk prediction (LOW / MEDIUM / HIGH)
- Live AQI and weather data (OpenWeatherMap API)
- Plain English explanations — no medical jargon
- Personalized time-aware recommendations
- Trip safety checker — check air quality at destination
- Doctor monitoring dashboard
- Multi-role system (Patient, Doctor, Admin)

## Datasets Used

- Kaggle Asthma Disease Dataset (2,392 records)
- Global Air Pollution Dataset (23,463 city readings)
- Synthetic patient data (1,000 records)
- Total: ~3,400 combined training records with 27 features

## How to Run

### AI Backend
```bash
cd wheezeease-ai
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Flutter App
```bash
cd wheezeease-app
flutter pub get
flutter run
```

### React Dashboard
```bash
cd WEBAPP
npm install
npm start
```

## API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| /health | GET | Server status |
| /predict | POST | Full AI prediction |
| /environment | GET | Live AQI + weather |
| /quick-predict | GET | Home screen refresh |
| /trip-risk | GET | Destination safety check |
| /api/login | POST | Doctor authentication |

## Team

Built as a Final Year Project — WheezeEase System
