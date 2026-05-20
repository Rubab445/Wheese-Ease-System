import 'package:supabase_flutter/supabase_flutter.dart';

class PredictionLogService {
  static final _supabase = Supabase.instance.client;

  static Future<void> savePrediction({
    required Map<String, dynamic> result,
    required Map<String, dynamic> patientData,
  }) async {
    final user = _supabase.auth.currentUser;

    if (user == null) return;

    await _supabase.from('prediction_logs').insert({
      // USER
      'user_id': user.id,

      // AI RESULT
      'risk_level': result['risk_level'],
      'icon': result['icon'],
      'color': result['color'],
      'main_message': result['main_message'],
      'confidence': result['confidence'],

      // PROBABILITIES
      'low_probability': result['probabilities']['low'],
      'medium_probability': result['probabilities']['medium'],
      'high_probability': result['probabilities']['high'],

      // TEXT OUTPUT
      'advice': result['advice'],
      'reasons': List<String>.from(result['reasons'] ?? []),
      'alerts': List<String>.from(result['alerts'] ?? []),

      // ENVIRONMENT
      'environment': result['environment'],

      // MODEL
      'models_used': result['models_used'],

      // PATIENT DATA
      'age': patientData['age'],
      'gender': patientData['gender'],
      'bmi': patientData['bmi'],
      'smoking': patientData['smoking'],
      'family_history_ast': patientData['family_history_asthma'],

      'wheezing': patientData['wheezing'],
      'coughing': patientData['coughing'],
      'chest_tightness': patientData['chest_tightness'],
      'inhaler_usage': patientData['inhaler_usage'],
      'breathing_difficulty': patientData['breathing_difficulty'],
      'medication_adher': patientData['medication_adherence'],
      'past_attacks': patientData['past_attacks'],

      'lung_function_fev': patientData['lung_function_fev1'],
      'lung_function_fvc': patientData['lung_function_fvc'],

      'physical_activity': patientData['physical_activity'],
      'history_of_allergie': patientData['history_of_allergies'],
      'hay_fever': patientData['hay_fever'],
      'eczema': patientData['eczema'],
      'dust_exposure': patientData['dust_exposure'],
    });
  }
}