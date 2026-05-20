import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import 'recommendation_detail_screen.dart';

class ExerciseLogScreen extends StatefulWidget {
  const ExerciseLogScreen({super.key});

  @override
  State<ExerciseLogScreen> createState() => _ExerciseLogScreenState();
}

class _ExerciseLogScreenState extends State<ExerciseLogScreen> {
  // Categories with exercises
  final List<Map<String, dynamic>> _cardioExercises = [
    {'icon': Icons.directions_walk_rounded, 'label': 'Walking'},
    {'icon': Icons.directions_run_rounded, 'label': 'Running'},
    {'icon': Icons.directions_bike_rounded, 'label': 'Cycling'},
  ];

  final List<Map<String, dynamic>> _recoveryExercises = [
    {'icon': Icons.self_improvement_rounded, 'label': 'Yoga'},
    {'icon': Icons.accessibility_new_rounded, 'label': 'Stretching'},
    {'icon': Icons.air_rounded, 'label': 'Breathwork'},
  ];

  // Tracks which exercises have been logged
  final Map<String, Map<String, dynamic>> _exerciseLogs = {};

  void _openExerciseSheet(String exerciseName, IconData icon) {
    // Initialize defaults if not already set
    _exerciseLogs.putIfAbsent(exerciseName, () => {
      'duration': 30,
      'intensity': 'moderate',
      'isIndoor': false,
      'usedInhaler': false,
      'hadSymptoms': false,
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _ExerciseBottomSheet(
        exerciseName: exerciseName,
        icon: icon,
        initialData: Map<String, dynamic>.from(_exerciseLogs[exerciseName]!),
        onSave: (data) {
          setState(() => _exerciseLogs[exerciseName] = data);
          Navigator.pop(ctx);
          _navigateToRecommendation(exerciseName, data);
        },
      ),
    );
  }

  void _navigateToRecommendation(String exerciseName, Map<String, dynamic> data) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RecommendationDetailScreen(
          entryType: 'exercise',
          entryData: {
            'exercise_type': exerciseName.toLowerCase(),
            'duration': data['duration'],
            'intensity': data['intensity'],
            'indoor': data['isIndoor'],
            'used_inhaler': data['usedInhaler'],
            'symptoms_reported': data['symptoms_reported'] ?? [],
            'symptom_notes': data['symptom_notes'],
          },
          entryDate: DateTime.now(),
          saveToHistory: true,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return Scaffold(
      backgroundColor: bg,
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── HEADER ──
            Container(
              width: double.infinity,
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 14,
                left: 16,
                right: 16,
                bottom: 14,
              ),
              decoration: BoxDecoration(
                gradient: isDark
                    ? AppColors.primaryGradientDark
                    : AppColors.primaryGradient,
              ),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Text(
                    'Select Exercise',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // ── HERO IMAGE CARD ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: SizedBox(
                  height: 180,
                  width: double.infinity,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      // Image
                      Image.network(
                        'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
                        fit: BoxFit.cover,
                        errorBuilder: (ctx, err, stack) => Container(
                          color: primary.withOpacity(0.15),
                          child: Center(
                            child: Icon(
                              Icons.fitness_center_rounded,
                              color: primary,
                              size: 48,
                            ),
                          ),
                        ),
                      ),
                      // Gradient overlay
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.transparent,
                              Colors.black.withOpacity(0.65),
                            ],
                          ),
                        ),
                      ),
                      // Text overlay
                      Positioned(
                        bottom: 18,
                        left: 18,
                        right: 18,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Breathe & Move',
                              style: GoogleFonts.playfairDisplay(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Gentle exercises optimized for lung health.',
                              style: GoogleFonts.nunito(
                                fontSize: 12,
                                color: Colors.white.withOpacity(0.85),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // ── CARDIO CATEGORY ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Icon(Icons.favorite_outline_rounded, color: primary, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'CARDIO',
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: textMuted,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Row(
                children: _cardioExercises.map((exercise) {
                  return Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(
                        right: exercise != _cardioExercises.last ? 10 : 0,
                      ),
                      child: _buildExerciseTile(
                        exercise['icon'] as IconData,
                        exercise['label'] as String,
                        surface, border, text, textMuted, primary,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 24),

            // ── RECOVERY CATEGORY ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: [
                  Icon(Icons.spa_outlined, color: primary, size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'RECOVERY',
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: textMuted,
                      letterSpacing: 1.2,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Row(
                children: _recoveryExercises.map((exercise) {
                  return Expanded(
                    child: Padding(
                      padding: EdgeInsets.only(
                        right: exercise != _recoveryExercises.last ? 10 : 0,
                      ),
                      child: _buildExerciseTile(
                        exercise['icon'] as IconData,
                        exercise['label'] as String,
                        surface, border, text, textMuted, primary,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),

            const SizedBox(height: 28),

            // ── HEALTH TIP CARD ──
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: primary.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: primary.withOpacity(0.12),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: primary.withOpacity(0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.info_outline_rounded,
                        color: primary,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Health Tip',
                            style: GoogleFonts.nunito(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: text,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'During high pollen days, prefer indoor activities like Yoga or Stretching to minimize respiratory irritation.',
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              color: textMuted,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseTile(
    IconData icon,
    String label,
    Color surface,
    Color border,
    Color text,
    Color textMuted,
    Color primary,
  ) {
    final isLogged = _exerciseLogs.containsKey(label);

    return GestureDetector(
      onTap: () => _openExerciseSheet(label, icon),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 18),
        decoration: BoxDecoration(
          color: isLogged ? primary.withOpacity(0.08) : surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isLogged ? primary.withOpacity(0.3) : border,
            width: isLogged ? 1.5 : 1,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 28,
              color: isLogged ? primary : textMuted,
            ),
            const SizedBox(height: 8),
            Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isLogged ? primary : text,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bottom Sheet for individual exercise logging
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class _ExerciseBottomSheet extends StatefulWidget {
  final String exerciseName;
  final IconData icon;
  final Map<String, dynamic> initialData;
  final Function(Map<String, dynamic>) onSave;

  const _ExerciseBottomSheet({
    required this.exerciseName,
    required this.icon,
    required this.initialData,
    required this.onSave,
  });

  @override
  State<_ExerciseBottomSheet> createState() => _ExerciseBottomSheetState();
}

class _ExerciseBottomSheetState extends State<_ExerciseBottomSheet> {
  late int _duration;
  late String _intensity;
  late bool _isIndoor;
  late bool _usedInhaler;
  late bool _hadSymptoms;
  final List<String> _selectedSymptoms = [];
  final TextEditingController _symptomNotesController = TextEditingController();

  static const List<String> _symptomOptions = [
    'Wheezing',
    'Coughing',
    'Chest Tightness',
    'Shortness of Breath',
    'Runny Nose',
  ];

  @override
  void initState() {
    super.initState();
    _duration = widget.initialData['duration'] as int;
    _intensity = widget.initialData['intensity'] as String;
    _isIndoor = widget.initialData['isIndoor'] as bool;
    _usedInhaler = widget.initialData['usedInhaler'] as bool;
    _hadSymptoms = widget.initialData['hadSymptoms'] as bool;
  }

  @override
  void dispose() {
    _symptomNotesController.dispose();
    super.dispose();
  }

  Color _intensityColor(String value) {
    switch (value) {
      case 'mild':
        return AppColors.green;
      case 'moderate':
        return AppColors.yellow;
      case 'severe':
        return AppColors.red;
      default:
        return AppColors.green;
    }
  }

  String get _durationLabel {
    if (_duration >= 120) return '120m+';
    return '$_duration min';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return Container(
      decoration: BoxDecoration(
        color: bg,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle bar
              Center(
                child: Container(
                  margin: const EdgeInsets.only(top: 12, bottom: 16),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),

              // Title row
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(
                  children: [
                    Container(
                      width: 42,
                      height: 42,
                      decoration: BoxDecoration(
                        color: primary.withOpacity(0.10),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(widget.icon, color: primary, size: 22),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        widget.exerciseName,
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: text,
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () => Navigator.pop(context),
                      child: Container(
                        width: 34,
                        height: 34,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: border.withOpacity(0.3),
                        ),
                        child: Icon(Icons.close, size: 18, color: textMuted),
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Duration section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Duration',
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: text,
                      ),
                    ),
                    Text(
                      _durationLabel,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: primary,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: SliderTheme(
                  data: SliderThemeData(
                    activeTrackColor: primary,
                    inactiveTrackColor: border,
                    thumbColor: primary,
                    overlayColor: primary.withOpacity(0.12),
                    trackHeight: 5,
                    thumbShape: const RoundSliderThumbShape(
                      enabledThumbRadius: 9,
                    ),
                  ),
                  child: Slider(
                    value: _duration.toDouble(),
                    min: 10,
                    max: 120,
                    divisions: 22,
                    onChanged: (v) => setState(() => _duration = v.round()),
                  ),
                ),
              ),
              // Duration labels
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: ['10m', '30m', '60m', '90m', '120m+'].map((l) {
                    return Text(
                      l,
                      style: GoogleFonts.nunito(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: textMuted,
                      ),
                    );
                  }).toList(),
                ),
              ),

              const SizedBox(height: 22),

              // Intensity section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Text(
                  'Intensity',
                  style: GoogleFonts.nunito(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: text,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(
                  children: [
                    _intensityChip('Mild', 'mild', primary, surface, border, text, textMuted),
                    const SizedBox(width: 10),
                    _intensityChip('Moderate', 'moderate', primary, surface, border, text, textMuted),
                    const SizedBox(width: 10),
                    _intensityChip('Severe', 'severe', primary, surface, border, text, textMuted),
                  ],
                ),
              ),

              const SizedBox(height: 20),

              // Toggle rows
              _buildToggleRow(
                Icons.home_rounded,
                'Indoor Exercise',
                _isIndoor,
                (v) => setState(() => _isIndoor = v),
                surface, border, text, textMuted, primary,
              ),
              _buildToggleRow(
                Icons.medication_outlined,
                'Used Inhaler Before',
                _usedInhaler,
                (v) => setState(() => _usedInhaler = v),
                surface, border, text, textMuted, primary,
              ),
              _buildToggleRow(
                Icons.sick_outlined,
                'Symptoms Before',
                _hadSymptoms,
                (v) {
                  setState(() {
                    _hadSymptoms = v;
                    if (!v) {
                      _selectedSymptoms.clear();
                      _symptomNotesController.clear();
                    }
                  });
                },
                surface, border, text, textMuted, primary,
              ),

              // Expandable symptoms section
              if (_hadSymptoms) ...[
                Padding(
                  padding: const EdgeInsets.fromLTRB(22, 6, 22, 0),
                  child: Text(
                    'WHAT DID YOU EXPERIENCE?',
                    style: GoogleFonts.nunito(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: textMuted,
                      letterSpacing: 0.7,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: Wrap(
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
                            horizontal: 14,
                            vertical: 8,
                          ),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? primary.withOpacity(0.12)
                                : surface,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: isSelected
                                  ? primary.withOpacity(0.6)
                                  : border,
                              width: isSelected ? 1.5 : 1,
                            ),
                          ),
                          child: Text(
                            symptom,
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: isSelected ? primary : textMuted,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 14),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: Text(
                    'ADDITIONAL NOTES (OPTIONAL)',
                    style: GoogleFonts.nunito(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: textMuted,
                      letterSpacing: 0.7,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: TextField(
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
                      fillColor: surface,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: border),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: border),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(color: primary),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 12,
                      ),
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 24),

              // Save button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: GestureDetector(
                  onTap: () {
                    widget.onSave({
                      'duration': _duration,
                      'intensity': _intensity,
                      'isIndoor': _isIndoor,
                      'usedInhaler': _usedInhaler,
                      'hadSymptoms': _hadSymptoms,
                      'symptoms_reported': List<String>.from(_selectedSymptoms),
                      'symptom_notes': _symptomNotesController.text.trim().isEmpty
                          ? null
                          : _symptomNotesController.text.trim(),
                    });
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      gradient: AppColors.primaryGradient,
                      boxShadow: [
                        BoxShadow(
                          color: primary.withOpacity(0.3),
                          blurRadius: 14,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.save_outlined, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            'Save to Log',
                            style: GoogleFonts.nunito(
                              fontSize: 15,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }

  Widget _intensityChip(
    String label,
    String value,
    Color primary,
    Color surface,
    Color border,
    Color text,
    Color textMuted,
  ) {
    final isSelected = _intensity == value;
    final chipColor = _intensityColor(value);
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _intensity = value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? chipColor : surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isSelected ? chipColor : border,
              width: 1.5,
            ),
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: isSelected ? Colors.white : textMuted,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildToggleRow(
    IconData icon,
    String label,
    bool value,
    ValueChanged<bool> onChanged,
    Color surface,
    Color border,
    Color text,
    Color textMuted,
    Color primary,
  ) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 22, vertical: 5),
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
            child: Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: text,
              ),
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
