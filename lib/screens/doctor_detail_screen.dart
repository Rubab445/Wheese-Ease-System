import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class DoctorDetailScreen extends StatelessWidget {
  final VoidCallback onMessageTap;

  const DoctorDetailScreen({super.key, required this.onMessageTap});

  void _showToast(BuildContext context, String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 22,
              left: 22,
              right: 22,
              bottom: 28,
            ),
            decoration: const BoxDecoration(
              gradient: AppColors.darkGradient,
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
                      'My Doctor',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'Your assigned pulmonologist',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        color: Colors.white60,
                      ),
                    ),
                  ],
                ),
                const Text('🩺', style: TextStyle(fontSize: 34)),
              ],
            ),
          ),

          // Doctor card
          Container(
            margin: const EdgeInsets.fromLTRB(18, 16, 18, 0),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: AppColors.border),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.14),
                  blurRadius: 40,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Row(
                  children: [
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        gradient: const LinearGradient(
                          colors: [Color(0xFF1A4A7A), Color(0xFF3A8EFF)],
                        ),
                        border: Border.all(
                          color: AppColors.blue.withValues(alpha: 0.3),
                          width: 3,
                        ),
                      ),
                      child: Center(
                        child: Text(
                          'DR',
                          style: GoogleFonts.nunito(
                            fontSize: 22,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Dr. A. Rahman',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppColors.text,
                          ),
                        ),
                        Text(
                          'Pulmonologist · FCPS',
                          style: GoogleFonts.nunito(
                            fontSize: 12,
                            color: AppColors.textMuted,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          '🏥 Gujranwala General Hospital',
                          style: GoogleFonts.nunito(
                            fontSize: 12,
                            color: AppColors.blue,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    _statCard(
                      'Experience',
                      '14 yrs',
                      AppColors.greenDim,
                      AppColors.green,
                    ),
                    const SizedBox(width: 8),
                    _statCard(
                      'Last Visit',
                      'Feb 18',
                      AppColors.blueDim,
                      AppColors.blue,
                    ),
                    const SizedBox(width: 8),
                    _statCard(
                      'Next Visit',
                      'Mar 18',
                      AppColors.purpleDim,
                      AppColors.purple,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 8,
                  mainAxisSpacing: 8,
                  childAspectRatio: 3.2,
                  children: [
                    _actionBtn(
                      context,
                      '💬 Message',
                      AppColors.blueDim,
                      AppColors.blue,
                      onMessageTap,
                    ),
                    _actionBtn(
                      context,
                      '📅 Book Visit',
                      AppColors.greenDim,
                      AppColors.green,
                      () => _showToast(context, '📅 Appointment request sent!'),
                    ),
                    _actionBtn(
                      context,
                      '📞 Call Now',
                      AppColors.redDim,
                      AppColors.red,
                      () => _showToast(context, '📞 Calling Dr. Rahman...'),
                    ),
                    _actionBtn(
                      context,
                      '📋 Share Report',
                      AppColors.yellowDim,
                      AppColors.yellow,
                      () => _showToast(context, '📋 Sharing health report...'),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Recent advice
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 8),
            child: Text(
              'Recent Advice',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: AppColors.text,
              ),
            ),
          ),
          _adviceCard(
            'Today · 7:22 AM',
            'Carry your rescue inhaler at all times. AQI is above 150 — wear an N95 mask if you must go outside. Take corticosteroid as scheduled.',
            AppColors.blue,
          ),
          _adviceCard(
            'March 05 · 2:10 PM',
            'Good progress this week! Risk scores are improving. Continue current medication. Reduce inhaler use if possible.',
            AppColors.green,
          ),
          _adviceCard(
            'March 01 · 9:45 AM',
            'Pollen season starting. Start Cetirizine daily. Avoid morning outdoor walks 6–10 AM when pollen peaks.',
            AppColors.purple,
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _statCard(String label, String value, Color bg, Color borderColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(11),
          border: Border.all(color: borderColor.withValues(alpha: 0.2)),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 10,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w600,
              ),
            ),
            Text(
              value,
              style: GoogleFonts.playfairDisplay(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppColors.text,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _actionBtn(
    BuildContext context,
    String label,
    Color bg,
    Color textColor,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: textColor.withValues(alpha: 0.25)),
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: textColor,
            ),
          ),
        ),
      ),
    );
  }

  Widget _adviceCard(String date, String text, Color borderColor) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 5),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Container(
        decoration: BoxDecoration(
          border: Border(left: BorderSide(color: borderColor, width: 4)),
        ),
        padding: const EdgeInsets.only(left: 10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              date,
              style: GoogleFonts.nunito(
                fontSize: 10,
                color: AppColors.textMuted,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 5),
            Text(
              text,
              style: GoogleFonts.nunito(
                fontSize: 13,
                color: AppColors.text,
                height: 1.7,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
