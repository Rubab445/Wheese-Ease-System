import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class SosModal extends StatelessWidget {
  final VoidCallback onClose;

  const SosModal({super.key, required this.onClose});

  void _action(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), behavior: SnackBarBehavior.floating),
    );
    onClose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.red.withValues(alpha: 0.96),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Align(
                alignment: Alignment.topRight,
                child: GestureDetector(
                  onTap: onClose,
                  child: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withValues(alpha: 0.2),
                    ),
                    child: const Center(
                      child: Text(
                        '✕',
                        style: TextStyle(fontSize: 19, color: Colors.white),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              const Text('🆘', style: TextStyle(fontSize: 54)),
              const SizedBox(height: 16),
              Text(
                'Emergency Help',
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 30,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'You may be experiencing a severe attack.\nChoose an action below:',
                textAlign: TextAlign.center,
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  color: Colors.white.withValues(alpha: 0.85),
                  height: 1.7,
                ),
              ),
              const SizedBox(height: 24),
              _sosBtn(
                context,
                '📞 Call My Doctor',
                () => _action(context, '📞 Calling Dr. Rahman...'),
              ),
              const SizedBox(height: 12),
              _sosBtn(
                context,
                '🚑 Call Emergency (1122)',
                () => _action(context, '🚑 Emergency services called: 1122'),
              ),
              const SizedBox(height: 12),
              _sosBtn(
                context,
                '📍 Share My Location',
                () => _action(context, '📍 Location shared with contact'),
              ),
              const SizedBox(height: 20),
              Text(
                'Use rescue inhaler immediately.\nSit upright. Breathe slowly. Do not lie down.',
                textAlign: TextAlign.center,
                style: GoogleFonts.nunito(
                  fontSize: 12,
                  color: Colors.white60,
                  height: 1.8,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sosBtn(BuildContext context, String label, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 17),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: Colors.white.withValues(alpha: 0.2),
          border: Border.all(
            color: Colors.white.withValues(alpha: 0.5),
            width: 2,
          ),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 17,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
        ),
      ),
    );
  }
}
