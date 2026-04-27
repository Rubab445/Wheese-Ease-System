import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';
import '../models/prediction_result.dart';
import '../utils/patient_profile.dart';

class CheckinScreen extends StatefulWidget {
  final VoidCallback onComplete;
  final Function(Map<String, dynamic>) onPatientDataUpdate;

  const CheckinScreen({
    super.key,
    required this.onComplete,
    required this.onPatientDataUpdate,
  });

  @override
  State<CheckinScreen> createState() => _CheckinScreenState();
}

class _CheckinScreenState extends State<CheckinScreen> {
  bool _submitted = false;
  bool _loading = false;
  late PredictionResult _predictionResult;
  int _inhalerCount = 4;
  // _intensity is now derived from per-symptom intensities (kept for submission logic)
  int _selectedMood = 2; // 0-4
  final _notesController = TextEditingController(
    text: 'Worse after going outside this morning. Used inhaler twice.',
  );

  // Gemini recommendation state
  Map<String, dynamic>? _recommendation;
  bool _recommendationLoading = false;

  final List<Map<String, dynamic>> _symptoms = [
    {
      'icon': Icons.volume_up_outlined,
      'name': 'Coughing',
      'sub': 'Dry or wet',
      'selected': false,
      'expanded': false,
      'intensity': null, // null = not chosen yet
    },
    {
      'icon': Icons.air_rounded,
      'name': 'Wheezing',
      'sub': 'Whistling breath',
      'selected': false,
      'expanded': false,
      'intensity': null,
    },
    {
      'icon': Icons.emergency_outlined,
      'name': 'Shortness',
      'sub': 'Hard to breathe',
      'selected': false,
      'expanded': false,
      'intensity': null,
    },
    {
      'icon': Icons.battery_1_bar_rounded,
      'name': 'Fatigue',
      'sub': 'Low energy',
      'selected': false,
      'expanded': false,
      'intensity': null,
    },
    {
      'icon': Icons.water_drop_outlined,
      'name': 'Runny Nose',
      'sub': 'Nasal congestion',
      'selected': false,
      'expanded': false,
      'intensity': null,
    },
    {
      'icon': Icons.check_circle_outline,
      'name': 'None',
      'sub': 'Feeling fine!',
      'selected': false,
      'expanded': false,
      'intensity': null,
    },
  ];

  final List<IconData> _moodIcons = [
    Icons.sentiment_very_satisfied_outlined,
    Icons.sentiment_satisfied_outlined,
    Icons.sentiment_neutral_outlined,
    Icons.sentiment_dissatisfied_outlined,
    Icons.sentiment_very_dissatisfied_outlined,
  ];

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  /// Derives the worst intensity across all selected symptoms for submission
  String get _intensity {
    final selectedSymptoms = _symptoms.where(
      (s) => s['selected'] == true && s['name'] != 'None',
    );
    if (selectedSymptoms.isEmpty) return 'mild';
    // Priority: sev > mod > mild
    if (selectedSymptoms.any((s) => s['intensity'] == 'sev')) return 'sev';
    if (selectedSymptoms.any((s) => s['intensity'] == 'mod')) return 'mod';
    return 'mild';
  }

  // Build a text summary of selected symptoms for Gemini
  String _buildSymptomsText() {
    final selected = _symptoms
        .where((s) => s['selected'] == true && s['name'] != 'None')
        .toList();
    if (selected.isEmpty) return 'No symptoms reported';
    final parts = selected.map((s) {
      final name = s['name'] as String;
      final intensityVal = s['intensity'] as String?;
      final label = intensityVal == 'mild'
          ? 'Mild'
          : intensityVal == 'sev'
              ? 'Severe'
              : 'Moderate';
      return '$name ($label)';
    });
    return parts.join(', ');
  }

