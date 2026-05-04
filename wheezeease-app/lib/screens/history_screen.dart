import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import 'recommendation_detail_screen.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  int _filterIndex = 0; // 0=All, 1=Symptoms, 2=Exercise, 3=Household, 4=Trip
  final List<String> _filters = [
    'All',
    'Symptoms',
    'Exercise',
    'Household',
    'Trip',
  ];

  // Sample data simulating logged entries
  final List<Map<String, dynamic>> _entries = [
    {
      'type': 'symptoms',
      'date': DateTime.now().subtract(const Duration(hours: 1)),
      'data': {
        'symptoms': ['Coughing', 'Wheezing'],
        'severity': 'Moderate',
        'mood': 3,
        'notes': 'Worse after going outside this morning',
        'intensity': 'mod',
      },
    },
    {
      'type': 'exercise',
      'date': DateTime.now().subtract(const Duration(hours: 4)),
      'data': {
        'exercise_type': 'walking',
        'duration': 30,
        'intensity': 'moderate',
        'indoor': false,
        'used_inhaler': true,
      },
    },
    {
      'type': 'household',
      'date': DateTime.now().subtract(const Duration(hours: 8)),
      'data': {
        'activity_type': 'cleaning',
        'duration': 45,
        'wore_mask': true,
        'trigger': 'Dust',
      },
    },
    {
      'type': 'trip',
      'date': DateTime.now().subtract(const Duration(days: 1)),
      'data': {'destination': 'Lahore'},
    },
    {
      'type': 'symptoms',
      'date': DateTime.now().subtract(const Duration(days: 1, hours: 6)),
      'data': {
        'symptoms': ['Shortness of Breath'],
        'severity': 'Severe',
        'mood': 4,
        'notes': 'Air quality was very poor today',
        'intensity': 'sev',
      },
    },
    {
      'type': 'exercise',
      'date': DateTime.now().subtract(const Duration(days: 2)),
      'data': {
        'exercise_type': 'running',
        'duration': 20,
        'intensity': 'intense',
        'indoor': false,
        'used_inhaler': false,
      },
    },
    {
      'type': 'household',
      'date': DateTime.now().subtract(const Duration(days: 2, hours: 5)),
      'data': {
        'activity_type': 'cooking',
        'duration': 60,
        'wore_mask': false,
        'trigger': 'Smoke',
      },
    },
    {
      'type': 'trip',
      'date': DateTime.now().subtract(const Duration(days: 3)),
      'data': {'destination': 'Islamabad'},
    },
    {
      'type': 'symptoms',
      'date': DateTime.now().subtract(const Duration(days: 3, hours: 2)),
      'data': {
        'symptoms': ['Fatigue'],
        'severity': 'Mild',
        'mood': 1,
        'notes': '',
        'intensity': 'mild',
      },
    },
    {
      'type': 'exercise',
      'date': DateTime.now().subtract(const Duration(days: 4)),
      'data': {
        'exercise_type': 'cycling',
        'duration': 45,
        'intensity': 'moderate',
        'indoor': true,
        'used_inhaler': false,
      },
    },
  ];

  List<Map<String, dynamic>> get _filteredEntries {
    if (_filterIndex == 0) return _entries;
    final typeKey = _filters[_filterIndex].toLowerCase();
    return _entries.where((e) => e['type'] == typeKey).toList();
  }

  IconData _typeIcon(String type) {
    switch (type) {
      case 'symptoms':
        return Icons.monitor_heart_outlined;
      case 'exercise':
        return Icons.directions_run_rounded;
      case 'household':
        return Icons.home_work_rounded;
      case 'trip':
        return Icons.location_on_outlined;
      default:
        return Icons.circle;
    }
  }

  String _typeLabel(String type) {
    switch (type) {
      case 'symptoms':
        return 'Symptoms Check-in';
      case 'exercise':
        return 'Exercise';
      case 'household':
        return 'Household Activity';
      case 'trip':
        return 'Trip';
      default:
        return type;
    }
  }

  Color _typeColor(String type) {
    switch (type) {
      case 'symptoms':
        return AppColors.red;
      case 'exercise':
        return AppColors.blue;
      case 'household':
        return AppColors.yellow;
      case 'trip':
        return AppColors.green;
      default:
        return AppColors.primary;
    }
  }

  String _preview(Map<String, dynamic> entry) {
    final data = entry['data'] as Map<String, dynamic>;
    switch (entry['type']) {
      case 'symptoms':
        return 'Severity: ${data['severity'] ?? 'Unknown'}';
      case 'exercise':
        final exType = (data['exercise_type'] as String?)
            ?.substring(0, 1)
            .toUpperCase();
        final fullType = exType != null
            ? exType + (data['exercise_type'] as String).substring(1)
            : '';
        return '$fullType · ${data['duration']} mins';
      case 'household':
        final actType = (data['activity_type'] as String?)
            ?.substring(0, 1)
            .toUpperCase();
        final fullAct = actType != null
            ? actType + (data['activity_type'] as String).substring(1)
            : '';
        return fullAct;
      case 'trip':
        return data['destination'] ?? '';
      default:
        return '';
    }
  }

  String _formatDate(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays == 1) return 'Yesterday';
    return '${diff.inDays}d ago';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;
    final filtered = _filteredEntries;

    return Column(
      children: [
        // Header
        Container(
          padding: EdgeInsets.only(
            top: MediaQuery.of(context).padding.top + 22,
            left: 22,
            right: 22,
            bottom: 20,
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
                    'My Insights',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    'Your logged activities & health data',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              Image.asset(
                'images/logo.png',
                width: 40,
                height: 40,
                fit: BoxFit.contain,
              ),
            ],
          ),
        ),

        // Filter tabs
        Container(
          height: 48,
          margin: const EdgeInsets.fromLTRB(18, 14, 18, 6),
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: _filters.length,
            itemBuilder: (context, i) {
              final isActive = i == _filterIndex;
              return GestureDetector(
                onTap: () => setState(() => _filterIndex = i),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.only(right: 8),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 18,
                    vertical: 10,
                  ),
                  decoration: BoxDecoration(
                    color: isActive ? primary.withOpacity(0.15) : surface,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: isActive ? primary : border,
                      width: isActive ? 2 : 1,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      _filters[i],
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: isActive ? primary : textMuted,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Entry list
        Expanded(
          child: filtered.isEmpty
              ? Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.inbox_outlined, size: 48, color: textMuted),
                      const SizedBox(height: 12),
                      Text(
                        'No entries yet',
                        style: GoogleFonts.nunito(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: textMuted,
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(18, 8, 18, 100),
                  itemCount: filtered.length,
                  itemBuilder: (context, i) {
                    final entry = filtered[i];
                    final type = entry['type'] as String;
                    final color = _typeColor(type);
                    return GestureDetector(
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => RecommendationDetailScreen(
                            entryType: type,
                            entryData: entry['data'] as Map<String, dynamic>,
                            entryDate: entry['date'] as DateTime,
                          ),
                        ),
                      ),
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 10),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: surface,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: border),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(
                                alpha: isDark ? 0.12 : 0.04,
                              ),
                              blurRadius: 12,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: BoxDecoration(
                                color: color.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(
                                _typeIcon(type),
                                color: color,
                                size: 20,
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        _typeLabel(type),
                                        style: GoogleFonts.nunito(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w800,
                                          color: text,
                                        ),
                                      ),
                                      const Spacer(),
                                      Text(
                                        _formatDate(entry['date'] as DateTime),
                                        style: GoogleFonts.nunito(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w600,
                                          color: textMuted,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    _preview(entry),
                                    style: GoogleFonts.nunito(
                                      fontSize: 12,
                                      color: textMuted,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.arrow_forward_ios_rounded,
                              size: 12,
                              color: textMuted,
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
