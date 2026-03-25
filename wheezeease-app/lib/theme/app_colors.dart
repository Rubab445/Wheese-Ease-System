import 'package:flutter/material.dart';

class AppColors {
  // ════ LIGHT THEME ════
  static const Color bg = Color(0xFFEEF9F6);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surface2 = Color(0xFFF0FAF7);
  static const Color surface3 = Color(0xFFE0F5EF);
  static const Color border = Color(0x1F009B84); // rgba(0, 155, 132, 0.12)

  static const Color primary = Color(0xFF006B5E);
  static const Color primaryMid = Color(0xFF009B84);
  static const Color primaryLight = Color(0xFFE0F5F0);

  static const Color text = Color(0xFF0D3B35);
  static const Color textMuted = Color(0xFF5AADA0);
  static const Color textDim = Color(0xFF94D3C1);

  static const Color green = Color(0xFF00A688);
  static const Color yellow = Color(0xFFF5A623);
  static const Color red = Color(0xFFE05A2B);
  static const Color blue = Color(0xFF2980B9);

  // ════ DARK THEME ════
  static const Color bgDark = Color(0xFF0A1812);
  static const Color surfaceDark = Color(0xFF162E24);
  static const Color surface2Dark = Color(0xFF1A3D2E);
  static const Color borderDark = Color(0x1F00D4B4); // rgba(0, 212, 180, 0.12)

  static const Color primaryDark = Color(0xFF00D4B4);
  static const Color primaryMidDark = Color(0xFF00A688);
  static const Color textDark = Color(0xFFE2FBF5);
  static const Color textMutedDark = Color(0xFF3A8A72);
  static const Color textDimDark = Color(0xFF265A48);

  // ════ GRADIENTS ════
  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary, primaryMid], // #006B5E to #009B84
  );

  static const LinearGradient primaryGradientDark = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF1A5C48), Color(0xFF00A688)],
  );

  static const LinearGradient greenGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF00A688), Color(0xFF00C9A7)],
  );

  static const LinearGradient orangeGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF5A623), Color(0xFFE05A2B)],
  );

  static const LinearGradient redGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFE05A2B), Color(0xFFFF4D6D)],
  );

  // ════ CONTEXT-AWARE HELPERS ════
  static Color bgColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? bgDark : bg;

  static Color surfaceColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? surfaceDark : surface;

  static Color surface2Color(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? surface2Dark : surface2;

  static Color primaryColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? primaryDark : primary;

  static Color primaryMidColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark
      ? primaryMidDark
      : primaryMid;

  static Color textColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? textDark : text;

  static Color textMutedColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark
      ? textMutedDark
      : textMuted;

  static Color textDimColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? textDimDark : textDim;

  static Color borderColor(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark ? borderDark : border;

  static Color riskColor(String riskLevel, BuildContext context) {
    if (riskLevel.toUpperCase() == 'HIGH') return red;
    if (riskLevel.toUpperCase() == 'MEDIUM') return yellow;
    return green; // LOW
  }

  // Legacy aliases for backward compatibility
  static const Color greenDim = Color(0x1F00A688);
  static const Color yellowDim = Color(0x1FF5A623);
  static const Color redDim = Color(0x1AE05A2B);
  static const Color blueDim = Color(0x1A2980B9);
  static const Color purple = primary;
  static const Color purpleDim = Color(0x1F009B84);

  // Gradient aliases for refactoring existing code
  static const LinearGradient bluePurple = primaryGradient;
  static const LinearGradient purpleGradient = primaryGradient;
  static const LinearGradient darkGradient = primaryGradient;
  static const LinearGradient redOrangeGradient = redGradient;
}
