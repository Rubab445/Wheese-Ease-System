import 'dart:async';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';
import '../models/prediction_result.dart';
import '../screens/trip_risk_screen.dart';

class HomeScreen extends StatefulWidget {
  final String userName;
  final Map<String, dynamic> patientData;
  final VoidCallback onCheckinTap;

  const HomeScreen({
    super.key,
    required this.userName,
    required this.patientData,
    required this.onCheckinTap,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with TickerProviderStateMixin {
  double _riskVal = 0;
  late Timer _timer;
  late AnimationController _arcController;
  PredictionResult? _prediction;
  Map<String, dynamic>? _environment;
  bool _loading = true;

  // Symptom history graph state
  List<Map<String, dynamic>> _symptomHistory = [];
  String _graphPeriod = 'week'; // 'week' or 'month'
  bool _historyLoading = true;

  @override
  void initState() {
    super.initState();
    _arcController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );
    _loadInitialData();
    _timer = Timer.periodic(const Duration(seconds: 30), (_) {
      _loadInitialData();
    });
  }

  Future<void> _loadInitialData() async {
    if (!mounted) return;

    final env = await ApiService.getEnvironment();
    if (env != null && mounted) {
      setState(() => _environment = env);
    }

    final prediction = await ApiService.quickPredict(
      patientData: widget.patientData,
    );

    if (prediction != null && mounted) {
      setState(() {
        _prediction = PredictionResult.fromJson(prediction);
        _riskVal = _prediction!.riskPercentage;
        _loading = false;
      });
      _arcController.forward(from: 0.0);
    }

    // Fetch symptom history for graphs
    final history = await ApiService.getSymptomHistory(period: _graphPeriod);
    if (history != null && mounted) {
      setState(() {
        _symptomHistory = List<Map<String, dynamic>>.from(history);
        _historyLoading = false;
      });
    } else if (mounted) {
      setState(() => _historyLoading = false);
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    _arcController.dispose();
    super.dispose();
  }

  String get _riskLabel {
    if (_prediction == null) return 'Loading risk data...';
    return _prediction!.advice.isNotEmpty
        ? _prediction!.advice
        : 'Risk assessment pending';
  }

  Color _getRiskColor(BuildContext context) {
    if (_prediction == null) return AppColors.textMutedColor(context);
    return _prediction!.riskColor;
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    final risk = _riskVal.round();

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── HEADER WITH GRADIENT ──
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 18,
              left: 20,
              right: 20,
              bottom: 24,
            ),
            decoration: BoxDecoration(
              gradient: isDark
                  ? AppColors.primaryGradientDark
                  : AppColors.primaryGradient,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(28),
                bottomRight: Radius.circular(28),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Good morning,',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: Colors.white70,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Text(
                      widget.userName,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // ── RISK SCORE HERO CARD WITH ARC ──
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 20, 18, 16),
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: surface,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: border, width: 0.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // ── ARC PAINTER ──
                  SizedBox(
                    width: 110,
                    height: 110,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        CustomPaint(
                          size: const Size(110, 110),
                          painter: _ArcPainter(
                            value: _riskVal / 100,
                            riskColor: _getRiskColor(context),
                            isDark: isDark,
                            animation: _arcController,
                          ),
                        ),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              '$risk%',
                              style: GoogleFonts.playfairDisplay(
                                fontSize: 28,
                                fontWeight: FontWeight.w800,
                                color: text,
                              ),
                            ),
                            Text(
                              _prediction?.riskLevel ?? 'LOADING',
                              style: GoogleFonts.nunito(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: textMuted,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 18),
                  // ── RISK INFO ──
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Risk chip
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: _getRiskColor(context).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                              color: _getRiskColor(context),
                              width: 0.5,
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 6,
                                height: 6,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  color: _getRiskColor(context),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                _prediction?.riskLevel ?? 'LOADING',
                                style: GoogleFonts.nunito(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: _getRiskColor(context),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'AI Health Risk Score',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 13,
                            fontWeight: FontWeight.w800,
                            color: text,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          _riskLabel,
                          style: GoogleFonts.nunito(
                            fontSize: 12,
                            color: textMuted,
                            height: 1.4,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── ENVIRONMENTAL DATA (2x2 GRID) ──
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: _loading || _environment == null
                ? SizedBox(
                    height: 200,
                    child: Center(
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation(primary),
                      ),
                    ),
                  )
                : GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.0,
                    children: [
                      _envCard(
                        icon: Icons.thermostat_outlined,
                        iconColor: AppColors.yellow,
                        value:
                            '${_environment?['temperature']?.toStringAsFixed(0) ?? '34'}°C',
                        label: 'Temperature',
                        surface: surface,
                        border: border,
                        isDark: isDark,
                      ),
                      _envCard(
                        icon: Icons.water_drop_outlined,
                        iconColor: AppColors.blue,
                        value:
                            '${_environment?['humidity']?.toStringAsFixed(0) ?? '67'}%',
                        label: 'Humidity',
                        surface: surface,
                        border: border,
                        isDark: isDark,
                      ),
                      _envCard(
                        icon: Icons.air_rounded,
                        iconColor: _environment?['aqi'] != null
                            ? ((_environment!['aqi'] as num) > 150
                                  ? AppColors.red
                                  : AppColors.yellow)
                            : AppColors.yellow,
                        value: '${_environment?['aqi'] ?? '158'}',
                        label: ' AQI',
                        surface: surface,
                        border: border,
                        isDark: isDark,
                      ),
                      _envCard(
                        icon: Icons.local_florist_outlined,
                        iconColor: primary,
                        value: _environment?['pollen_level'] ?? 'High',
                        label: 'Pollen',
                        surface: surface,
                        border: border,
                        isDark: isDark,
                      ),
                    ],
                  ),
          ),

          // ── SYMPTOM HISTORY GRAPHS ──
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 20, 18, 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'SYMPTOM HISTORY',
                  style: GoogleFonts.nunito(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: textMuted,
                    letterSpacing: 1.2,
                  ),
                ),
                // Week / Month toggle
                Container(
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: border),
                  ),
                  child: Row(
                    children: ['week', 'month'].map((p) {
                      final selected = _graphPeriod == p;
                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            _graphPeriod = p;
                            _historyLoading = true;
                          });
                          _loadInitialData();
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 5,
                          ),
                          decoration: BoxDecoration(
                            color: selected ? primary : Colors.transparent,
                            borderRadius: BorderRadius.circular(7),
                          ),
                          child: Text(
                            p[0].toUpperCase() + p.substring(1),
                            style: GoogleFonts.nunito(
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                              color: selected ? Colors.white : textMuted,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          _historyLoading
              ? SizedBox(
                  height: 160,
                  child: Center(
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation(primary),
                    ),
                  ),
                )
              : _symptomHistory.isEmpty
              ? Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 20,
                  ),
                  child: Center(
                    child: Text(
                      'No symptom data yet.\nLog your first check-in!',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: textMuted,
                        height: 1.6,
                      ),
                    ),
                  ),
                )
              : SizedBox(
                  height: 200,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    children: [
                      _symptomGraph(
                        'Wheezing',
                        'wheezing',
                        AppColors.red,
                        surface,
                        border,
                        isDark,
                      ),
                      _symptomGraph(
                        'Coughing',
                        'coughing',
                        AppColors.yellow,
                        surface,
                        border,
                        isDark,
                      ),
                      _symptomGraph(
                        'Chest',
                        'chest_tightness',
                        AppColors.blue,
                        surface,
                        border,
                        isDark,
                      ),
                      _symptomGraph(
                        'Breathing',
                        'breathing_difficulty',
                        primary,
                        surface,
                        border,
                        isDark,
                      ),
                      _symptomGraph(
                        'Inhaler Use',
                        'inhaler_usage',
                        AppColors.green,
                        surface,
                        border,
                        isDark,
                      ),
                    ],
                  ),
                ),

          // ── QUICK ACTIONS ──
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 20, 18, 12),
            child: Text(
              'QUICK ACTIONS',
              style: GoogleFonts.nunito(
                fontSize: 9,
                fontWeight: FontWeight.w800,
                color: textMuted,
                letterSpacing: 1.2,
              ),
            ),
          ),

          // Primary action: Check-in
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: GestureDetector(
              onTap: widget.onCheckinTap,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                decoration: BoxDecoration(
                  gradient: isDark
                      ? AppColors.primaryGradientDark
                      : AppColors.primaryGradient,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: primary.withOpacity(0.25),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.assignment_outlined,
                        color: Colors.white,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Log Symptoms',
                            style: GoogleFonts.nunito(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            'Daily check-in — 30 seconds',
                            style: GoogleFonts.nunito(
                              fontSize: 11,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      Icons.arrow_forward_ios_rounded,
                      color: Colors.white.withOpacity(0.7),
                      size: 16,
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 12),

          // Secondary actions grid
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.2,
              children: [
                _secondaryBtn(
                  icon: Icons.location_on_outlined,
                  color: primary,
                  label: 'Trip Risk',
                  surface: surface,
                  border: border,
                  isDark: isDark,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const TripRiskScreen()),
                  ),
                ),
                _secondaryBtn(
                  icon: Icons.medication_outlined,
                  color: primary,
                  label: 'Record Dose',
                  surface: surface,
                  border: border,
                  isDark: isDark,
                  onTap: () => _showRecordDoseSheet(context),
                ),
              ],
            ),
          ),

          // ── ALERTS ──
          if (_prediction?.alerts.isNotEmpty ?? false)
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 20, 18, 12),
              child: Text(
                'ACTIVE ALERTS',
                style: GoogleFonts.nunito(
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                  color: textMuted,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          if (_prediction?.alerts.isNotEmpty ?? false)
            ..._prediction!.alerts.asMap().entries.map(
              (entry) => _buildAlertCard(
                entry.value,
                _getRiskColor(context),
                surface,
                border,
                isDark,
              ),
            ),

          // ── AI INSIGHT ──
          if (_prediction != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 20, 18, 24),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: surface,
                  borderRadius: BorderRadius.circular(18),
                  border: Border(
                    left: BorderSide(color: _getRiskColor(context), width: 3),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 28,
                          height: 28,
                          decoration: BoxDecoration(
                            color: primary.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            Icons.lightbulb_outline_rounded,
                            color: primary,
                            size: 14,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'AI INSIGHT',
                          style: GoogleFonts.nunito(
                            fontSize: 9,
                            fontWeight: FontWeight.w800,
                            color: textMuted,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _prediction!.advice,
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: text,
                        height: 1.6,
                        fontStyle: FontStyle.italic,
                      ),
                    ),
                    if (_prediction!.reasons.isNotEmpty) ...[
                      const SizedBox(height: 12),
                      Divider(color: border, height: 1),
                      const SizedBox(height: 12),
                      Text(
                        'Why:',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: text,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ..._prediction!.reasons.asMap().entries.map(
                        (entry) => Padding(
                          padding: const EdgeInsets.only(bottom: 6),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${entry.key + 1}.',
                                style: GoogleFonts.nunito(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                  color: textMuted,
                                ),
                              ),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  entry.value,
                                  style: GoogleFonts.nunito(
                                    fontSize: 11,
                                    color: text,
                                    height: 1.4,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _envCard({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
    required Color surface,
    required Color border,
    required bool isDark,
  }) {
    final text = isDark ? AppColors.textDark : AppColors.text;
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: border, width: 0.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.12),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: iconColor, size: 17),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: text,
                ),
              ),
              Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textMutedColor(context),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _secondaryBtn({
    required IconData icon,
    required Color color,
    required String label,
    required Color surface,
    required Color border,
    required bool isDark,
    required VoidCallback onTap,
  }) {
    final text = isDark ? AppColors.textDark : AppColors.text;
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: border, width: 0.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: color, size: 17),
            ),
            Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: text,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAlertCard(
    String text,
    Color riskColor,
    Color surface,
    Color border,
    bool isDark,
  ) {
    final textColor = isDark ? AppColors.textDark : AppColors.text;
    final mutedColor = isDark ? AppColors.textMutedDark : AppColors.textMuted;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 6),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border, width: 0.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                color: riskColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.warning_amber_rounded,
                color: riskColor,
                size: 17,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: textColor,
                      height: 1.3,
                    ),
                  ),
                  Text(
                    'Alert',
                    style: GoogleFonts.nunito(fontSize: 10, color: mutedColor),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ── Symptom Graph Widget ──
  Widget _symptomGraph(
    String label,
    String key,
    Color color,
    Color surface,
    Color border,
    bool isDark,
  ) {
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;

    // Build spots from history data
    final spots = <FlSpot>[];
    for (int i = 0; i < _symptomHistory.length; i++) {
      final val = (_symptomHistory[i][key] ?? 0);
      spots.add(FlSpot(i.toDouble(), (val as num).toDouble()));
    }

    // If all zeros, still show flat line
    final hasData = spots.any((s) => s.y > 0);

    return Container(
      width: 160,
      margin: const EdgeInsets.symmetric(horizontal: 5, vertical: 6),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: border, width: 0.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(isDark ? 0.15 : 0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 6),
              Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: text,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            hasData
                ? 'Detected ${spots.where((s) => s.y > 0).length}x'
                : 'No episodes',
            style: GoogleFonts.nunito(fontSize: 9, color: textMuted),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: spots.isEmpty
                ? Center(
                    child: Text(
                      'No data',
                      style: GoogleFonts.nunito(fontSize: 10, color: textMuted),
                    ),
                  )
                : LineChart(
                    LineChartData(
                      gridData: const FlGridData(show: false),
                      borderData: FlBorderData(show: false),
                      titlesData: const FlTitlesData(show: false),
                      lineTouchData: const LineTouchData(enabled: false),
                      minY: 0,
                      maxY: key == 'breathing_difficulty'
                          ? 3
                          : key == 'inhaler_usage'
                          ? 5
                          : 1,
                      lineBarsData: [
                        LineChartBarData(
                          spots: spots,
                          isCurved: true,
                          color: color,
                          barWidth: 2.5,
                          isStrokeCapRound: true,
                          dotData: FlDotData(
                            show: true,
                            getDotPainter: (spot, _, __, ___) =>
                                FlDotCirclePainter(
                                  radius: spot.y > 0 ? 3 : 1.5,
                                  color: spot.y > 0
                                      ? color
                                      : color.withOpacity(0.3),
                                  strokeWidth: 0,
                                  strokeColor: Colors.transparent,
                                ),
                          ),
                          belowBarData: BarAreaData(
                            show: true,
                            color: color.withOpacity(0.08),
                          ),
                        ),
                      ],
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  // ── Record Dose Bottom Sheet ──
  void _showRecordDoseSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final surface2 = isDark ? AppColors.surface2Dark : AppColors.surface2;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    final medications = [
      {
        'name': 'Salbutamol',
        'type': 'Rescue Inhaler',
        'icon': Icons.air_rounded,
        'color': AppColors.red,
      },
      {
        'name': 'Fluticasone',
        'type': 'Preventer Inhaler',
        'icon': Icons.medication_outlined,
        'color': primary,
      },
      {
        'name': 'Montelukast',
        'type': 'Tablet',
        'icon': Icons.medical_services_outlined,
        'color': AppColors.green,
      },
    ];

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (ctx) {
        return Container(
          padding: const EdgeInsets.fromLTRB(22, 12, 22, 28),
          decoration: BoxDecoration(
            color: surface,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Handle bar
              Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 18),
                decoration: BoxDecoration(
                  color: border,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              // Title
              Row(
                children: [
                  Icon(Icons.medication_outlined, color: primary, size: 22),
                  const SizedBox(width: 10),
                  Text(
                    'Record a Dose',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: text,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Select the medication you just took',
                  style: GoogleFonts.nunito(fontSize: 12, color: textMuted),
                ),
              ),
              const SizedBox(height: 18),
              // Medication list
              ...medications.map((med) {
                return GestureDetector(
                  onTap: () {
                    Navigator.pop(ctx);
                    final now = TimeOfDay.now();
                    final timeStr =
                        '${now.hourOfPeriod == 0 ? 12 : now.hourOfPeriod}:${now.minute.toString().padLeft(2, '0')} ${now.period == DayPeriod.am ? 'AM' : 'PM'}';
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        behavior: SnackBarBehavior.floating,
                        backgroundColor: primary,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        content: Row(
                          children: [
                            const Icon(
                              Icons.check_circle_outline,
                              color: Colors.white,
                              size: 18,
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                '${med['name']} recorded at $timeStr',
                                style: GoogleFonts.nunito(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 10),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: surface2,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: border),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 42,
                          height: 42,
                          decoration: BoxDecoration(
                            color: (med['color'] as Color).withOpacity(0.12),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(
                            med['icon'] as IconData,
                            color: med['color'] as Color,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                med['name'] as String,
                                style: GoogleFonts.nunito(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w800,
                                  color: text,
                                ),
                              ),
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
                        Icon(
                          Icons.add_circle_outline,
                          color: primary,
                          size: 22,
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        );
      },
    );
  }
}

// ══════════════════════════════════════════════════════
// ARC PAINTER FOR RISK SCORE
// ══════════════════════════════════════════════════════

class _ArcPainter extends CustomPainter {
  final double value;
  final Color riskColor;
  final bool isDark;
  final Animation<double> animation;

  _ArcPainter({
    required this.value,
    required this.riskColor,
    required this.isDark,
    required this.animation,
  }) : super(repaint: animation);

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2 - 8;

    // ── Track ring (background) ──
    final trackPaint = Paint()
      ..color = (isDark ? AppColors.surface2Dark : AppColors.surface2)
          .withOpacity(0.6)
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawCircle(center, radius, trackPaint);

    // ── Glow layer ──
    final glowPaint = Paint()
      ..color = riskColor.withOpacity(0.18)
      ..strokeWidth = 15
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final startAngle = -math.pi / 2;
    final sweepAngle =
        2 * math.pi * (animation.value * value); // Animate the sweep angle
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      glowPaint,
    );

    // ── Main arc with gradient ──
    final arcPaint = Paint()
      ..color = riskColor
      ..strokeWidth = 8
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      startAngle,
      sweepAngle,
      false,
      arcPaint,
    );
  }

  @override
  bool shouldRepaint(_ArcPainter oldDelegate) =>
      oldDelegate.value != value ||
      oldDelegate.riskColor != riskColor ||
      oldDelegate.isDark != isDark;
}
