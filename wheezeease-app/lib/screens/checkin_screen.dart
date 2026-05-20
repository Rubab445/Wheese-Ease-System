import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/activity_log_service.dart';

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
  int _selectedMood = 2; // 0-4
  final _notesController = TextEditingController();
  Timer? _debounceTimer;
  bool _saving = false;

  // Each symptom: icon, name, selected (bool), severity (null, 'mild', 'moderate', 'severe'), expanded (bool)
  final List<Map<String, dynamic>> _symptoms = [
    {
      'icon': Icons.volume_up_outlined,
      'name': 'Coughing',
      'selected': false,
      'severity': null,
      'expanded': false,
    },
    {
      'icon': Icons.air_rounded,
      'name': 'Wheezing',
      'selected': false,
      'severity': null,
      'expanded': false,
    },
    {
      'icon': Icons.emergency_outlined,
      'name': 'Shortness',
      'selected': false,
      'severity': null,
      'expanded': false,
    },
    {
      'icon': Icons.battery_1_bar_rounded,
      'name': 'Fatigue',
      'selected': false,
      'severity': null,
      'expanded': false,
    },
    {
      'icon': Icons.water_drop_outlined,
      'name': 'Runny Nose',
      'selected': false,
      'severity': null,
      'expanded': false,
    },
    {
      'icon': Icons.block_outlined,
      'name': 'None',
      'selected': false,
      'severity': null,
      'expanded': false,
      'isNone': true,
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
    _debounceTimer?.cancel();
    _notesController.dispose();
    super.dispose();
  }

  void _toggleSymptom(int index) {
    setState(() {
      final symptom = _symptoms[index];
      final isNone = symptom['isNone'] == true;

      if (isNone) {
        for (var s in _symptoms) {
          s['selected'] = false;
          s['severity'] = null;
          s['expanded'] = false;
        }
        symptom['selected'] = true;
        // "None" is a definitive selection — trigger save
        _triggerAutoSave();
        return;
      }

      // Deselect "None" when selecting any real symptom
      _symptoms.last['selected'] = false;

      final isCurrentlyExpanded = symptom['expanded'] as bool;

      if (isCurrentlyExpanded) {
        // Collapse, deselect if no severity chosen
        symptom['expanded'] = false;
        if (symptom['severity'] == null) {
          symptom['selected'] = false;
        }
      } else {
        // Close all other open cards first
        for (var s in _symptoms) {
          s['expanded'] = false;
        }
        symptom['expanded'] = true;
        symptom['selected'] = true;
      }
      // Do NOT save here — wait until severity is chosen
    });
  }

  void _selectSeverity(int index, String severity) {
    setState(() {
      _symptoms[index]['severity'] = severity;
      _symptoms[index]['selected'] = true;
      _symptoms[index]['expanded'] = false; // collapse after choosing severity
    });
    _triggerAutoSave(); // Save + show "Saved ✓" only when severity is picked
  }

  Color _severityBgColor(String severity) {
    switch (severity) {
      case 'mild':
        return const Color(0xFFE8F8F0); // light green
      case 'moderate':
        return const Color(0xFFFFF5E6); // light yellow/orange
      case 'severe':
        return const Color(0xFFFEECE6); // light red
      default:
        return Colors.transparent;
    }
  }

  Color _severityTextColor(String severity) {
    switch (severity) {
      case 'mild':
        return AppColors.green;
      case 'moderate':
        return AppColors.yellow;
      case 'severe':
        return AppColors.red;
      default:
        return Colors.grey;
    }
  }

  Color _severityBorderColor(String severity) {
    switch (severity) {
      case 'mild':
        return AppColors.green.withOpacity(0.3);
      case 'moderate':
        return AppColors.yellow.withOpacity(0.3);
      case 'severe':
        return AppColors.red.withOpacity(0.3);
      default:
        return Colors.transparent;
    }
  }

  Future<void> _saveCheckin() async {
    final selected = _symptoms
        .where((s) => s['selected'] == true && s['isNone'] != true)
        .toList();
    final symptomNames = selected.map((s) => s['name'] as String).toList();

    final severities = selected
        .where((s) => s['severity'] != null)
        .map((s) => s['severity'] as String)
        .toList();

    String severity = 'None';
    if (severities.contains('severe')) {
      severity = 'Severe';
    } else if (severities.contains('moderate')) {
      severity = 'Moderate';
    } else if (severities.isNotEmpty) {
      severity = 'Mild';
    }

    final riskLevel = severity == 'Severe'
        ? 'HIGH'
        : severity == 'Moderate'
            ? 'MEDIUM'
            : 'LOW';

    final notes = _notesController.text.trim();

    await ActivityLogService.saveCheckinLog(
      symptoms: symptomNames,
      severity: severity,
      mood: _selectedMood,
      notes: notes.isEmpty ? null : notes,
      riskLevel: riskLevel,
    );
  }

  /// Debounced auto-save: waits 2 seconds after the last toggle before saving.
  void _triggerAutoSave() {
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(seconds: 2), () => _autoSave());
  }

  Future<void> _autoSave() async {
    if (_saving) return;
    setState(() => _saving = true);

    // Collect form data
    int coughing = 0, wheezing = 0, breathingDifficulty = 0, chestTightness = 0;

    for (var s in _symptoms) {
      if (s['selected'] == true && s['severity'] != null) {
        switch (s['name']) {
          case 'Coughing':
            coughing = 1;
            break;
          case 'Wheezing':
            wheezing = 1;
            break;
          case 'Shortness':
            breathingDifficulty = 1;
            break;
        }
      }
    }

    // Build patient data for home screen
    final patientData = {
      'wheezing': wheezing,
      'coughing': coughing,
      'chest_tightness': chestTightness,
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
      'timestamp': DateTime.now().toIso8601String(),
    };

    if (!mounted) return;

    widget.onPatientDataUpdate(patientData);
    setState(() => _saving = false);

    // Show subtle "Saved ✓" snackbar
    ScaffoldMessenger.of(context).clearSnackBars();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.check_circle_outline, color: Colors.white, size: 16),
            const SizedBox(width: 8),
            Text(
              'Saved ✓',
              style: GoogleFonts.nunito(
                fontSize: 13,
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
        duration: const Duration(seconds: 1),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgColor(context),
      body: Column(
      children: [
        // Header
        Container(
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top + 14,
            left: 16,
            right: 16,
            bottom: 14,
          ),
          decoration: BoxDecoration(
            gradient: Theme.of(context).brightness == Brightness.dark
                ? AppColors.primaryGradientDark
                : AppColors.primaryGradient,
          ),
          child: Row(
            children: [
              GestureDetector(
                onTap: () async {
                  _debounceTimer?.cancel();
                  await _saveCheckin();
                  if (mounted) widget.onComplete();
                },
                child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
              ),
              const SizedBox(width: 14),
              Text(
                'Daily Check-In',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
              const Spacer(),
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white.withOpacity(0.2),
                  border: Border.all(color: Colors.white.withOpacity(0.4), width: 1.5),
                ),
                child: const Icon(Icons.person, color: Colors.white, size: 20),
              ),
            ],
          ),
        ),

        Expanded(child: _buildForm()),
      ],
      ),
    );
  }

  Widget _buildForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.only(bottom: 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title section
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 4),
            child: Text(
              'How are you breathing today?',
              style: GoogleFonts.playfairDisplay(
                fontSize: 24,
                fontWeight: FontWeight.w800,
                color: AppColors.textColor(context),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
            child: Text(
              'Select any symptoms you\'re currently\nexperiencing to track your respiratory health.',
              style: GoogleFonts.nunito(
                fontSize: 13,
                color: AppColors.textMutedColor(context),
                height: 1.5,
              ),
            ),
          ),

          // Symptom cards
          ...List.generate(_symptoms.length, (index) {
            return _buildSymptomCard(index);
          }),

          const SizedBox(height: 8),

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

          // Auto-save indicator
          if (_saving)
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 18, 18, 6),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 14,
                    height: 14,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(
                        AppColors.primaryColor(context),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Saving...',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textMutedColor(context),
                    ),
                  ),
                ],
              ),
            ),

          // Footer text
          Center(
            child: Padding(
              padding: const EdgeInsets.only(top: 12, bottom: 10),
              child: Text(
                'Symptoms auto-save after selection.',
                style: GoogleFonts.nunito(
                  fontSize: 11,
                  color: AppColors.textMutedColor(context),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSymptomCard(int index) {
    final symptom = _symptoms[index];
    final isExpanded = symptom['expanded'] as bool;
    final isSelected = symptom['selected'] as bool;
    final severity = symptom['severity'] as String?;
    final isNone = symptom['isNone'] == true;

    // Border color changes when selected/expanded
    Color cardBorderColor = AppColors.borderColor(context);
    if (isSelected && severity != null) {
      cardBorderColor = _severityBorderColor(severity);
    } else if (isExpanded) {
      cardBorderColor = AppColors.primaryColor(context).withOpacity(0.4);
    }

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeInOut,
      margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 5),
      decoration: BoxDecoration(
        color: AppColors.surfaceColor(context),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: cardBorderColor,
          width: isExpanded || (isSelected && severity != null) ? 1.8 : 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(
              alpha: Theme.of(context).brightness == Brightness.dark
                  ? 0.12
                  : 0.04,
            ),
            blurRadius: isExpanded ? 20 : 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Tappable header row
          GestureDetector(
            onTap: () => _toggleSymptom(index),
            behavior: HitTestBehavior.opaque,
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: 16,
                vertical: isExpanded ? 14 : 16,
              ),
              child: Row(
                children: [
                  // Icon container
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: isSelected
                          ? (severity != null
                              ? _severityBgColor(severity)
                              : AppColors.primaryColor(context).withOpacity(0.08))
                          : AppColors.surface2Color(context),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      symptom['icon'] as IconData,
                      size: 19,
                      color: isSelected
                          ? (severity != null
                              ? _severityTextColor(severity)
                              : AppColors.primaryColor(context))
                          : AppColors.textMutedColor(context),
                    ),
                  ),
                  const SizedBox(width: 14),
                  // Symptom name
                  Expanded(
                    child: Text(
                      symptom['name'] as String,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textColor(context),
                      ),
                    ),
                  ),
                  // Chevron or check for "None"
                  if (!isNone)
                    AnimatedRotation(
                      turns: isExpanded ? 0.5 : 0,
                      duration: const Duration(milliseconds: 250),
                      child: Icon(
                        Icons.keyboard_arrow_down_rounded,
                        color: AppColors.textMutedColor(context),
                        size: 24,
                      ),
                    ),
                  if (isNone && isSelected)
                    Icon(
                      Icons.check_circle,
                      color: AppColors.green,
                      size: 22,
                    ),
                ],
              ),
            ),
          ),

          // Expandable severity section
          AnimatedCrossFade(
            firstChild: const SizedBox.shrink(),
            secondChild: _buildSeverityOptions(index),
            crossFadeState: isExpanded
                ? CrossFadeState.showSecond
                : CrossFadeState.showFirst,
            duration: const Duration(milliseconds: 250),
            sizeCurve: Curves.easeInOut,
          ),
        ],
      ),
    );
  }

  Widget _buildSeverityOptions(int index) {
    final symptom = _symptoms[index];
    final currentSeverity = symptom['severity'] as String?;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Divider
          Container(
            height: 1,
            color: AppColors.borderColor(context).withOpacity(0.5),
          ),
          const SizedBox(height: 12),
          Text(
            'SEVERITY LEVEL',
            style: GoogleFonts.nunito(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              letterSpacing: 1.2,
              color: AppColors.textMutedColor(context),
            ),
          ),
          const SizedBox(height: 10),
          // Severity options
          _buildSeverityRow('mild', 'Mild', currentSeverity, index),
          const SizedBox(height: 6),
          _buildSeverityRow('moderate', 'Moderate', currentSeverity, index),
          const SizedBox(height: 6),
          _buildSeverityRow('severe', 'Severe', currentSeverity, index),
        ],
      ),
    );
  }

  Widget _buildSeverityRow(
    String value,
    String label,
    String? currentSeverity,
    int symptomIndex,
  ) {
    final isActive = currentSeverity == value;
    final bgColor = _severityBgColor(value);
    final textColor = _severityTextColor(value);

    return GestureDetector(
      onTap: () => _selectSeverity(symptomIndex, value),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        decoration: BoxDecoration(
          color: isActive ? bgColor : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isActive
                ? _severityBorderColor(value)
                : AppColors.borderColor(context).withOpacity(0.3),
            width: 1.2,
          ),
        ),
        child: Row(
          children: [
            Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
                color: isActive ? textColor : AppColors.textColor(context),
              ),
            ),
            const Spacer(),
            // Radio circle
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: isActive ? textColor : AppColors.borderColor(context),
                  width: 2,
                ),
                color: isActive ? textColor.withOpacity(0.08) : Colors.transparent,
              ),
              child: isActive
                  ? Center(
                      child: Icon(
                        Icons.check,
                        size: 14,
                        color: textColor,
                      ),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