  void _submitCheckin() async {
    setState(() {
      _loading = true;
      _recommendation = null;
      _recommendationLoading = true;
    });

    // Collect form data
    final coughing = _symptoms[0]['selected'] ? 1 : 0;
    final wheezing = _symptoms[1]['selected'] ? 1 : 0;
    final breathingDifficulty = _symptoms[2]['selected'] ? 1 : 0;

    // Map intensity to breathing difficulty level (1=Mild, 2=Moderate, 3=Severe)
    int breathingLevel = 1; // default
    if (_intensity == 'mod') breathingLevel = 2;
    if (_intensity == 'sev') breathingLevel = 3;

    // Store patient data
    final patientData = {
      'wheezing': wheezing,
      'coughing': coughing,
      'chest_tightness': 0,
      'inhaler_usage': _inhalerCount,
      'breathing_difficulty': breathingDifficulty,
      'medication_adherence': 1,
      'past_attacks': 0,
      'lung_function_fev1': 0.8,
      'lung_function_fvc': 1.0,
      'bmi': 24.0,
      'smoking': 0,
      'physical_activity': 3.0,
      'family_history_asthma': 0,
      'history_of_allergies': 0,
      'hay_fever': 0,
      'eczema': 0,
      'dust_exposure': 0.5,
    };

    // ── Step 1: ML Prediction (silent — user sees "Loading Recommendations...") ──
    final result = await ApiService.predict(
      wheezing: wheezing,
      coughing: coughing,
      chestTightness: 0,
      inhalerUsage: _inhalerCount.clamp(0, 5),
      breathingDifficulty: breathingLevel,
      medicationAdherence: PatientProfile.getClinicalValue(
        'medication_adherence',
        1,
      ),
      pastAttacks: PatientProfile.getClinicalValue('past_attacks', 2),
      lungFunctionFev1: PatientProfile.getClinicalValue(
        'lung_function_fev1',
        2.5,
      ),
      lungFunctionFvc: PatientProfile.getClinicalValue(
        'lung_function_fvc',
        3.5,
      ),
      bmi: PatientProfile.getClinicalValue('bmi', 24.0),
      smoking: PatientProfile.getClinicalValue('smoking', 0),
      physicalActivity: PatientProfile.getClinicalValue(
        'physical_activity',
        5.0,
      ),
      familyHistoryAsthma: PatientProfile.getClinicalValue(
        'family_history_asthma',
        0,
      ),
      historyOfAllergies: PatientProfile.getClinicalValue(
        'history_of_allergies',
        0,
      ),
      hayFever: PatientProfile.getClinicalValue('hay_fever', 0),
      eczema: PatientProfile.getClinicalValue('eczema', 0),
      dustExposure: PatientProfile.getClinicalValue('dust_exposure', 3.0),
    );

    if (!mounted) return;

    if (result == null) {
      setState(() {
        _loading = false;
        _recommendationLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Failed to get prediction. Check server.'),
        ),
      );
      return;
    }

    // Parse prediction (keep internally, don't show ML card to user)
    final prediction = PredictionResult.fromJson(result);
    setState(() {
      _predictionResult = prediction;
      _submitted = true;
      _loading = false;
      // Keep _recommendationLoading = true → user sees "Loading Recommendations..."
      widget.onPatientDataUpdate(patientData);
    });

    // ── Step 2: Gemini Recommendation ──
    final env = result['environment'] as Map<String, dynamic>?;

    final recResult = await ApiService.getRecommendation(
      riskLevel: prediction.riskLevel,
      aqi: (env?['AQI'] as num?)?.toDouble(),
      humidity: (env?['humidity'] as num?)?.toDouble(),
      temperature: (env?['temperature'] as num?)?.toDouble(),
      symptoms: _buildSymptomsText(),
      weatherDescription: env?['description'] as String?,
      age: PatientProfile.age,
      gender: PatientProfile.gender,
    );

    if (!mounted) return;

    setState(() {
      _recommendationLoading = false;
      if (recResult != null && recResult['success'] == true) {
        _recommendation = recResult['data'] as Map<String, dynamic>?;
      } else if (recResult != null && recResult['data'] != null) {
        if (recResult['data'] is Map<String, dynamic>) {
          _recommendation = recResult['data'] as Map<String, dynamic>;
        }
      }

      // ── Fallback: build recommendation from ML model if Gemini failed ──
      _recommendation ??= _buildFallbackRecommendation(prediction);
    });
  }

