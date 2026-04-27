import 'dart:async';
import 'package:geolocator/geolocator.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';
import '../services/location_history_service.dart';
import '../models/location_event.dart';

/// LocationMonitorService — passive background location monitoring
///
/// Monitors the user's location with an 800m distance filter.
/// When the user moves 800m+ from their last known position:
///   1. Fetches real-time environmental data for the new coordinates
///   2. Checks if AQI > 100 or PM2.5 > 55
///   3. Pushes a local notification if conditions are dangerous
///   4. Stores the location change event in local history

class LocationMonitorService {
  static final LocationMonitorService _instance =
      LocationMonitorService._internal();
  factory LocationMonitorService() => _instance;
  LocationMonitorService._internal();

  // ── Configuration ──
  static const double distanceThreshold = 800; // meters
  static const double aqiAlertThreshold = 100;
  static const double pm25AlertThreshold = 55;

  // ── State ──
  StreamSubscription<Position>? _positionStream;
  Position? _lastKnownPosition;
  bool _isMonitoring = false;
  final NotificationService _notificationService = NotificationService();

  bool get isMonitoring => _isMonitoring;
  Position? get lastKnownPosition => _lastKnownPosition;

  /// Initialize the service — must be called before startMonitoring
  Future<void> init() async {
    await _notificationService.init();
    print('LocationMonitorService initialized');
  }

  /// Check if location services are available and permissions are granted
  Future<bool> checkPermissions() async {
    // Check if location services are enabled
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      print('Location services are disabled');
      return false;
    }

    // Check permission status
    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        print('Location permission denied');
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      print('Location permission permanently denied');
      return false;
    }

    return true;
  }

  /// Start passive location monitoring with 800m distance filter
  ///
  /// Call this after the user grants location permission.
  /// The stream will fire only when the user moves 800m+ from last position.
  Future<void> startMonitoring() async {
    if (_isMonitoring) {
      print('Location monitoring already active');
      return;
    }

    final hasPermission = await checkPermissions();
    if (!hasPermission) {
      print('Cannot start monitoring — no permission');
      return;
    }

    // Get initial position
    try {
      _lastKnownPosition = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.medium,
          timeLimit: Duration(seconds: 10),
        ),
      );
      print('Initial position: ${_lastKnownPosition!.latitude}, '
          '${_lastKnownPosition!.longitude}');
    } catch (e) {
      print('Could not get initial position: $e');
    }

    // Set up the position stream with distance filter
    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.medium,
      distanceFilter: 800, // Only trigger when moved 800m+
    );

    _positionStream = Geolocator.getPositionStream(
      locationSettings: locationSettings,
    ).listen(
      _onLocationChanged,
      onError: (error) {
        print('Location stream error: $error');
      },
    );

    _isMonitoring = true;
    print('🔵 Passive location monitoring started (${distanceThreshold}m threshold)');
  }

  /// Called when the user moves 800m+ from their last known position
  Future<void> _onLocationChanged(Position position) async {
    print('\n📍 Location changed: ${position.latitude}, ${position.longitude}');

    // Calculate distance from last known position
    if (_lastKnownPosition != null) {
      final distance = Geolocator.distanceBetween(
        _lastKnownPosition!.latitude,
        _lastKnownPosition!.longitude,
        position.latitude,
        position.longitude,
      );
      print('   Distance from last: ${distance.round()}m');
    }

    // Update last known position
    _lastKnownPosition = position;

    // Fetch environmental data for the new coordinates
    try {
      final envData = await ApiService.getEnvironmentByCoords(
        position.latitude,
        position.longitude,
      );

      if (envData == null) {
        print('   ⚠️ Could not fetch env data for new location');
        // Still store the event with default values
        await _storeEvent(position, 0, 0, false, null, null, null, null);
        return;
      }

      final double aqi = (envData['aqi'] as num?)?.toDouble() ?? 0;
      final double pm25 = (envData['pm25'] as num?)?.toDouble() ?? 0;
      final String? city = envData['city'] as String?;
      final double? temperature = (envData['temperature'] as num?)?.toDouble();
      final double? humidity = (envData['humidity'] as num?)?.toDouble();

      print('   AQI: $aqi | PM2.5: $pm25 | City: $city');

      // Check thresholds
      final bool shouldAlert = aqi > aqiAlertThreshold || pm25 > pm25AlertThreshold;

      if (shouldAlert) {
        print('   🚨 ALERT: Air quality dangerous at new location!');
        await _notificationService.showAirQualityAlert(
          aqi: aqi,
          pm25: pm25,
          city: city,
        );
      } else {
        print('   ✅ Air quality is acceptable');
      }

      // Store the event in location history
      await _storeEvent(
        position, aqi, pm25, shouldAlert, city, temperature, humidity,
        shouldAlert
            ? 'Poor air quality detected: AQI ${aqi.round()}, PM2.5 ${pm25.toStringAsFixed(1)}'
            : null,
      );
    } catch (e) {
      print('   Error processing location change: $e');
    }
  }

  /// Store a location event in local history
  Future<void> _storeEvent(
    Position position,
    double aqi,
    double pm25,
    bool wasAlerted,
    String? city,
    double? temperature,
    double? humidity,
    String? alertMessage,
  ) async {
    final event = LocationEvent(
      latitude: position.latitude,
      longitude: position.longitude,
      aqi: aqi,
      pm25: pm25,
      timestamp: DateTime.now(),
      wasAlerted: wasAlerted,
      alertMessage: alertMessage,
      city: city,
      temperature: temperature,
      humidity: humidity,
    );

    await LocationHistoryService.saveEvent(event);
  }

  /// Stop location monitoring
  void stopMonitoring() {
    _positionStream?.cancel();
    _positionStream = null;
    _isMonitoring = false;
    print('🔴 Passive location monitoring stopped');
  }

  /// Dispose of all resources
  void dispose() {
    stopMonitoring();
    _lastKnownPosition = null;
  }
}
