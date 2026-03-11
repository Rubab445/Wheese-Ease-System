import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class LocationPermissionScreen extends StatefulWidget {
  final VoidCallback onAllow;
  final VoidCallback onDeny;

  const LocationPermissionScreen({
    super.key,
    required this.onAllow,
    required this.onDeny,
  });

  @override
  State<LocationPermissionScreen> createState() =>
      _LocationPermissionScreenState();
}

class _LocationPermissionScreenState extends State<LocationPermissionScreen>
    with TickerProviderStateMixin {
  bool _searching = false;
  String _statusText = 'Accessing GPS…';
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _allowLocation() async {
    setState(() => _searching = true);
    final steps = [
      'Accessing GPS…',
      'Obtaining coordinates…',
      'Resolving address…',
      'Location confirmed ✓',
    ];
    for (int i = 0; i < steps.length; i++) {
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) setState(() => _statusText = steps[i]);
    }
    await Future.delayed(const Duration(milliseconds: 500));
    if (mounted) widget.onAllow();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFE8F4FF), Color(0xFFF0E8FF)],
        ),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
          child: Column(
            children: [
              // Pulse ring with location icon
              AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  final scale = 1.0 + _pulseController.value * 0.03;
                  return Transform.scale(scale: scale, child: child);
                },
                child: Container(
                  width: 130,
                  height: 130,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [
                        AppColors.blue.withValues(alpha: 0.13),
                        AppColors.purple.withValues(alpha: 0.13),
                      ],
                    ),
                  ),
                  child: Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: AppColors.bluePurple,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.blue.withValues(alpha: 0.38),
                            blurRadius: 28,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Text('📍', style: TextStyle(fontSize: 34)),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'Allow Location\nAccess',
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: AppColors.text,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'WheezeEase uses your location to monitor real-time AQI, pollen, and weather conditions in your area.',
                textAlign: TextAlign.center,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  color: AppColors.textMuted,
                  height: 1.75,
                ),
              ),
              const SizedBox(height: 22),

              // Permission card
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 18,
                ),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 24,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  children: [
                    _buildPermRow(
                      '🌫️',
                      AppColors.blueDim,
                      'Live Air Quality Index',
                      'We fetch real-time AQI data for your exact neighbourhood to detect dangerous pollution levels.',
                    ),
                    _buildPermRow(
                      '🌸',
                      AppColors.greenDim,
                      'Pollen & Allergen Tracking',
                      'Localised pollen forecasts so we can warn you on high-risk days before you step outside.',
                    ),
                    _buildPermRow(
                      '🏥',
                      AppColors.yellowDim,
                      'Find Doctors Near You',
                      "We'll show you registered WheezeEase doctors in your area so you can pick one to monitor your health.",
                    ),
                    _buildPermRow(
                      '🔒',
                      AppColors.purpleDim,
                      'Your Privacy is Protected',
                      'Location is only used for environmental data. It is never shared with third parties.',
                      showBorder: false,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Searching animation
              if (_searching)
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.08),
                        blurRadius: 24,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      SizedBox(
                        width: 36,
                        height: 36,
                        child: CircularProgressIndicator(
                          strokeWidth: 3,
                          color: AppColors.blue,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Detecting your location…',
                        style: GoogleFonts.nunito(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: AppColors.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _statusText,
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),

              if (!_searching) ...[
                GestureDetector(
                  onTap: _allowLocation,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 17),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(18),
                      gradient: AppColors.bluePurple,
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.blue.withValues(alpha: 0.35),
                          blurRadius: 28,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        '📍  Allow Location Access',
                        style: GoogleFonts.nunito(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: widget.onDeny,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: Text(
                        'Not now — enter manually',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: AppColors.textMuted,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermRow(
    String icon,
    Color bgColor,
    String title,
    String subtitle, {
    bool showBorder = true,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        border: showBorder
            ? Border(bottom: BorderSide(color: AppColors.border))
            : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(11),
              color: bgColor,
            ),
            child: Center(
              child: Text(icon, style: const TextStyle(fontSize: 17)),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    color: AppColors.textMuted,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
