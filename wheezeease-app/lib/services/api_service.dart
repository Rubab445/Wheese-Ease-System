import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Base URL - Change to your PC's IP for real device testing
  static const String _baseUrl = 'http://localhost:8000';

  // City settings
  static const String _weatherCity = 'Gujrat';
  static const String _aqiCity = 'Lahore';

  // Check if server is running
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

  // Fetch environment data (AQI, humidity, temperature, etc.)
  static Future<Map<String, dynamic>?> getEnvironment() async {
    try {
      final res = await http
          .get(
            Uri.parse(
              '$_baseUrl/environment?city=$_weatherCity&aqi_city=$_aqiCity',
            ),
          )
          .timeout(const Duration(seconds: 20));

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Environment error: $e');
      return null;
    }
  }

  // Main prediction endpoint
  static Future<Map<String, dynamic>?> predict({
    // Symptoms (0 or 1)
    required int wheezing,
    required int coughing,
    required int chestTightness,
    required int inhalerUsage,
    required int breathingDifficulty,
    required int medicationAdherence,
    required int pastAttacks,
    // Clinical features
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
          .timeout(const Duration(seconds: 25));

      print('Response status: ${res.statusCode}');
      print('Response body: ${res.body}');

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Prediction error: $e');
      return null;
    }
  }

  // Quick predict (for home screen live updates)
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
          .timeout(const Duration(seconds: 25));

      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
      return null;
    } catch (e) {
      print('Quick predict error: $e');
      return null;
    }
  }
}
