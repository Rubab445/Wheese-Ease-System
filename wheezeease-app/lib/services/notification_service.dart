import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest.dart' as tzdata;

class NotificationService {
  static final _notifications = FlutterLocalNotificationsPlugin();

  /// Callback invoked when user taps a notification.
  /// Set this from main.dart so we can navigate to the check-in tab.
  static void Function(String? payload)? onNotificationTap;

  static Future<void> init() async {
    // flutter_local_notifications does not support web
    if (kIsWeb) return;

    tzdata.initializeTimeZones();

    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iOS = DarwinInitializationSettings();

    await _notifications.initialize(
      const InitializationSettings(android: android, iOS: iOS),
      onDidReceiveNotificationResponse: _onNotificationResponse,
    );
  }

  static void _onNotificationResponse(NotificationResponse response) {
    // Delegate to the callback set from main.dart
    onNotificationTap?.call(response.payload);
  }

  static Future<void> scheduleDailyNotifications() async {
    // flutter_local_notifications does not support web
    if (kIsWeb) return;

    // Cancel existing before rescheduling
    await _notifications.cancelAll();

    final times = [
      {'id': 1, 'hour': 10, 'minute': 0, 'label': 'Morning'},
      {'id': 2, 'hour': 15, 'minute': 0, 'label': 'Afternoon'},
      {'id': 3, 'hour': 20, 'minute': 0, 'label': 'Evening'},
      {'id': 4, 'hour': 0, 'minute': 0, 'label': 'Night'},
    ];

    for (final t in times) {
      await _notifications.zonedSchedule(
        t['id'] as int,
        'WheezeEase Check-in',
        'Time to log your symptoms — tap to record',
        _nextInstanceOfTime(t['hour'] as int, t['minute'] as int),
        const NotificationDetails(
          android: AndroidNotificationDetails(
            'wheeze_checkin',
            'Symptom Check-ins',
            channelDescription: 'Daily symptom check-in reminders',
            importance: Importance.high,
            priority: Priority.high,
          ),
        ),
        androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
        uiLocalNotificationDateInterpretation:
            UILocalNotificationDateInterpretation.absoluteTime,
        matchDateTimeComponents: DateTimeComponents.time, // repeats daily
        payload: 'checkin', // used to identify notification tap
      );
    }
  }

  static tz.TZDateTime _nextInstanceOfTime(int hour, int minute) {
    final now = tz.TZDateTime.now(tz.local);
    var scheduled = tz.TZDateTime(
      tz.local,
      now.year,
      now.month,
      now.day,
      hour,
      minute,
    );
    if (scheduled.isBefore(now)) {
      scheduled = scheduled.add(const Duration(days: 1));
    }
    return scheduled;
  }
}
