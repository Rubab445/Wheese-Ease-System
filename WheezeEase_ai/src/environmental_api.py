"""
Step 5: Environmental Data API
Fetches real-time environmental data for AI predictions
"""

import requests
from datetime import datetime
import os
import sys
# Add root config to path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from config import OPENWEATHER_API_KEY  # from root .env

class EnvironmentalDataCollector:
    """Collects real-time environmental data from OpenWeather API"""
    
    def __init__(self, api_key=None):
        self.api_key = api_key or OPENWEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
        
        if not self.api_key:
            raise ValueError(
                "API key not found! Add OPENWEATHER_API_KEY to root .env file"
            )
        
    def get_current_weather(self, city="Lahore,PK"):
        try:
            # Weather data
            weather_url = f"{self.base_url}/weather?q={city}&appid={self.api_key}&units=metric"
            weather_response = requests.get(weather_url, timeout=10)
            if weather_response.status_code != 200:
                print(f"Weather API Error: {weather_response.text}")
                return None
            weather_data = weather_response.json()
            
            # Coordinates
            lat = weather_data['coord']['lat']
            lon = weather_data['coord']['lon']
            
            # Air pollution
            pollution_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={self.api_key}"
            pollution_response = requests.get(pollution_url, timeout=10)
            pollution_data = pollution_response.json() if pollution_response.status_code == 200 else None
            
            # Format data
            formatted_data = {
                'timestamp': datetime.now().isoformat(),
                'city': city,
                'location': {'latitude': lat, 'longitude': lon},
                'temperature': weather_data['main']['temp'],
                'humidity': weather_data['main']['humidity'],
                'pressure': weather_data['main']['pressure'],
                'weather_condition': weather_data['weather'][0]['main'],
                'weather_description': weather_data['weather'][0]['description'],
            }
            
            # Pollution
            if pollution_data and 'list' in pollution_data:
                formatted_data.update({
                    'aqi': pollution_data['list'][0]['main']['aqi'],
                    'pm2_5': pollution_data['list'][0]['components'].get('pm2_5', 0),
                    'pm10': pollution_data['list'][0]['components'].get('pm10', 0),
                    'co': pollution_data['list'][0]['components'].get('co', 0),
                    'no2': pollution_data['list'][0]['components'].get('no2', 0),
                })
            else:
                formatted_data.update({'aqi': 2, 'pm2_5': 25, 'pm10': 50, 'co':0, 'no2':0})
            
            formatted_data['pollen_level'] = self._estimate_pollen(
                weather_data, formatted_data['temperature'], formatted_data['humidity']
            )
            
            return formatted_data
            
        except requests.exceptions.RequestException as e:
            print(f"Network error: {e}")
            return None
        except Exception as e:
            print(f"Error fetching environmental data: {e}")
            return None
    
    def _estimate_pollen(self, weather, temp, humidity):
        month = datetime.now().month
        if month in [3,4,5]:  # Spring
            if humidity < 60 and 15 < temp < 30: return "High"
            elif humidity < 70: return "Medium"
            return "Low"
        elif month in [9,10]:  # Fall
            if humidity < 65 and temp > 18: return "Medium"
            return "Low"
        else:  # Summer/Winter
            return "Low"
    
    def get_formatted_for_ml(self, city="Lahore,PK"):
        data = self.get_current_weather(city)
        if not data: return None
        pollen_map = {'Low':0,'Medium':1,'High':2}
        month = datetime.now().month
        return {
            'temperature': data['temperature'],
            'humidity': data['humidity'],
            'aqi': data['aqi'],
            'pollen_level': pollen_map[data['pollen_level']],
            'month': month,
            'is_spring': 1 if month in [3,4,5] else 0,
            'is_winter': 1 if month in [12,1,2] else 0,
            'raw_data': data
        }

# Optional: test function
def test_api():
    print("="*60)
    print("TESTING ENVIRONMENTAL DATA API")
    print("="*60)
    collector = EnvironmentalDataCollector()
    cities = ["Lahore,PK","Karachi,PK","Islamabad,PK"]
    for city in cities:
        data = collector.get_current_weather(city)
        if data:
            print(f"\n✓ {city} fetched successfully:")
            print(f"  Temp: {data['temperature']}°C | Humidity: {data['humidity']}% | AQI: {data['aqi']} | Pollen: {data['pollen_level']}")
            ml_data = collector.get_formatted_for_ml(city)
            print(f"  ML Format: {ml_data}")
            break
    print("\n✓ API TEST COMPLETED")
    print("="*60)

if __name__ == "__main__":
    test_api()
