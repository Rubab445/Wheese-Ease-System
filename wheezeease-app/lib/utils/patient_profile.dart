import 'clinical_estimator.dart';

/// PatientProfile
///
/// Stores the patient profile in memory so all screens can access it
/// without passing data around. Static variables hold all onboarding data
/// and the computed clinical profile.

class PatientProfile {
  // Patient demographics
  static String name = '';
  static int age = 28;
  static String gender = 'Female';

  // Health status
  static bool smoking = false;
  static bool familyHistory = false;
  static String activityLevel = 'Moderate';

  // Medical information
  static Set<String> conditions = {};
  static String triggers = '';

  // Computed clinical profile for ML predictions
  static Map<String, dynamic> clinicalProfile = {};

  /// Saves the patient profile by computing clinical estimates
  ///
  /// This method should be called after the onboarding is complete.
  /// It uses the onboarding data to build a clinical profile that will
  /// be used for all future predictions.
  ///
  /// Default severity: 'Moderate' (can be adjusted based on user input)
  /// Default BMI: 24.0 (normal weight baseline)
  static void save({String severity = 'Moderate', double bmi = 24.0}) {
    clinicalProfile = ClinicalEstimator.buildClinicalProfile(
      age: age,
      gender: gender,
      smoking: smoking,
      familyHistoryAsthma: familyHistory,
      physicalActivityLevel: activityLevel,
      conditions: conditions,
      triggers: triggers,
      severity: severity,
      bmi: bmi,
    );
  }

  /// Gets a clinical value from the profile
  ///
  /// Returns the value for the given key from clinicalProfile,
  /// or the defaultValue if not found.
  ///
  /// Example:
  ///   double fev1 = PatientProfile.getClinicalValue('lung_function_fev1', 2.5);
  static dynamic getClinicalValue(String key, dynamic defaultValue) {
    return clinicalProfile[key] ?? defaultValue;
  }

  /// Clears all patient data (for logout/reset)
  static void clear() {
    name = '';
    age = 28;
    gender = 'Female';
    smoking = false;
    familyHistory = false;
    activityLevel = 'Moderate';
    conditions.clear();
    triggers = '';
    clinicalProfile.clear();
  }

  /// Gets all patient data as a readable map (useful for debugging/logging)
  static Map<String, dynamic> toMap() {
    return {
      'name': name,
      'age': age,
      'gender': gender,
      'smoking': smoking,
      'familyHistory': familyHistory,
      'activityLevel': activityLevel,
      'conditions': conditions.toList(),
      'triggers': triggers,
      'clinicalProfile': clinicalProfile,
    };
  }
}