  /// Builds a recommendation map from ML prediction data when Gemini is unavailable
  Map<String, dynamic> _buildFallbackRecommendation(PredictionResult prediction) {
    // Use ML advice as summary
    String summary = prediction.advice.isNotEmpty
        ? prediction.advice
        : 'Your risk level is ${prediction.riskLevel}. Please follow the recommendations below.';

    // Build immediate actions from ML reasons/alerts
    List<String> immediateActions = [];
    if (prediction.alerts.isNotEmpty) {
      immediateActions.addAll(prediction.alerts);
    }
    if (prediction.reasons.isNotEmpty) {
      for (final reason in prediction.reasons) {
        if (immediateActions.length >= 3) break;
        immediateActions.add(reason);
      }
    }
    // Fill with defaults if needed
    if (immediateActions.isEmpty) {
      if (prediction.riskLevel == 'HIGH') {
        immediateActions = [
          'Use your rescue inhaler immediately if symptoms are present',
          'Move to a clean, well-ventilated indoor area',
          'Seek emergency medical help if breathing does not improve',
        ];
      } else if (prediction.riskLevel == 'MEDIUM') {
        immediateActions = [
          'Take prescribed controller medication as directed',
          'Avoid outdoor activity if air quality is poor',
          'Stay hydrated and rest in a clean environment',
        ];
      } else {
        immediateActions = [
          'Continue regular medication schedule as prescribed',
          'Keep rescue inhaler accessible at all times',
          'Maintain good indoor air quality at home',
        ];
      }
    }

    // Build preventive steps
    List<String> preventiveSteps;
    if (prediction.riskLevel == 'HIGH') {
      preventiveSteps = [
        'Avoid all known triggers including smoke, dust, and strong odors',
        'Monitor symptoms every few hours and keep medication nearby',
      ];
    } else if (prediction.riskLevel == 'MEDIUM') {
      preventiveSteps = [
        'Track symptoms daily and note any worsening patterns',
        'Schedule a routine checkup with your doctor this week',
      ];
    } else {
      preventiveSteps = [
        'Exercise in low-pollution environments and avoid peak traffic hours',
        'Stay updated on local air quality and weather forecasts',
      ];
    }

    return {
      'condition_summary': summary,
      'immediate_actions': immediateActions,
      'preventive_steps': preventiveSteps,
      'doctor_alert': prediction.riskLevel == 'HIGH',
      'doctor_alert_reason': prediction.riskLevel == 'HIGH'
          ? 'High risk score requires urgent medical evaluation'
          : null,
    };
  }

  void _resetCheckin() {
    setState(() => _submitted = false);
    widget.onComplete();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        Container(
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top + 22,
            left: 22,
            right: 22,
            bottom: 32,
          ),
          decoration: BoxDecoration(
            gradient: Theme.of(context).brightness == Brightness.dark
                ? AppColors.primaryGradientDark
                : AppColors.primaryGradient,
            borderRadius: BorderRadius.only(
              bottomLeft: Radius.circular(34),
              bottomRight: Radius.circular(34),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Daily Check-In',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'How are you feeling right now?',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              const Icon(Icons.assignment_outlined, color: Colors.white, size: 34),
            ],
          ),
        ),

