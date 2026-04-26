import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';

class HouseholdActivityScreen extends StatefulWidget {
  const HouseholdActivityScreen({super.key});

  @override
  State<HouseholdActivityScreen> createState() =>
      _HouseholdActivityScreenState();
}

class _HouseholdActivityScreenState extends State<HouseholdActivityScreen>
    with SingleTickerProviderStateMixin {
  // Form state
  String _activityType = 'cleaning';
  int _duration = 30;
  bool _woreMask = false;

  // Symptom state — replaces the old _hadSymptoms bool
  bool _hadSymptoms = false; // controls expansion
  final List<String> _selectedSymptoms = [];
  String? _symptomSeverity;
  final TextEditingController _symptomNotesController =
      TextEditingController();

  // Submission state
  bool _loading = false;
  Map<String, dynamic>? _result;
  String? _error;

  late AnimationController _resultAnimController;
  late Animation<double> _resultAnim;

  final List<Map<String, dynamic>> _activityTypes = [
    {
      'key': 'cleaning',
      'icon': Icons.cleaning_services_rounded,
      'label': 'Cleaning',
      'trigger': 'Dust'
    },
    {
      'key': 'cooking',
      'icon': Icons.restaurant_rounded,
      'label': 'Cooking',
      'trigger': 'Smoke'
    },
    {
      'key': 'painting',
      'icon': Icons.format_paint_rounded,
      'label': 'Painting',
      'trigger': 'VOCs'
    },
    {
      'key': 'gardening',
      'icon': Icons.yard_rounded,
      'label': 'Gardening',
      'trigger': 'Pollen'
    },
  ];

  static const List<String> _symptomOptions = [
    'Wheezing',
    'Coughing',
    'Chest Tightness',
    'Shortness of Breath',
    'Runny Nose',
  ];

  static const List<Map<String, dynamic>> _severityLevels = [
    {
      'key': 'Mild',
      'color': Color(0xFF27AE60),
      'icon': Icons.sentiment_satisfied_rounded
    },
    {
      'key': 'Moderate',
      'color': Color(0xFFF39C12),
      'icon': Icons.sentiment_neutral_rounded
    },
    {
      'key': 'Severe',
      'color': Color(0xFFE74C3C),
      'icon': Icons.sentiment_very_dissatisfied_rounded
    },
  ];

  @override
  void initState() {
    super.initState();
    _resultAnimController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _resultAnim = CurvedAnimation(
      parent: _resultAnimController,
      curve: Curves.easeOutCubic,
    );
  }

  @override
  void dispose() {
    _resultAnimController.dispose();
    _symptomNotesController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() {
      _loading = true;
      _error = null;
      _result = null;
    });

    try {
      final result = await ApiService.logHouseholdActivity(
        activityType: _activityType,
        duration: _duration,
        woreMask: _woreMask,
        // Updated: pass structured symptom data instead of bool
        symptomsReported: _hadSymptoms ? _selectedSymptoms : [],
        symptomSeverity: _hadSymptoms && _selectedSymptoms.isNotEmpty
            ? _symptomSeverity
            : null,
        symptomNotes: _hadSymptoms && _symptomNotesController.text.isNotEmpty
            ? _symptomNotesController.text.trim()
            : null,
      );

      if (result != null && mounted) {
        setState(() {
          _result = result;
          _loading = false;
        });
        _resultAnimController.forward(from: 0.0);
      } else {
        setState(() {
          _error = 'Could not get recommendation. Check your connection.';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Something went wrong. Please try again.';
        _loading = false;
      });
    }
  }

  Color _riskColor(String? riskLevel) {
    if (riskLevel == 'HIGH') return AppColors.red;
    if (riskLevel == 'MEDIUM') return AppColors.yellow;
    return AppColors.green;
  }

  LinearGradient _riskGradient(String? riskLevel) {
    if (riskLevel == 'HIGH') return AppColors.redGradient;
    if (riskLevel == 'MEDIUM') return AppColors.orangeGradient;
    return AppColors.greenGradient;
  }

  IconData _riskIcon(String? riskLevel) {
    if (riskLevel == 'HIGH') return Icons.error_outline;
    if (riskLevel == 'MEDIUM') return Icons.warning_amber_rounded;
    return Icons.check_circle_outline;
  }

  String _riskLabel(String? riskLevel) {
    if (riskLevel == 'HIGH') return 'HIGH RISK';
    if (riskLevel == 'MEDIUM') return 'MODERATE RISK';
    return 'LOW RISK';
  }

  Map<String, dynamic> get _currentActivity =>
      _activityTypes.firstWhere((a) => a['key'] == _activityType);

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final textDim = isDark ? AppColors.textDimDark : AppColors.textDim;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded, color: text, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Household Activity',
          style: GoogleFonts.playfairDisplay(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: text,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: border),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header card ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFFF5A623), Color(0xFFE67E22)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.home_work_rounded,
                      color: Colors.white, size: 32),
                  const SizedBox(height: 10),
                  Text(
                    'Household Activities',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Log your home activities and get trigger-aware safety recommendations.',
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      color: Colors.white.withOpacity(0.9),
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── ACTIVITY TYPE ──
            _sectionLabel('ACTIVITY TYPE', textMuted),
            const SizedBox(height: 10),
            Row(
              children: _activityTypes.map((a) {
                final isSelected = _activityType == a['key'];
                return Expanded(
                  child: GestureDetector(
                    onTap: () =>
                        setState(() => _activityType = a['key'] as String),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: EdgeInsets.only(
                          right: a != _activityTypes.last ? 8 : 0),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppColors.yellow.withOpacity(0.15)
                            : surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? AppColors.yellow : border,
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(a['icon'] as IconData,
                              color: isSelected ? AppColors.yellow : textDim,
                              size: 22),
                          const SizedBox(height: 4),
                          Text(
                            a['label'] as String,
                            style: GoogleFonts.nunito(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? AppColors.yellow : textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 8),

            // Trigger info chip
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: AppColors.yellowDim,
                borderRadius: BorderRadius.circular(10),
                border:
                    Border.all(color: AppColors.yellow.withOpacity(0.2)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.info_outline_rounded,
                      color: AppColors.yellow, size: 14),
                  const SizedBox(width: 6),
                  Text(
                    'Known trigger: ${_currentActivity['trigger']}',
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.yellow,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 22),

            // ── DURATION SLIDER ──
            _sectionLabel('DURATION', textMuted),
            const SizedBox(height: 6),
            Row(
              children: [
                Expanded(
                  child: SliderTheme(
                    data: SliderThemeData(
                      activeTrackColor: AppColors.yellow,
                      inactiveTrackColor: border,
                      thumbColor: AppColors.yellow,
                      overlayColor: AppColors.yellow.withOpacity(0.15),
                      trackHeight: 4,
                      thumbShape: const RoundSliderThumbShape(
                          enabledThumbRadius: 8),
                    ),
                    child: Slider(
                      value: _duration.toDouble(),
                      min: 5,
                      max: 120,
                      divisions: 23,
                      onChanged: (v) =>
                          setState(() => _duration = v.round()),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: AppColors.yellow.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$_duration min',
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: AppColors.yellow,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 22),

            // ── PRECAUTIONS ──
            _sectionLabel('PRECAUTIONS', textMuted),
            const SizedBox(height: 10),
            _toggleTile(
              icon: Icons.masks_rounded,
              label: 'Wore a Mask',
              sublabel: 'Did you wear a mask during this activity?',
              value: _woreMask,
              onChanged: (v) => setState(() => _woreMask = v),
              surface: surface,
              border: border,
              text: text,
              textMuted: textMuted,
              accentColor: AppColors.yellow,
            ),
            const SizedBox(height: 22),

            // ── SYMPTOMS SECTION (replaces the old toggle) ──
            _sectionLabel('SYMPTOMS AFTER ACTIVITY', textMuted),
            const SizedBox(height: 10),
            _buildSymptomsSection(
                surface, border, text, textMuted, textDim, primary),
            const SizedBox(height: 28),

            // ── SUBMIT BUTTON ──
            GestureDetector(
              onTap: _loading ? null : _submit,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  gradient: _loading
                      ? LinearGradient(colors: [textDim, textDim])
                      : const LinearGradient(
                          colors: [Color(0xFFF5A623), Color(0xFFE67E22)],
                        ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    if (!_loading)
                      BoxShadow(
                        color: AppColors.yellow.withOpacity(0.3),
                        blurRadius: 14,
                        offset: const Offset(0, 4),
                      ),
                  ],
                ),
                child: Center(
                  child: _loading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                              color: Colors.white, strokeWidth: 2),
                        )
                      : Text(
                          'Get Safety Recommendation',
                          style: GoogleFonts.nunito(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // ── ERROR ──
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.redDim,
                  borderRadius: BorderRadius.circular(14),
                  border:
                      Border.all(color: AppColors.red.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.cancel_outlined,
                        color: AppColors.red, size: 18),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        _error!,
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: AppColors.red,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            // ── RESULT ──
            if (_result != null)
              FadeTransition(
                opacity: _resultAnim,
                child: SlideTransition(
                  position: Tween<Offset>(
                    begin: const Offset(0, 0.1),
                    end: Offset.zero,
                  ).animate(_resultAnim),
                  child: _buildResultCard(
                      isDark, primary, surface, text, textMuted, border),
                ),
              ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // ── NEW: Symptoms section widget ──────────────────────────────────
  Widget _buildSymptomsSection(Color surface, Color border, Color text,
      Color textMuted, Color textDim, Color primary) {
    return Container(
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: _hadSymptoms ? AppColors.red.withOpacity(0.5) : border,
          width: _hadSymptoms ? 1.5 : 1,
        ),
      ),
      child: Column(
        children: [
          // Top row: toggle
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: (_hadSymptoms ? AppColors.red : AppColors.yellow)
                        .withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.sick_outlined,
                    color:
                        _hadSymptoms ? AppColors.red : AppColors.yellow,
                    size: 17,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Symptoms After Activity',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: text,
                        ),
                      ),
                      Text(
                        _hadSymptoms
                            ? 'Tap to log what you experienced'
                            : 'Any wheezing, coughing, or breathing issues?',
                        style: GoogleFonts.nunito(
                            fontSize: 10, color: textMuted),
                      ),
                    ],
                  ),
                ),
                Switch.adaptive(
                  value: _hadSymptoms,
                  onChanged: (v) {
                    setState(() {
                      _hadSymptoms = v;
                      if (!v) {
                        _selectedSymptoms.clear();
                        _symptomSeverity = null;
                        _symptomNotesController.clear();
                      }
                    });
                  },
                  activeColor: AppColors.red,
                ),
              ],
            ),
          ),

          // Expanded symptom detail section
          if (_hadSymptoms) ...[
            Divider(height: 1, color: border),
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Symptom chips
                  Text(
                    'WHAT DID YOU EXPERIENCE?',
                    style: GoogleFonts.nunito(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: textMuted,
                      letterSpacing: 0.7,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _symptomOptions.map((symptom) {
                      final isSelected =
                          _selectedSymptoms.contains(symptom);
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            if (isSelected) {
                              _selectedSymptoms.remove(symptom);
                            } else {
                              _selectedSymptoms.add(symptom);
                            }
                          });
                        },
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 7),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.red.withOpacity(0.12)
                                : border.withOpacity(0.3),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.red.withOpacity(0.6)
                                  : border,
                              width: isSelected ? 1.5 : 1,
                            ),
                          ),
                          child: Text(
                            symptom,
                            style: GoogleFonts.nunito(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color:
                                  isSelected ? AppColors.red : textMuted,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  // Severity — only show if symptoms selected
                  if (_selectedSymptoms.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(
                      'HOW SEVERE?',
                      style: GoogleFonts.nunito(
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        color: textMuted,
                        letterSpacing: 0.7,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: _severityLevels.map((s) {
                        final isSelected = _symptomSeverity == s['key'];
                        final col = s['color'] as Color;
                        return Expanded(
                          child: GestureDetector(
                            onTap: () => setState(
                                () => _symptomSeverity = s['key'] as String),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              margin: EdgeInsets.only(
                                  right: s != _severityLevels.last ? 8 : 0),
                              padding:
                                  const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? col.withOpacity(0.12)
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected ? col : border,
                                  width: isSelected ? 1.5 : 1,
                                ),
                              ),
                              child: Column(
                                children: [
                                  Icon(s['icon'] as IconData,
                                      color: isSelected ? col : textMuted,
                                      size: 18),
                                  const SizedBox(height: 3),
                                  Text(
                                    s['key'] as String,
                                    style: GoogleFonts.nunito(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      color: isSelected ? col : textMuted,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],

                  // Optional notes
                  const SizedBox(height: 14),
                  Text(
                    'ADDITIONAL NOTES (OPTIONAL)',
                    style: GoogleFonts.nunito(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: textMuted,
                      letterSpacing: 0.7,
                    ),
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _symptomNotesController,
                    maxLines: 2,
                    style: GoogleFonts.nunito(fontSize: 13, color: text),
                    decoration: InputDecoration(
                      hintText:
                          'e.g. started coughing after 20 min, improved after opening windows...',
                      hintStyle: GoogleFonts.nunito(
                          fontSize: 12, color: textMuted),
                      filled: true,
                      fillColor: border.withOpacity(0.2),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: border),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide(color: border),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide:
                            const BorderSide(color: AppColors.yellow),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 10),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ── Result card ───────────────────────────────────────────────────
  Widget _buildResultCard(bool isDark, Color primary, Color surface,
      Color text, Color textMuted, Color border) {
    final riskLevel = _result!['risk_level'] as String? ?? 'LOW';
    final riskCol = _riskColor(riskLevel);
    final trigger = _result!['trigger'] as String? ?? '';
    final triggerDesc = _result!['trigger_description'] as String? ?? '';
    final aiRec =
        _result!['ai_recommendation'] as Map<String, dynamic>? ?? {};
    final recData = aiRec['data'] as Map<String, dynamic>? ?? {};
    final conditionSummary = recData['condition_summary'] as String? ?? '';
    final immediateActions =
        (recData['immediate_actions'] as List?)?.cast<String>() ?? [];
    final preventiveSteps =
        (recData['preventive_steps'] as List?)?.cast<String>() ?? [];
    final doctorAlert = recData['doctor_alert'] == true;
    final doctorAlertReason = recData['doctor_alert_reason'] as String?;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: _riskGradient(riskLevel),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(_riskIcon(riskLevel), color: Colors.white, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          _riskLabel(riskLevel),
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 20,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                        if (trigger.isNotEmpty)
                          Text(
                            'Trigger: $trigger',
                            style: GoogleFonts.nunito(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Colors.white.withOpacity(0.75),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
              if (conditionSummary.isNotEmpty) ...[
                const SizedBox(height: 12),
                Text(
                  conditionSummary,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    color: Colors.white.withOpacity(0.9),
                    height: 1.6,
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 14),

        if (triggerDesc.isNotEmpty)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'ABOUT THIS TRIGGER',
                  style: GoogleFonts.nunito(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: textMuted,
                    letterSpacing: 0.7,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(Icons.info_outline_rounded,
                        color: _riskColor(riskLevel), size: 16),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        triggerDesc,
                        style: GoogleFonts.nunito(
                            fontSize: 12, color: text, height: 1.5),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        if (triggerDesc.isNotEmpty) const SizedBox(height: 14),

        if (immediateActions.isNotEmpty)
          _recommendationSection(
            title: 'IMMEDIATE ACTIONS',
            icon: Icons.flash_on_rounded,
            items: immediateActions,
            accentColor: riskCol,
            surface: surface,
            border: border,
            text: text,
            textMuted: textMuted,
          ),
        if (immediateActions.isNotEmpty) const SizedBox(height: 14),

        if (preventiveSteps.isNotEmpty)
          _recommendationSection(
            title: 'PREVENTIVE STEPS',
            icon: Icons.shield_outlined,
            items: preventiveSteps,
            accentColor: primary,
            surface: surface,
            border: border,
            text: text,
            textMuted: textMuted,
          ),
        if (preventiveSteps.isNotEmpty) const SizedBox(height: 14),

        if (doctorAlert)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.redDim,
              borderRadius: BorderRadius.circular(16),
              border:
                  Border.all(color: AppColors.red.withOpacity(0.3)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.medical_services_outlined,
                    color: AppColors.red, size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'DOCTOR VISIT RECOMMENDED',
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: AppColors.red,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        doctorAlertReason ??
                            'Please consult your doctor about this activity.',
                        style: GoogleFonts.nunito(
                            fontSize: 12, color: text, height: 1.5),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _recommendationSection({
    required String title,
    required IconData icon,
    required List<String> items,
    required Color accentColor,
    required Color surface,
    required Color border,
    required Color text,
    required Color textMuted,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(16),
        border: Border(left: BorderSide(color: accentColor, width: 3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: accentColor, size: 16),
              const SizedBox(width: 8),
              Text(
                title,
                style: GoogleFonts.nunito(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  color: accentColor,
                  letterSpacing: 0.7,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...items.asMap().entries.map(
            (entry) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 20,
                    height: 20,
                    decoration: BoxDecoration(
                      color: accentColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Center(
                      child: Text(
                        '${entry.key + 1}',
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: accentColor,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      entry.value,
                      style: GoogleFonts.nunito(
                          fontSize: 12, color: text, height: 1.5),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionLabel(String label, Color color) {
    return Text(
      label,
      style: GoogleFonts.nunito(
        fontSize: 10,
        fontWeight: FontWeight.w800,
        color: color,
        letterSpacing: 0.8,
      ),
    );
  }

  Widget _toggleTile({
    required IconData icon,
    required String label,
    required String sublabel,
    required bool value,
    required ValueChanged<bool> onChanged,
    required Color surface,
    required Color border,
    required Color text,
    required Color textMuted,
    required Color accentColor,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: border),
      ),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: accentColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: accentColor, size: 17),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: text,
                    )),
                Text(sublabel,
                    style:
                        GoogleFonts.nunito(fontSize: 10, color: textMuted)),
              ],
            ),
          ),
          Switch.adaptive(
              value: value,
              onChanged: onChanged,
              activeColor: accentColor),
        ],
      ),
    );
  }
}