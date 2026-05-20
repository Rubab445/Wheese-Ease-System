import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import 'recommendation_detail_screen.dart';

class HouseholdActivityScreen extends StatefulWidget {
  const HouseholdActivityScreen({super.key});

  @override
  State<HouseholdActivityScreen> createState() => _HouseholdActivityScreenState();
}

class _HouseholdActivityScreenState extends State<HouseholdActivityScreen> {
  final List<Map<String, dynamic>> _cleaningActivities = [
    {'icon': Icons.cleaning_services_rounded, 'label': 'Sweeping'},
    {'icon': Icons.dry_cleaning_rounded, 'label': 'Dusting'},
    {'icon': Icons.local_laundry_service_rounded, 'label': 'Laundry'},
  ];

  final List<Map<String, dynamic>> _kitchenActivities = [
    {'icon': Icons.restaurant_rounded, 'label': 'Cooking'},
    {'icon': Icons.soup_kitchen_rounded, 'label': 'Frying'},
    {'icon': Icons.bakery_dining_rounded, 'label': 'Baking'},
  ];

  final List<Map<String, dynamic>> _outdoorActivities = [
    {'icon': Icons.yard_rounded, 'label': 'Gardening'},
    {'icon': Icons.format_paint_rounded, 'label': 'Painting'},
    {'icon': Icons.handyman_rounded, 'label': 'Repairs'},
  ];

  final Map<String, Map<String, dynamic>> _activityLogs = {};

  void _openActivitySheet(String name, IconData icon) {
    _activityLogs.putIfAbsent(name, () => {
      'duration': 30, 'intensity': 'moderate',
      'woreMask': false, 'openedWindows': false, 'hadSymptoms': false,
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _HouseholdBottomSheet(
        activityName: name, icon: icon,
        initialData: Map<String, dynamic>.from(_activityLogs[name]!),
        onSave: (data) {
          setState(() => _activityLogs[name] = data);
          Navigator.pop(ctx);
          _navigateToRecommendation(name, data);
        },
      ),
    );
  }

  void _navigateToRecommendation(String activityName, Map<String, dynamic> data) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RecommendationDetailScreen(
          entryType: 'household',
          entryData: {
            'activity_type': activityName.toLowerCase(),
            'duration': data['duration'],
            'wore_mask': data['woreMask'],
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
            // Header
            Container(
              width: double.infinity,
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 14,
                left: 16, right: 16, bottom: 14,
              ),
              decoration: BoxDecoration(
                gradient: isDark ? AppColors.primaryGradientDark : AppColors.primaryGradient,
              ),
              child: Row(children: [
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 14),
                Text('Select Household Activity',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 18, fontWeight: FontWeight.w800,
                    color: Colors.white, fontStyle: FontStyle.italic,
                  )),
              ]),
            ),

            const SizedBox(height: 16),

            // Hero image
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: SizedBox(
                  height: 180, width: double.infinity,
                  child: Stack(fit: StackFit.expand, children: [
                    Image.network(
                      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
                      fit: BoxFit.cover,
                      errorBuilder: (_, __, ___) => Container(
                        color: AppColors.yellow.withOpacity(0.15),
                        child: const Center(child: Icon(Icons.home_work_rounded, color: AppColors.yellow, size: 48)),
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter, end: Alignment.bottomCenter,
                          colors: [Colors.transparent, Colors.black.withOpacity(0.65)],
                        ),
                      ),
                    ),
                    Positioned(
                      bottom: 18, left: 18, right: 18,
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('Clean & Breathe Easy',
                          style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white)),
                        const SizedBox(height: 4),
                        Text('Track household activities & manage triggers.',
                          style: GoogleFonts.nunito(fontSize: 12, color: Colors.white.withOpacity(0.85))),
                      ]),
                    ),
                  ]),
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Cleaning category
            _categoryLabel(Icons.cleaning_services_outlined, 'CLEANING', primary, textMuted),
            const SizedBox(height: 12),
            _buildTileRow(_cleaningActivities, surface, border, text, textMuted, primary),

            const SizedBox(height: 24),

            // Kitchen category
            _categoryLabel(Icons.kitchen_outlined, 'KITCHEN', primary, textMuted),
            const SizedBox(height: 12),
            _buildTileRow(_kitchenActivities, surface, border, text, textMuted, primary),

            const SizedBox(height: 24),

            // Outdoor / DIY category
            _categoryLabel(Icons.park_outlined, 'OUTDOOR & DIY', primary, textMuted),
            const SizedBox(height: 12),
            _buildTileRow(_outdoorActivities, surface, border, text, textMuted, primary),

            const SizedBox(height: 28),

            // Health tip
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 18),
              child: Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.yellow.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.yellow.withOpacity(0.15)),
                ),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Container(
                    width: 38, height: 38,
                    decoration: BoxDecoration(
                      color: AppColors.yellow.withOpacity(0.12), shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.info_outline_rounded, color: AppColors.yellow, size: 18),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text('Trigger Tip', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: text)),
                      const SizedBox(height: 4),
                      Text('Wear a mask while sweeping or dusting to reduce exposure to dust mites and allergens.',
                        style: GoogleFonts.nunito(fontSize: 12, color: textMuted, height: 1.5)),
                    ]),
                  ),
                ]),
              ),
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _categoryLabel(IconData icon, String label, Color primary, Color textMuted) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(children: [
        Icon(icon, color: primary, size: 18),
        const SizedBox(width: 8),
        Text(label, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 1.2)),
      ]),
    );
  }

  Widget _buildTileRow(List<Map<String, dynamic>> activities, Color surface, Color border, Color text, Color textMuted, Color primary) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18),
      child: Row(
        children: activities.map((a) {
          final label = a['label'] as String;
          final isLogged = _activityLogs.containsKey(label);
          return Expanded(
            child: Padding(
              padding: EdgeInsets.only(right: a != activities.last ? 10 : 0),
              child: GestureDetector(
                onTap: () => _openActivitySheet(label, a['icon'] as IconData),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(vertical: 18),
                  decoration: BoxDecoration(
                    color: isLogged ? primary.withOpacity(0.08) : surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: isLogged ? primary.withOpacity(0.3) : border, width: isLogged ? 1.5 : 1),
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 8, offset: const Offset(0, 2))],
                  ),
                  child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
                    Icon(a['icon'] as IconData, size: 28, color: isLogged ? primary : textMuted),
                    const SizedBox(height: 8),
                    Text(label, style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: isLogged ? primary : text)),
                  ]),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bottom Sheet for household activity logging
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

