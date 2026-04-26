import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';

class ExerciseLogScreen extends StatefulWidget {
  const ExerciseLogScreen({super.key});

  @override
  State<ExerciseLogScreen> createState() => _ExerciseLogScreenState();
}

class _ExerciseLogScreenState extends State<ExerciseLogScreen>
    with SingleTickerProviderStateMixin {
  // Form state
  String _exerciseType = 'walking';
  int _duration = 30;
  String _intensity = 'moderate';
  bool _isIndoor = false;
  bool _usedInhaler = false;

  // Symptom state — replaces the old _hadSymptoms bool
  bool _hadSymptoms = false; // controls expansion
  final List<String> _selectedSymptoms = [];
  String? _symptomSeverity;
  final TextEditingController _symptomNotesController = TextEditingController();

  // Submission state
  bool _loading = false;
  Map<String, dynamic>? _result;
  String? _error;

  late AnimationController _resultAnimController;
  late Animation<double> _resultAnim;

  final List<Map<String, dynamic>> _exerciseTypes = [
    {
      'key': 'walking',
      'icon': Icons.directions_walk_rounded,
      'label': 'Walking',
    },
    {
      'key': 'running',
      'icon': Icons.directions_run_rounded,
      'label': 'Running',
    },
    {
      'key': 'cycling',
      'icon': Icons.directions_bike_rounded,
      'label': 'Cycling',
    },
    {'key': 'swimming', 'icon': Icons.pool_rounded, 'label': 'Swimming'},
  ];

  final List<Map<String, dynamic>> _intensityLevels = [
    {'key': 'mild', 'label': 'Mild', 'icon': Icons.self_improvement_rounded},
    {
      'key': 'moderate',
      'label': 'Moderate',
      'icon': Icons.directions_walk_rounded,
    },
    {'key': 'intense', 'label': 'Intense', 'icon': Icons.flash_on_rounded},
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
      'icon': Icons.sentiment_satisfied_rounded,
    },
    {
      'key': 'Moderate',
      'color': Color(0xFFF39C12),
      'icon': Icons.sentiment_neutral_rounded,
    },
    {
      'key': 'Severe',
      'color': Color(0xFFE74C3C),
      'icon': Icons.sentiment_very_dissatisfied_rounded,
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
      final result = await ApiService.logExercise(
        exerciseType: _exerciseType,
        duration: _duration,
        intensity: _intensity,
        indoor: _isIndoor,
        usedInhaler: _usedInhaler,
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
    if (riskLevel == 'HIGH') return 'NOT RECOMMENDED';
    if (riskLevel == 'MEDIUM') return 'PROCEED WITH CAUTION';
    return 'SAFE';
  }

  Color _riskColor(String? riskLevel) {
    if (riskLevel == 'HIGH') return AppColors.red;
    if (riskLevel == 'MEDIUM') return AppColors.yellow;
    return AppColors.green;
  }

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
          'Exercise Logging',
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
                  colors: [Color(0xFF2980B9), Color(0xFF3498DB)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(
                    Icons.fitness_center_rounded,
                    color: Colors.white,
                    size: 32,
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Log Your Workout',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Tell us about your exercise and we\'ll check if conditions are safe for your asthma.',
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      color: Colors.white.withOpacity(0.85),
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── EXERCISE TYPE ──
            _sectionLabel('TYPE OF EXERCISE', textMuted),
            const SizedBox(height: 10),
            Row(
              children: _exerciseTypes.map((t) {
                final isSelected = _exerciseType == t['key'];
                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _exerciseType = t['key']),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: EdgeInsets.only(
                        right: t != _exerciseTypes.last ? 8 : 0,
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: isSelected ? primary.withOpacity(0.15) : surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? primary : border,
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            t['icon'] as IconData,
                            color: isSelected ? primary : textDim,
                            size: 22,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            t['label'] as String,
                            style: GoogleFonts.nunito(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? primary : textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
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
                      activeTrackColor: primary,
                      inactiveTrackColor: border,
                      thumbColor: primary,
                      overlayColor: primary.withOpacity(0.15),
                      trackHeight: 4,
                      thumbShape: const RoundSliderThumbShape(
                        enabledThumbRadius: 8,
                      ),
                    ),
                    child: Slider(
                      value: _duration.toDouble(),
                      min: 5,
                      max: 120,
                      divisions: 23,
                      onChanged: (v) => setState(() => _duration = v.round()),
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: primary.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '$_duration min',
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      fontWeight: FontWeight.w800,
                      color: primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 22),

            // ── INTENSITY ──
            _sectionLabel('INTENSITY', textMuted),
            const SizedBox(height: 10),
            Row(
              children: _intensityLevels.map((level) {
                final isSelected = _intensity == level['key'];
                return Expanded(
                  child: GestureDetector(
                    onTap: () =>
                        setState(() => _intensity = level['key'] as String),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: EdgeInsets.only(
                        right: level != _intensityLevels.last ? 8 : 0,
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      decoration: BoxDecoration(
                        color: isSelected ? primary.withOpacity(0.15) : surface,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: isSelected ? primary : border,
                          width: isSelected ? 2 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(
                            level['icon'] as IconData,
                            color: isSelected ? primary : textDim,
                            size: 20,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            level['label'] as String,
                            style: GoogleFonts.nunito(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? primary : textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 22),

            // ── DETAILS TOGGLES ──
            _sectionLabel('DETAILS', textMuted),
            const SizedBox(height: 10),
            _toggleTile(
              icon: Icons.location_on_outlined,
              label: 'Indoor Exercise',
              sublabel: _isIndoor
                  ? 'Gym, home, or indoor facility'
                  : 'Outdoor — park, road, or field',
              value: _isIndoor,
              onChanged: (v) => setState(() => _isIndoor = v),
              surface: surface,
              border: border,
              text: text,
              textMuted: textMuted,
              primary: primary,
            ),
            const SizedBox(height: 10),
            _toggleTile(
              icon: Icons.medication_outlined,
              label: 'Used Inhaler Before',
              sublabel: 'Did you take your inhaler before exercising?',
              value: _usedInhaler,
              onChanged: (v) => setState(() => _usedInhaler = v),
              surface: surface,
              border: border,
              text: text,
              textMuted: textMuted,
              primary: primary,
            ),
            const SizedBox(height: 22),

            // ── SYMPTOMS SECTION (replaces the old toggle) ──
            _sectionLabel('SYMPTOMS DURING / AFTER', textMuted),
            const SizedBox(height: 10),
            _buildSymptomsSection(
              surface,
              border,
              text,
              textMuted,
              textDim,
              primary,
            ),
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
                          colors: [Color(0xFF2980B9), Color(0xFF3498DB)],
                        ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    if (!_loading)
                      BoxShadow(
                        color: const Color(0xFF2980B9).withOpacity(0.3),
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
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
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
                  border: Border.all(color: AppColors.red.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.cancel_outlined,
                      color: AppColors.red,
                      size: 18,
                    ),
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
                    isDark,
                    primary,
                    surface,
                    text,
                    textMuted,
                    border,
                  ),
                ),
              ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // ── NEW: Symptoms section widget ──────────────────────────────────
  Widget _buildSymptomsSection(
    Color surface,
    Color border,
    Color text,
    Color textMuted,
    Color textDim,
    Color primary,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: _hadSymptoms ? primary.withOpacity(0.5) : border,
          width: _hadSymptoms ? 1.5 : 1,
        ),
      ),
      child: Column(
        children: [
          // Top row: toggle "Did you have symptoms?"
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: (_hadSymptoms ? AppColors.red : primary).withOpacity(
                      0.1,
                    ),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.sick_outlined,
                    color: _hadSymptoms ? AppColors.red : primary,
                    size: 17,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Symptoms During / After',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          fontWeight: FontWeight.w700,
                          color: text,
                        ),
                      ),
                      Text(
                        _hadSymptoms
                            ? 'Tap to log what you experienced'
                            : 'No symptoms? Leave this off',
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          color: textMuted,
                        ),
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

          // Expanded section when symptoms toggled on
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
                      final isSelected = _selectedSymptoms.contains(symptom);
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
                            horizontal: 12,
                            vertical: 7,
                          ),
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
                              color: isSelected ? AppColors.red : textMuted,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),

                  // Severity — only show if at least one symptom selected
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
                              () => _symptomSeverity = s['key'] as String,
                            ),
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 150),
                              margin: EdgeInsets.only(
                                right: s != _severityLevels.last ? 8 : 0,
                              ),
                              padding: const EdgeInsets.symmetric(vertical: 10),
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
                                  Icon(
                                    s['icon'] as IconData,
                                    color: isSelected ? col : textMuted,
                                    size: 18,
                                  ),
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

                  // Optional notes field
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
                          'e.g. symptoms started 10 min into run, went away after rest...',
                      hintStyle: GoogleFonts.nunito(
                        fontSize: 12,
                        color: textMuted,
                      ),
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
                        borderSide: BorderSide(color: primary),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 10,
                      ),
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

  // ── Result card (unchanged structure) ────────────────────────────
  Widget _buildResultCard(
    bool isDark,
    Color primary,
    Color surface,
    Color text,
    Color textMuted,
    Color border,
  ) {
    final riskLevel = _result!['risk_level'] as String? ?? 'LOW';
    final riskCol = _riskColor(riskLevel);
    final env = _result!['environment'] as Map<String, dynamic>? ?? {};
    final aiRec = _result!['ai_recommendation'] as Map<String, dynamic>? ?? {};
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
                    child: Text(
                      _riskLabel(riskLevel),
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                      overflow: TextOverflow.ellipsis,
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

        if (env.isNotEmpty)
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
                  'CURRENT CONDITIONS',
                  style: GoogleFonts.nunito(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: textMuted,
                    letterSpacing: 0.7,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _envPill(
                      Icons.air_rounded,
                      'AQI',
                      '${env['aqi'] ?? '--'}',
                      primary,
                    ),
                    _envPill(
                      Icons.thermostat_outlined,
                      'Temp',
                      '${env['temperature'] ?? '--'}°C',
                      AppColors.yellow,
                    ),
                    _envPill(
                      Icons.water_drop_outlined,
                      'Humidity',
                      '${env['humidity'] ?? '--'}%',
                      AppColors.blue,
                    ),
                    _envPill(
                      Icons.blur_on_rounded,
                      'PM2.5',
                      '${env['pm25'] ?? '--'}',
                      AppColors.red,
                    ),
                  ],
                ),
              ],
            ),
          ),
        if (env.isNotEmpty) const SizedBox(height: 14),

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
              border: Border.all(color: AppColors.red.withOpacity(0.3)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.medical_services_outlined,
                  color: AppColors.red,
                  size: 20,
                ),
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
                          fontSize: 12,
                          color: text,
                          height: 1.5,
                        ),
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
                        fontSize: 12,
                        color: text,
                        height: 1.5,
                      ),
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

  Widget _envPill(IconData icon, String label, String value, Color color) {
    return Column(
      children: [
        Icon(icon, color: color, size: 18),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.nunito(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: AppColors.textColor(context),
          ),
        ),
        Text(
          label,
          style: GoogleFonts.nunito(
            fontSize: 9,
            fontWeight: FontWeight.w600,
            color: AppColors.textMutedColor(context),
          ),
        ),
      ],
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
    required Color primary,
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
              color: primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: primary, size: 17),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: text,
                  ),
                ),
                Text(
                  sublabel,
                  style: GoogleFonts.nunito(fontSize: 10, color: textMuted),
                ),
              ],
            ),
          ),
          Switch.adaptive(
            value: value,
            onChanged: onChanged,
            activeColor: primary,
          ),
        ],
      ),
    );
  }
}
