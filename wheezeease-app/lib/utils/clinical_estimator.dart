/// ClinicalEstimator
///
/// Estimates clinical AI features from onboarding data so patients never need
/// to enter medical values like FEV1. All calculations are based on clinical
/// literature and patient demographics.

class ClinicalEstimator {
  /// Estimates Forced Expiratory Volume in 1 second (FEV1)
  ///
  /// Input:
  ///   - age: Patient age in years
  ///   - gender: 'Male' or 'Female'
  ///   - smoking: Whether patient smokes
  ///   - hasAsthma: Whether patient has asthma diagnosis
  ///   - severity: 'Mild', 'Moderate', or 'Severe'
  ///
  /// Returns: FEV1 value clamped between 1.0 and 4.0 L
  static double estimateFev1({
    required int age,
    required String gender,
    required bool smoking,
    required bool hasAsthma,
    required String severity,
  }) {
    double fev1 = gender.toLowerCase() == 'male' ? 3.2 : 2.7;

    if (age > 65) fev1 -= 0.6;
    if (age > 50) fev1 -= 0.4;
    if (age > 40) fev1 -= 0.2;

    if (smoking) fev1 -= 0.5;
    if (hasAsthma) fev1 -= 0.3;

    if (severity.toLowerCase() == 'moderate') fev1 -= 0.3;
    if (severity.toLowerCase() == 'severe') fev1 -= 0.7;

    return fev1.clamp(1.0, 4.0);
  }

  /// Estimates Forced Vital Capacity (FVC) from FEV1
  ///
  /// Input:
  ///   - fev1: FEV1 value
  ///
  /// Returns: FVC value clamped between 1.5 and 6.0 L
  static double estimateFvc(double fev1) {
    return (fev1 * 1.25).clamp(1.5, 6.0);
  }

  /// Estimates dust exposure from trigger history
  ///
  /// Input:
  ///   - triggers: Trigger string like "Dust, Pollen, Cold air"
  ///
  /// Returns: Dust exposure score (3.0 to 7.0)
  static double estimateDustExposure(String triggers) {
    final triggersLower = triggers.toLowerCase();
    if (triggersLower.contains('dust')) return 7.0;
    if (triggersLower.contains('pollen')) return 5.0;
    return 3.0;
  }

  /// Checks if patient has any allergies from conditions list
  ///
  /// Input:
  ///   - conditions: Set of condition names selected by patient
  ///
  /// Returns: 1 if patient has allergies, 0 otherwise
  static int hasAllergies(Set<String> conditions) {
    final allergies = {
      'Seasonal Allergy',
      'Dust Allergy',
      'Pollen Allergy',
      'Pet Allergy',
      'Food Allergy',
    };
    return conditions.any((c) => allergies.contains(c)) ? 1 : 0;
  }

  /// Checks if patient has hay fever from conditions
  ///
  /// Input:
  ///   - conditions: Set of condition names selected by patient
  ///
  /// Returns: 1 if patient has hay fever, 0 otherwise
  static int hasHayFever(Set<String> conditions) {
    return (conditions.contains('Seasonal Allergy') ||
            conditions.contains('Pollen Allergy'))
        ? 1
        : 0;
  }

  /// Checks if patient has eczema based on condition count
  ///
  /// Input:
  ///   - conditions: Set of condition names selected by patient
  ///
  /// Returns: 1 if patient has multiple conditions suggesting eczema, 0 otherwise
  static int hasEczema(Set<String> conditions) {
    return conditions.length >= 3 ? 1 : 0;
  }

  /// Estimates number of past asthma attacks
  ///
  /// Input:
  ///   - conditions: Set of condition names selected by patient
  ///   - age: Patient age in years
  ///
  /// Returns: Estimated past attacks count (0-9)
  static int estimatePastAttacks(Set<String> conditions, int age) {
    int pastAttacks = conditions.contains('Asthma') ? 3 : 0;
    if (age > 40) pastAttacks += 1;
    if (conditions.length > 3) pastAttacks += 1;
    return pastAttacks.clamp(0, 9);
  }

  /// Maps physical activity level to numeric score
  ///
  /// Input:
  ///   - level: 'Low', 'Moderate', or 'High'
  ///
  /// Returns: Physical activity score
  static double mapPhysicalActivity(String level) {
    switch (level.toLowerCase()) {
      case 'low':
        return 2.0;
      case 'moderate':
        return 5.0;
      case 'high':
        return 8.0;
      default:
        return 5.0;
    }
  }

  /// Builds the complete clinical profile for AI prediction
  ///
  /// Calls all estimation methods and returns a map of clinical features
  /// for use with the ML model.
  ///
  /// Input:
  ///   - age: Patient age
  ///   - gender: Patient gender
  ///   - smoking: Whether patient smokes
  ///   - familyHistoryAsthma: Whether patient has family history of asthma
  ///   - physicalActivityLevel: Activity level (Low/Moderate/High)
  ///   - conditions: Set of patient conditions
  ///   - triggers: Known asthma triggers
  ///   - severity: Default asthma severity (Mild/Moderate/Severe)
  ///   - bmi: Body Mass Index
  ///
  /// Returns: Map<String, dynamic> with ML-ready clinical features
  static Map<String, dynamic> buildClinicalProfile({
    required int age,
    required String gender,
    required bool smoking,
    required bool familyHistoryAsthma,
    required String physicalActivityLevel,
    required Set<String> conditions,
    required String triggers,
    required String severity,
    required double bmi,
  }) {
    final fev1 = estimateFev1(
      age: age,
      gender: gender,
      smoking: smoking,
      hasAsthma: conditions.contains('Asthma'),
      severity: severity,
    );

    return {
      'lung_function_fev1': fev1,
      'lung_function_fvc': estimateFvc(fev1),
      'bmi': bmi,
      'smoking': smoking ? 1 : 0,
      'physical_activity': mapPhysicalActivity(physicalActivityLevel),
      'family_history_asthma': familyHistoryAsthma ? 1 : 0,
      'history_of_allergies': hasAllergies(conditions),
      'hay_fever': hasHayFever(conditions),
      'eczema': hasEczema(conditions),
      'dust_exposure': estimateDustExposure(triggers),
      'past_attacks': estimatePastAttacks(conditions, age),
      'medication_adherence': 1, // Default to 1 (good adherence)
    };
  }
}
