import 'package:flutter/material.dart';

class PredictionResult {
  final String riskLevel; // LOW, MEDIUM, HIGH, UNCERTAIN
  final String icon;      // icon string from API
  final double confidence;
  final String advice;
  final List<String> reasons;
  final List<String> alerts;
  final Map<String, double> probabilities; // {low, medium, high}

  PredictionResult({
    required this.riskLevel,
    required this.icon,
    required this.confidence,
    required this.advice,
    required this.reasons,
    required this.alerts,
    required this.probabilities,
  });

  factory PredictionResult.fromJson(Map<String, dynamic> json) {
    return PredictionResult(
      riskLevel: json['risk_level'] ?? 'UNCERTAIN',
      icon: json['icon'] ?? '',
      confidence: (json['confidence'] ?? 0.0).toDouble(),
      advice: json['advice'] ?? '',
      reasons: List<String>.from(json['reasons'] ?? []),
      alerts: List<String>.from(json['alerts'] ?? []),
      probabilities: {
        'low': ((json['probabilities']?['low'] ?? 0.0) as num).toDouble(),
        'medium': ((json['probabilities']?['medium'] ?? 0.0) as num).toDouble(),
        'high': ((json['probabilities']?['high'] ?? 0.0) as num).toDouble(),
      },
    );
  }

  // Calculate risk percentage based on probabilities
  double get riskPercentage {
    final highProb = probabilities['high'] ?? 0.0;
    final mediumProb = probabilities['medium'] ?? 0.0;
    return (highProb * 100 + mediumProb * 40).clamp(0, 99).toDouble();
  }

  Color get riskColor {
    switch (riskLevel) {
      case 'LOW':
        return const Color(0xFF4CAF50);
      case 'MEDIUM':
        return const Color(0xFFFFC107);
      case 'HIGH':
        return const Color(0xFFF44336);
      default:
        return const Color(0xFF9E9E9E);
    }
  }

  String get confidencePercentage =>
      '${(confidence * 100).toStringAsFixed(0)}%';

  IconData get riskIconData {
    switch (riskLevel) {
      case 'LOW':
        return Icons.check_circle_outline;
      case 'MEDIUM':
        return Icons.warning_amber_rounded;
      case 'HIGH':
        return Icons.error_outline;
      default:
        return Icons.help_outline;
    }
  }
}
