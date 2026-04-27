import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/location_event.dart';

/// LocationHistoryService — persists location change events locally
///
/// Uses SharedPreferences to store a JSON list of LocationEvent objects.
/// Each event records where the user moved, the environmental conditions,
/// and whether an alert was triggered.

class LocationHistoryService {
  static const String _storageKey = 'wheezeease_location_history';
  static const int _maxEvents = 100; // Keep last 100 events

  /// Save a location event to local storage
  static Future<void> saveEvent(LocationEvent event) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<String> existing = prefs.getStringList(_storageKey) ?? [];

      // Add new event at the beginning (most recent first)
      existing.insert(0, jsonEncode(event.toJson()));

      // Trim to max events
      if (existing.length > _maxEvents) {
        existing.removeRange(_maxEvents, existing.length);
      }

      await prefs.setStringList(_storageKey, existing);
      print('Location event saved: ${event.city ?? "Unknown"} '
          '(AQI: ${event.aqi}, Alerted: ${event.wasAlerted})');
    } catch (e) {
      print('Error saving location event: $e');
    }
  }

  /// Get all stored location events (most recent first)
  static Future<List<LocationEvent>> getHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final List<String> stored = prefs.getStringList(_storageKey) ?? [];

      return stored
          .map((json) => LocationEvent.fromJson(
              jsonDecode(json) as Map<String, dynamic>))
          .toList();
    } catch (e) {
      print('Error reading location history: $e');
      return [];
    }
  }

  /// Get only events where an alert was triggered
  static Future<List<LocationEvent>> getAlertedEvents() async {
    final history = await getHistory();
    return history.where((e) => e.wasAlerted).toList();
  }

  /// Get the most recent event (or null if none)
  static Future<LocationEvent?> getLastEvent() async {
    final history = await getHistory();
    return history.isNotEmpty ? history.first : null;
  }

  /// Get the count of events
  static Future<int> getEventCount() async {
    final prefs = await SharedPreferences.getInstance();
    return (prefs.getStringList(_storageKey) ?? []).length;
  }

  /// Clear all stored location events
  static Future<void> clearHistory() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
    print('Location history cleared');
  }
}