class _HouseholdBottomSheet extends StatefulWidget {
  final String activityName;
  final IconData icon;
  final Map<String, dynamic> initialData;
  final Function(Map<String, dynamic>) onSave;

  const _HouseholdBottomSheet({
    required this.activityName, required this.icon,
    required this.initialData, required this.onSave,
  });

  @override
  State<_HouseholdBottomSheet> createState() => _HouseholdBottomSheetState();
}

class _HouseholdBottomSheetState extends State<_HouseholdBottomSheet> {
  late int _duration;
  late String _intensity;
  late bool _woreMask;
  late bool _openedWindows;
  late bool _hadSymptoms;
  final List<String> _selectedSymptoms = [];
  final TextEditingController _notesCtrl = TextEditingController();

  static const List<String> _symptomOptions = [
    'Wheezing', 'Coughing', 'Chest Tightness', 'Shortness of Breath', 'Runny Nose',
  ];

  @override
  void initState() {
    super.initState();
    _duration = widget.initialData['duration'] as int;
    _intensity = widget.initialData['intensity'] as String;
    _woreMask = widget.initialData['woreMask'] as bool;
    _openedWindows = widget.initialData['openedWindows'] as bool;
    _hadSymptoms = widget.initialData['hadSymptoms'] as bool;
  }

  @override
  void dispose() { _notesCtrl.dispose(); super.dispose(); }

  Color _intensityColor(String v) {
    switch (v) { case 'mild': return AppColors.green; case 'moderate': return AppColors.yellow; case 'severe': return AppColors.red; default: return AppColors.green; }
  }

  String get _durationLabel => _duration >= 120 ? '120m+' : '$_duration min';

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
        borderRadius: const BorderRadius.only(topLeft: Radius.circular(28), topRight: Radius.circular(28)),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Handle
              Center(child: Container(
                margin: const EdgeInsets.only(top: 12, bottom: 16),
                width: 40, height: 4,
                decoration: BoxDecoration(color: border, borderRadius: BorderRadius.circular(2)),
              )),

