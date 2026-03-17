import 'package:flutter/material.dart';

class Doctor {
  final int id;
  final String name;
  final String initials;
  final String spec;
  final String hospital;
  final String distance;
  final double rating;
  final int reviews;
  final List<String> tags;
  final String avail;
  final LinearGradient color;

  const Doctor({
    required this.id,
    required this.name,
    required this.initials,
    required this.spec,
    required this.hospital,
    required this.distance,
    required this.rating,
    required this.reviews,
    required this.tags,
    required this.avail,
    required this.color,
  });

  static List<Doctor> get sampleDoctors => [
    Doctor(
      id: 1,
      name: 'Dr. A. Rahman',
      initials: 'AR',
      spec: 'Pulmonologist',
      hospital: 'Gujranwala General Hospital',
      distance: '1.2 km',
      rating: 4.9,
      reviews: 142,
      tags: ['Asthma', 'COPD', 'Allergy'],
      avail: 'online',
      color: const LinearGradient(
        colors: [Color(0xFF3A8EFF), Color(0xFF7C5CFC)],
      ),
    ),
    Doctor(
      id: 2,
      name: 'Dr. Sana Mirza',
      initials: 'SM',
      spec: 'Allergist',
      hospital: 'Allergy & Chest Care Clinic',
      distance: '2.4 km',
      rating: 4.8,
      reviews: 98,
      tags: ['Allergies', 'Rhinitis'],
      avail: 'online',
      color: const LinearGradient(
        colors: [Color(0xFFE84393), Color(0xFFF5A623)],
      ),
    ),
    Doctor(
      id: 3,
      name: 'Dr. Umar Farooq',
      initials: 'UF',
      spec: 'Pulmonologist',
      hospital: 'Punjab Medical Centre',
      distance: '3.1 km',
      rating: 4.7,
      reviews: 76,
      tags: ['Asthma', 'Bronchitis'],
      avail: 'busy',
      color: const LinearGradient(
        colors: [Color(0xFF20B2AA), Color(0xFF3A8EFF)],
      ),
    ),
    Doctor(
      id: 4,
      name: 'Dr. Hina Bajwa',
      initials: 'HB',
      spec: 'General Physician',
      hospital: 'City Health Clinic',
      distance: '0.9 km',
      rating: 4.6,
      reviews: 210,
      tags: ['General', 'Allergy'],
      avail: 'online',
      color: const LinearGradient(
        colors: [Color(0xFFF5A623), Color(0xFFE84343)],
      ),
    ),
    Doctor(
      id: 5,
      name: 'Dr. Bilal Chaudhry',
      initials: 'BC',
      spec: 'Allergist',
      hospital: 'Premier Allergy Institute',
      distance: '4.0 km',
      rating: 4.8,
      reviews: 55,
      tags: ['Dust Allergy', 'Eczema'],
      avail: 'busy',
      color: const LinearGradient(
        colors: [Color(0xFF7C5CFC), Color(0xFFE843E8)],
      ),
    ),
    Doctor(
      id: 6,
      name: 'Dr. Ayesha Tariq',
      initials: 'AT',
      spec: 'Pulmonologist',
      hospital: 'Fatima Memorial Hospital',
      distance: '2.8 km',
      rating: 4.9,
      reviews: 188,
      tags: ['Asthma', 'Sleep Apnea'],
      avail: 'online',
      color: const LinearGradient(
        colors: [Color(0xFF22C87A), Color(0xFF3A8EFF)],
      ),
    ),
    Doctor(
      id: 7,
      name: 'Dr. Kamran Malik',
      initials: 'KM',
      spec: 'General Physician',
      hospital: 'Malik Family Clinic',
      distance: '1.5 km',
      rating: 4.5,
      reviews: 320,
      tags: ['General', 'Respiratory'],
      avail: 'online',
      color: const LinearGradient(
        colors: [Color(0xFFFF6B35), Color(0xFFF5A623)],
      ),
    ),
    Doctor(
      id: 8,
      name: 'Dr. Rabia Noor',
      initials: 'RN',
      spec: 'Allergist',
      hospital: 'Gujranwala Allergy Centre',
      distance: '3.6 km',
      rating: 4.7,
      reviews: 62,
      tags: ['Pollen', 'Food Allergy'],
      avail: 'busy',
      color: const LinearGradient(
        colors: [Color(0xFFE84393), Color(0xFF7C5CFC)],
      ),
    ),
    Doctor(
      id: 9,
      name: 'Dr. Zafar Iqbal',
      initials: 'ZI',
      spec: 'Pulmonologist',
      hospital: 'Iqbal Chest & Lung Clinic',
      distance: '5.2 km',
      rating: 4.6,
      reviews: 44,
      tags: ['COPD', 'Asthma'],
      avail: 'online',
      color: const LinearGradient(
        colors: [Color(0xFF20B2AA), Color(0xFF22C87A)],
      ),
    ),
  ];
}
