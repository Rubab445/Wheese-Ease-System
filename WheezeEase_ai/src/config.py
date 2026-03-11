# wheezeEase_ai/src/config.py
import os
from dotenv import load_dotenv

# Load .env from root folder (one level above AI folder)
ROOT_ENV_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", ".env")
load_dotenv(ROOT_ENV_PATH)

# API keys and server config
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("AI_API_PORT", 8001))
