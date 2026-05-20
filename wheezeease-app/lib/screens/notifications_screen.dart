import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../theme/app_colors.dart';
import 'medications_screen.dart';

class NotificationsScreen extends StatefulWidget {
  final VoidCallback? onCheckinTap;

  const NotificationsScreen({super.key, this.onCheckinTap});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final _supabase = Supabase.instance.client;
  bool _loading = true;
  List<Map<String, dynamic>> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _loading = true);

    final user = _supabase.auth.currentUser;
    final List<Map<String, dynamic>> liveItems = [];

    if (user != null) {
      try {
        // Check last check-in
        final checkins = await _supabase
            .from('activity_logs')
            .select('created_at')
            .eq('user_id', user.id)
            .eq('type', 'checkin')
            .order('created_at', ascending: false)
            .limit(1);

        final bool needsCheckin;
        DateTime? lastCheckin;
        if (checkins.isEmpty) {
          needsCheckin = true;
        } else {
          lastCheckin = DateTime.tryParse(checkins[0]['created_at'] as String? ?? '');
          needsCheckin = lastCheckin == null ||
              DateTime.now().difference(lastCheckin).inHours >= 24;
        }

        liveItems.add({
          'id': 1,
          'type': 'reminder',
          'title': 'Check-in Reminder',
          'subtitle': 'Time to log your health data',
          'message': needsCheckin
              ? (lastCheckin == null
                  ? 'You haven\'t logged your symptoms yet. How are you feeling?'
                  : 'It\'s been ${DateTime.now().difference(lastCheckin).inHours}h since your last check-in. How are you feeling?')
              : 'You\'re up to date! Last check-in was recent.',
          'time': lastCheckin ?? DateTime.now().subtract(const Duration(hours: 25)),
          'icon': Icons.notifications_active_outlined,
          'read': !needsCheckin,
          'actionable': needsCheckin,
        });

        // Check last prediction for high risk
        final predictions = await _supabase
            .from('prediction_logs')
            .select('risk_level, created_at, main_message')
            .eq('user_id', user.id)
            .order('created_at', ascending: false)
            .limit(1);

        if (predictions.isNotEmpty) {
          final pred = predictions[0];
          final isHigh = (pred['risk_level'] as String?) == 'HIGH';
          final predTime = DateTime.tryParse(pred['created_at'] as String? ?? '') ??
              DateTime.now().subtract(const Duration(days: 1));
          liveItems.add({
            'id': 3,
            'type': 'alert',
            'title': isHigh ? 'High Risk Alert' : 'Risk Assessment Updated',
            'subtitle': isHigh ? 'Your risk level has increased' : 'Your current risk is ${pred['risk_level']}',
            'message': isHigh
                ? 'Your current risk assessment is HIGH. Please contact your doctor.'
                : 'Your latest AI assessment shows ${pred['risk_level']} risk. Keep monitoring.',
            'time': predTime,
            'icon': isHigh ? Icons.warning_rounded : Icons.insights_rounded,
            'read': !isHigh,
            'actionable': false,
          });
        }
      } catch (_) {
        // Fall back to static
      }
    }

    // Static notifications (medication, activity, doctor)
    final staticItems = [
      {
        'id': 2,
        'type': 'medication',
        'title': 'Medication Reminder',
        'subtitle': 'Take your Albuterol inhaler',
        'message': 'Time to take your Albuterol inhaler (Morning dose)',
        'time': DateTime.now().subtract(const Duration(hours: 5)),
        'icon': Icons.medication_outlined,
        'read': false,
        'actionable': false,
      },
      {
        'id': 4,
        'type': 'activity',
        'title': 'Activity Achievement',
        'subtitle': 'Great job on your walk!',
        'message': 'You completed a 30-minute walk today. Keep it up!',
        'time': DateTime.now().subtract(const Duration(days: 1)),
        'icon': Icons.favorite_rounded,
        'read': true,
        'actionable': false,
      },
      {
        'id': 5,
        'type': 'doctor',
        'title': 'Message from Dr. Ahmad Ali',
        'subtitle': 'Your prescription is ready',
        'message': 'Your new prescription for Fluticasone is ready to pick up.',
        'time': DateTime.now().subtract(const Duration(days: 2)),
        'icon': Icons.person_rounded,
        'read': true,
        'actionable': false,
      },
    ];

    // Merge: dynamic first, then static
    final List<Map<String, dynamic>> merged = [...liveItems, ...staticItems];
    merged.sort((a, b) => (b['time'] as DateTime).compareTo(a['time'] as DateTime));

    if (!mounted) return;
    setState(() {
      _notifications = merged;
      _loading = false;
    });
  }

  Color _getNotificationColor(String type) {
    switch (type) {
      case 'reminder':
        return const Color(0xFF00D4B4);
      case 'medication':
        return const Color(0xFF6C5CE7);
      case 'alert':
        return const Color(0xFFE74C3C);
      case 'activity':
        return const Color(0xFFF39C12);
      case 'doctor':
        return const Color(0xFF3498DB);
      default:
        return const Color(0xFF95A5A6);
    }
  }

  String _getTimeAgo(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);
    if (difference.inMinutes < 1) return 'Just now';
    if (difference.inMinutes < 60) return '${difference.inMinutes}m ago';
    if (difference.inHours < 24) return '${difference.inHours}h ago';
    if (difference.inDays < 7) return '${difference.inDays}d ago';
    return '${difference.inDays ~/ 7}w ago';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return RefreshIndicator(
      onRefresh: _loadNotifications,
      color: primary,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── HEADER ──
            Container(
              width: double.infinity,
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top + 18,
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
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Notifications',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 28,
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Stay updated with your health alerts',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        color: Colors.white70,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── NOTIFICATIONS LIST ──
            _loading
                ? Padding(
                    padding: const EdgeInsets.only(top: 60),
                    child: Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation(primary),
                        strokeWidth: 2,
                      ),
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      children: List.generate(_notifications.length, (index) {
                        final notification = _notifications[index];
                        final color = _getNotificationColor(notification['type'] as String);
                        final timeAgo = _getTimeAgo(notification['time'] as DateTime);
                        final isRead = notification['read'] as bool;
                        final isActionable = notification['actionable'] as bool? ?? false;

                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: GestureDetector(
                            onTap: () {
                              final type = notification['type'] as String;
                              if (type == 'reminder') {
                                widget.onCheckinTap?.call();
                              } else if (type == 'medication') {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (_) => const MedicationsScreen(),
                                  ),
                                );
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isRead ? surface : color.withOpacity(0.08),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: isRead ? border : color.withOpacity(0.3),
                                  width: 0.5,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(isDark ? 0.1 : 0.03),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  ),
                                ],
                              ),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 44,
                                    height: 44,
                                    decoration: BoxDecoration(
                                      color: color.withOpacity(0.15),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Icon(
                                      notification['icon'] as IconData,
                                      color: color,
                                      size: 22,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              notification['title'] as String,
                                              style: GoogleFonts.nunito(
                                                fontSize: 14,
                                                fontWeight: FontWeight.w700,
                                                color: text,
                                              ),
                                            ),
                                            if (!isRead)
                                              Container(
                                                width: 8,
                                                height: 8,
                                                decoration: const BoxDecoration(
                                                  shape: BoxShape.circle,
                                                  color: Color(0xFF00D4B4),
                                                ),
                                              ),
                                          ],
                                        ),
                                        const SizedBox(height: 3),
                                        Text(
                                          notification['message'] as String,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                          style: GoogleFonts.nunito(
                                            fontSize: 12,
                                            color: textMuted,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        const SizedBox(height: 6),
                                        Row(
                                          children: [
                                            Text(
                                              timeAgo,
                                              style: GoogleFonts.nunito(
                                                fontSize: 11,
                                                color: textMuted.withOpacity(0.7),
                                                fontWeight: FontWeight.w500,
                                              ),
                                            ),
                                            if (notification['type'] == 'reminder' || notification['type'] == 'medication') ...[
                                              const SizedBox(width: 8),
                                              Text(
                                                notification['type'] == 'medication'
                                                    ? '· Tap to open'
                                                    : '· Tap to check in',
                                                style: GoogleFonts.nunito(
                                                  fontSize: 11,
                                                  color: color,
                                                  fontWeight: FontWeight.w700,
                                                ),
                                              ),
                                            ],
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
