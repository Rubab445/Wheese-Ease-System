import 'package:supabase_flutter/supabase_flutter.dart';

class ActivityLogService {
  static final _supabase = Supabase.instance.client;

  // ── SAVE EXERCISE LOG ─────────────────────────────────────────────────
  static Future<void> saveExerciseLog({
    required String exerciseType,
    required int duration,
    required String intensity,
    required bool indoor,
    required bool usedInhaler,
    required List<String> symptomsReported,
    String? symptomNotes,
    required String riskLevel,
    Map<String, dynamic>? environment,
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return;

    await _supabase.from('activity_logs').insert({
      'user_id': user.id,
      'type': 'exercise',
      'risk_level': riskLevel,
      'data': {
        'exercise_type': exerciseType,
        'duration': duration,
        'intensity': intensity,
        'indoor': indoor,
        'used_inhaler': usedInhaler,
        'symptoms_reported': symptomsReported,
        'symptom_notes': symptomNotes,
        'environment': environment,
      },
    });
  }

  // ── SAVE HOUSEHOLD LOG ────────────────────────────────────────────────
  static Future<void> saveHouseholdLog({
    required String activityType,
    required int duration,
    required bool woreMask,
    required List<String> symptomsReported,
    String? symptomNotes,
    required String riskLevel,
    String? trigger,
    Map<String, dynamic>? environment,
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return;

    await _supabase.from('activity_logs').insert({
      'user_id': user.id,
      'type': 'household',
      'risk_level': riskLevel,
      'data': {
        'activity_type': activityType,
        'duration': duration,
        'wore_mask': woreMask,
        'symptoms_reported': symptomsReported,
        'symptom_notes': symptomNotes,
        'trigger': trigger,
        'environment': environment,
      },
    });
  }

  // ── SAVE TRIP LOG ─────────────────────────────────────────────────────
  static Future<void> saveTripLog({
    required String destination,
    required String riskLevel,
    Map<String, dynamic>? environment,
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return;

    await _supabase.from('activity_logs').insert({
      'user_id': user.id,
      'type': 'trip',
      'risk_level': riskLevel,
      'data': {
        'destination': destination,
        'environment': environment,
      },
    });
  }

  // ── SAVE CHECKIN LOG ──────────────────────────────────────────────────
  static Future<void> saveCheckinLog({
    required List<String> symptoms,
    required String severity,
    required int mood,
    String? notes,
    required String riskLevel,
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return;

    await _supabase.from('activity_logs').insert({
      'user_id': user.id,
      'type': 'checkin',
      'risk_level': riskLevel,
      'data': {
        'symptoms': symptoms,
        'severity': severity,
        'mood': mood,
        'notes': notes,
      },
    });
  }

  // ── FETCH SYMPTOM HISTORY (for home screen graphs) ───────────────────
  static Future<List<Map<String, dynamic>>> getSymptomHistory({
    String period = 'week',
  }) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return [];

    final days = period == 'month' ? 30 : 7;
    final since = DateTime.now().subtract(Duration(days: days)).toIso8601String();

    final data = await _supabase
        .from('prediction_logs')
        .select(
          'wheezing, coughing, chest_tightness, inhaler_usage, breathing_difficulty, created_at',
        )
        .eq('user_id', user.id)
        .gte('created_at', since)
        .order('created_at', ascending: true);

    return List<Map<String, dynamic>>.from(data);
  }

  // ── FETCH RECENT LOGS (for history screen) ────────────────────────────
  static Future<List<Map<String, dynamic>>> getRecentLogs({int limit = 60}) async {
    final user = _supabase.auth.currentUser;
    if (user == null) return [];

    final response = await _supabase
        .from('activity_logs')
        .select()
        .eq('user_id', user.id)
        .order('created_at', ascending: false)
        .limit(limit);

    return List<Map<String, dynamic>>.from(response);
  }
}
