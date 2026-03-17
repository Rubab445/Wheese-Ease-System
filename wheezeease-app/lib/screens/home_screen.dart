import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';
import '../models/prediction_result.dart';

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

class _HomeScreenState extends State<HomeScreen> {
  double _riskVal = 0;
  late Timer _timer;
  PredictionResult? _prediction;
  Map<String, dynamic>? _environment;
  bool _loading = true;

  final List<Map<String, dynamic>> _alerts = [
    {
      'icon': '🚨',
      'bg': AppColors.redDim,
      'text': 'AQI is Unhealthy (158). Avoid outdoor activity.',
      'time': 'Just now · Air Quality',
    },
    {
      'icon': '🌸',
      'bg': AppColors.yellowDim,
      'text': 'Pollen count very high. Take antihistamine now.',
      'time': '10 min ago · Pollen',
    },
    {
      'icon': '💊',
      'bg': AppColors.blueDim,
      'text': 'Reminder: Fluticasone due in 30 minutes.',
      'time': '1h ago · Medication',
    },
  ];

  @override
  void initState() {
    super.initState();
    _loadInitialData();
    // Refresh every 30 seconds
    _timer = Timer.periodic(const Duration(seconds: 30), (_) {
      _loadInitialData();
    });
  }

  Future<void> _loadInitialData() async {
    if (!mounted) return;

    // Fetch environment data
    final env = await ApiService.getEnvironment();
    if (env != null && mounted) {
      setState(() => _environment = env);
    }

    // Quick prediction with patient data from check-in
    final prediction = await ApiService.quickPredict(
      patientData: widget.patientData,
    );

    if (prediction != null && mounted) {
      setState(() {
        _prediction = PredictionResult.fromJson(prediction);
        _riskVal = _prediction!.riskPercentage;
        _loading = false;
      });
    }
  }

  @override
  void dispose() {
    _timer.cancel();
    super.dispose();
  }

  String get _riskLabel {
    if (_prediction == null) return 'Loading risk data...';
    return _prediction!.advice.isNotEmpty
        ? _prediction!.advice
        : 'Risk assessment pending';
  }

  Color get _riskColor {
    if (_prediction == null) return AppColors.textMuted;
    return _prediction!.riskColor;
  }

