import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class NotificationsScreen extends StatefulWidget {
  final VoidCallback? onCheckinTap;

  const NotificationsScreen({super.key, this.onCheckinTap});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  final List<Map<String, dynamic>> _notifications = [
    {
      'id': 1,
      'type': 'reminder',
      'title': 'Check-in Reminder',
      'subtitle': 'Time to log your health data',
      'message':
          'It\'s been 24 hours since your last check-in. How are you feeling?',
      'time': DateTime.now().subtract(const Duration(hours: 2)),
      'icon': Icons.notifications_active_outlined,
      'read': false,
    },
    {
      'id': 2,
      'type': 'medication',
      'title': 'Medication Reminder',
      'subtitle': 'Take your Albuterol inhaler',
      'message': 'Time to take your Albuterol inhaler (Morning dose)',
      'time': DateTime.now().subtract(const Duration(hours: 5)),
      'icon': Icons.medication_outlined,
      'read': false,
    },
    {
      'id': 3,
      'type': 'alert',
      'title': 'High Risk Alert',
      'subtitle': 'Your risk level has increased',
      'message':
          'Your current risk assessment is HIGH. Please contact your doctor.',
      'time': DateTime.now().subtract(const Duration(days: 1)),
      'icon': Icons.warning_rounded,
      'read': true,
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
    },
    {
      'id': 5,
      'type': 'doctor',
      'title': 'Message from Dr. Smith',
      'subtitle': 'Your prescription is ready',
      'message': 'Your new prescription for Fluticasone is ready to pick up.',
      'time': DateTime.now().subtract(const Duration(days: 2)),
      'icon': Icons.person_rounded,
      'read': true,
    },
  ];

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

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${difference.inDays ~/ 7}w ago';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return SingleChildScrollView(
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
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: List.generate(_notifications.length, (index) {
                final notification = _notifications[index];
                final color = _getNotificationColor(notification['type']);
                final timeAgo = _getTimeAgo(notification['time']);

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: GestureDetector(
                    onTap: () {
                      // Handle different notification types
                      if (notification['type'] == 'reminder') {
                        // For check-in reminders, open the check-in screen
                        if (widget.onCheckinTap != null) {
                          widget.onCheckinTap!();
                        }
                      } else {
                        // For other notifications, show a snackbar
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(notification['title']),
                            behavior: SnackBarBehavior.floating,
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: notification['read']
                            ? surface
                            : color.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: notification['read']
                              ? border
                              : color.withOpacity(0.3),
                          width: 0.5,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(
                              isDark ? 0.1 : 0.03,
                            ),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Icon
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: color.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(
                              notification['icon'],
                              color: color,
                              size: 22,
                            ),
                          ),
                          const SizedBox(width: 12),

                          // Content
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      notification['title'],
                                      style: GoogleFonts.nunito(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700,
                                        color: text,
                                      ),
                                    ),
                                    if (!notification['read'])
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
                                  notification['message'],
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.nunito(
                                    fontSize: 12,
                                    color: textMuted,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  timeAgo,
                                  style: GoogleFonts.nunito(
                                    fontSize: 11,
                                    color: textMuted.withOpacity(0.7),
                                    fontWeight: FontWeight.w500,
                                  ),
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
    );
  }
}
