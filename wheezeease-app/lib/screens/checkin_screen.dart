import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

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
  bool _loading = false;
  String _intensity = 'mod';
  int _selectedMood = 2; // 0-4
  final _notesController = TextEditingController();

  final List<Map<String, dynamic>> _symptoms = [
    {
      'icon': Icons.volume_up_outlined,
      'name': 'Coughing',
      'sub': 'Dry or wet',
      'selected': false,
    },
    {
      'icon': Icons.air_rounded,
      'name': 'Wheezing',
      'sub': 'Whistling breath',
      'selected': true,
    },
    {
      'icon': Icons.emergency_outlined,
      'name': 'Shortness',
      'sub': 'Hard to breathe',
      'selected': true,
    },
    {
      'icon': Icons.battery_1_bar_rounded,
      'name': 'Fatigue',
      'sub': 'Low energy',
      'selected': false,
    },
    {
      'icon': Icons.water_drop_outlined,
      'name': 'Runny Nose',
      'sub': 'Nasal congestion',
      'selected': false,
    },
    {
      'icon': Icons.check_circle_outline,
      'name': 'None',
      'sub': 'Feeling fine!',
      'selected': false,
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

  // Build a text summary of selected symptoms for Gemini
  String _buildSymptomsText() {
    final selected = _symptoms
        .where((s) => s['selected'] == true && s['name'] != 'None')
        .map((s) => s['name'] as String)
        .toList();
    if (selected.isEmpty) return 'No symptoms reported';
    final intensity = _intensity == 'mild'
        ? 'Mild'
        : _intensity == 'sev'
            ? 'Severe'
            : 'Moderate';
    return '${selected.join(", ")} ($intensity intensity)';
  }

  void _submitCheckin() async {
    setState(() => _loading = true);

    // Collect form data
    final coughing = _symptoms[0]['selected'] ? 1 : 0;
    final wheezing = _symptoms[1]['selected'] ? 1 : 0;
    final breathingDifficulty = _symptoms[2]['selected'] ? 1 : 0;

    // Map intensity to breathing difficulty level (1=Mild, 2=Moderate, 3=Severe)
    int breathingLevel = 1; // default
    if (_intensity == 'mod') breathingLevel = 2;
    if (_intensity == 'sev') breathingLevel = 3;

    // Store patient data for home screen
    final patientData = {
      'wheezing': wheezing,
      'coughing': coughing,
      'chest_tightness': 0,
      'inhaler_usage': 0,
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

    // Simulate a brief delay for logging
    await Future.delayed(const Duration(milliseconds: 400));

    if (!mounted) return;

    widget.onPatientDataUpdate(patientData);

    setState(() => _loading = false);

    // Show success snackbar
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_outline, color: Colors.white, size: 18),
            const SizedBox(width: 10),
            Text(
              'Symptoms logged successfully',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
        duration: const Duration(seconds: 2),
      ),
    );

    // Return to home
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

        Expanded(child: _buildForm()),
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
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 18),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.4,
            children: _symptoms.map((s) {
              final selected = s['selected'] as bool;
              return GestureDetector(
                onTap: () {
                  setState(() {
                    if (s['name'] == 'None') {
                      for (var sym in _symptoms) {
                        sym['selected'] = false;
                      }
                      s['selected'] = true;
                    } else {
                      _symptoms.last['selected'] = false;
                      s['selected'] = !(s['selected'] as bool);
                    }
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: selected
                        ? AppColors.primaryColor(context).withOpacity(0.12)
                        : AppColors.surfaceColor(context),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: selected
                          ? AppColors.primaryColor(context)
                          : AppColors.borderColor(context),
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(
                          alpha: Theme.of(context).brightness == Brightness.dark
                              ? 0.15
                              : 0.08,
                        ),
                        blurRadius: 24,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        s['icon'] as IconData,
                        size: 28,
                        color: selected
                            ? AppColors.primaryColor(context)
                            : AppColors.textMutedColor(context),
                      ),
                      const SizedBox(height: 4),
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
                    ],
                  ),
                ),
              );
            }).toList(),
          ),

          // Intensity
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 10),
            child: Text(
              'Symptom intensity',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: AppColors.textColor(context),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Row(
              children: [
                _intensityBtn(
                  Icons.sentiment_satisfied_outlined,
                  'Mild',
                  'mild',
                  AppColors.green,
                  AppColors.greenDim,
                ),
                const SizedBox(width: 8),
                _intensityBtn(
                  Icons.sentiment_neutral_outlined,
                  'Moderate',
                  'mod',
                  AppColors.yellow,
                  AppColors.yellowDim,
                ),
                const SizedBox(width: 8),
                _intensityBtn(
                  Icons.sentiment_very_dissatisfied_outlined,
                  'Severe',
                  'sev',
                  AppColors.red,
                  AppColors.redDim,
                ),
              ],
            ),
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
                              'Check In',
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

  Widget _intensityBtn(
    IconData icon,
    String label,
    String value,
    Color activeColor,
    Color activeBg,
  ) {
    final isActive = _intensity == value;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _intensity = value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(13),
            color: isActive ? activeBg : AppColors.surfaceColor(context),
            border: Border.all(
              color: isActive ? activeColor : AppColors.borderColor(context),
              width: 2,
            ),
          ),
          child: Center(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  icon,
                  color: isActive
                      ? activeColor
                      : AppColors.textMutedColor(context),
                  size: 20,
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: isActive
                        ? activeColor
                        : AppColors.textMutedColor(context),
                  ),
                ),
              ],
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
