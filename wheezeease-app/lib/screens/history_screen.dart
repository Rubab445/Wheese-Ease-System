import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import 'recommendation_detail_screen.dart';
import '../services/activity_log_service.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => HistoryScreenState();
}

class HistoryScreenState extends State<HistoryScreen> {
  int _filterIndex = 0; // 0=All, 1=Symptoms, 2=Exercise, 3=Household, 4=Trip
  final List<String> _filters = [
    'All',
    'Symptoms',
    'Exercise',
    'Household',
    'Trip',
  ];

  bool _loading = true;
  List<Map<String, dynamic>> _entries = [];

  @override
  void initState() {
    super.initState();
    _loadEntries();
  }

  void refresh() => _loadEntries();

  Future<void> _loadEntries() async {
    if (!mounted) return;
    setState(() => _loading = true);
    try {
      final logs = await ActivityLogService.getRecentLogs();
      if (!mounted) return;
      setState(() {
        _entries = logs.map((e) {
          final rawType = e['type'] as String? ?? '';
          return {
            'type': rawType == 'checkin' ? 'symptoms' : rawType,
            'date': DateTime.tryParse(e['created_at'] as String? ?? '') ?? DateTime.now(),
            'data': Map<String, dynamic>.from(e['data'] as Map? ?? {}),
          };
        }).toList();
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

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
    final filtered = _loading ? <Map<String, dynamic>>[] : _filteredEntries;

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
                'assets/images/logo.png',
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
          child: _loading
              ? Center(
                  child: CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(primary),
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadEntries,
                  color: primary,
                  child: filtered.isEmpty
                  ? ListView(
                      children: [
                        SizedBox(height: MediaQuery.of(context).size.height * 0.2),
                        Column(
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
                            const SizedBox(height: 6),
                            Text(
                              'Log an activity to see it here.\nPull down to refresh.',
                              textAlign: TextAlign.center,
                              style: GoogleFonts.nunito(
                                fontSize: 12,
                                color: textMuted,
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      ],
                    )
                  : ListView.builder(
                  padding: const EdgeInsets.fromLTRB(18, 8, 18, 100),
                  itemCount: filtered.length,
                  itemBuilder: (context, i) {
                    final entry = filtered[i];
                    final type = entry['type'] as String;
                    final color = _typeColor(type);
                    return GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => RecommendationDetailScreen(
                              entryType: type,
                              entryData: Map<String, dynamic>.from(
                                entry['data'] as Map? ?? {},
                              ),
                              entryDate: entry['date'] as DateTime,
                              saveToHistory: false,
                            ),
                          ),
                        );
                      },
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
        ),
      ],
    );
  }
}
