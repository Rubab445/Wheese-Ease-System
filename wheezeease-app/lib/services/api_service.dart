import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Base URL
  static const String _baseUrl = 'http://localhost:8000';

  // City settings
  static const String _weatherCity = 'Gujrat';
  static const String _aqiCity     = 'Lahore';

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
          .get(Uri.parse(
              '$_baseUrl/environment?city=$_weatherCity&aqi_city=$_aqiCity'))
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
    required int    wheezing,
    required int    coughing,
    required int    chestTightness,
    required int    inhalerUsage,
    required int    breathingDifficulty,
    required int    medicationAdherence,
    required int    pastAttacks,
    required double lungFunctionFev1,
    required double lungFunctionFvc,
    required double bmi,
    required int    smoking,
    required double physicalActivity,
    required int    familyHistoryAsthma,
    required int    historyOfAllergies,
    required int    hayFever,
    required int    eczema,
    required double dustExposure,
  }) async {
    try {
      final body = jsonEncode({
        "city":                   _weatherCity,
        "aqi_city":               _aqiCity,
        "wheezing":               wheezing,
        "coughing":               coughing,
        "chest_tightness":        chestTightness,
        "inhaler_usage":          inhalerUsage,
        "breathing_difficulty":   breathingDifficulty,
        "medication_adherence":   medicationAdherence,
        "past_attacks":           pastAttacks,
        "lung_function_fev1":     lungFunctionFev1,
        "lung_function_fvc":      lungFunctionFvc,
        "bmi":                    bmi,
        "smoking":                smoking,
        "physical_activity":      physicalActivity,
        "family_history_asthma":  familyHistoryAsthma,
        "history_of_allergies":   historyOfAllergies,
        "hay_fever":              hayFever,
        "eczema":                 eczema,
        "dust_exposure":          dustExposure,
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
        "city":     _weatherCity,
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

  // TRIP RISK CHECK
  static Future<Map<String, dynamic>?> checkTripRisk({
    required String destination,
    required Map<String, dynamic> patientProfile,
  }) async {
    try {
      // Build query parameters
      final params = <String, String>{
        'destination': destination,
      };

      // Add all patient profile values as strings
      patientProfile.forEach((key, value) {
        if (value != null) {
          params[key] = value.toString();
        }
      });

      final uri = Uri.parse('$_baseUrl/trip-risk')
          .replace(queryParameters: params);

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
}