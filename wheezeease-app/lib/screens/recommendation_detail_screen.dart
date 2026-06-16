import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/api_service.dart';
import '../services/activity_log_service.dart';
import '../utils/patient_profile.dart';

class RecommendationDetailScreen extends StatefulWidget {
  final String entryType;
  final Map<String, dynamic> entryData;
  final DateTime entryDate;
  final bool saveToHistory;

  const RecommendationDetailScreen({
    super.key,
    required this.entryType,
    required this.entryData,
    required this.entryDate,
    this.saveToHistory = false,
  });

  @override
  State<RecommendationDetailScreen> createState() => _RecommendationDetailScreenState();
}

class _RecommendationDetailScreenState extends State<RecommendationDetailScreen> {
  bool _loading = true;
  Map<String, dynamic>? _recommendation;
  Map<String, dynamic>? _destinationEnv;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchRecommendation();
  }

  Future<void> _fetchRecommendation() async {
    setState(() { _loading = true; _error = null; });

    try {
      Map<String, dynamic>? result;

      switch (widget.entryType) {
        case 'symptoms':
          final symptoms = (widget.entryData['symptoms'] as List?)?.join(', ') ?? 'No symptoms';
          final severity = widget.entryData['severity'] as String? ?? 'Moderate';
          String riskLevel = 'LOW';
          if (severity == 'Severe') {
            riskLevel = 'HIGH';
          } else if (severity == 'Moderate') riskLevel = 'MEDIUM';

          result = await ApiService.getRecommendation(
            riskLevel: riskLevel,
            symptoms: symptoms,
            age: PatientProfile.age,
            gender: PatientProfile.gender,
          );
          if (result != null && result['success'] == true) {
            _recommendation = result['data'] as Map<String, dynamic>?;
          } else if (result != null && result['data'] is Map<String, dynamic>) {
            _recommendation = result['data'] as Map<String, dynamic>;
          }
          break;

        case 'exercise':
          final exSymptoms = List<String>.from(widget.entryData['symptoms_reported'] ?? []);
          final exNotes = widget.entryData['symptom_notes'] as String?;
          result = await ApiService.logExercise(
            exerciseType: widget.entryData['exercise_type'] ?? 'walking',
            duration: (widget.entryData['duration'] as num?)?.toInt() ?? 30,
            intensity: widget.entryData['intensity'] ?? 'moderate',
            indoor: widget.entryData['indoor'] ?? false,
            usedInhaler: widget.entryData['used_inhaler'] ?? false,
            symptomsReported: exSymptoms,
            symptomNotes: exNotes,
          );
          if (result != null) {
            final aiRec = result['ai_recommendation'] as Map<String, dynamic>? ?? {};
            _recommendation = aiRec['data'] as Map<String, dynamic>? ?? _buildFromResult(result);
            if (widget.saveToHistory) {
              await ActivityLogService.saveExerciseLog(
                exerciseType: widget.entryData['exercise_type'] ?? 'walking',
                duration: (widget.entryData['duration'] as num?)?.toInt() ?? 30,
                intensity: widget.entryData['intensity'] ?? 'moderate',
                indoor: widget.entryData['indoor'] ?? false,
                usedInhaler: widget.entryData['used_inhaler'] ?? false,
                symptomsReported: exSymptoms,
                symptomNotes: exNotes,
                riskLevel: result['risk_level'] as String? ?? 'MEDIUM',
              );
            }
          }
          break;

        case 'household':
          final hhSymptoms = List<String>.from(widget.entryData['symptoms_reported'] ?? []);
          final hhNotes = widget.entryData['symptom_notes'] as String?;
          result = await ApiService.logHouseholdActivity(
            activityType: widget.entryData['activity_type'] ?? 'cleaning',
            duration: (widget.entryData['duration'] as num?)?.toInt() ?? 30,
            woreMask: widget.entryData['wore_mask'] ?? false,
            symptomsReported: hhSymptoms,
            symptomNotes: hhNotes,
          );
          if (result != null) {
            final aiRec = result['ai_recommendation'] as Map<String, dynamic>? ?? {};
            _recommendation = aiRec['data'] as Map<String, dynamic>? ?? _buildFromResult(result);
            if (widget.saveToHistory) {
              await ActivityLogService.saveHouseholdLog(
                activityType: widget.entryData['activity_type'] ?? 'cleaning',
                duration: (widget.entryData['duration'] as num?)?.toInt() ?? 30,
                woreMask: widget.entryData['wore_mask'] ?? false,
                symptomsReported: hhSymptoms,
                symptomNotes: hhNotes,
                riskLevel: result['risk_level'] as String? ?? 'MEDIUM',
              );
            }
          }
          break;

        case 'trip':
          result = await ApiService.checkTripRisk(
            destination: widget.entryData['destination'] ?? '',
            patientProfile: PatientProfile.clinicalProfile,
          );
          if (result != null) {
            // Capture destination environment data from the API response
            _destinationEnv = result['destination_environment'] as Map<String, dynamic>?;

            // Extract AI recommendation (Gemini-powered), same as exercise/household
            final aiRec = result['ai_recommendation'] as Map<String, dynamic>? ?? {};
            final aiData = aiRec['data'] as Map<String, dynamic>?;
            if (aiData != null &&
                aiData['condition_summary'] != null &&
                aiData['immediate_actions'] != null) {
              _recommendation = aiData;
            } else {
              // Fallback to building from ML result if AI recommendation is missing
              _recommendation = _buildTripRecommendation(result);
            }
            if (widget.saveToHistory) {
              final riskLevel = result['risk_level'] as String? ?? 'LOW';
              await ActivityLogService.saveTripLog(
                destination: widget.entryData['destination'] ?? '',
                riskLevel: riskLevel,
              );
            }
          }
          break;
      }

      if (_recommendation == null && _error == null) {
        _error = 'Could not get recommendations. Please try again.';
      }
    } catch (e) {
      _error = 'Something went wrong. Please try again.';
    }

    if (mounted) setState(() => _loading = false);
  }

  Map<String, dynamic> _buildFromResult(Map<String, dynamic> result) {
    return {
      'condition_summary': result['summary'] ?? 'Activity logged. Here are your recommendations.',
      'immediate_actions': (result['immediate_actions'] as List?)?.cast<String>() ?? ['Keep your rescue inhaler accessible', 'Monitor your breathing', 'Stay hydrated'],
      'preventive_steps': (result['preventive_steps'] as List?)?.cast<String>() ?? ['Track your symptoms regularly', 'Consult your doctor if symptoms worsen'],
      'doctor_alert': result['doctor_alert'] ?? false,
      'doctor_alert_reason': result['doctor_alert_reason'],
    };
  }

  Map<String, dynamic> _buildTripRecommendation(Map<String, dynamic> result) {
    final verdict = result['trip_verdict'] as String? ?? 'SAFE';
    final advice = result['trip_advice'] as String? ?? '';
    final reasons = (result['reasons'] as List?)?.cast<String>() ?? [];
    final alerts = (result['alerts'] as List?)?.cast<String>() ?? [];

    return {
      'condition_summary': advice.isNotEmpty ? advice : 'Trip to ${widget.entryData['destination']} assessed.',
      'immediate_actions': reasons.take(3).toList().isNotEmpty ? reasons.take(3).toList() : ['Check local air quality before outdoor activities', 'Carry your rescue inhaler', 'Stay hydrated during travel'],
      'preventive_steps': alerts.take(2).toList().isNotEmpty ? alerts.take(2).toList() : ['Monitor weather conditions at your destination', 'Keep emergency contacts accessible'],
      'doctor_alert': verdict == 'NOT RECOMMENDED',
      'doctor_alert_reason': verdict == 'NOT RECOMMENDED' ? 'This destination has conditions that may be dangerous for your asthma' : null,
    };
  }

  String get _typeLabel {
    switch (widget.entryType) {
      case 'symptoms': return 'Symptoms Check-in';
      case 'exercise': return 'Exercise';
      case 'household': return 'Household Activity';
      case 'trip': return 'Trip';
      default: return widget.entryType;
    }
  }

  IconData get _typeIcon {
    switch (widget.entryType) {
      case 'symptoms': return Icons.monitor_heart_outlined;
      case 'exercise': return Icons.directions_run_rounded;
      case 'household': return Icons.home_work_rounded;
      case 'trip': return Icons.location_on_outlined;
      default: return Icons.circle;
    }
  }

  Color get _typeColor {
    switch (widget.entryType) {
      case 'symptoms': return AppColors.red;
      case 'exercise': return AppColors.blue;
      case 'household': return AppColors.yellow;
      case 'trip': return AppColors.green;
      default: return AppColors.primary;
    }
  }

  String _detailSummary() {
    final d = widget.entryData;
    switch (widget.entryType) {
      case 'symptoms':
        final syms = (d['symptoms'] as List?)?.join(', ') ?? 'None';
        return 'Symptoms: $syms\nSeverity: ${d['severity'] ?? 'Unknown'}';
      case 'exercise':
        return '${_capitalize(d['exercise_type'] ?? '')} · ${d['duration']}min · ${_capitalize(d['intensity'] ?? '')}\n${d['indoor'] == true ? 'Indoor' : 'Outdoor'}';
      case 'household':
        return '${_capitalize(d['activity_type'] ?? '')} · ${d['duration']}min\n${d['wore_mask'] == true ? 'Wore mask' : 'No mask'}';
      case 'trip':
        return 'Destination: ${d['destination'] ?? ''}';
      default: return '';
    }
  }

  String _capitalize(String s) => s.isEmpty ? s : s[0].toUpperCase() + s.substring(1);

  String _formatDate(DateTime dt) {
    final months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return '${months[dt.month - 1]} ${dt.day}, ${dt.year} · ${dt.hour.toString().padLeft(2,'0')}:${dt.minute.toString().padLeft(2,'0')}';
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

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: surface, elevation: 0,
        leading: IconButton(icon: Icon(Icons.arrow_back_ios_new_rounded, color: text, size: 18), onPressed: () => Navigator.pop(context)),
        title: Text('Recommendations', style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w800, color: text)),
        bottom: PreferredSize(preferredSize: const Size.fromHeight(1), child: Container(height: 1, color: border)),
      ),
      body: _loading
          ? Center(child: Column(mainAxisSize: MainAxisSize.min, children: [
              SizedBox(width: 32, height: 32, child: CircularProgressIndicator(strokeWidth: 3, valueColor: AlwaysStoppedAnimation(primary))),
              const SizedBox(height: 16),
              Text('Loading Recommendations...', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w700, color: text)),
              const SizedBox(height: 6),
              Text('Analyzing your data with AI', style: GoogleFonts.nunito(fontSize: 12, color: textMuted)),
            ]))
          : _error != null
              ? Center(child: Padding(padding: const EdgeInsets.all(32), child: Column(mainAxisSize: MainAxisSize.min, children: [
                  Icon(Icons.cloud_off_outlined, size: 48, color: textMuted),
                  const SizedBox(height: 16),
                  Text(_error!, textAlign: TextAlign.center, style: GoogleFonts.nunito(fontSize: 14, color: textMuted)),
                  const SizedBox(height: 20),
                  GestureDetector(
                    onTap: _fetchRecommendation,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 12),
                      decoration: BoxDecoration(gradient: isDark ? AppColors.primaryGradientDark : AppColors.primaryGradient, borderRadius: BorderRadius.circular(14)),
                      child: Text('Retry', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
                    ),
                  ),
                ])))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    // Entry summary card
                    Container(
                      width: double.infinity, padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(color: _typeColor.withOpacity(0.08), borderRadius: BorderRadius.circular(16), border: Border.all(color: _typeColor.withOpacity(0.2))),
                      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Container(
                          width: 42, height: 42,
                          decoration: BoxDecoration(color: _typeColor.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                          child: Icon(_typeIcon, color: _typeColor, size: 20),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(_typeLabel, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w800, color: _typeColor)),
                          const SizedBox(height: 2),
                          Text(_formatDate(widget.entryDate), style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                          const SizedBox(height: 6),
                          Text(_detailSummary(), style: GoogleFonts.nunito(fontSize: 12, color: text, height: 1.5)),
                        ])),
                      ]),
                    ),
                    const SizedBox(height: 20),

                    // Destination Environment Data (trip only)
                    if (widget.entryType == 'trip' && _destinationEnv != null) ...[
                      Row(children: [
                        Container(
                          width: 28, height: 28,
                          decoration: BoxDecoration(
                            color: AppColors.blue.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.cloud_outlined, color: AppColors.blue, size: 14),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'DESTINATION ENVIRONMENT',
                          style: GoogleFonts.nunito(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: textMuted,
                            letterSpacing: 0.7,
                          ),
                        ),
                      ]),
                      const SizedBox(height: 12),
                      GridView.count(
                        crossAxisCount: 2,
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.15,
                        children: [
                          _buildEnvCard(
                            icon: Icons.thermostat_outlined,
                            iconColor: const Color(0xFFFF6B35),
                            value: '${(_destinationEnv!['temperature'] as num?)?.toStringAsFixed(0) ?? '--'}°C',
                            label: 'Temperature',
                            surface: surface,
                            border: border,
                            isDark: isDark,
                          ),
                          _buildEnvCard(
                            icon: Icons.water_drop_outlined,
                            iconColor: const Color(0xFF4A90D9),
                            value: '${(_destinationEnv!['humidity'] as num?)?.toStringAsFixed(0) ?? '--'}%',
                            label: 'Humidity',
                            surface: surface,
                            border: border,
                            isDark: isDark,
                          ),
                          _buildEnvCard(
                            icon: Icons.air_rounded,
                            iconColor: _getAqiColor(_destinationEnv!['AQI']),
                            value: '${_destinationEnv!['AQI'] ?? '--'}',
                            label: 'AQI',
                            surface: surface,
                            border: border,
                            isDark: isDark,
                          ),
                          _buildEnvCard(
                            icon: Icons.local_florist_outlined,
                            iconColor: AppColors.green,
                            value: '${_destinationEnv!['pollen'] ?? '--'}',
                            label: 'Pollen',
                            surface: surface,
                            border: border,
                            isDark: isDark,
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                    ],

                    // Condition summary
                    if (_recommendation!['condition_summary'] != null) ...[
                      Container(
                        width: double.infinity, padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: surface, borderRadius: BorderRadius.circular(16), border: Border(left: BorderSide(color: primary, width: 3))),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Row(children: [
                            Icon(Icons.auto_awesome, color: primary, size: 16),
                            const SizedBox(width: 8),
                            Text('CONDITION SUMMARY', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
                          ]),
                          const SizedBox(height: 10),
                          Text(_recommendation!['condition_summary'] as String, style: GoogleFonts.nunito(fontSize: 13, color: text, height: 1.6, fontStyle: FontStyle.italic)),
                        ]),
                      ),
                      const SizedBox(height: 14),
                    ],

                    // Immediate actions
                    if (_recommendation!['immediate_actions'] != null)
                      _buildSection('IMMEDIATE ACTIONS', Icons.flash_on_rounded, (_recommendation!['immediate_actions'] as List).cast<String>(), AppColors.red, surface, border, text, textMuted),

                    // Preventive steps
                    if (_recommendation!['preventive_steps'] != null)
                      _buildSection('PREVENTIVE STEPS', Icons.shield_outlined, (_recommendation!['preventive_steps'] as List).cast<String>(), AppColors.green, surface, border, text, textMuted),

                    // Doctor alert
                    if (_recommendation!['doctor_alert'] == true)
                      Container(
                        width: double.infinity, padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: AppColors.redDim, borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.red.withOpacity(0.3))),
                        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          const Icon(Icons.local_hospital_rounded, color: AppColors.red, size: 22),
                          const SizedBox(width: 10),
                          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text('DOCTOR VISIT RECOMMENDED', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.red, letterSpacing: 0.5)),
                            const SizedBox(height: 4),
                            Text(_recommendation!['doctor_alert_reason'] as String? ?? 'Please consult your doctor.', style: GoogleFonts.nunito(fontSize: 12, color: text, height: 1.5)),
                          ])),
                        ]),
                      ),

                    const SizedBox(height: 40),
                  ]),
                ),
    );
  }

  Widget _buildSection(String title, IconData icon, List<String> items, Color accent, Color surface, Color border, Color text, Color textMuted) {
    if (items.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Container(
        width: double.infinity, padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: surface, borderRadius: BorderRadius.circular(16), border: Border(left: BorderSide(color: accent, width: 3))),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Icon(icon, color: accent, size: 16),
            const SizedBox(width: 8),
            Text(title, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: accent, letterSpacing: 0.7)),
          ]),
          const SizedBox(height: 10),
          ...items.asMap().entries.map((entry) => Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Container(
                width: 22, height: 22,
                decoration: BoxDecoration(color: accent.withOpacity(0.12), borderRadius: BorderRadius.circular(7)),
                child: Center(child: Text('${entry.key + 1}', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: accent))),
              ),
              const SizedBox(width: 10),
              Expanded(child: Text(entry.value, style: GoogleFonts.nunito(fontSize: 12, color: text, height: 1.5))),
            ]),
          )),
        ]),
      ),
    );
  }

  // ── AQI Color Helper ──
  Color _getAqiColor(dynamic aqi) {
    if (aqi == null) return AppColors.yellow;
    final val = (aqi as num).toDouble();
    if (val > 150) return AppColors.red;
    if (val > 100) return AppColors.yellow;
    return AppColors.green;
  }

  // ── Environment Card (matches home screen style) ──
  Widget _buildEnvCard({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
    required Color surface,
    required Color border,
    required bool isDark,
  }) {
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;

    // Compute progress & status from value and label
    double progress = 0;
    String status = '';
    final numVal = double.tryParse(value.replaceAll(RegExp(r'[°C%]'), ''));

    switch (label) {
      case 'Temperature':
        if (numVal != null) {
          progress = (numVal / 50).clamp(0.0, 1.0);
          status = numVal > 40 ? 'Hot' : numVal > 35 ? 'Warm' : numVal > 20 ? 'Mild' : 'Cool';
        }
        break;
      case 'Humidity':
        if (numVal != null) {
          progress = (numVal / 100).clamp(0.0, 1.0);
          status = numVal > 70 ? 'High' : numVal > 40 ? 'OK' : 'Low';
        }
        break;
      case 'AQI':
        if (numVal != null) {
          progress = (numVal / 300).clamp(0.0, 1.0);
          status = numVal > 200
              ? 'Hazardous'
              : numVal > 150
                  ? 'Unhealthy'
                  : numVal > 100
                      ? 'Moderate'
                      : numVal > 50
                          ? 'Fair'
                          : 'Good';
        }
        break;
      case 'Pollen':
        if (numVal != null) {
          progress = (numVal / 200).clamp(0.0, 1.0);
          status = numVal > 100 ? 'High' : numVal > 50 ? 'Moderate' : 'Low';
        } else {
          status = value;
          progress = value == 'High' ? 0.8 : value == 'Moderate' ? 0.5 : 0.2;
        }
        break;
    }

    final statusColor = (status == 'Good' || status == 'OK' || status == 'Low' ||
            status == 'Mild' || status == 'Cool' || status == 'Fair')
        ? AppColors.green
        : (status == 'Moderate' || status == 'Warm')
            ? AppColors.yellow
            : AppColors.red;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: iconColor.withOpacity(0.2), width: 1.5),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            surface,
            iconColor.withOpacity(isDark ? 0.1 : 0.06),
          ],
        ),
        boxShadow: [
          BoxShadow(
            color: iconColor.withOpacity(isDark ? 0.1 : 0.08),
            blurRadius: 16,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      iconColor.withOpacity(0.22),
                      iconColor.withOpacity(0.08),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(11),
                ),
                child: Icon(icon, color: iconColor, size: 18),
              ),
              if (status.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(color: statusColor.withOpacity(0.3), width: 0.5),
                  ),
                  child: Text(
                    status,
                    style: GoogleFonts.nunito(
                      fontSize: 8,
                      fontWeight: FontWeight.w800,
                      color: statusColor,
                    ),
                  ),
                ),
            ],
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: text,
                ),
              ),
              const SizedBox(height: 1),
              Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  color: textMuted,
                ),
              ),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(3),
                child: SizedBox(
                  height: 4,
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: iconColor.withOpacity(0.1),
                    valueColor: AlwaysStoppedAnimation(iconColor),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}