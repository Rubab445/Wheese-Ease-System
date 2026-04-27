/// LocationEvent — data model for a location change event
///
/// Stores coordinates, environmental data, alert status, and timestamp
/// for each significant location change detected by passive monitoring.
library;

class LocationEvent {
  final double latitude;
  final double longitude;
  final double aqi;
  final double pm25;
  final DateTime timestamp;
  final bool wasAlerted;
  final String? alertMessage;
  final String? city;
  final double? temperature;
  final double? humidity;

  const LocationEvent({
    required this.latitude,
    required this.longitude,
    required this.aqi,
    required this.pm25,
    required this.timestamp,
    this.wasAlerted = false,
    this.alertMessage,
    this.city,
    this.temperature,
    this.humidity,
  });

  Map<String, dynamic> toJson() => {
    'latitude': latitude,
    'longitude': longitude,
    'aqi': aqi,
    'pm25': pm25,
    'timestamp': timestamp.toIso8601String(),
    'wasAlerted': wasAlerted,
    'alertMessage': alertMessage,
    'city': city,
    'temperature': temperature,
    'humidity': humidity,
  };

  factory LocationEvent.fromJson(Map<String, dynamic> json) => LocationEvent(
    latitude: (json['latitude'] as num).toDouble(),
    longitude: (json['longitude'] as num).toDouble(),
    aqi: (json['aqi'] as num).toDouble(),
    pm25: (json['pm25'] as num).toDouble(),
    timestamp: DateTime.parse(json['timestamp'] as String),
    wasAlerted: json['wasAlerted'] as bool? ?? false,
    alertMessage: json['alertMessage'] as String?,
    city: json['city'] as String?,
    temperature: (json['temperature'] as num?)?.toDouble(),
    humidity: (json['humidity'] as num?)?.toDouble(),
  );

  @override
  String toString() =>
      'LocationEvent(lat: $latitude, lon: $longitude, aqi: $aqi, pm25: $pm25, alerted: $wasAlerted)';
}