  @override
  Widget build(BuildContext context) {
    final risk = _riskVal.round();
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 18,
              left: 22,
              right: 22,
              bottom: 28,
            ),
            decoration: const BoxDecoration(
              gradient: AppColors.bluePurple,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(36),
                bottomRight: Radius.circular(36),
              ),
            ),
            child: Column(
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
                  '${widget.userName} 👋',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 24,
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 14),
                // Risk hero card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(22),
                    border: Border.all(
                      color: Colors.white.withValues(alpha: 0.25),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'YOUR RISK SCORE RIGHT NOW',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          color: Colors.white70,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.8,
                        ),
                      ),
                      Text(
                        '$risk%',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 50,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      Row(
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: _riskColor,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Flexible(
                            child: Text(
                              _riskLabel,
                              style: GoogleFonts.nunito(
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: risk / 100,
                          minHeight: 7,
                          backgroundColor: Colors.white.withValues(alpha: 0.15),
                          valueColor: AlwaysStoppedAnimation(
                            Colors.white.withValues(alpha: 0.9),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Env strip
          SizedBox(
            height: 80,
            child: _loading || _environment == null
                ? Center(
                    child: SizedBox(
                      width: 30,
                      height: 30,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation(
                          AppColors.blue.withValues(alpha: 0.5),
                        ),
                      ),
                    ),
                  )
                : ListView(
                    scrollDirection: Axis.horizontal,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 8,
                    ),
                    children: [
                      _envChip(
                        '🌡️',
                        '${_environment?['temperature']?.toStringAsFixed(0) ?? '34'}°C',
                        'Temp',
                        AppColors.yellow,
                      ),
                      _envChip(
                        '💧',
                        '${_environment?['humidity']?.toStringAsFixed(0) ?? '67'}%',
                        'Humidity',
                        AppColors.blue,
                      ),
                      _envChip(
                        '🌫️',
                        '${_environment?['aqi'] ?? '158'}',
                        'AQI',
                        AppColors.red,
                      ),
                      _envChip(
                        '🌸',
                        _environment?['pollen_level'] ?? 'High',
                        'Pollen',
                        AppColors.red,
                      ),
                      _envChip(
                        '💨',
                        _environment?['dust_level'] ?? 'Med',
                        'Dust',
                        AppColors.yellow,
                      ),
                      _envChip(
                        '☁️',
                        _environment?['weather'] ?? 'Hazy',
                        'Sky',
                        AppColors.textMuted,
                      ),
                    ],
                  ),
          ),

          // Check-in banner
          GestureDetector(
            onTap: widget.onCheckinTap,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 18),
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
              decoration: BoxDecoration(
                gradient: AppColors.greenGradient,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.green.withValues(alpha: 0.3),
                    blurRadius: 22,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Text('📋', style: TextStyle(fontSize: 30)),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Daily Check-In',
                          style: GoogleFonts.nunito(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          'Log your symptoms — takes 30 seconds',
                          style: GoogleFonts.nunito(
                            fontSize: 12,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '›',
                    style: GoogleFonts.nunito(
                      fontSize: 20,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Alerts
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Active Alerts',
                  style: GoogleFonts.nunito(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: AppColors.text,
                  ),
                ),
                Text(
                  'See all',
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    color: AppColors.blue,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
          if (_prediction?.alerts.isNotEmpty ?? false)
            ..._prediction!.alerts.asMap().entries.map(
              (entry) => _buildPredictionAlertCard(entry.value, entry.key),
            )
          else
            ..._alerts.map((a) => _buildAlertCard(a)),

          // Quick stats
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 0),
            child: GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
              childAspectRatio: 1.3,
              children: [
                _quickStat('💨', '4x', 'Inhaler used today', AppColors.red),
                _quickStat('📅', '7', 'Days tracked', AppColors.blue),
                _quickStat('🏆', 'Mon', 'Best day this week', AppColors.green),
                _quickStat(
                  '🩺',
                  'Mar 18',
                  'Next appointment',
                  AppColors.purple,
                ),
              ],
            ),
          ),

          // AI Recommendations
          if (_prediction != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 18, 18, 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'AI Health Insights',
                    style: GoogleFonts.nunito(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: AppColors.text,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(14),
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
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Recommendation
                        Container(
                          width: double.infinity,
                          decoration: BoxDecoration(
                            border: Border(
                              left: BorderSide(color: _riskColor, width: 4),
                            ),
                          ),
                          padding: const EdgeInsets.only(left: 10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Container(
                                    width: 34,
                                    height: 34,
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(10),
                                      color: _riskColor.withValues(alpha: 0.2),
                                    ),
                                    child: Center(
                                      child: Text(
                                        _prediction!.riskLevel == 'LOW'
                                            ? '✅'
                                            : _prediction!.riskLevel == 'MEDIUM'
                                                ? '⚠️'
                                                : '🚨',
                                        style: const TextStyle(fontSize: 18),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 10),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          'AI Recommendation',
                                          style: GoogleFonts.nunito(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w700,
                                            color: AppColors.textMuted,
                                            letterSpacing: 0.5,
                                          ),
                                        ),
                                        Text(
                                          'Risk: ${_prediction!.riskLevel} (${_prediction!.confidencePercentage})',
                                          style: GoogleFonts.nunito(
                                            fontSize: 13,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.text,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Text(
                                _prediction!.advice,
                                style: GoogleFonts.nunito(
                                  fontSize: 13,
                                  color: AppColors.text,
                                  height: 1.6,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        if (_prediction!.reasons.isNotEmpty) ...[
                          const SizedBox(height: 14),
                          Divider(
                            color: AppColors.border,
                            height: 1,
                          ),
                          const SizedBox(height: 10),
                          Text(
                            'Why This Risk Level:',
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: AppColors.text,
                            ),
                          ),
                          const SizedBox(height: 8),
                          ..._prediction!.reasons.asMap().entries.map(
                            (entry) => Padding(
                              padding: const EdgeInsets.only(bottom: 6),
                              child: Row(
                                crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '${entry.key + 1}.',
                                    style: GoogleFonts.nunito(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textMuted,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      entry.value,
                                      style: GoogleFonts.nunito(
                                        fontSize: 12,
                                        color: AppColors.text,
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
                ],
              ),
            ),

          // Doctor advice
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Latest Doctor Advice',
                  style: GoogleFonts.nunito(
                    fontSize: 15,
                    fontWeight: FontWeight.w800,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(14),
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
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          border: Border(
                            left: BorderSide(color: AppColors.blue, width: 4),
                          ),
                        ),
                        padding: const EdgeInsets.only(left: 10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 34,
                                  height: 34,
                                  decoration: BoxDecoration(
                                    borderRadius: BorderRadius.circular(10),
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFF1A4A7A),
                                        Color(0xFF3A8EFF),
                                      ],
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      'DR',
                                      style: GoogleFonts.nunito(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Dr. A. Rahman',
                                      style: GoogleFonts.nunito(
                                        fontSize: 13,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.text,
                                      ),
                                    ),
                                    Text(
                                      '2 hours ago',
                                      style: GoogleFonts.nunito(
                                        fontSize: 10,
                                        color: AppColors.textMuted,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            const SizedBox(height: 9),
                            Text(
                              'Carry your rescue inhaler at all times today. With AQI above 150, please wear an N95 mask if you must go outside.',
                              style: GoogleFonts.nunito(
                                fontSize: 13,
                                color: AppColors.text,
                                height: 1.7,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _envChip(String icon, String value, String label, Color valueColor) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
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
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(icon, style: const TextStyle(fontSize: 16)),
          Text(
            value,
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: valueColor,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 8,
              color: AppColors.textDim,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAlertCard(Map<String, dynamic> alert) {
    return Dismissible(
      key: UniqueKey(),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => setState(() => _alerts.remove(alert)),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: const Icon(Icons.delete, color: AppColors.red),
      ),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
        padding: const EdgeInsets.all(12),
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
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(11),
                color: alert['bg'] as Color,
              ),
              child: Center(
                child: Text(
                  alert['icon'] as String,
                  style: const TextStyle(fontSize: 17),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    alert['text'] as String,
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: AppColors.text,
                      height: 1.4,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    alert['time'] as String,
                    style: GoogleFonts.nunito(
                      fontSize: 10,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _quickStat(String icon, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(icon, style: const TextStyle(fontSize: 22)),
          const SizedBox(height: 6),
          Text(
            value,
            style: GoogleFonts.playfairDisplay(
              fontSize: 22,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 10,
              color: AppColors.textMuted,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildPredictionAlertCard(String alertText, int index) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
      padding: const EdgeInsets.all(12),
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
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(11),
              color: _prediction!.riskColor.withValues(alpha: 0.2),
            ),
            child: Center(
              child: Text(
                _prediction!.riskLevel == 'HIGH'
                    ? '⚠️'
                    : _prediction!.riskLevel == 'MEDIUM'
                    ? '⚡'
                    : '✓',
                style: const TextStyle(fontSize: 17),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  alertText,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: AppColors.text,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  'AI Prediction',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    color: AppColors.textMuted,
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
