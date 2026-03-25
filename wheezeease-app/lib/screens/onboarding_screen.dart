import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class OnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;
  final Function(String) onNameSet;

  const OnboardingScreen({
    super.key,
    required this.onComplete,
    required this.onNameSet,
  });

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _currentStep = 0;

  // ── Step 0 controllers ──
  final _nameController     = TextEditingController(text: 'Sara Ahmed');
  final _ageController      = TextEditingController(text: '28');
  final _heightController   = TextEditingController(text: '165');
  final _weightController   = TextEditingController(text: '68');
  String _gender            = 'Female';

  // ── Step 1 ──
  final Set<String> _selectedConditions = {'Asthma', 'Dust Allergy'};
  final List<Map<String, dynamic>> _conditions = [
    {'icon': Icons.air_rounded, 'label': 'Asthma'},
    {'icon': Icons.sick_outlined, 'label': 'Seasonal Allergy'},
    {'icon': Icons.cloud_outlined, 'label': 'Dust Allergy'},
    {'icon': Icons.local_florist_outlined, 'label': 'Pollen Allergy'},
    {'icon': Icons.pets_outlined, 'label': 'Pet Allergy'},
    {'icon': Icons.restaurant_outlined, 'label': 'Food Allergy'},
  ];

  // ── Step 2 controllers ──
  final _primaryMedController   = TextEditingController(text: 'Salbutamol');
  final _secondaryMedController = TextEditingController(text: 'Fluticasone');
  final _triggersController     = TextEditingController(text: 'Dust, Pollen');
  bool   _smoking        = false;
  bool   _familyHistory  = false;
  String _activityLevel  = 'Moderate';

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _heightController.dispose();
    _weightController.dispose();
    _primaryMedController.dispose();
    _secondaryMedController.dispose();
    _triggersController.dispose();
    super.dispose();
  }

  // ── BMI calculation ──
  double _calculateBMI() {
    final height = double.tryParse(_heightController.text) ?? 165;
    final weight = double.tryParse(_weightController.text) ?? 68;
    if (height <= 0) return 24.0;
    return weight / ((height / 100) * (height / 100));
  }

  Color _bmiColor() {
    final bmi = _calculateBMI();
    if (bmi < 18.5) return const Color(0xFF3a8eff);
    if (bmi < 25.0) return const Color(0xFF22c87a);
    if (bmi < 30.0) return const Color(0xFFf5a623);
    return const Color(0xFFff4d6d);
  }

  String _bmiLabel() {
    final bmi = _calculateBMI();
    if (bmi < 18.5) return '— Underweight';
    if (bmi < 25.0) return '— Normal';
    if (bmi < 30.0) return '— Overweight';
    return '— Obese';
  }

  void _goToStep(int step) {
    setState(() => _currentStep = step);
    if (step == 3) {
      widget.onNameSet(_nameController.text);
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      decoration: BoxDecoration(
        gradient: isDark
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.bgDark, const Color(0xFF0D2920)],
              )
            : const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFFE8F4FF), Color(0xFFF5F0FF)],
              ),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── Logo ──
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      gradient: isDark
                          ? AppColors.primaryGradientDark
                          : AppColors.primaryGradient,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.primaryColor(context)
                              .withValues(alpha: 0.35),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(Icons.air_rounded,
                          color: Colors.white, size: 20),
                    ),
                  ),
                  const SizedBox(width: 10),
                  RichText(
                    text: TextSpan(
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textColor(context),
                      ),
                      children: [
                        const TextSpan(text: 'Wheeze'),
                        TextSpan(
                          text: 'Ease',
                          style: TextStyle(
                              color: AppColors.primaryColor(context)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // ── Title ──
              Center(
                child: Column(
                  children: [
                    Text(
                      'Your health,\nprotected.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 25,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textColor(context),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'AI-powered asthma & allergy monitoring.\nSmart warnings before attacks happen.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: AppColors.textMutedColor(context),
                        height: 1.7,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // ── Step dots ──
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (i) {
                  final isActive = i == _currentStep;
                  final isDone   = i < _currentStep;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width:  isActive ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: isActive
                          ? AppColors.primaryColor(context)
                          : isDone
                              ? AppColors.green
                              : AppColors.borderColor(context),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 22),

              // ── Steps ──
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 400),
                child: _buildStep(_currentStep),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep(int step) {
    switch (step) {
      case 0:  return _buildStep0();
      case 1:  return _buildStep1();
      case 2:  return _buildStep2();
      case 3:  return _buildStep3();
      default: return _buildStep0();
    }
  }

  // ══════════════════════════════════════════
  // STEP 0 — Personal Info (with height/weight/BMI)
  // ══════════════════════════════════════════
  Widget _buildStep0() {
    return Column(
      key: const ValueKey(0),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          "Let's get to know you",
          style: GoogleFonts.playfairDisplay(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            color: AppColors.textColor(context),
          ),
        ),
        const SizedBox(height: 5),
        Text(
          'Personalise your risk monitoring experience',
          style: GoogleFonts.nunito(
              fontSize: 12, color: AppColors.textMutedColor(context)),
        ),
        const SizedBox(height: 14),

        // Name
        _buildLabel('YOUR FULL NAME'),
        _buildTextField(_nameController, 'e.g. Sara Ahmed'),
        const SizedBox(height: 14),

        // Age + Gender
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLabel('AGE'),
                  _buildTextField(
                    _ageController,
                    '28',
                    keyboardType: TextInputType.number,
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLabel('GENDER'),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                          color: AppColors.borderColor(context), width: 2),
                      color: AppColors.surfaceColor(context),
                    ),
                    child: DropdownButton<String>(
                      value: _gender,
                      isExpanded: true,
                      underline: const SizedBox(),
                      dropdownColor: AppColors.surfaceColor(context),
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textColor(context),
                      ),
                      items: ['Female', 'Male', 'Other']
                          .map((g) => DropdownMenuItem(
                                value: g,
                                child: Text(g),
                              ))
                          .toList(),
                      onChanged: (v) => setState(() => _gender = v!),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),

        // Height + Weight
        Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLabel('HEIGHT (CM)'),
                  _buildTextField(
                    _heightController,
                    'e.g. 165',
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildLabel('WEIGHT (KG)'),
                  _buildTextField(
                    _weightController,
                    'e.g. 68',
                    keyboardType: TextInputType.number,
                    onChanged: (_) => setState(() {}),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // Live BMI display
        AnimatedContainer(
          duration: const Duration(milliseconds: 300),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: _bmiColor().withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: _bmiColor().withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              Text(
                'BMI: ${_calculateBMI().toStringAsFixed(1)}',
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: _bmiColor(),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                _bmiLabel(),
                style: GoogleFonts.nunito(
                  fontSize: 12,
                  color: _bmiColor(),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),
        _buildGradientButton('Continue →', () => _goToStep(1)),
      ],
    );
  }

  // ══════════════════════════════════════════
  // STEP 1 — Conditions
  // ══════════════════════════════════════════
  Widget _buildStep1() {
    final primary = AppColors.primaryColor(context);

    return Column(
      key: const ValueKey(1),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your conditions',
          style: GoogleFonts.playfairDisplay(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            color: AppColors.textColor(context),
          ),
        ),
        const SizedBox(height: 5),
        Text(
          'Select all that apply',
          style: GoogleFonts.nunito(
              fontSize: 12, color: AppColors.textMutedColor(context)),
        ),
        const SizedBox(height: 14),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 10,
          mainAxisSpacing: 10,
          childAspectRatio: 1.5,
          children: _conditions.map((c) {
            final selected = _selectedConditions.contains(c['label']);
            return GestureDetector(
              onTap: () {
                setState(() {
                  if (selected) {
                    _selectedConditions.remove(c['label']);
                  } else {
                    _selectedConditions.add(c['label']!);
                  }
                });
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.all(13),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: selected
                        ? primary
                        : AppColors.borderColor(context),
                    width: 2,
                  ),
                  color: selected
                      ? primary.withOpacity(0.12)
                      : AppColors.surfaceColor(context),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(c['icon'] as IconData,
                        size: 22,
                        color: selected
                            ? primary
                            : AppColors.textMutedColor(context)),
                    const SizedBox(height: 5),
                    Text(
                      c['label']!,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: selected
                            ? primary
                            : AppColors.textMutedColor(context),
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: 14),
        Row(
          children: [
            OutlinedButton(
              onPressed: () => _goToStep(0),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                side: BorderSide(
                    color: AppColors.borderColor(context), width: 2),
              ),
              child: Text(
                '← Back',
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMutedColor(context),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child:
                  _buildGradientButton('Continue →', () => _goToStep(2)),
            ),
          ],
        ),
      ],
    );
  }

  // ══════════════════════════════════════════
  // STEP 2 — Medications + Health questions
  // ══════════════════════════════════════════
  Widget _buildStep2() {
    return Column(
      key: const ValueKey(2),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your medications',
          style: GoogleFonts.playfairDisplay(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            color: AppColors.textColor(context),
          ),
        ),
        const SizedBox(height: 5),
        Text(
          'Helps track your inhaler & schedule',
          style: GoogleFonts.nunito(
              fontSize: 12, color: AppColors.textMutedColor(context)),
        ),
        const SizedBox(height: 14),

        // Primary medication
        _buildLabel('PRIMARY MEDICATION'),
        _buildTextField(_primaryMedController, 'e.g. Salbutamol'),
        const SizedBox(height: 14),

        // Secondary medication
        _buildLabel('SECONDARY (OPTIONAL)'),
        _buildTextField(_secondaryMedController, 'e.g. Fluticasone'),
        const SizedBox(height: 14),

        // Known triggers
        _buildLabel('KNOWN TRIGGERS'),
        _buildTextField(
            _triggersController, 'e.g. Dust, Pollen, Cold air'),
        const SizedBox(height: 20),

        // ── Do you smoke? ──
        _buildLabel('DO YOU SMOKE?'),
        const SizedBox(height: 6),
        Row(
          children: [
            _buildToggleChip(
              label: 'No',
              selected: !_smoking,
              onTap: () => setState(() => _smoking = false),
            ),
            const SizedBox(width: 10),
            _buildToggleChip(
              label: 'Yes',
              selected: _smoking,
              onTap: () => setState(() => _smoking = true),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // ── Physical activity ──
        _buildLabel('PHYSICAL ACTIVITY LEVEL'),
        const SizedBox(height: 6),
        Row(
          children: [
            _buildToggleChip(
              label: 'Low',
              selected: _activityLevel == 'Low',
              onTap: () => setState(() => _activityLevel = 'Low'),
            ),
            const SizedBox(width: 8),
            _buildToggleChip(
              label: 'Moderate',
              selected: _activityLevel == 'Moderate',
              onTap: () => setState(() => _activityLevel = 'Moderate'),
            ),
            const SizedBox(width: 8),
            _buildToggleChip(
              label: 'High',
              selected: _activityLevel == 'High',
              onTap: () => setState(() => _activityLevel = 'High'),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // ── Family history ──
        _buildLabel('FAMILY HISTORY OF ASTHMA?'),
        const SizedBox(height: 6),
        Row(
          children: [
            _buildToggleChip(
              label: 'No',
              selected: !_familyHistory,
              onTap: () => setState(() => _familyHistory = false),
            ),
            const SizedBox(width: 10),
            _buildToggleChip(
              label: 'Yes',
              selected: _familyHistory,
              onTap: () => setState(() => _familyHistory = true),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // Navigation buttons
        Row(
          children: [
            OutlinedButton(
              onPressed: () => _goToStep(1),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                side: BorderSide(
                    color: AppColors.borderColor(context), width: 2),
              ),
              child: Text(
                '← Back',
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMutedColor(context),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child:
                  _buildGradientButton('Continue →', () => _goToStep(3)),
            ),
          ],
        ),
      ],
    );
  }

  // ══════════════════════════════════════════
  // STEP 3 — Success screen
  // ══════════════════════════════════════════
  Widget _buildStep3() {
    final firstName = _nameController.text.split(' ').first;
    final primary = AppColors.primaryColor(context);

    return Column(
      key: const ValueKey(3),
      children: [
        const SizedBox(height: 10),
        Icon(Icons.celebration_outlined, color: primary, size: 64),
        const SizedBox(height: 14),
        Text(
          "You're all set,\n$firstName!",
          textAlign: TextAlign.center,
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: AppColors.textColor(context),
          ),
        ),
        const SizedBox(height: 10),
        Text(
          "We'll monitor your risk in real time and warn you before any attack. Dr. Rahman is connected.",
          textAlign: TextAlign.center,
          style: GoogleFonts.nunito(
            fontSize: 13,
            color: AppColors.textMutedColor(context),
            height: 1.7,
          ),
        ),
        const SizedBox(height: 14),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(16),
            border:
                Border.all(color: primary.withValues(alpha: 0.25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Enabled',
                style: GoogleFonts.nunito(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: primary,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 7),
              Text(
                'High risk alerts · Medication reminders\nDaily check-in · Environmental warnings',
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  color: AppColors.textColor(context),
                  height: 1.8,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        _buildGreenButton('Start Monitoring', widget.onComplete),
      ],
    );
  }

  // ══════════════════════════════════════════
  // REUSABLE WIDGETS
  // ══════════════════════════════════════════
  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Text(
        text,
        style: GoogleFonts.nunito(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: AppColors.textMutedColor(context),
          letterSpacing: 0.7,
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String hint, {
    TextInputType? keyboardType,
    Function(String)? onChanged,
  }) {
    final primary = AppColors.primaryColor(context);

    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      onChanged: onChanged,
      style: GoogleFonts.nunito(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textColor(context),
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.nunito(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: AppColors.textDimColor(context),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
        filled: true,
        fillColor: AppColors.surfaceColor(context),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide:
              BorderSide(color: AppColors.borderColor(context), width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide:
              BorderSide(color: AppColors.borderColor(context), width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: primary, width: 2),
        ),
      ),
    );
  }

  Widget _buildToggleChip({
    required String label,
    required bool selected,
    required VoidCallback onTap,
  }) {
    final primary = AppColors.primaryColor(context);

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: selected ? primary : AppColors.borderColor(context),
            width: 2,
          ),
          color: selected
              ? primary.withOpacity(0.12)
              : AppColors.surfaceColor(context),
        ),
        child: Text(
          label,
          style: GoogleFonts.nunito(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: selected ? primary : AppColors.textMutedColor(context),
          ),
        ),
      ),
    );
  }

  Widget _buildGradientButton(String text, VoidCallback onPressed) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return GestureDetector(
      onTap: onPressed,
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
            text,
            style: GoogleFonts.nunito(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: 0.3,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGreenButton(String text, VoidCallback onPressed) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: AppColors.greenGradient,
        ),
        child: Center(
          child: Text(
            text,
            style: GoogleFonts.nunito(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}