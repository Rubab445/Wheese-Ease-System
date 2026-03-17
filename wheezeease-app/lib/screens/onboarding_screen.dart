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
  final _nameController = TextEditingController(text: 'Sara Ahmed');
  final _ageController = TextEditingController(text: '28');
  String _gender = 'Female';
  final _primaryMedController = TextEditingController(text: 'Salbutamol');
  final _secondaryMedController = TextEditingController(text: 'Fluticasone');
  final _triggersController = TextEditingController(text: 'Dust, Pollen');

  final Set<String> _selectedConditions = {'Asthma', 'Dust Allergy'};

  final List<Map<String, String>> _conditions = [
    {'icon': '😮‍💨', 'label': 'Asthma'},
    {'icon': '🤧', 'label': 'Seasonal Allergy'},
    {'icon': '🌫️', 'label': 'Dust Allergy'},
    {'icon': '🌸', 'label': 'Pollen Allergy'},
    {'icon': '🐱', 'label': 'Pet Allergy'},
    {'icon': '🍤', 'label': 'Food Allergy'},
  ];

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _primaryMedController.dispose();
    _secondaryMedController.dispose();
    _triggersController.dispose();
    super.dispose();
  }

  void _goToStep(int step) {
    setState(() => _currentStep = step);
    if (step == 3) {
      widget.onNameSet(_nameController.text);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
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
              // Logo
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      gradient: AppColors.bluePurple,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.blue.withValues(alpha: 0.35),
                          blurRadius: 16,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Text('🫁', style: TextStyle(fontSize: 20)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  RichText(
                    text: TextSpan(
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: AppColors.text,
                      ),
                      children: [
                        const TextSpan(text: 'Wheeze'),
                        TextSpan(
                          text: 'Ease',
                          style: TextStyle(color: AppColors.blue),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),

              // Title
              Center(
                child: Column(
                  children: [
                    Text(
                      'Your health,\nprotected.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 25,
                        fontWeight: FontWeight.w800,
                        color: AppColors.text,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'AI-powered asthma & allergy monitoring.\nSmart warnings before attacks happen.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: AppColors.textMuted,
                        height: 1.7,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Step dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(4, (i) {
                  final isActive = i == _currentStep;
                  final isDone = i < _currentStep;
                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: isActive ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: isActive
                          ? AppColors.blue
                          : isDone
                          ? AppColors.green
                          : AppColors.border,
                    ),
                  );
                }),
              ),
              const SizedBox(height: 22),

              // Steps
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
      case 0:
        return _buildStep0();
      case 1:
        return _buildStep1();
      case 2:
        return _buildStep2();
      case 3:
        return _buildStep3();
      default:
        return _buildStep0();
    }
  }

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
            color: AppColors.text,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          'Personalise your risk monitoring experience',
          style: GoogleFonts.nunito(fontSize: 12, color: AppColors.textMuted),
        ),
        const SizedBox(height: 14),
        _buildLabel('YOUR FULL NAME'),
        _buildTextField(_nameController, 'e.g. Sara Ahmed'),
        const SizedBox(height: 14),
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
                      border: Border.all(color: AppColors.border, width: 2),
                      color: AppColors.surface,
                    ),
                    child: DropdownButton<String>(
                      value: _gender,
                      isExpanded: true,
                      underline: const SizedBox(),
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.text,
                      ),
                      items: ['Female', 'Male', 'Other']
                          .map(
                            (g) => DropdownMenuItem(value: g, child: Text(g)),
                          )
                          .toList(),
                      onChanged: (v) => setState(() => _gender = v!),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        _buildGradientButton('Continue →', () => _goToStep(1)),
      ],
    );
  }

  Widget _buildStep1() {
    return Column(
      key: const ValueKey(1),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your conditions',
          style: GoogleFonts.playfairDisplay(
            fontSize: 21,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          'Select all that apply',
          style: GoogleFonts.nunito(fontSize: 12, color: AppColors.textMuted),
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
                    color: selected ? AppColors.blue : AppColors.border,
                    width: 2,
                  ),
                  color: selected ? AppColors.blueDim : AppColors.surface,
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(c['icon']!, style: const TextStyle(fontSize: 22)),
                    const SizedBox(height: 5),
                    Text(
                      c['label']!,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: selected ? AppColors.blue : AppColors.textMuted,
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
                  horizontal: 20,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                side: BorderSide(color: AppColors.border, width: 2),
              ),
              child: Text(
                '← Back',
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMuted,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildGradientButton('Continue →', () => _goToStep(2)),
            ),
          ],
        ),
      ],
    );
  }

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
            color: AppColors.text,
          ),
        ),
        const SizedBox(height: 5),
        Text(
          'Helps track your inhaler & schedule',
          style: GoogleFonts.nunito(fontSize: 12, color: AppColors.textMuted),
        ),
        const SizedBox(height: 14),
        _buildLabel('PRIMARY MEDICATION'),
        _buildTextField(_primaryMedController, 'e.g. Salbutamol'),
        const SizedBox(height: 14),
        _buildLabel('SECONDARY (OPTIONAL)'),
        _buildTextField(_secondaryMedController, 'e.g. Fluticasone'),
        const SizedBox(height: 14),
        _buildLabel('KNOWN TRIGGERS'),
        _buildTextField(_triggersController, 'e.g. Dust, Pollen, Cold air'),
        const SizedBox(height: 20),
        Row(
          children: [
            OutlinedButton(
              onPressed: () => _goToStep(1),
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                side: BorderSide(color: AppColors.border, width: 2),
              ),
              child: Text(
                '← Back',
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textMuted,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _buildGradientButton('Continue →', () => _goToStep(3)),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStep3() {
    final firstName = _nameController.text.split(' ').first;
    return Column(
      key: const ValueKey(3),
      children: [
        const SizedBox(height: 10),
        const Text('🎉', style: TextStyle(fontSize: 64)),
        const SizedBox(height: 14),
        Text(
          "You're all set,\n$firstName!",
          textAlign: TextAlign.center,
          style: GoogleFonts.playfairDisplay(
            fontSize: 24,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
          ),
        ),
        const SizedBox(height: 10),
        Text(
          "We'll monitor your risk in real time and warn you before any attack. Dr. Rahman is connected.",
          textAlign: TextAlign.center,
          style: GoogleFonts.nunito(
            fontSize: 13,
            color: AppColors.textMuted,
            height: 1.7,
          ),
        ),
        const SizedBox(height: 14),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.blueDim,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.blue.withValues(alpha: 0.25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '✓ Enabled',
                style: GoogleFonts.nunito(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.blue,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 7),
              Text(
                'High risk alerts · Medication reminders\nDaily check-in · Environmental warnings',
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  color: AppColors.text,
                  height: 1.8,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
        _buildGreenButton('Start Monitoring 🚀', widget.onComplete),
      ],
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Text(
        text,
        style: GoogleFonts.nunito(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: AppColors.textMuted,
          letterSpacing: 0.7,
        ),
      ),
    );
  }

  Widget _buildTextField(
    TextEditingController controller,
    String hint, {
    TextInputType? keyboardType,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: GoogleFonts.nunito(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.text,
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.nunito(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: AppColors.textDim,
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 13,
        ),
        filled: true,
        fillColor: AppColors.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.border, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: AppColors.border, width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: AppColors.blue, width: 2),
        ),
      ),
    );
  }

  Widget _buildGradientButton(String text, VoidCallback onPressed) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: AppColors.bluePurple,
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
