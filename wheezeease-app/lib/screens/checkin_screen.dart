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
  // _intensity is now derived from per-symptom intensities (kept for submission logic)
  int _selectedMood = 2; // 0-4
  final _notesController = TextEditingController();

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
          // Expandable symptom cards in 2-column layout
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: _buildSymptomGrid(),
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
}
