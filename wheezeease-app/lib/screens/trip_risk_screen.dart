import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';
import '../utils/patient_profile.dart';

class TripRiskScreen extends StatefulWidget {
  const TripRiskScreen({super.key});

  @override
  State<TripRiskScreen> createState() => _TripRiskScreenState();
}

class _TripRiskScreenState extends State<TripRiskScreen> {
  final _controller = TextEditingController();
  Map<String, dynamic>? _result;
  bool _loading = false;
  String? _error;

  // Supported Pakistan cities
  final List<String> _suggestedCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Faisalabad',
    'Multan', 'Rawalpindi', 'Peshawar', 'Gujranwala',
    'Sialkot', 'Quetta', 'Hyderabad', 'Sargodha',
    'Bahawalpur', 'Abbottabad',
  ];

  Future<void> _checkTrip(String city) async {
    if (city.trim().isEmpty) return;

    setState(() {
      _loading = true;
      _error   = null;
      _result  = null;
    });

    try {
      final result = await ApiService.checkTripRisk(
        destination:    city.trim(),
        patientProfile: PatientProfile.clinicalProfile,
      );

      if (result != null) {
        setState(() {
          _result  = result;
          _loading = false;
        });
      } else {
        setState(() {
          _error   = 'Could not fetch data for $city. Check your connection.';
          _loading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error   = 'Something went wrong. Please try again.';
        _loading = false;
      });
    }
  }

  // ── Colors based on verdict ──
  Color _verdictColor(String? verdict) {
    if (verdict == null) return AppColors.blue;
    if (verdict == 'NOT RECOMMENDED')    return AppColors.red;
    if (verdict == 'PROCEED WITH CAUTION') return AppColors.yellow;
    return AppColors.green;
  }

  Color _verdictDim(String? verdict) {
    if (verdict == null) return AppColors.blueDim;
    if (verdict == 'NOT RECOMMENDED')    return AppColors.redDim;
    if (verdict == 'PROCEED WITH CAUTION') return AppColors.yellowDim;
    return AppColors.greenDim;
  }

  LinearGradient _verdictGradient(String? verdict) {
    if (verdict == null) return AppColors.bluePurple;
    if (verdict == 'NOT RECOMMENDED')    return AppColors.redOrangeGradient;
    if (verdict == 'PROCEED WITH CAUTION') return AppColors.orangeGradient;
    return AppColors.greenGradient;
  }

  String _verdictIcon(String? verdict) {
    if (verdict == null) return '🗺️';
    if (verdict == 'NOT RECOMMENDED')    return '🚨';
    if (verdict == 'PROCEED WITH CAUTION') return '⚠️';
    return '✅';
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded,
              color: AppColors.text, size: 18),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Trip Safety Check',
          style: GoogleFonts.playfairDisplay(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: AppColors.text,
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(height: 1, color: AppColors.border),
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
                gradient: AppColors.bluePurple,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('🗺️', style: TextStyle(fontSize: 32)),
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
                    'Enter your destination and we will check if the air quality is safe for you before you travel.',
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
                color: AppColors.textMuted,
                letterSpacing: 0.7,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppColors.border, width: 2),
                    ),
                    child: TextField(
                      controller: _controller,
                      style: GoogleFonts.nunito(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: AppColors.text,
                      ),
                      decoration: InputDecoration(
                        hintText: 'e.g. Lahore, Karachi...',
                        hintStyle: GoogleFonts.nunito(
                          fontSize: 15,
                          color: AppColors.textDim,
                        ),
                        prefixIcon: const Icon(
                          Icons.location_on_outlined,
                          color: AppColors.blue,
                          size: 20,
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 14,
                        ),
                      ),
                      onSubmitted: _checkTrip,
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                GestureDetector(
                  onTap: _loading
                      ? null
                      : () => _checkTrip(_controller.text),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      gradient: _loading
                          ? const LinearGradient(
                              colors: [AppColors.textDim, AppColors.textDim])
                          : AppColors.bluePurple,
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
                              Icons.search_rounded,
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
                color: AppColors.textMuted,
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
                    _checkTrip(city);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.border, width: 1.5),
                    ),
                    child: Text(
                      city,
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // ── Error state ──
            if (_error != null)
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.redDim,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                      color: AppColors.red.withValues(alpha: 0.3)),
                ),
                child: Row(
                  children: [
                    const Text('❌', style: TextStyle(fontSize: 18)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        _error!,
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: AppColors.red,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            // ── Result card ──
            if (_result != null) ...[
              // Verdict banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient:
                      _verdictGradient(_result!['trip_verdict'] as String?),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          _verdictIcon(_result!['trip_verdict'] as String?),
                          style: const TextStyle(fontSize: 28),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _result!['destination']
                                    .toString()
                                    .toUpperCase(),
                                style: GoogleFonts.nunito(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white.withValues(alpha: 0.75),
                                  letterSpacing: 0.8,
                                ),
                              ),
                              Text(
                                _result!['trip_verdict'] ?? '',
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(
                      _result!['trip_advice'] ?? '',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: Colors.white.withValues(alpha: 0.9),
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Environment data at destination
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: AppColors.border),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'LIVE CONDITIONS IN ${(_result!['destination'] ?? '').toString().toUpperCase()}',
                      style: GoogleFonts.nunito(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textMuted,
                        letterSpacing: 0.7,
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildEnvGrid(_result!['destination_environment']
                        as Map<String, dynamic>),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Reasons
              if ((_result!['reasons'] as List).isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'WHY THIS VERDICT?',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textMuted,
                          letterSpacing: 0.7,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...(_result!['reasons'] as List).map(
                        (r) => Padding(
                          padding: const EdgeInsets.only(bottom: 10),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                margin: const EdgeInsets.only(top: 6, right: 10),
                                decoration: BoxDecoration(
                                  color: _verdictColor(
                                      _result!['trip_verdict'] as String?),
                                  shape: BoxShape.circle,
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  r.toString(),
                                  style: GoogleFonts.nunito(
                                    fontSize: 13,
                                    color: AppColors.text,
                                    height: 1.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Alerts
              if ((_result!['alerts'] as List).isNotEmpty) ...[
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppColors.yellowDim,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                        color: AppColors.yellow.withValues(alpha: 0.3)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'ALERTS FOR THIS DESTINATION',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.yellow,
                          letterSpacing: 0.7,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ...(_result!['alerts'] as List).map(
                        (a) => Padding(
                          padding: const EdgeInsets.only(bottom: 8),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('⚠️',
                                  style: TextStyle(fontSize: 14)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  a.toString(),
                                  style: GoogleFonts.nunito(
                                    fontSize: 13,
                                    color: AppColors.text,
                                    height: 1.5,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
              ],

              // Travel tips
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: AppColors.blueDim,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                      color: AppColors.blue.withValues(alpha: 0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'TRAVEL TIPS',
                      style: GoogleFonts.nunito(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.blue,
                        letterSpacing: 0.7,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ..._getTravelTips(
                            _result!['trip_verdict'] as String?,
                            _result!['destination_environment']
                                as Map<String, dynamic>)
                        .map(
                      (tip) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('💡',
                                style: TextStyle(fontSize: 14)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                tip,
                                style: GoogleFonts.nunito(
                                  fontSize: 13,
                                  color: AppColors.text,
                                  height: 1.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  // ── Environment grid ──
  Widget _buildEnvGrid(Map<String, dynamic> env) {
    final items = [
      {'icon': '🌡️', 'label': 'Temp',    'value': '${env['temperature']}°C'},
      {'icon': '💧', 'label': 'Humidity', 'value': '${env['humidity']}%'},
      {'icon': '🌫️', 'label': 'AQI',      'value': '${env['AQI']}'},
      {'icon': '🏭', 'label': 'PM2.5',    'value': '${env['PM2_5']} μg'},
      {'icon': '🚗', 'label': 'NO2',      'value': '${env['NO2']} μg'},
      {'icon': '🌸', 'label': 'Pollen',   'value': '${env['pollen_count'] ?? '--'}'},
    ];

    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      childAspectRatio: 1.3,
      children: items.map((item) {
        return Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: AppColors.surface3,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(item['icon']!,
                  style: const TextStyle(fontSize: 18)),
              const SizedBox(height: 4),
              Text(
                item['value']!,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: AppColors.text,
                ),
              ),
              Text(
                item['label']!,
                style: GoogleFonts.nunito(
                  fontSize: 9,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textDim,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  // ── Travel tips based on verdict ──
  List<String> _getTravelTips(
      String? verdict, Map<String, dynamic> env) {
    final aqi = (env['AQI'] as num?)?.toInt() ?? 50;

    if (verdict == 'NOT RECOMMENDED') {
      return [
        'Pack your rescue inhaler (blue one) in your front pocket — easy access',
        'Wear an N95 mask outdoors — a regular surgical mask is not enough',
        'Plan indoor activities only and avoid busy roads and markets',
        'Share your location with Dr. Rahman before you travel',
      ];
    } else if (verdict == 'PROCEED WITH CAUTION') {
      return [
        'Carry both your preventer and rescue inhaler',
        'Take your preventer inhaler before leaving home',
        'Limit time outdoors especially between 12pm and 4pm',
        'Stay hydrated — dehydration worsens airway irritation',
      ];
    } else {
      return [
        'Continue your normal medication routine while travelling',
        'Still carry your inhaler — conditions can change quickly',
        if (aqi > 50)
          'Air quality is acceptable but keep an eye on it during your trip',
        'Enjoy your trip — conditions look good for you today',
      ];
    }
  }
}