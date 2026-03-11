"""
Test script for WheezeEase AI API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health check endpoint"""
    print("\n" + "="*60)
    print("Testing Health Check")
    print("="*60)
    
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_environmental_data():
    """Test environmental data endpoint"""
    print("\n" + "="*60)
    print("Testing Environmental Data API")
    print("="*60)
    
    cities = ["Lahore,PK", "Karachi,PK"]
    
    for city in cities:
        print(f"\n--- {city} ---")
        response = requests.get(f"{BASE_URL}/environmental-data/{city}")
        
        if response.status_code == 200:
            data = response.json()['data']
            print(f"✓ Temperature: {data['temperature']}°C")
            print(f"✓ Humidity: {data['humidity']}%")
            print(f"✓ AQI: {data['aqi']}")
            print(f"✓ Pollen: {data['pollen_level']}")
        else:
            print(f"✗ Error: {response.status_code}")

def test_prediction():
    """Test risk prediction endpoint"""
    print("\n" + "="*60)
    print("Testing Risk Prediction API")
    print("="*60)
    
    # Test case 1: High risk patient
    payload = {
        "patient": {
            "age": 35,
            "gender": "Male",
            "has_asthma": True,
            "severity": "Moderate",
            "allergies": ["pollen", "pollution", "dust"]
        },
        "symptoms": {
            "symptom_wheezing": 5,
            "symptom_coughing": 6,
            "symptom_shortness_breath": 4,
            "symptom_chest_tightness": 3,
            "inhaler_usage_week": 12,
            "medication_adherence": 0.8
        },
        "city": "Lahore,PK"
    }
    
    print("\nTest Case 1: High-risk patient with multiple symptoms")
    response = requests.post(f"{BASE_URL}/predict", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✓ Prediction successful!")
        print(f"  Risk Level: {result['risk_level']}")
        print(f"  Confidence: {result['confidence']}%")
        print(f"\n  Probabilities:")
        for level, prob in result['probabilities'].items():
            print(f"    {level.capitalize():8s}: {prob:5.2f}%")
        print(f"\n  Triggers:")
        for trigger in result['triggers']:
            print(f"    • {trigger}")
        print(f"\n  Recommendations:")
        for rec in result['recommendations']:
            print(f"    • {rec}")
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)
    
    # Test case 2: Low risk patient
    payload2 = {
        "patient": {
            "age": 25,
            "gender": "Female",
            "has_asthma": False,
            "severity": "Mild",
            "allergies": []
        },
        "symptoms": {
            "symptom_wheezing": 0,
            "symptom_coughing": 1,
            "symptom_shortness_breath": 0,
            "symptom_chest_tightness": 0,
            "inhaler_usage_week": 0,
            "medication_adherence": 1.0
        },
        "city": "Islamabad,PK"
    }
    
    print("\n\nTest Case 2: Low-risk patient with minimal symptoms")
    response = requests.post(f"{BASE_URL}/predict", json=payload2)
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✓ Prediction successful!")
        print(f"  Risk Level: {result['risk_level']}")
        print(f"  Confidence: {result['confidence']}%")
    else:
        print(f"✗ Error: {response.status_code}")

def main():
    """Run all tests"""
    print("="*60)
    print("WHEEZEEASE AI API - TEST SUITE")
    print("="*60)
    print("\nMake sure the API server is running:")
    print("  python src/6_api_service.py")
    print("\nStarting tests...")
    
    try:
        test_health()
        test_environmental_data()
        test_prediction()
        
        print("\n" + "="*60)
        print("✓ ALL TESTS COMPLETED")
        print("="*60)
        
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Cannot connect to API server")
        print("Make sure to run: python src/6_api_service.py")
    except Exception as e:
        print(f"\n✗ Test failed with error: {e}")

if __name__ == "__main__":
    main()
