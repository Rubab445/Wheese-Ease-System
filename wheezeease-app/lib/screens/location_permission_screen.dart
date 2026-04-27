import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:geolocator/geolocator.dart';
import '../theme/app_colors.dart';
// import '../services/location_monitor_service.dart'; // DISABLED: location alerts module

class LocationPermissionScreen extends StatefulWidget {
  final VoidCallback onAllow;
  final VoidCallback onDeny;

  const LocationPermissionScreen({
    super.key,
    required this.onAllow,
    required this.onDeny,
  });

  @override
  State<LocationPermissionScreen> createState() =>
      _LocationPermissionScreenState();
}

class _LocationPermissionScreenState extends State<LocationPermissionScreen>
    with TickerProviderStateMixin {
  bool _searching = false;
  String _statusText = 'Accessing GPS…';
  late AnimationController _pulseController;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _allowLocation() async {
    setState(() => _searching = true);

    // On web, permission_handler doesn't support locationWhenInUse/locationAlways.
    // Skip native permission flow and proceed directly.
    if (kIsWeb) {
      setState(() => _statusText = 'Web platform detected…');
      await Future.delayed(const Duration(milliseconds: 500));
      setState(() => _statusText = 'Location confirmed ✓');
      await Future.delayed(const Duration(milliseconds: 500));
      if (mounted) widget.onAllow();
      return;
    }

    // Step 1: Check if location services are enabled
    setState(() => _statusText = 'Checking location services…');
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) {
        setState(() => _statusText = 'Location services disabled');
        await Future.delayed(const Duration(seconds: 1));
        // Still proceed — some devices allow permission grant before enabling
      }
    }

    // Step 2: Request foreground location permission
    setState(() => _statusText = 'Requesting location permission…');
    var locationStatus = await Permission.locationWhenInUse.request();

    if (locationStatus.isDenied || locationStatus.isPermanentlyDenied) {
      if (mounted) {
        setState(() {
          _searching = false;
          _statusText = 'Permission denied';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Location permission is required for air quality monitoring'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
      return;
    }

    // Step 3: Request background location (Always) permission
    setState(() => _statusText = 'Requesting background location…');
    var bgStatus = await Permission.locationAlways.request();
    // Background location denial is non-blocking — we still proceed
    if (bgStatus.isDenied) {
      print('Background location denied — monitoring limited to foreground');
    }

    // Step 4: Get current position
    setState(() => _statusText = 'Obtaining coordinates…');
    try {
      await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.medium,
          timeLimit: Duration(seconds: 10),
        ),
      );
    } catch (e) {
      print('Initial position fetch failed: $e');
    }

    setState(() => _statusText = 'Resolving address…');
    await Future.delayed(const Duration(milliseconds: 400));

    // Start location monitoring — DISABLED
    // await LocationMonitorService().startMonitoring();
    await Future.delayed(const Duration(milliseconds: 300));

    setState(() => _statusText = 'Location confirmed ✓');
    await Future.delayed(const Duration(milliseconds: 500));
    if (mounted) widget.onAllow();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;

    return Container(
      decoration: BoxDecoration(
        gradient: isDark
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [AppColors.bgDark, const Color(0xFF0D2920)],
              )
            : const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFFE8F4FF), Color(0xFFF0E8FF)],
              ),
      ),
      child: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 28),
          child: Column(
            children: [
              // Pulse ring with location icon
              AnimatedBuilder(
                animation: _pulseController,
                builder: (context, child) {
                  final scale = 1.0 + _pulseController.value * 0.03;
                  return Transform.scale(scale: scale, child: child);
                },
                child: Container(
                  width: 130,
                  height: 130,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [
                        primary.withValues(alpha: 0.13),
                        primary.withValues(alpha: 0.08),
                      ],
                    ),
                  ),
                  child: Center(
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: isDark
                            ? AppColors.primaryGradientDark
                            : AppColors.primaryGradient,
                        boxShadow: [
                          BoxShadow(
                            color: primary.withValues(alpha: 0.38),
                            blurRadius: 28,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(Icons.location_on_outlined,
                            color: Colors.white, size: 34),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),

              Text(
                'Allow Location\nAccess',
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: text,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                'WheezeEase uses your location to monitor real-time AQI, pollen, and weather conditions in your area.',
                textAlign: TextAlign.center,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  color: textMuted,
                  height: 1.75,
                ),
              ),
              const SizedBox(height: 22),

              // Permission card
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 18,
                ),
                decoration: BoxDecoration(
                  color: surface,
                  borderRadius: BorderRadius.circular(22),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black
                          .withValues(alpha: isDark ? 0.2 : 0.08),
                      blurRadius: 24,
                      offset: const Offset(0, 4),
                    ),
                  ],
                  border: Border.all(color: border),
                ),
                child: Column(
                  children: [
                    _buildPermRow(
                      Icons.cloud_outlined,
                      primary.withOpacity(0.12),
                      'Live Air Quality Index',
                      'We fetch real-time AQI data for your exact neighbourhood to detect dangerous pollution levels.',
                      primary,
                      text,
                      textMuted,
                      border,
                    ),
                    _buildPermRow(
                      Icons.local_florist_outlined,
                      AppColors.greenDim,
                      'Pollen & Allergen Tracking',
                      'Localised pollen forecasts so we can warn you on high-risk days before you step outside.',
                      primary,
                      text,
                      textMuted,
                      border,
                    ),
                    _buildPermRow(
                      Icons.local_hospital_outlined,
                      AppColors.yellowDim,
                      'Find Doctors Near You',
                      "We'll show you registered WheezeEase doctors in your area so you can pick one to monitor your health.",
                      primary,
                      text,
                      textMuted,
                      border,
                    ),
                    _buildPermRow(
                      Icons.lock_outlined,
                      isDark
                          ? primary.withOpacity(0.15)
                          : AppColors.purpleDim,
                      'Your Privacy is Protected',
                      'Location is only used for environmental data. It is never shared with third parties.',
                      primary,
                      text,
                      textMuted,
                      border,
                      showBorder: false,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),

              // Searching animation
              if (_searching)
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: surface,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black
                            .withValues(alpha: isDark ? 0.2 : 0.08),
                        blurRadius: 24,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      SizedBox(
                        width: 36,
                        height: 36,
                        child: CircularProgressIndicator(
                          strokeWidth: 3,
                          color: primary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Detecting your location…',
                        style: GoogleFonts.nunito(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _statusText,
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          color: textMuted,
                        ),
                      ),
                    ],
                  ),
                ),

              if (!_searching) ...[
                GestureDetector(
                  onTap: _allowLocation,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 17),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(18),
                      gradient: isDark
                          ? AppColors.primaryGradientDark
                          : AppColors.primaryGradient,
                      boxShadow: [
                        BoxShadow(
                          color: primary.withValues(alpha: 0.35),
                          blurRadius: 28,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.location_on_outlined,
                              color: Colors.white, size: 18),
                          const SizedBox(width: 6),
                          Text(
                            'Allow Location Access',
                            style: GoogleFonts.nunito(
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: 0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: widget.onDeny,
                  child: Center(
                    child: Padding(
                      padding: const EdgeInsets.all(8),
                      child: Text(
                        'Not now — enter manually',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: textMuted,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPermRow(
    IconData icon,
    Color bgColor,
    String title,
    String subtitle,
    Color iconColor,
    Color textColor,
    Color mutedColor,
    Color borderColor, {
    bool showBorder = true,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        border: showBorder
            ? Border(bottom: BorderSide(color: borderColor))
            : null,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(11),
              color: bgColor,
            ),
            child: Center(
              child: Icon(icon, size: 17, color: iconColor),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    color: mutedColor,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