              // Title
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(children: [
                  Container(
                    width: 42, height: 42,
                    decoration: BoxDecoration(color: primary.withOpacity(0.10), borderRadius: BorderRadius.circular(12)),
                    child: Icon(widget.icon, color: primary, size: 22),
                  ),
                  const SizedBox(width: 14),
                  Expanded(child: Text(widget.activityName,
                    style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.w800, color: text))),
                  GestureDetector(
                    onTap: () => Navigator.pop(context),
                    child: Container(
                      width: 34, height: 34,
                      decoration: BoxDecoration(shape: BoxShape.circle, color: border.withOpacity(0.3)),
                      child: Icon(Icons.close, size: 18, color: textMuted),
                    ),
                  ),
                ]),
              ),

              const SizedBox(height: 24),

              // Duration
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                  Text('Duration', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: text)),
                  Text(_durationLabel, style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: primary)),
                ]),
              ),
              const SizedBox(height: 8),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: SliderTheme(
                  data: SliderThemeData(
                    activeTrackColor: primary, inactiveTrackColor: border,
                    thumbColor: primary, overlayColor: primary.withOpacity(0.12),
                    trackHeight: 5, thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 9),
                  ),
                  child: Slider(value: _duration.toDouble(), min: 10, max: 120, divisions: 22,
                    onChanged: (v) => setState(() => _duration = v.round())),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: ['10m', '30m', '60m', '90m', '120m+'].map((l) =>
                    Text(l, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w600, color: textMuted))).toList(),
                ),
              ),

              const SizedBox(height: 22),

              // Intensity
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Text('Intensity', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: text)),
              ),
              const SizedBox(height: 10),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: Row(children: [
                  _chip('Mild', 'mild', surface, border, textMuted),
                  const SizedBox(width: 10),
                  _chip('Moderate', 'moderate', surface, border, textMuted),
                  const SizedBox(width: 10),
                  _chip('Severe', 'severe', surface, border, textMuted),
                ]),
              ),

              const SizedBox(height: 20),

              // Toggles
              _toggle(Icons.masks_rounded, 'Wore a Mask', _woreMask, (v) => setState(() => _woreMask = v), surface, border, text, textMuted, primary),
              _toggle(Icons.window_rounded, 'Opened Windows', _openedWindows, (v) => setState(() => _openedWindows = v), surface, border, text, textMuted, primary),
              _toggle(Icons.sick_outlined, 'Symptoms Before', _hadSymptoms, (v) {
                setState(() { _hadSymptoms = v; if (!v) { _selectedSymptoms.clear(); _notesCtrl.clear(); } });
              }, surface, border, text, textMuted, primary),

              // Expandable symptoms
              if (_hadSymptoms) ...[
                Padding(
                  padding: const EdgeInsets.fromLTRB(22, 6, 22, 0),
                  child: Text('WHAT DID YOU EXPERIENCE?',
                    style: GoogleFonts.nunito(fontSize: 9, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: Wrap(
                    spacing: 8, runSpacing: 8,
                    children: _symptomOptions.map((s) {
                      final sel = _selectedSymptoms.contains(s);
                      return GestureDetector(
                        onTap: () => setState(() => sel ? _selectedSymptoms.remove(s) : _selectedSymptoms.add(s)),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 150),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: sel ? primary.withOpacity(0.12) : surface,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: sel ? primary.withOpacity(0.6) : border, width: sel ? 1.5 : 1),
                          ),
                          child: Text(s, style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: sel ? primary : textMuted)),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 14),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: Text('ADDITIONAL NOTES (OPTIONAL)',
                    style: GoogleFonts.nunito(fontSize: 9, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
                ),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 22),
                  child: TextField(
                    controller: _notesCtrl, maxLines: 2,
                    style: GoogleFonts.nunito(fontSize: 13, color: text),
                    decoration: InputDecoration(
                      hintText: 'e.g. started coughing after dusting bedroom...',
                      hintStyle: GoogleFonts.nunito(fontSize: 12, color: textMuted),
                      filled: true, fillColor: surface,
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: border)),
                      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: border)),
                      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: primary)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                ),
              ],

              const SizedBox(height: 24),

              // Save button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 22),
                child: GestureDetector(
                  onTap: () => widget.onSave({
                    'duration': _duration,
                    'intensity': _intensity,
                    'woreMask': _woreMask,
                    'openedWindows': _openedWindows,
                    'hadSymptoms': _hadSymptoms,
                    'symptoms_reported': List<String>.from(_selectedSymptoms),
                    'symptom_notes': _notesCtrl.text.trim().isEmpty
                        ? null
                        : _notesCtrl.text.trim(),
                  }),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      gradient: AppColors.primaryGradient,
                      boxShadow: [BoxShadow(color: primary.withOpacity(0.3), blurRadius: 14, offset: const Offset(0, 4))],
                    ),
                    child: Center(child: Row(mainAxisSize: MainAxisSize.min, children: [
                      const Icon(Icons.save_outlined, color: Colors.white, size: 18),
                      const SizedBox(width: 8),
                      Text('Save to Log', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                    ])),
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

  Widget _chip(String label, String value, Color surface, Color border, Color textMuted) {
    final sel = _intensity == value;
    final c = _intensityColor(value);
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _intensity = value),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: sel ? c : surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: sel ? c : border, width: 1.5),
          ),
          child: Center(child: Text(label,
            style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: sel ? Colors.white : textMuted))),
        ),
      ),
    );
  }

  Widget _toggle(IconData icon, String label, bool value, ValueChanged<bool> onChanged,
      Color surface, Color border, Color text, Color textMuted, Color primary) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 22, vertical: 5),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      decoration: BoxDecoration(color: surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: border)),
      child: Row(children: [
        Container(
          width: 34, height: 34,
          decoration: BoxDecoration(color: primary.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
          child: Icon(icon, color: primary, size: 17),
        ),
        const SizedBox(width: 12),
        Expanded(child: Text(label, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: text))),
        Switch.adaptive(value: value, onChanged: onChanged, activeColor: primary),
      ]),
    );
  }
}