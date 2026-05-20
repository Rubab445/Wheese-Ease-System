import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import 'recommendation_detail_screen.dart';

class TripRiskScreen extends StatefulWidget {
  const TripRiskScreen({super.key});

  @override
  State<TripRiskScreen> createState() => _TripRiskScreenState();
}

class _TripRiskScreenState extends State<TripRiskScreen> {
  final _controller = TextEditingController();
  bool _loading = false;

  // Supported Pakistan cities
  final List<String> _suggestedCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Faisalabad',
    'Multan', 'Rawalpindi', 'Peshawar', 'Gujranwala',
    'Sialkot', 'Quetta', 'Hyderabad', 'Sargodha',
    'Bahawalpur', 'Abbottabad',
  ];

  void _logTrip(String city) {
    if (city.trim().isEmpty) return;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (_) => RecommendationDetailScreen(
          entryType: 'trip',
          entryData: {'destination': city.trim()},
          entryDate: DateTime.now(),
          saveToHistory: true,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final textDim = isDark ? AppColors.textDimDark : AppColors.textDim;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new_rounded,
              color: text, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Trip Logging',
          style: GoogleFonts.playfairDisplay(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: text,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: border),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [

            // ── Header card ──
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: isDark
                    ? AppColors.primaryGradientDark
                    : AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.map_outlined, color: Colors.white, size: 32),
                  const SizedBox(height: 10),
                  Text(
                    'Planning a trip?',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Log your destination so we can track your environment exposure and give you personalized insights later.',
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      color: Colors.white.withValues(alpha: 0.85),
                      height: 1.6,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // ── Search input ──
            Text(
              'WHERE ARE YOU GOING?',
              style: GoogleFonts.nunito(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: textMuted,
                letterSpacing: 0.7,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: border, width: 2),
                    ),
                    child: TextField(
                      controller: _controller,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: text,
                      ),
                      decoration: InputDecoration(
                        hintText: 'e.g. Lahore, Karachi...',
                        hintStyle: GoogleFonts.nunito(
                          fontSize: 15,
                          color: textDim,
                        ),
                        prefixIcon: Icon(
                          Icons.location_on_outlined,
                          color: primary,
                          size: 20,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 14,
                        ),
                      ),
                      onSubmitted: _logTrip,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                GestureDetector(
                  onTap: _loading
                      ? null
                      : () => _logTrip(_controller.text),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      gradient: _loading
                          ? LinearGradient(
                              colors: [textDim, textDim])
                          : (isDark
                              ? AppColors.primaryGradientDark
                              : AppColors.primaryGradient),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Center(
                      child: _loading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : const Icon(
                              Icons.check_rounded,
                              color: Colors.white,
                              size: 22,
                            ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // ── Quick city chips ──
            Text(
              'QUICK SELECT',
              style: GoogleFonts.nunito(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: textMuted,
                letterSpacing: 0.7,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _suggestedCities.map((city) {
                return GestureDetector(
                  onTap: () {
                    _controller.text = city;
                    _logTrip(city);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: surface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: border, width: 1.5),
                    ),
                    child: Text(
                      city,
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: textMuted,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}