        Expanded(child: _submitted ? _buildResult() : _buildForm()),
      ],
    );
  }

  Widget _buildForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Symptoms
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 10),
            child: Text(
              'Select your symptoms',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: AppColors.textColor(context),
              ),
            ),
          ),
          // Expandable symptom cards in 2-column layout
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: _buildSymptomGrid(),
          ),

          // Inhaler usage
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 10),
            child: Text(
              'Inhaler usage today',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: AppColors.textColor(context),
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 18),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surfaceColor(context),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.borderColor(context)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.08),
                  blurRadius: 24,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: AppColors.primaryColor(context).withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.air_rounded,
                    color: AppColors.primaryColor(context),
                    size: 22,
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Rescue Inhaler',
                        style: GoogleFonts.nunito(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textColor(context),
                        ),
                      ),
                      Text(
                        'Times used today',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          color: AppColors.textMutedColor(context),
                        ),
                      ),
                    ],
                  ),
                ),
                _counterBtn(
                  '−',
                  () => setState(
                    () => _inhalerCount = (_inhalerCount - 1).clamp(0, 20),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  '$_inhalerCount',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textColor(context),
                  ),
                ),
                const SizedBox(width: 10),
                _counterBtn(
                  '+',
                  () => setState(
                    () => _inhalerCount = (_inhalerCount + 1).clamp(0, 20),
                  ),
                ),
              ],
            ),
          ),

          // Mood
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 10),
            child: Text(
              'Overall mood',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: AppColors.textColor(context),
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(5, (i) {
              final selected = i == _selectedMood;
              final moodColor = i <= 1
                  ? AppColors.green
                  : i == 2
                  ? AppColors.yellow
                  : AppColors.red;
              return GestureDetector(
                onTap: () => setState(() => _selectedMood = i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: selected ? 56 : 50,
                  height: selected ? 56 : 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: selected
                        ? moodColor.withOpacity(0.12)
                        : AppColors.surfaceColor(context),
                    border: Border.all(
                      color: selected
                          ? moodColor
                          : AppColors.borderColor(context),
                      width: 2,
                    ),
                  ),
                  child: Center(
                    child: Icon(
                      _moodIcons[i],
                      color: moodColor,
                      size: selected ? 28 : 24,
                    ),
                  ),
                ),
              );
            }),
          ),

          // Notes
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Any notes?',
                  style: GoogleFonts.nunito(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textColor(context),
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _notesController,
                  maxLines: 3,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    color: AppColors.textColor(context),
                    height: 1.6,
                  ),
                  decoration: InputDecoration(
                    hintText: 'e.g. Worse after going outside...',
                    hintStyle: GoogleFonts.nunito(
                      fontSize: 13,
                      color: AppColors.textDimColor(context),
                    ),
                    filled: true,
                    fillColor: AppColors.surfaceColor(context),
                    contentPadding: const EdgeInsets.all(14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: AppColors.borderColor(context), width: 2),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: AppColors.borderColor(context), width: 2),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(
                        color: AppColors.primaryColor(context),
                        width: 2,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Submit button
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 14, 18, 20),
            child: GestureDetector(
              onTap: _loading ? null : _submitCheckin,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  gradient: _loading
                      ? const LinearGradient(colors: [Colors.grey, Colors.grey])
                      : AppColors.greenGradient,
                ),
                child: Center(
                  child: _loading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              Colors.white,
                            ),
                            strokeWidth: 2,
                          ),
                        )
                      : Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Submit Check-In',
                              style: GoogleFonts.nunito(
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.check_circle_outline, color: Colors.white, size: 18),
                          ],
                        ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildResult() {
    final riskColor = _predictionResult.riskColor;
    final riskLevel = _predictionResult.riskLevel;
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;

    return SingleChildScrollView(
      padding: const EdgeInsets.only(left: 22, right: 22, top: 22, bottom: 100),
      child: Column(
        children: [
          const SizedBox(height: 24),
          // ── Risk Level Hero ──
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: riskColor.withOpacity(0.12),
              border: Border.all(color: riskColor.withOpacity(0.3), width: 3),
            ),
            child: Icon(_predictionResult.riskIconData, color: riskColor, size: 40),
          ),
          const SizedBox(height: 14),
          Text(
            'Check-In Complete!',
            style: GoogleFonts.playfairDisplay(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppColors.textColor(context),
            ),
          ),
          const SizedBox(height: 8),
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: GoogleFonts.nunito(
                fontSize: 13,
                color: AppColors.textMutedColor(context),
                height: 1.7,
              ),
              children: [
                const TextSpan(
                  text: 'Dr. Rahman has been notified. Your risk is ',
                ),
                TextSpan(
                  text: riskLevel,
                  style: GoogleFonts.nunito(
                    fontWeight: FontWeight.w800,
                    color: riskColor,
                  ),
                ),
                const TextSpan(text: ' today.'),
              ],
            ),
          ),

          const SizedBox(height: 18),

          // ══════════════════════════════════════════
          // RECOMMENDATIONS CARD
          // ══════════════════════════════════════════
          if (_recommendationLoading)
            // ── Loading state ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surfaceColor(context),
                borderRadius: BorderRadius.circular(18),
                border: Border(
                  left: BorderSide(color: primary, width: 3),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  const SizedBox(height: 12),
                  SizedBox(
                    width: 28,
                    height: 28,
                    child: CircularProgressIndicator(
                      strokeWidth: 3,
                      valueColor: AlwaysStoppedAnimation(primary),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Loading Recommendations...',
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textColor(context),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Analyzing your symptoms and environment',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      color: AppColors.textMutedColor(context),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            )
          else if (_recommendation != null)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceColor(context),
                borderRadius: BorderRadius.circular(18),
                border: Border(
                  left: BorderSide(color: primary, width: 3),
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header
                  Row(
                    children: [
                      Container(
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          color: primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(Icons.auto_awesome, color: primary, size: 15),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'RECOMMENDATIONS',
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textMutedColor(context),
                          letterSpacing: 1.0,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Condition summary
                  if (_recommendation!['condition_summary'] != null)
                    Text(
                      _recommendation!['condition_summary'] as String,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: AppColors.textColor(context),
                        height: 1.6,
                        fontWeight: FontWeight.w600,
                        fontStyle: FontStyle.italic,
                      ),
                    ),

                  // Do Right Now
                  if (_recommendation!['immediate_actions'] != null) ...[
                    const SizedBox(height: 14),
                    _sectionLabel(Icons.flash_on_rounded, 'Do Right Now', AppColors.red),
                    const SizedBox(height: 8),
                    ...(_recommendation!['immediate_actions'] as List).map(
                      (action) => _actionItem(action.toString(), AppColors.red),
                    ),
                  ],

                  // Preventive Steps
                  if (_recommendation!['preventive_steps'] != null) ...[
                    const SizedBox(height: 14),
                    _sectionLabel(Icons.shield_outlined, 'Preventive Steps', AppColors.green),
                    const SizedBox(height: 8),
                    ...(_recommendation!['preventive_steps'] as List).map(
                      (step) => _actionItem(step.toString(), AppColors.green),
                    ),
                  ],

                  // Doctor Visit
                  if (_recommendation!['doctor_alert'] == true) ...[
                    const SizedBox(height: 14),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.red.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.red.withOpacity(0.2)),
                      ),
                      child: Row(
                        children: [
                          Icon(Icons.local_hospital_rounded, color: AppColors.red, size: 20),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Doctor Visit Recommended',
                                  style: GoogleFonts.nunito(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    color: AppColors.red,
                                  ),
                                ),
                                if (_recommendation!['doctor_alert_reason'] != null)
                                  Text(
                                    _recommendation!['doctor_alert_reason'] as String,
                                    style: GoogleFonts.nunito(
                                      fontSize: 11,
                                      color: AppColors.textColor(context),
                                      height: 1.4,
                                    ),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),

          const SizedBox(height: 22),

          // ── Back to Home button ──
          GestureDetector(
            onTap: _resetCheckin,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: isDark
                    ? AppColors.primaryGradientDark
                    : AppColors.primaryGradient,
              ),
              child: Center(
                child: Text(
                  'Back to Home',
                  style: GoogleFonts.nunito(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Helper: Section label for recommendation cards ──
  Widget _sectionLabel(IconData icon, String label, Color color) {
    return Row(
      children: [
        Icon(icon, color: color, size: 14),
        const SizedBox(width: 6),
        Text(
          label.toUpperCase(),
          style: GoogleFonts.nunito(
            fontSize: 10,
            fontWeight: FontWeight.w800,
            color: color,
            letterSpacing: 0.8,
          ),
        ),
      ],
    );
  }

  // ── Helper: Action item row ──
  Widget _actionItem(String text, Color dotColor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            margin: const EdgeInsets.only(top: 5),
            width: 5,
            height: 5,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: dotColor,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.nunito(
                fontSize: 12,
                color: AppColors.textColor(context),
                height: 1.5,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Builds the 2-column symptom grid with expandable cards ──
  Widget _buildSymptomGrid() {
    final List<Widget> rows = [];
    for (int i = 0; i < _symptoms.length; i += 2) {
      rows.add(
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildSymptomCard(_symptoms[i], i)),
            const SizedBox(width: 10),
            if (i + 1 < _symptoms.length)
              Expanded(child: _buildSymptomCard(_symptoms[i + 1], i + 1))
            else
              const Expanded(child: SizedBox()),
          ],
        ),
      );
      if (i + 2 < _symptoms.length) rows.add(const SizedBox(height: 10));
    }
    return Column(children: rows);
  }

  // ── Individual expandable symptom card ──
  Widget _buildSymptomCard(Map<String, dynamic> s, int index) {
    final selected = s['selected'] as bool;
    final expanded = s['expanded'] as bool;
    final isNone = s['name'] == 'None';

    return GestureDetector(
      onTap: () {
        setState(() {
          if (isNone) {
            // "None" deselects everything else and collapses all
            for (var sym in _symptoms) {
              sym['selected'] = false;
              sym['expanded'] = false;
              sym['intensity'] = null;
            }
            s['selected'] = true;
          } else {
            // Deselect "None" if it was selected
            _symptoms.last['selected'] = false;
            _symptoms.last['expanded'] = false;
            _symptoms.last['intensity'] = null;

            final wasSelected = s['selected'] as bool;
            if (wasSelected) {
              // Deselect and collapse
              s['selected'] = false;
              s['expanded'] = false;
              s['intensity'] = null;
            } else {
              // Select and expand
              s['selected'] = true;
              s['expanded'] = true;
            }
          }
        });
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.surfaceColor(context),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: selected
                ? AppColors.primaryColor(context)
                : AppColors.borderColor(context),
            width: selected ? 2.0 : 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(
                alpha: Theme.of(context).brightness == Brightness.dark
                    ? 0.15
                    : 0.08,
              ),
              blurRadius: selected ? 16 : 24,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Icon + Title + Subtitle
            Column(
              children: [
                const SizedBox(height: 4),
                Icon(
                  s['icon'] as IconData,
                  size: 28,
                  color: selected
                      ? AppColors.primaryColor(context)
                      : AppColors.textMutedColor(context),
                ),
                const SizedBox(height: 6),
                Text(
                  s['name'] as String,
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: selected
                        ? AppColors.primaryColor(context)
                        : AppColors.textColor(context),
                  ),
                ),
                Text(
                  s['sub'] as String,
                  style: GoogleFonts.nunito(
                    fontSize: 10,
                    color: AppColors.textMutedColor(context),
                  ),
                ),
                const SizedBox(height: 4),
              ],
            ),
            // Expandable intensity section
            AnimatedCrossFade(
              firstChild: const SizedBox.shrink(),
              secondChild: !isNone
                  ? _buildInlineIntensity(s, index)
                  : const SizedBox.shrink(),
              crossFadeState: expanded && !isNone
                  ? CrossFadeState.showSecond
                  : CrossFadeState.showFirst,
              duration: const Duration(milliseconds: 300),
              sizeCurve: Curves.easeInOut,
            ),
          ],
        ),
      ),
    );
  }

  // ── Inline intensity picker inside an expanded card ──
  Widget _buildInlineIntensity(Map<String, dynamic> s, int index) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Column(
        children: [
          // Divider
          Container(
            height: 1,
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: AppColors.primaryColor(context).withOpacity(0.15),
              borderRadius: BorderRadius.circular(1),
            ),
          ),
          Text(
            'Intensity',
            style: GoogleFonts.nunito(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              color: AppColors.textMutedColor(context),
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              _inlineIntensityBtn(
                s, index, 'Mild', 'mild',
                AppColors.green, AppColors.greenDim,
              ),
              const SizedBox(width: 4),
              _inlineIntensityBtn(
                s, index, 'Mod', 'mod',
                AppColors.yellow, AppColors.yellowDim,
              ),
              const SizedBox(width: 4),
              _inlineIntensityBtn(
                s, index, 'Severe', 'sev',
                AppColors.red, AppColors.redDim,
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ── Single inline intensity button ──
  Widget _inlineIntensityBtn(
    Map<String, dynamic> s,
    int index,
    String label,
    String value,
    Color activeColor,
    Color activeBg,
  ) {
    final isActive = s['intensity'] == value;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          // Only select intensity — do NOT collapse the card
          setState(() {
            s['intensity'] = value;
          });
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 6),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: isActive ? activeBg : Colors.transparent,
            border: Border.all(
              color: isActive ? activeColor : AppColors.borderColor(context),
              width: 1.5,
            ),
          ),
          child: Center(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: isActive
                    ? activeColor
                    : AppColors.textMutedColor(context),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _counterBtn(String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: AppColors.surface2Color(context),
          border: Border.all(color: AppColors.borderColor(context), width: 2),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textColor(context),
            ),
          ),
        ),
      ),
    );
  }
}
