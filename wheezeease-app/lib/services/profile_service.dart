import 'package:supabase_flutter/supabase_flutter.dart';

class ProfileService {
  static final supabase = Supabase.instance.client;

  static Future<void> saveProfile({
  required String fullName,
  required int age,
  required String gender,

  required List<String> conditions,
  required List<String> medications,
  required List<String> allergies,

  required bool smoking,
  required String activityLevel,

  double? heightCm,
  double? weightKg,
  double? bmi,
  bool? familyHistory,

  String? city,
  String? country,
  String? doctorId,
}) async {
    final user = supabase.auth.currentUser;

    if (user == null) {
      throw Exception('User not logged in');
    }

    await supabase.from('profiles').upsert({
  'id': user.id,

  'full_name': fullName,
  'age': age,
  'gender': gender,

  'height_cm': heightCm,
  'weight_kg': weightKg,
  'bmi': bmi,

  'conditions': conditions.join(', '),
  'medications': medications.join(', '),
  'allergies': allergies.join(', '),

  'smoking': smoking,
  'family_history_asthma': familyHistory,
  'activity_level': activityLevel,

  'onboarding_completed': true,

  'city': city,
  'country': country,
  if (doctorId != null) 'doctor_id': doctorId,
});
  }

  static Future<Map<String, dynamic>?> getProfile() async {
    final user = supabase.auth.currentUser;

    if (user == null) return null;

    final response = await supabase
        .from('profiles')
        .select()
        .eq('id', user.id)
        .single();

    return response;
  }
}