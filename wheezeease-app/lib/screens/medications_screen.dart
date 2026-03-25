import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class MedicationsScreen extends StatefulWidget {
  const MedicationsScreen({super.key});

  @override
  State<MedicationsScreen> createState() => _MedicationsScreenState();
}

class _MedicationsScreenState extends State<MedicationsScreen> {
  final List<Map<String, dynamic>> _meds = [
    {
      'name': 'Salbutamol (Ventolin)',
      'type': 'Rescue Inhaler · β₂ agonist',
      'icon': Icons.air_rounded,
      'badge': '100mcg/puff',
      'time': 'As needed',
      'note': 'Alert if used more than 3x/day',
      'taken': false,
      'toggle': true,
    },
    {
      'name': 'Fluticasone (Flixotide)',
      'type': 'Preventer Inhaler · Corticosteroid',
      'icon': Icons.cyclone_outlined,
      'badge': '250mcg/dose',
      'time': '2:00 PM Daily',
      'note': 'Daily reminder at 2:00 PM',
      'taken': false,
      'toggle': true,
    },
    {
      'name': 'Cetirizine (Zyrtec)',
      'type': 'Antihistamine · Allergy tablet',
      'icon': Icons.medication_outlined,
      'badge': '10mg',
      'time': 'Every morning',
      'note': 'Daily reminder at 8:00 AM',
      'taken': true,
      'takenTime': '8:00 AM',
      'toggle': true,
    },
  ];

  void _takeMed(int index) {
    if (_meds[index]['taken'] == true) return;
    setState(() {
      _meds[index]['taken'] = true;
      _meds[index]['takenTime'] = TimeOfDay.now().format(context);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Medication logged! Dr. Rahman notified.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

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
            decoration: BoxDecoration(
              gradient: isDark
                  ? AppColors.primaryGradientDark
                  : AppColors.primaryGradient,
              borderRadius: const BorderRadius.only(
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
                      'Medications',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'Your schedule & reminders',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
                const Icon(Icons.medication_outlined, color: Colors.white, size: 34),
              ],
            ),
          ),

          // Next dose
          Container(
            margin: const EdgeInsets.fromLTRB(18, 16, 18, 0),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: isDark
                  ? AppColors.primaryGradientDark
                  : AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: primary.withValues(alpha: 0.3),
                  blurRadius: 26,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.access_time_outlined, color: Colors.white70, size: 12),
                          const SizedBox(width: 4),
                          Text(
                            'NEXT DOSE DUE',
                            style: GoogleFonts.nunito(
                              fontSize: 11,
                              color: Colors.white70,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 0.7,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 5),
                      Text(
                        'Fluticasone',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Today at 2:00 PM · in 4h 19m',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: Colors.white.withValues(alpha: 0.9),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  Icons.medication_outlined,
                  size: 38,
                  color: Colors.white.withValues(alpha: 0.4),
                ),
              ],
            ),
          ),

          // Med cards
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 0),
            child: Text(
              'All Medications',
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w800,
                color: text,
              ),
            ),
          ),
          ...List.generate(_meds.length, (i) => _buildMedCard(i, surface, text, textMuted, border, primary, isDark)),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildMedCard(int index, Color surface, Color text, Color textMuted, Color border, Color primary, bool isDark) {
    final med = _meds[index];
    final taken = med['taken'] as bool;
    return Container(
      margin: const EdgeInsets.fromLTRB(18, 10, 18, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05),
            blurRadius: 24,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      med['name'] as String,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: text,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      med['type'] as String,
                      style: GoogleFonts.nunito(
                        fontSize: 11,
                        color: textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              Icon(med['icon'] as IconData, size: 24, color: primary),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: primary.withOpacity(0.12),
                  border: Border.all(color: primary.withValues(alpha: 0.2)),
                ),
                child: Text(
                  med['badge'] as String,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: primary,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  color: AppColors.blueDim,
                  border: Border.all(color: AppColors.blue.withValues(alpha: 0.2)),
                ),
                child: Text(
                  med['time'] as String,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.blue,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () => _takeMed(index),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 11),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(13),
                color: taken ? AppColors.green : AppColors.greenDim,
                border: Border.all(color: AppColors.green, width: 2),
              ),
              child: Center(
                child: Text(
                  taken
                      ? 'Taken at ${med['takenTime'] ?? ''}'
                      : 'Mark as ${index == 0 ? 'Used' : 'Taken'}',
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: taken ? Colors.white : AppColors.green,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 11),
          Container(
            padding: const EdgeInsets.only(top: 11),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: border)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Text(
                    med['note'] as String,
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: textMuted,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: () =>
                      setState(() => med['toggle'] = !(med['toggle'] as bool)),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    width: 48,
                    height: 28,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(14),
                      color: (med['toggle'] as bool) ? primary : border,
                    ),
                    child: AnimatedAlign(
                      duration: const Duration(milliseconds: 250),
                      alignment: (med['toggle'] as bool)
                          ? Alignment.centerRight
                          : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.all(3),
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.15),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                    ),
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
