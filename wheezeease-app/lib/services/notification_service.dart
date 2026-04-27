import 'dart:convert';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

/// NotificationService — handles local push notifications for air quality alerts
///
/// Initializes the notification plugin for both Android and iOS,
/// and provides methods to show air quality warning notifications
/// when the user moves to an area with dangerous conditions.

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;

  /// Initialize notification channels and settings for both platforms
  Future<void> init() async {
    if (_isInitialized) return;

    // Android settings
    const androidSettings = AndroidInitializationSettings(
      '@mipmap/ic_launcher',
    );

    // iOS settings
    const darwinSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: darwinSettings,
    );

    await _plugin.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );

    _isInitialized = true;
    print('NotificationService initialized');
  }

  /// Handle notification tap
  void _onNotificationTapped(NotificationResponse response) {
    print('Notification tapped: ${response.payload}');
    // Could navigate to a specific screen in the future
  }

  /// Show an air quality alert notification
  ///
  /// Called when passive location monitoring detects the user has moved
  /// to an area with AQI > 100 or PM2.5 > 55
  Future<void> showAirQualityAlert({
    required double aqi,
    required double pm25,
    String? city,
  }) async {
    if (!_isInitialized) await init();

    // Build the notification message based on conditions
    final List<String> warnings = [];

    if (aqi > 150) {
      warnings.add('AQI is ${aqi.round()} (Unhealthy)');
    } else if (aqi > 100) {
      warnings.add('AQI is ${aqi.round()} (Poor)');
    }

    if (pm25 > 55) {
      warnings.add('PM2.5 is ${pm25.toStringAsFixed(1)} µg/m³ (Harmful)');
    }

    final location = city != null && city.isNotEmpty ? ' in $city' : '';
    final title = '⚠️ Poor Air Quality Detected$location';
    final body = warnings.isNotEmpty
        ? '${warnings.join(' · ')}. Consider wearing a mask and limiting outdoor exposure.'
        : 'Air quality has worsened at your current location. Take precautions.';

    const androidDetails = AndroidNotificationDetails(
      'wheezeease_location_alerts',
      'Location Air Quality Alerts',
      channelDescription:
          'Alerts when you move to an area with poor air quality',
      importance: Importance.high,
      priority: Priority.high,
      icon: '@mipmap/ic_launcher',
      showWhen: true,
      enableVibration: true,
      playSound: true,
      styleInformation: BigTextStyleInformation(''),
    );

    const darwinDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const details = NotificationDetails(
      android: androidDetails,
      iOS: darwinDetails,
    );

    await _plugin.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000, // unique ID
      title,
      body,
      details,
      payload: jsonEncode({
        'type': 'air_quality_alert',
        'aqi': aqi,
        'pm25': pm25,
        'city': city,
      }),
    );

    print('Notification shown: $title — $body');
  }

  /// Cancel all notifications
  Future<void> cancelAll() async {
    await _plugin.cancelAll();
  }
}
