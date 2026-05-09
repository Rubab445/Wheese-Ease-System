from dotenv import load_dotenv
import os
import google.generativeai as genai
import json
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import hashlib
import functools

def sanitize_input(text: str, max_length: int = 200) -> str:
    if not text:
        return "Not provided"
    clean = text.replace('{', '').replace('}', '').strip()
    return clean[:max_length]


router = APIRouter()


class RecommendationRequest(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    risk_level: str
    risk_score: Optional[float] = None
    symptoms: Optional[str] = None
    duration: Optional[str] = None
    medications: Optional[str] = None
    triggers: Optional[str] = None
    weather_description: Optional[str] = None
    aqi: Optional[float] = None
    humidity: Optional[float] = None
    temperature: Optional[float] = None
    trip_risk_level: Optional[str] = None


load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """
You are a clinical decision support assistant embedded in WheezeEase, 
an AI-powered asthma risk management application used by registered 
doctors and patients in Pakistan.

Your role is to analyze patient data and provide structured, 
evidence-based asthma management recommendations following 
GINA (Global Initiative for Asthma) 2024 guidelines.

STRICT RULES YOU MUST FOLLOW:
- Never recommend specific medication dosages or prescribe drugs by name
- Always recommend consulting a doctor for HIGH risk cases
- Keep recommendations practical, short, and actionable
- Consider Pakistan's climate, air quality, and healthcare context
- Never diagnose. You support decisions, you do not make them.
- If data seems incomplete, still give best possible recommendations 
  based on available information
- Always respond in the exact JSON format specified. No extra text.
- CRITICAL: Your recommendations MUST be meaningfully different for LOW vs MEDIUM vs HIGH risk.
  Do NOT give generic asthma advice that applies to every case.
  A LOW risk patient should get reassurance and maintenance tips.
  A MEDIUM risk patient should get caution-based guidance.
  A HIGH risk patient should get urgent, specific action steps.

YOUR TONE:
- Clear and professional for doctors
- Simple and reassuring for patients
- Never alarming, never dismissive
"""

ACTIVITY_SYSTEM_PROMPT = """
You are a clinical decision support assistant embedded in WheezeEase, 
an AI-powered asthma risk management application.

Your role is to analyze a patient's planned or completed physical/household 
activity alongside current environmental conditions, and provide structured, 
evidence-based safety recommendations following GINA 2024 guidelines.

STRICT RULES:
- Never recommend specific medication dosages or prescribe drugs by name
- Always recommend consulting a doctor for HIGH risk activities
- Keep recommendations practical, short, and actionable
- Consider Pakistan's climate, air quality, and healthcare context
- Never diagnose. You support decisions, you do not make them.
- Always respond in the exact JSON format specified. No extra text.
- CRITICAL: Recommendations MUST be meaningfully different for LOW vs MEDIUM vs HIGH risk.
  LOW risk = reassurance + maintenance tips.
  MEDIUM risk = specific precautions for this activity type.
  HIGH risk = urgent warnings + stop/modify activity guidance.
  Never copy-paste the same preventive steps across risk levels.

YOUR TONE:
- Clear and professional
- Simple and reassuring
- Never alarming, never dismissive
"""

TRIP_SYSTEM_PROMPT = """
You are a clinical decision support assistant in WheezeEase.
Your role is to assess travel safety for asthma patients.
Consider destination air quality, climate, healthcare access,
and patient fitness to travel. Follow GINA 2024 guidelines.
STRICT RULES:
- Never recommend specific medication dosages or prescribe drugs by name
- Always recommend consulting a doctor for HIGH risk cases
- Keep recommendations practical, short, and actionable
- Consider Pakistan's climate, air quality, and healthcare context
- Never diagnose. You support decisions, you do not make them.
- Always respond in the exact JSON format specified. No extra text.
"""

generation_config = genai.GenerationConfig(
    temperature=0.2,
    max_output_tokens=2048
)

model_general = genai.GenerativeModel(
    model_name="models/gemini-2.5-flash",
    system_instruction=SYSTEM_PROMPT,
    generation_config=generation_config
)

model_activity = genai.GenerativeModel(
    model_name="models/gemini-2.5-flash",
    system_instruction=ACTIVITY_SYSTEM_PROMPT,
    generation_config=generation_config
)

model_trip = genai.GenerativeModel(
    model_name="models/gemini-2.5-flash",
    system_instruction=TRIP_SYSTEM_PROMPT,
    generation_config=generation_config
)

@functools.lru_cache(maxsize=100)
def get_cached_gemini_response(prompt: str, model_type: str) -> str:
    if model_type == "general":
        return model_general.generate_content(prompt).text.strip()
    elif model_type == "activity":
        return model_activity.generate_content(prompt).text.strip()
    elif model_type == "trip":
        return model_trip.generate_content(prompt).text.strip()
    return ""



def get_hardcoded_recommendation(risk_level: str):
    recommendations = {
        "HIGH": {
            "condition_summary": "Patient is at high risk and requires immediate attention.",
            "immediate_actions": [
                "Use your rescue inhaler immediately if symptoms are present",
                "Move to a clean, well-ventilated indoor area",
                "Seek emergency medical help if breathing does not improve"
            ],
            "preventive_steps": [
                "Avoid all known triggers including smoke, dust, and strong odors",
                "Monitor symptoms every few hours and keep medication nearby"
            ],
            "doctor_alert": True,
            "doctor_alert_reason": "High risk score requires urgent medical evaluation"
        },
        "MEDIUM": {
            "condition_summary": "Patient shows moderate asthma risk and should take precautionary measures.",
            "immediate_actions": [
                "Take prescribed controller medication as directed",
                "Avoid outdoor activity if air quality is poor",
                "Stay hydrated and rest in a clean environment"
            ],
            "preventive_steps": [
                "Track symptoms daily and note any worsening patterns",
                "Schedule a routine checkup with your doctor this week"
            ],
            "doctor_alert": False,
            "doctor_alert_reason": None
        },
        "LOW": {
            "condition_summary": "Patient is at low risk but should maintain preventive care.",
            "immediate_actions": [
                "Continue regular medication schedule as prescribed",
                "Keep rescue inhaler accessible at all times",
                "Maintain good indoor air quality at home"
            ],
            "preventive_steps": [
                "Exercise in low-pollution environments and avoid peak traffic hours",
                "Stay updated on local air quality and weather forecasts"
            ],
            "doctor_alert": False,
            "doctor_alert_reason": None
        }
    }
    
    risk_level = str(risk_level).upper() if risk_level else "MEDIUM"
    return recommendations.get(risk_level, recommendations["MEDIUM"])

@router.post("/get-recommendation")
async def get_recommendation(request: RecommendationRequest):
    print(f"Received: risk={request.risk_level}, symptoms={request.symptoms}, aqi={request.aqi}")
    
    risk_level = str(request.risk_level).upper()

    # Risk-specific instruction injected directly into prompt
    risk_instructions = {
        "HIGH": (
            "This is a HIGH RISK case. Your tone must reflect urgency. "
            "Immediate actions should be specific crisis-response steps. "
            "doctor_alert MUST be true with a clear reason. "
            "Do NOT give generic maintenance tips — this person may need help now."
        ),
        "MEDIUM": (
            "This is a MEDIUM RISK case. The patient needs caution-based guidance. "
            "Immediate actions should reduce current exposure or risk. "
            "Preventive steps should be things to do in the next 1-3 days. "
            "doctor_alert should be true only if specific data (high AQI, worsening symptoms) warrants it."
        ),
        "LOW": (
            "This is a LOW RISK case. Be reassuring. "
            "Immediate actions should be simple maintenance reminders, not alarm bells. "
            "Preventive steps should focus on staying healthy and keeping risk low. "
            "doctor_alert should be false unless there is a specific reason in the data."
        )
    }

    risk_instruction = risk_instructions.get(risk_level, risk_instructions["MEDIUM"])
    
    symptoms_clean = sanitize_input(request.symptoms)
    duration_clean = sanitize_input(request.duration)
    medications_clean = sanitize_input(request.medications)
    triggers_clean = sanitize_input(request.triggers)
    
    user_prompt = f"""
    Analyze the following asthma patient data and provide recommendations.
    
    RISK CONTEXT (READ THIS FIRST):
    {risk_instruction}
    
    PATIENT DATA:
    - Age: {request.age or 'Unknown'} years
    - Gender: {request.gender or 'Unknown'}
    - Risk Level: {risk_level}
    - Risk Score: {request.risk_score or 'Unknown'}
    - Current Symptoms: {symptoms_clean}
    - Symptom Duration: {duration_clean}
    - Medications Currently Taking: {medications_clean}
    - Known Triggers: {triggers_clean}
    - Weather Conditions: {request.weather_description or 'Unknown'}
    - Air Quality Index: {request.aqi or 'Unknown'}
    - Humidity: {request.humidity or 'Unknown'}%
    - Temperature: {request.temperature or 'Unknown'}°C
    - Recent Trip Risk: {request.trip_risk_level or 'Unknown'}
    
    TASK:
    Based on BOTH the risk level context above AND the patient data:
    1. A brief 1-sentence summary of the patient's current condition
       (must reflect the actual risk level, not a generic statement)
    2. Exactly 3 immediate action recommendations tailored to THIS specific case
       (not generic asthma tips — use the actual data: symptoms, AQI, triggers etc.)
    3. Exactly 2 preventive recommendations relevant to the risk level
       (LOW = maintenance, MEDIUM = caution steps, HIGH = urgent follow-up actions)
    4. doctor_alert: true only if this specific data warrants it
       (HIGH risk always true, MEDIUM/LOW only if data supports it)

    Respond ONLY in this exact JSON format, no extra text:

    {{
      "condition_summary": "...",
      "immediate_actions": [
        "action 1",
        "action 2",
        "action 3"
      ],
      "preventive_steps": [
        "step 1",
        "step 2"
      ],
      "doctor_alert": true,
      "doctor_alert_reason": "reason here or null if false"
    }}
    """

    try:
        response_text = get_cached_gemini_response(user_prompt, "general")

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        result = json.loads(response_text)
        return {"success": True, "data": result}
        
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return {"success": True, "data": get_hardcoded_recommendation(request.risk_level), "source": "fallback"}
        
    except Exception as e:
        print(f"Gemini error: {e}")
        return {
            "success": True,
            "data": get_hardcoded_recommendation(request.risk_level),
            "source": "fallback"
        }


# ── ACTIVITY-SPECIFIC RECOMMENDATIONS ──────────────────────────────



def get_hardcoded_activity_recommendation(risk_level: str, activity_type: str, is_exercise: bool = True):
    risk_level = str(risk_level).upper() if risk_level else "MEDIUM"
    
    if is_exercise:
        recommendations = {
            "HIGH": {
                "condition_summary": f"Current conditions make {activity_type} risky for asthma patients. Immediate precautions are needed.",
                "immediate_actions": [
                    "Stop or avoid this exercise until conditions improve",
                    "Use your rescue inhaler if you experience any symptoms",
                    "Move to a clean indoor environment immediately"
                ],
                "preventive_steps": [
                    "Switch to indoor exercise alternatives when air quality is poor",
                    "Always warm up for 10-15 minutes before any exercise session"
                ],
                "doctor_alert": True,
                "doctor_alert_reason": "High-risk exercise conditions detected — consult your doctor before continuing this routine"
            },
            "MEDIUM": {
                "condition_summary": f"You can do {activity_type} with caution. Take precautions to reduce asthma triggers.",
                "immediate_actions": [
                    "Keep your rescue inhaler within reach during exercise",
                    "Reduce exercise intensity or duration if you feel any symptoms",
                    "Breathe through your nose to warm and filter the air"
                ],
                "preventive_steps": [
                    "Monitor air quality before outdoor workouts and prefer indoor exercise on bad days",
                    "Track your symptoms after each session to identify patterns"
                ],
                "doctor_alert": False,
                "doctor_alert_reason": None
            },
            "LOW": {
                "condition_summary": f"Conditions are good for {activity_type}. Keep up the healthy routine!",
                "immediate_actions": [
                    "Continue your exercise as planned — conditions are safe",
                    "Stay hydrated and maintain a steady breathing rhythm",
                    "Keep your inhaler accessible as a precaution"
                ],
                "preventive_steps": [
                    "Regular exercise strengthens lung capacity — stay consistent",
                    "Cool down properly after exercise to prevent sudden airway changes"
                ],
                "doctor_alert": False,
                "doctor_alert_reason": None
            }
        }
    else:
        recommendations = {
            "HIGH": {
                "condition_summary": f"{activity_type.title()} poses significant trigger exposure. Take immediate precautions or postpone.",
                "immediate_actions": [
                    "Stop this activity and move to a well-ventilated area",
                    "Use your rescue inhaler if symptoms appear",
                    "Wear a proper respirator mask if you must continue"
                ],
                "preventive_steps": [
                    "Delegate high-trigger household tasks to someone without asthma when possible",
                    "Always ensure proper ventilation before starting trigger-heavy chores"
                ],
                "doctor_alert": True,
                "doctor_alert_reason": "High-risk household trigger exposure — discuss safer alternatives with your doctor"
            },
            "MEDIUM": {
                "condition_summary": f"{activity_type.title()} involves moderate trigger exposure. Basic precautions will help.",
                "immediate_actions": [
                    "Wear a mask to reduce exposure to airborne irritants",
                    "Take breaks every 20 minutes to breathe fresh air",
                    "Keep your rescue inhaler nearby during the activity"
                ],
                "preventive_steps": [
                    "Use asthma-friendly cleaning products and low-VOC alternatives",
                    "Track which household activities trigger your symptoms"
                ],
                "doctor_alert": False,
                "doctor_alert_reason": None
            },
            "LOW": {
                "condition_summary": f"{activity_type.title()} is manageable with basic precautions. Trigger exposure is low.",
                "immediate_actions": [
                    "Continue with the activity — risk is low",
                    "Keep windows open for ventilation",
                    "Have your inhaler accessible as a precaution"
                ],
                "preventive_steps": [
                    "Maintain good ventilation habits during all household chores",
                    "Shower and change clothes after prolonged chore sessions to remove allergens"
                ],
                "doctor_alert": False,
                "doctor_alert_reason": None
            }
        }
    
    return recommendations.get(risk_level, recommendations["MEDIUM"])


async def get_activity_recommendation(
    activity_type: str,
    duration: int,
    risk_level: str,
    environment: dict,
    is_exercise: bool = True,
    intensity: str = None,
    indoor: bool = None,
    used_inhaler: bool = None,
    # UPDATED: replaces had_symptoms: bool
    # Now accepts a list of symptom strings e.g. ["Wheezing", "Coughing"]
    # and an optional severity string e.g. "Mild" / "Moderate" / "Severe"
    symptoms_reported: List[str] = None,
    symptom_severity: str = None,
    symptom_notes: str = None,   # optional free-text from patient
    wore_mask: bool = None,
    trigger: str = None,
    trigger_description: str = None,
):
    """
    Calls Gemini with activity-specific context.
    Returns {"success": True/False, "data": {...recommendation...}}
    
    NOTE: symptoms_reported replaces the old had_symptoms boolean.
    Pass a list like ["Wheezing", "Coughing"] or an empty list [] for no symptoms.
    """
    
    risk_level_upper = str(risk_level).upper() if risk_level else "MEDIUM"

    # Build symptom description for prompt
    if symptoms_reported and len(symptoms_reported) > 0:
        symptom_text = f"{', '.join(symptoms_reported)}"
        if symptom_severity:
            symptom_text += f" (severity: {symptom_severity})"
        if symptom_notes:
            symptom_text += f" — Patient note: {symptom_notes}"
    else:
        symptom_text = "None reported"

    # Risk-specific instruction injected directly into prompt
    risk_instructions = {
        "HIGH": (
            "This is HIGH RISK. Be direct and urgent. "
            "Immediate actions must address the specific symptoms and triggers present. "
            "doctor_alert MUST be true. Preventive steps should focus on avoiding "
            "this scenario in the future, not generic wellness tips."
        ),
        "MEDIUM": (
            "This is MEDIUM RISK. Give specific precautions for THIS activity type. "
            "Immediate actions should reduce current exposure. "
            "Preventive steps should be actionable for the next 1-3 days. "
            "doctor_alert only if symptoms or AQI are concerning."
        ),
        "LOW": (
            "This is LOW RISK. Be reassuring and positive. "
            "Immediate actions should be light reminders, not warnings. "
            "Preventive steps should encourage continuation with minor tips. "
            "doctor_alert should be false."
        )
    }

    risk_instruction = risk_instructions.get(risk_level_upper, risk_instructions["MEDIUM"])

    # Build activity details block
    if is_exercise:
        activity_details = f"""
    ACTIVITY TYPE: Exercise — {activity_type}
    Duration: {duration} minutes
    Intensity: {intensity or 'Unknown'}
    Location: {'Indoor' if indoor else 'Outdoor'}
    Used Inhaler Before: {'Yes' if used_inhaler else 'No'}
    Symptoms During/After: {symptom_text}
    """
    else:
        activity_details = f"""
    ACTIVITY TYPE: Household — {activity_type}
    Duration: {duration} minutes
    Wore Mask: {'Yes' if wore_mask else 'No'}
    Symptoms After: {symptom_text}
    Known Trigger: {trigger or 'General irritants'}
    Trigger Detail: {trigger_description or 'May expose to airborne irritants'}
    """
    
    user_prompt = f"""
    Analyze this asthma patient's activity and environmental conditions.
    
    RISK CONTEXT (READ THIS FIRST):
    {risk_instruction}
    
    {activity_details}
    
    ENVIRONMENTAL CONDITIONS:
    - Air Quality Index (AQI): {environment.get('aqi', 'Unknown')}
    - Temperature: {environment.get('temperature', 'Unknown')}°C
    - Humidity: {environment.get('humidity', 'Unknown')}%
    - PM2.5: {environment.get('pm25', 'Unknown')} μg/m³
    - Pollen: {environment.get('pollen', 'Unknown')}
    
    COMPUTED RISK LEVEL: {risk_level_upper}
    
    TASK:
    Based on BOTH the risk level context AND the specific activity/symptom data above:
    1. A 1-sentence summary of how safe this activity was/is for the patient
       (reference the actual activity type and key data points, not a generic statement)
    2. Exactly 3 immediate actions specific to THIS activity and risk level
       (if symptoms were reported, address them directly)
    3. Exactly 2 preventive steps relevant to THIS risk level
       (LOW = encouragement + minor tip, MEDIUM = specific precautions, HIGH = urgent follow-up)
    4. doctor_alert: follow the risk context instructions above

    Respond ONLY in this exact JSON format, no extra text:

    {{
      "condition_summary": "...",
      "immediate_actions": [
        "action 1",
        "action 2",
        "action 3"
      ],
      "preventive_steps": [
        "step 1",
        "step 2"
      ],
      "doctor_alert": true,
      "doctor_alert_reason": "reason here or null if false"
    }}
    """

    try:
        response_text = get_cached_gemini_response(user_prompt, "activity")

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        result = json.loads(response_text)
        return {"success": True, "data": result}
        
    except json.JSONDecodeError as e:
        print(f"Activity recommendation JSON parse error: {e}")
        return {
            "success": True,
            "data": get_hardcoded_activity_recommendation(risk_level, activity_type, is_exercise),
            "source": "fallback"
        }
        
    except Exception as e:
        print(f"Activity recommendation Gemini error: {e}")
        return {
            "success": True,
            "data": get_hardcoded_activity_recommendation(risk_level, activity_type, is_exercise),
            "source": "fallback"
        }


def get_hardcoded_trip_recommendation(risk_level: str):
    """Fallback hardcoded trip recommendations if Gemini fails."""
    recommendations = {
        "HIGH": {
            "condition_summary": "Travel to this destination poses significant asthma risk. Proceed only if absolutely necessary with comprehensive precautions.",
            "immediate_actions": [
                "Consult your doctor before traveling — the destination's air quality and conditions require medical review",
                "Ensure you have a 2-week supply of all medications including rescue inhalers",
                "Research hospitals and medical facilities near your destination with contact information saved"
            ],
            "preventive_steps": [
                "Consider postponing travel until air quality improves or conditions are more favorable",
                "If traveling, arrange for oxygen support and emergency medical services in your destination"
            ],
            "doctor_alert": True,
            "doctor_alert_reason": "High-risk travel destination requires pre-travel medical consultation"
        },
        "MEDIUM": {
            "condition_summary": "Travel to this destination is possible with careful preparation and precautions to manage asthma safely.",
            "immediate_actions": [
                "Pack 1.5x your usual medication supply including backup inhalers",
                "Check air quality forecasts for your destination daily leading up to departure",
                "Locate and note addresses/phone numbers of nearby hospitals and medical clinics at your destination"
            ],
            "preventive_steps": [
                "During travel, limit outdoor activities during peak pollution hours (morning/evening)",
                "Stay hydrated and monitor symptoms closely — seek medical attention if symptoms worsen"
            ],
            "doctor_alert": False,
            "doctor_alert_reason": None
        },
        "LOW": {
            "condition_summary": "Travel to this destination is relatively safe for your asthma. Maintain your regular medication routine.",
            "immediate_actions": [
                "Pack your standard medication supply plus one backup inhaler",
                "Share your travel dates and destination with your doctor for their records",
                "Download offline maps and note locations of pharmacies near your accommodation"
            ],
            "preventive_steps": [
                "Continue taking controller medications as prescribed — do not skip doses while traveling",
                "Stay in accommodation with good air quality and ventilation; avoid exposure to smoke"
            ],
            "doctor_alert": False,
            "doctor_alert_reason": None
        }
    }
    
    risk_level = str(risk_level).upper() if risk_level else "MEDIUM"
    return recommendations.get(risk_level, recommendations["MEDIUM"])

async def get_trip_risk_recommendation(
    destination: str,
    risk_level: str,
    environment: dict,
    patient_profile: dict = None,
    symptom_history: str = None,
):
    """
    Calls Gemini with trip-specific context to generate travel safety recommendations.
    Returns {"success": True/False, "data": {...recommendation...}}
    """
    
    risk_level_upper = str(risk_level).upper() if risk_level else "MEDIUM"
    
    # Build patient profile description
    patient_info = "Not provided"
    if patient_profile:
        details = []
        if patient_profile.get("recent_attacks"):
            details.append(f"{patient_profile['recent_attacks']} recent attacks")
        if patient_profile.get("medication_adherence") == 0:
            details.append("not taking medication regularly")
        if patient_profile.get("smoking"):
            details.append("active smoker")
        if details:
            patient_info = f"Patient with {', '.join(details)}"
    
    # Risk-specific instruction injected into prompt
    risk_instructions = {
        "HIGH": (
            "This is HIGH RISK travel. Strongly advise against travel unless absolutely necessary. "
            "Immediate actions must include comprehensive preparation and contingency plans. "
            "doctor_alert MUST be true. Emphasize dangers and protective measures."
        ),
        "MEDIUM": (
            "This is MEDIUM RISK travel. Travel is possible but requires significant precautions. "
            "Immediate actions should focus on preparation and monitoring. "
            "Preventive steps should cover before, during, and after travel. "
            "doctor_alert only if destination conditions or patient history is particularly concerning."
        ),
        "LOW": (
            "This is LOW RISK travel. Be reassuring and encouraging. "
            "Immediate actions should be routine precautions, not alarms. "
            "Preventive steps should focus on maintenance and emergency preparedness. "
            "doctor_alert should be false."
        )
    }

    risk_instruction = risk_instructions.get(risk_level_upper, risk_instructions["MEDIUM"])

    user_prompt = f"""
    Analyze this asthma patient's travel risk to a destination and provide recommendations.
    
    RISK CONTEXT (READ THIS FIRST):
    {risk_instruction}
    
    TRAVEL DETAILS:
    - Destination: {destination}
    - Computed Risk Level: {risk_level_upper}
    - Patient Profile: {patient_info}
    - Symptom History/Recent Episodes: {symptom_history or 'Not reported'}
    
    DESTINATION CONDITIONS:
    - Air Quality Index (AQI): {environment.get('aqi', 'Unknown')}
    - Temperature: {environment.get('temperature', 'Unknown')}°C
    - Humidity: {environment.get('humidity', 'Unknown')}%
    - Pollen Level: {environment.get('pollen', 'Unknown')}
    - PM2.5: {environment.get('pm25', 'Unknown')} μg/m³
    - Weather: {environment.get('weather_description', 'Unknown')}
    
    TASK:
    Based on BOTH the risk level context AND the specific destination/travel data:
    1. A 1-sentence travel verdict summarizing whether and how the patient can travel
       (must reflect the actual risk level, reference the destination and key hazards)
    2. Exactly 3 immediate action recommendations for pre-travel preparation
       (specific to destination conditions and patient risk level)
    3. Exactly 2 preventive steps for during/after travel
       (LOW = routine precautions, MEDIUM = significant protections, HIGH = emergency protocols)
    4. doctor_alert: follow the risk context instructions above

    Respond ONLY in this exact JSON format, no extra text:

    {{
      "condition_summary": "...",
      "immediate_actions": [
        "action 1",
        "action 2",
        "action 3"
      ],
      "preventive_steps": [
        "step 1",
        "step 2"
      ],
      "doctor_alert": true,
      "doctor_alert_reason": "reason here or null if false"
    }}
    """

    try:
        response_text = get_cached_gemini_response(user_prompt, "general")

        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()

        result = json.loads(response_text)
        return {"success": True, "data": result}
        
    except json.JSONDecodeError as e:
        print(f"Trip risk recommendation JSON parse error: {e}")
        return {
            "success": True,
            "data": get_hardcoded_trip_recommendation(risk_level),
            "source": "fallback"
        }
        
    except Exception as e:
        print(f"Trip risk recommendation Gemini error: {e}")
        return {
            "success": True,
            "data": get_hardcoded_trip_recommendation(risk_level),
            "source": "fallback"
        }


