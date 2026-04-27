import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Base URL - configurable via environment variable
  // For PC testing: flutter run
  // For mobile testing: flutter run --dart-define=API_BASE_URL=http://10.109.68.93:8000
  static const String _baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://localhost:8000',
  );

  // City settings
  static const String _weatherCity = 'Gujrat';
  static const String _aqiCity = 'Lahore';

  // Timeout
  static const Duration _timeout = Duration(seconds: 15);

  // HEALTH CHECK
  static Future<bool> checkHealth() async {
    try {
      final res = await http
          .get(Uri.parse('$_baseUrl/health'))
          .timeout(const Duration(seconds: 5));
      return res.statusCode == 200;
    } catch (e) {
      print('Health check error: $e');
      return false;
    }
  }

  // ENVIRONMENT DATA
  static Future<Map<String, dynamic>?> getEnvironment() async {
    try {
      final res = await http
          .get(
            Uri.parse(
              '$_baseUrl/environment?city=$_weatherCity&aqi_city=$_aqiCity',
            ),
          )
          .timeout(_timeout);

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Environment error: $e');
      return null;
    }
  }

  // FULL PREDICTION
  static Future<Map<String, dynamic>?> predict({
    required int wheezing,
    required int coughing,
    required int chestTightness,
    required int inhalerUsage,
    required int breathingDifficulty,
    required int medicationAdherence,
    required int pastAttacks,
    required double lungFunctionFev1,
    required double lungFunctionFvc,
    required double bmi,
    required int smoking,
    required double physicalActivity,
    required int familyHistoryAsthma,
    required int historyOfAllergies,
    required int hayFever,
    required int eczema,
    required double dustExposure,
  }) async {
    try {
      final body = jsonEncode({
        "city": _weatherCity,
        "aqi_city": _aqiCity,
        "wheezing": wheezing,
        "coughing": coughing,
        "chest_tightness": chestTightness,
        "inhaler_usage": inhalerUsage,
        "breathing_difficulty": breathingDifficulty,
        "medication_adherence": medicationAdherence,
        "past_attacks": pastAttacks,
        "lung_function_fev1": lungFunctionFev1,
        "lung_function_fvc": lungFunctionFvc,
        "bmi": bmi,
        "smoking": smoking,
        "physical_activity": physicalActivity,
        "family_history_asthma": familyHistoryAsthma,
        "history_of_allergies": historyOfAllergies,
        "hay_fever": hayFever,
        "eczema": eczema,
        "dust_exposure": dustExposure,
      });

      print('Sending prediction request...');
      final res = await http
          .post(
            Uri.parse('$_baseUrl/predict'),
            headers: {'Content-Type': 'application/json'},
            body: body,
          )
          .timeout(_timeout);

      print('Response status: ${res.statusCode}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Prediction error: $e');
      return null;
    }
  }

  // QUICK PREDICT (home screen live refresh)
  static Future<Map<String, dynamic>?> quickPredict({
    required Map<String, dynamic> patientData,
  }) async {
    try {
      final body = jsonEncode({
        ...patientData,
        "city": _weatherCity,
        "aqi_city": _aqiCity,
      });

      final res = await http
          .post(
            Uri.parse('$_baseUrl/predict'),
            headers: {'Content-Type': 'application/json'},
            body: body,
          )
          .timeout(_timeout);

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Quick predict error: $e');
      return null;
    }
  }

  // GET GEMINI RECOMMENDATION (chains after predict)
  static Future<Map<String, dynamic>?> getRecommendation({
    required String riskLevel,
    double? aqi,
    double? humidity,
    double? temperature,
    String? symptoms,
    String? weatherDescription,
    int? age,
    String? gender,
  }) async {
    try {
      final body = jsonEncode({
        "risk_level": riskLevel,
        "aqi": aqi,
        "humidity": humidity,
        "temperature": temperature,
        "symptoms": symptoms,
        "weather_description": weatherDescription,
        "age": age,
        "gender": gender,
      });

      print('Fetching Gemini recommendation for risk=$riskLevel...');
      final res = await http
          .post(
            Uri.parse('$_baseUrl/get-recommendation'),
            headers: {'Content-Type': 'application/json'},
            body: body,
          )
          .timeout(const Duration(seconds: 25));

      print('Recommendation status: ${res.statusCode}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Recommendation error: $e');
      return null;
    }
  }

  // EXERCISE LOGGING
  static Future<Map<String, dynamic>?> logExercise({
    required String exerciseType,
    required int duration,
    required String intensity,
    required bool indoor,
    required bool usedInhaler,
    // Replaced hadSymptoms: bool with structured symptom data
    List<String> symptomsReported = const [],
    String? symptomSeverity,
    String? symptomNotes,
  }) async {
    try {
      final body = jsonEncode({
        "exercise_type": exerciseType,
        "duration": duration,
        "intensity": intensity,
        "indoor": indoor,
        "used_inhaler": usedInhaler,
        // Send list — backend expects List[str], empty list = no symptoms
        "symptoms_reported": symptomsReported,
        // Only send if not null — backend treats null as "not provided"
        "symptom_severity": ?symptomSeverity,
        "symptom_notes": ?symptomNotes,
        "city": _weatherCity,
      });

      print('Logging exercise: $exerciseType, symptoms: $symptomsReported...');
      final res = await http
          .post(
            Uri.parse('$_baseUrl/activity/exercise'),
            headers: {'Content-Type': 'application/json'},
            body: body,
          )
          .timeout(_timeout);

      print('Exercise log status: ${res.statusCode}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Exercise log error: $e');
      return null;
    }
  }

  // HOUSEHOLD ACTIVITY LOGGING
  static Future<Map<String, dynamic>?> logHouseholdActivity({
    required String activityType,
    required int duration,
    required bool woreMask,
    // Replaced hadSymptoms: bool with structured symptom data
    List<String> symptomsReported = const [],
    String? symptomSeverity,
    String? symptomNotes,
  }) async {
    try {
      final body = jsonEncode({
        "activity_type": activityType,
        "duration": duration,
        "wore_mask": woreMask,
        // Send list — backend expects List[str], empty list = no symptoms
        "symptoms_reported": symptomsReported,
        // Only send if not null
        "symptom_severity": ?symptomSeverity,
        "symptom_notes": ?symptomNotes,
        "city": _weatherCity,
      });

      print(
        'Logging household activity: $activityType, symptoms: $symptomsReported...',
      );
      final res = await http
          .post(
            Uri.parse('$_baseUrl/activity/household'),
            headers: {'Content-Type': 'application/json'},
            body: body,
          )
          .timeout(_timeout);

      print('Household activity status: ${res.statusCode}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Household activity error: $e');
      return null;
    }
  }

  // TRIP RISK CHECK
  static Future<Map<String, dynamic>?> checkTripRisk({
    required String destination,
    required Map<String, dynamic> patientProfile,
  }) async {
    try {
      final params = <String, String>{'destination': destination};

      patientProfile.forEach((key, value) {
        if (value != null) {
          params[key] = value.toString();
        }
      });

      final uri = Uri.parse(
        '$_baseUrl/trip-risk',
      ).replace(queryParameters: params);

      print('Checking trip risk for: $destination');
      final res = await http.get(uri).timeout(_timeout);

      print('Trip risk status: ${res.statusCode}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      } else {
        print('Trip risk error body: ${res.body}');
      }
      return null;
    } catch (e) {
      print('Trip risk error: $e');
      return null;
    }
  }

  // ENVIRONMENT BY COORDINATES (passive location monitoring)
  static Future<Map<String, dynamic>?> getEnvironmentByCoords(
    double lat,
    double lon,
  ) async {
    try {
      final uri = Uri.parse(
        '$_baseUrl/environment/coords?lat=$lat&lon=$lon',
      );

      print('Fetching environment for coords: $lat, $lon');
      final res = await http.get(uri).timeout(_timeout);

      print('Environment coords status: ${res.statusCode}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Environment coords error: $e');
      return null;
    }
  }
}
