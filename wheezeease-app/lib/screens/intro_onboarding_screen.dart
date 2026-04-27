import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

/// Single intro/welcome page with meditation illustration,
/// animated breathing wave, and "Get Started" button.
/// Uses the app's existing teal/green theme.
class IntroOnboardingScreen extends StatefulWidget {
  final VoidCallback onComplete;

  const IntroOnboardingScreen({super.key, required this.onComplete});

  @override
  State<IntroOnboardingScreen> createState() => _IntroOnboardingScreenState();
}

class _IntroOnboardingScreenState extends State<IntroOnboardingScreen>
    with TickerProviderStateMixin {
  late AnimationController _breathingController;
  late AnimationController _pulseController;
  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    )..repeat(reverse: true);

    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeOut,
    );
    _fadeController.forward();
  }

  @override
  void dispose() {
    _breathingController.dispose();
    _pulseController.dispose();
    _fadeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = AppColors.primaryColor(context);

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
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 16),

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
                            color: primary.withValues(alpha: 0.35),
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
                            style: TextStyle(color: primary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // ── Illustration with breathing animation ──
                Expanded(
                  child: Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        SizedBox(
                          height: 280,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              // Pulsing glow behind character
                              AnimatedBuilder(
                                animation: _pulseController,
                                builder: (context, child) {
                                  final scale =
                                      1.0 + (_pulseController.value * 0.06);
                                  return Transform.scale(
                                    scale: scale,
                                    child: Container(
                                      width: 230,
                                      height: 230,
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        gradient: RadialGradient(
                                          colors: [
                                            primary.withOpacity(0.10),
                                            primary.withOpacity(0.03),
                                            Colors.transparent,
                                          ],
                                        ),
                                      ),
                                    ),
                                  );
                                },
                              ),

                              // Meditation character image
                              ClipRRect(
                                borderRadius: BorderRadius.circular(20),
                                child: Image.asset(
                                  'assets/images/meditation_character.png',
                                  width: 220,
                                  height: 220,
                                  fit: BoxFit.contain,
                                ),
                              ),

                              // Animated breathing wave
                              Positioned(
                                bottom: 0,
                                left: 20,
                                right: 20,
                                child: SizedBox(
                                  height: 50,
                                  child: AnimatedBuilder(
                                    animation: _breathingController,
                                    builder: (context, _) {
                                      return CustomPaint(
                                        size: const Size(double.infinity, 50),
                                        painter: _BreathingWavePainter(
                                          progress:
                                              _breathingController.value,
                                          color: primary,
                                        ),
                                      );
                                    },
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),

                        // ── Title ──
                        Text(
                          'Breathe Easy,\nLive Better',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 28,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textColor(context),
                            height: 1.3,
                          ),
                        ),
                        const SizedBox(height: 14),

                        // ── Subtitle ──
                        Text(
                          'AI-powered asthma & allergy monitoring.\nSmart warnings before attacks happen.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.nunito(
                            fontSize: 14,
                            color: AppColors.textMutedColor(context),
                            height: 1.7,
                          ),
                        ),
                        const SizedBox(height: 12),

                        // Feature highlights
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _featureChip(
                              Icons.shield_outlined,
                              'Risk Alerts',
                              primary,
                            ),
                            const SizedBox(width: 8),
                            _featureChip(
                              Icons.air_rounded,
                              'Air Quality',
                              primary,
                            ),
                            const SizedBox(width: 8),
                            _featureChip(
                              Icons.favorite_outline_rounded,
                              'Health AI',
                              primary,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // ── Get Started button ──
                GestureDetector(
                  onTap: widget.onComplete,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 18),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(18),
                      gradient: isDark
                          ? AppColors.primaryGradientDark
                          : AppColors.primaryGradient,
                      boxShadow: [
                        BoxShadow(
                          color: primary.withOpacity(0.35),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        'Get Started →',
                        style: GoogleFonts.nunito(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _featureChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        color: color.withOpacity(0.08),
        border: Border.all(color: color.withOpacity(0.15)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
        ],
      ),
    );
  }
}

// ═══════════════════════════════════════════
// Animated Breathing Wave Painter
// ═══════════════════════════════════════════
class _BreathingWavePainter extends CustomPainter {
  final double progress;
  final Color color;

  _BreathingWavePainter({required this.progress, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round;

    final path = Path();
    final midY = size.height / 2;

    for (double x = 0; x <= size.width; x += 1) {
      final normalizedX = x / size.width;
      final waveOffset = progress * 2 * pi;
      final envelope = sin(normalizedX * pi);
      final amplitude = 12 * envelope;
      final y = midY + sin(normalizedX * 4 * pi + waveOffset) * amplitude;

      if (x == 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    }

    // Gradient shader
    paint.shader = LinearGradient(
      colors: [
        color.withOpacity(0.1),
        color.withOpacity(0.6),
        color.withOpacity(0.6),
        color.withOpacity(0.1),
      ],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(path, paint);

    // Glow
    final glowPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 5
      ..strokeCap = StrokeCap.round
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 4);
    glowPaint.shader = LinearGradient(
      colors: [
        color.withOpacity(0.0),
        color.withOpacity(0.15),
        color.withOpacity(0.15),
        color.withOpacity(0.0),
      ],
    ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(path, glowPaint);

    // Moving dot
    final dotX = (progress * size.width) % size.width;
    final nX = dotX / size.width;
    final dotEnv = sin(nX * pi);
    final dotAmp = 12 * dotEnv;
    final dotY = midY + sin(nX * 4 * pi + progress * 2 * pi) * dotAmp;

    canvas.drawCircle(
      Offset(dotX, dotY),
      7,
      Paint()
        ..color = color.withOpacity(0.15)
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 5),
    );
    canvas.drawCircle(
      Offset(dotX, dotY),
      3.5,
      Paint()..color = color,
    );
  }

  @override
  bool shouldRepaint(covariant _BreathingWavePainter oldDelegate) =>
      oldDelegate.progress != progress;
}
