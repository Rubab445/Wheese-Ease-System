import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class HistoryDay {
  final String day;
  final int risk;
  final int inhaler;
  final int aqi;
  final String symptoms;
  final Color color;

  const HistoryDay({
    required this.day,
    required this.risk,
    required this.inhaler,
    required this.aqi,
    required this.symptoms,
    required this.color,
  });

  static List<HistoryDay> get sampleData => [
    HistoryDay(
      day: 'Mon',
      risk: 18,
      inhaler: 1,
      aqi: 72,
      symptoms: 'Mild cough · Felt 😊',
      color: AppColors.green,
    ),
    HistoryDay(
      day: 'Tue',
      risk: 32,
      inhaler: 2,
      aqi: 95,
      symptoms: 'Coughing (Mild) · Felt 🙂',
      color: AppColors.yellow,
    ),
    HistoryDay(
      day: 'Wed',
      risk: 45,
      inhaler: 2,
      aqi: 110,
      symptoms: 'Wheezing, Coughing (Mod) · Felt 😐',
      color: AppColors.yellow,
    ),
    HistoryDay(
      day: 'Thu',
      risk: 62,
      inhaler: 3,
      aqi: 138,
      symptoms: 'Wheezing, Shortness of breath (Severe) · Felt 😟',
      color: AppColors.red,
    ),
    HistoryDay(
      day: 'Fri',
      risk: 55,
      inhaler: 2,
      aqi: 120,
      symptoms: 'Wheezing (Moderate) · Felt 😐',
      color: AppColors.yellow,
    ),
    HistoryDay(
      day: 'Sat',
      risk: 48,
      inhaler: 0,
      aqi: 88,
      symptoms: 'None reported · Felt 🙂',
      color: AppColors.yellow,
    ),
    HistoryDay(
      day: 'Today',
      risk: 78,
      inhaler: 4,
      aqi: 158,
      symptoms: 'Wheezing, Shortness of breath (Mod) · Pollen: High',
      color: AppColors.red,
    ),
  ];

  static const List<String> dayNames = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Today, Mar 07',
  ];
}
