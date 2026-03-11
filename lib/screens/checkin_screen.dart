import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class CheckinScreen extends StatefulWidget {
  final VoidCallback onComplete;

  const CheckinScreen({super.key, required this.onComplete});

  @override
  State<CheckinScreen> createState() => _CheckinScreenState();
}

class _CheckinScreenState extends State<CheckinScreen> {
  bool _submitted = false;
  int _inhalerCount = 4;
  String _intensity = 'mod';
  int _selectedMood = 2; // 0-4
  final _notesController = TextEditingController(
    text: 'Worse after going outside this morning. Used inhaler twice.',
  );

  final List<Map<String, dynamic>> _symptoms = [
    {'emoji': '😤', 'name': 'Coughing', 'sub': 'Dry or wet', 'selected': false},
    {
      'emoji': '😮‍💨',
      'name': 'Wheezing',
      'sub': 'Whistling breath',
      'selected': true,
    },
    {
      'emoji': '😫',
      'name': 'Shortness',
      'sub': 'Hard to breathe',
      'selected': true,
    },
    {'emoji': '😴', 'name': 'Fatigue', 'sub': 'Low energy', 'selected': false},
    {
      'emoji': '🤧',
      'name': 'Runny Nose',
      'sub': 'Nasal congestion',
      'selected': false,
    },
    {'emoji': '😶', 'name': 'None', 'sub': 'Feeling fine!', 'selected': false},
  ];

  final List<String> _moods = ['😄', '🙂', '😐', '😟', '😰'];

  @override
  void dispose() {
    _notesController.dispose();
    super.dispose();
  }

  void _submitCheckin() {
    setState(() => _submitted = true);
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
          decoration: const BoxDecoration(
            gradient: AppColors.greenGradient,
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
              const Text('📋', style: TextStyle(fontSize: 34)),
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
                color: AppColors.text,
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
                    color: selected ? AppColors.blueDim : AppColors.surface,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: selected ? AppColors.blue : AppColors.border,
                      width: 2,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 24,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        s['emoji'] as String,
                        style: const TextStyle(fontSize: 32),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        s['name'] as String,
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: selected ? AppColors.blue : AppColors.text,
                        ),
                      ),
                      Text(
                        s['sub'] as String,
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          color: AppColors.textMuted,
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
                color: AppColors.text,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Row(
              children: [
                _intensityBtn(
                  '😌\nMild',
                  'mild',
                  AppColors.green,
                  AppColors.greenDim,
                ),
                const SizedBox(width: 8),
                _intensityBtn(
                  '😐\nModerate',
                  'mod',
                  AppColors.yellow,
                  AppColors.yellowDim,
                ),
                const SizedBox(width: 8),
                _intensityBtn(
                  '😣\nSevere',
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
                color: AppColors.text,
              ),
            ),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 18),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: AppColors.border),
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
                const Text('💨', style: TextStyle(fontSize: 30)),
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
                          color: AppColors.text,
                        ),
                      ),
                      Text(
                        'Times used today',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          color: AppColors.textMuted,
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
                    color: AppColors.text,
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
                color: AppColors.text,
              ),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(5, (i) {
              final selected = i == _selectedMood;
              return GestureDetector(
                onTap: () => setState(() => _selectedMood = i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  width: selected ? 56 : 50,
                  height: selected ? 56 : 50,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: selected ? AppColors.blueDim : AppColors.surface,
                    border: Border.all(
                      color: selected ? AppColors.blue : AppColors.border,
                      width: 2,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      _moods[i],
                      style: TextStyle(fontSize: selected ? 27 : 25),
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
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 8),
                TextField(
                  controller: _notesController,
                  maxLines: 3,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    color: AppColors.text,
                    height: 1.6,
                  ),
                  decoration: InputDecoration(
                    hintText: 'e.g. Worse after going outside...',
                    hintStyle: GoogleFonts.nunito(
                      fontSize: 13,
                      color: AppColors.textDim,
                    ),
                    filled: true,
                    fillColor: AppColors.surface,
                    contentPadding: const EdgeInsets.all(14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: AppColors.border, width: 2),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: AppColors.border, width: 2),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: const BorderSide(
                        color: AppColors.blue,
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
              onTap: _submitCheckin,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  gradient: AppColors.greenGradient,
                ),
                child: Center(
                  child: Text(
                    'Submit Check-In ✓',
                    style: GoogleFonts.nunito(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
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
    return SingleChildScrollView(
      padding: const EdgeInsets.all(22),
      child: Column(
        children: [
          const SizedBox(height: 36),
          const Text('✅', style: TextStyle(fontSize: 66)),
          const SizedBox(height: 14),
          Text(
            'Check-In Complete!',
            style: GoogleFonts.playfairDisplay(
              fontSize: 24,
              fontWeight: FontWeight.w800,
              color: AppColors.text,
            ),
          ),
          const SizedBox(height: 10),
          RichText(
            textAlign: TextAlign.center,
            text: TextSpan(
              style: GoogleFonts.nunito(
                fontSize: 13,
                color: AppColors.textMuted,
                height: 1.7,
              ),
              children: [
                const TextSpan(
                  text:
                      'Great job! Dr. Rahman has been notified. Based on your check-in, your risk is ',
                ),
                TextSpan(
                  text: 'High',
                  style: GoogleFonts.nunito(
                    fontWeight: FontWeight.w800,
                    color: AppColors.red,
                  ),
                ),
                const TextSpan(text: ' today. Stay indoors if possible.'),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.redDim,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.red.withValues(alpha: 0.2)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '⚡ AI RECOMMENDATIONS',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: AppColors.red,
                    letterSpacing: 0.5,
                  ),
                ),
                const SizedBox(height: 7),
                Text(
                  '• Carry your rescue inhaler\n• Avoid outdoor activity today\n• Wear N95 mask if going out\n• Take Fluticasone at 2:00 PM',
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
          GestureDetector(
            onTap: _resetCheckin,
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                gradient: AppColors.bluePurple,
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

  Widget _intensityBtn(
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
          padding: const EdgeInsets.symmetric(vertical: 11),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(13),
            color: isActive ? activeBg : AppColors.surface,
            border: Border.all(
              color: isActive ? activeColor : AppColors.border,
              width: 2,
            ),
          ),
          child: Center(
            child: Text(
              label,
              textAlign: TextAlign.center,
              style: GoogleFonts.nunito(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                color: isActive ? activeColor : AppColors.textMuted,
                height: 1.4,
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
          color: AppColors.surface2,
          border: Border.all(color: AppColors.border, width: 2),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.text,
            ),
          ),
        ),
      ),
    );
  }
}
