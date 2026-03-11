import 'package:flutter/material.dart';

class AppColors {
  static const Color bg = Color(0xFFF0F7FF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surface2 = Color(0xFFF8FBFF);
  static const Color surface3 = Color(0xFFEEF5FF);
  static const Color border = Color(0x26649FFF);

  static const Color green = Color(0xFF22C87A);
  static const Color greenDim = Color(0x1F22C87A);
  static const Color yellow = Color(0xFFF5A623);
  static const Color yellowDim = Color(0x1FF5A623);
  static const Color red = Color(0xFFFF4D6D);
  static const Color redDim = Color(0x1AFF4D6D);
  static const Color blue = Color(0xFF3A8EFF);
  static const Color blueDim = Color(0x1A3A8EFF);
  static const Color purple = Color(0xFF7C5CFC);
  static const Color purpleDim = Color(0x1A7C5CFC);

  static const Color text = Color(0xFF1A2840);
  static const Color textMuted = Color(0xFF6B8AAD);
  static const Color textDim = Color(0xFFA8BDD4);

  static const LinearGradient bluePurple = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [blue, purple],
  );

  static const LinearGradient greenGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF22C87A), Color(0xFF00B894)],
  );

  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF5A623), Color(0xFFF0522A)],
  );

  static const LinearGradient purpleGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [purple, Color(0xFFA855F7)],
  );

  static const LinearGradient darkGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1A2840), Color(0xFF2D4A7A)],
  );

  static const LinearGradient redOrangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFFF4D6D), Color(0xFFFF8C42)],
  );
}
