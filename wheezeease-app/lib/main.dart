import 'package:flutter/foundation.dart'
    show TargetPlatform, defaultTargetPlatform, kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme/app_colors.dart';
import 'theme/app_theme.dart';
import 'models/doctor.dart';
import 'screens/auth_screen.dart';
import 'screens/onboarding_screen.dart';
import 'screens/location_permission_screen.dart';
import 'screens/doctor_selection_screen.dart';
import 'screens/home_screen.dart';
import 'screens/checkin_screen.dart';
import 'screens/history_screen.dart';
import 'screens/medications_screen.dart';
import 'screens/doctor_detail_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/activities_screen.dart';
import 'screens/notifications_screen.dart';
import 'services/notification_service.dart';

import 'widgets/message_modal.dart';

final GlobalKey<_AppShellState> appShellKey = GlobalKey<_AppShellState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);

  // Initialize local notifications & schedule daily check-in reminders
  await NotificationService.init();
  await NotificationService.scheduleDailyNotifications();

  // When user taps a notification, navigate to the check-in tab
  NotificationService.onNotificationTap = (payload) {
    if (payload == 'checkin') {
      appShellKey.currentState?.switchToCheckin();
    }
  };

  runApp(const WheezeEaseApp());
}

class WheezeEaseApp extends StatelessWidget {
  const WheezeEaseApp({super.key});

  static bool get isDesktopOrWeb {
    if (kIsWeb) return true;
    return TargetPlatform.windows == defaultTargetPlatform ||
        TargetPlatform.macOS == defaultTargetPlatform ||
        TargetPlatform.linux == defaultTargetPlatform;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'WheezeEase',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.system,
      debugShowCheckedModeBanner: false,
      home: AppShell(key: appShellKey),
      builder: (context, child) {
        if (!WheezeEaseApp.isDesktopOrWeb) return child!;
        final isDark = Theme.of(context).brightness == Brightness.dark;
        return Container(
          color: isDark ? const Color(0xFF0A1812) : const Color(0xFFCCDDF5),
          child: Center(
            child: Container(
              width: 390,
              height: 844,
              clipBehavior: Clip.antiAlias,
              decoration: BoxDecoration(
                color: AppColors.bgColor(context),
                borderRadius: BorderRadius.circular(48),
                boxShadow: [
                  BoxShadow(
                    color:
                        (isDark
                                ? const Color(0xFF00D4B4)
                                : const Color(0xFF143C8C))
                            .withValues(alpha: 0.28),
                    blurRadius: 80,
                    offset: const Offset(0, 30),
                  ),
                ],
                border: Border.all(
                  color: AppColors.textColor(context),
                  width: 12,
                ),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(36),
                child: MediaQuery(
                  data: MediaQuery.of(context).copyWith(
                    size: const Size(390, 844),
                    padding: const EdgeInsets.only(top: 44),
                  ),
                  child: child!,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

enum AppFlow { auth, onboarding, location, doctorSelection, main }

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  AppFlow _flow = AppFlow.auth;
  int _currentTab = 0;

  /// Called by notification tap handler to navigate to check-in screen
  void switchToCheckin() {
    if (_flow == AppFlow.main) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => CheckinScreen(
            onComplete: () => Navigator.pop(context),
            onPatientDataUpdate: (data) {
              setState(() => _lastPatientData = data);
            },
          ),
        ),
      );
    }
  }

  String _userName = 'Sara Ahmed';

  bool _showMessage = false;

  // Track more menu selection
  String? _moreMenuSelection; // 'medications', 'doctor', or 'profile'

  // Last check-in data (used by HomeScreen for predictions)
  Map<String, dynamic> _lastPatientData = {
    'wheezing': 0,
    'coughing': 0,
    'chest_tightness': 0,
    'inhaler_usage': 2,
    'breathing_difficulty': 0,
    'medication_adherence': 1,
    'past_attacks': 0,
    'lung_function_fev1': 0.8,
    'lung_function_fvc': 1.0,
    'bmi': 24.0,
    'smoking': 0,
    'physical_activity': 3.0,
    'family_history_asthma': 0,
    'history_of_allergies': 0,
    'hay_fever': 0,
    'eczema': 0,
    'dust_exposure': 0.5,
  };

  final List<Map<String, dynamic>> _tabs = [
    {'icon': Icons.home_rounded, 'label': 'Home'},
    {'icon': Icons.local_activity_outlined, 'label': 'Activities'},
    {'icon': Icons.insights_rounded, 'label': 'Insights'},
    {'icon': Icons.notifications_outlined, 'label': 'Notifications'},
  ];

  void _onAuthComplete() {
    setState(() => _flow = AppFlow.onboarding);
  }

  void _onOnboardingComplete() {
    setState(() => _flow = AppFlow.location);
  }

  void _onLocationAllow() {
    setState(() => _flow = AppFlow.doctorSelection);
  }

  void _onLocationDeny() {
    setState(() => _flow = AppFlow.doctorSelection);
  }

  void _onDoctorSelected(Doctor doctor) {
    setState(() => _flow = AppFlow.main);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Welcome! ${doctor.name} is now your doctor'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _logout() {
    setState(() {
      _flow = AppFlow.auth;
      _currentTab = 0;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Signed out successfully'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgColor(context),
      body: Stack(
        children: [
          _buildCurrentFlow(),

          if (_showMessage)
            MessageModal(onClose: () => setState(() => _showMessage = false)),
        ],
      ),
      bottomNavigationBar: _flow == AppFlow.main ? _buildBottomNav() : null,
    );
  }

  Widget _buildCurrentFlow() {
    switch (_flow) {
      case AppFlow.auth:
        return AuthScreen(
          onAuthComplete: _onAuthComplete,
          onNameSet: (name) => setState(() => _userName = name),
        );
      case AppFlow.onboarding:
        return OnboardingScreen(
          onComplete: _onOnboardingComplete,
          onNameSet: (name) => setState(() => _userName = name),
          onSkip: () => setState(() => _flow = AppFlow.main),
        );
      case AppFlow.location:
        return LocationPermissionScreen(
          onAllow: _onLocationAllow,
          onDeny: _onLocationDeny,
        );
      case AppFlow.doctorSelection:
        return DoctorSelectionScreen(onDoctorSelected: _onDoctorSelected);
      case AppFlow.main:
        return _buildMainPages();
    }
  }

  Widget _buildMainPages() {
    // Handle more menu selection
    if (_moreMenuSelection == 'medications') {
      return const MedicationsScreen();
    } else if (_moreMenuSelection == 'doctor') {
      return DoctorDetailScreen(
        onMessageTap: () => setState(() => _showMessage = true),
      );
    } else if (_moreMenuSelection == 'profile') {
      return ProfileScreen(userName: _userName, onLogout: _logout);
    }

    // Default: show tab screen
    return IndexedStack(
      index: _currentTab,
      children: [
        HomeScreen(
          userName: _userName,
          patientData: _lastPatientData,
          onCheckinTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => CheckinScreen(
                  onComplete: () => Navigator.pop(context),
                  onPatientDataUpdate: (data) {
                    setState(() => _lastPatientData = data);
                  },
                ),
              ),
            );
          },
        ),
        const ActivitiesScreen(),
        const HistoryScreen(),
        NotificationsScreen(
          onCheckinTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) => CheckinScreen(
                  onComplete: () => Navigator.pop(context),
                  onPatientDataUpdate: (data) {
                    setState(() => _lastPatientData = data);
                  },
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildBottomNav() {
    return Builder(
      builder: (context) {
        final isDark = Theme.of(context).brightness == Brightness.dark;
        final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
        final primary = isDark ? AppColors.primaryDark : AppColors.primary;
        final border = isDark ? AppColors.borderDark : AppColors.border;
        final textMuted = isDark
            ? AppColors.textMutedDark
            : AppColors.textMuted;

        return Container(
          height: 80,
          decoration: BoxDecoration(
            color: surface,
            border: Border(top: BorderSide(color: border)),
            boxShadow: [
              BoxShadow(
                color: primary.withValues(alpha: 0.08),
                blurRadius: 20,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            top: false,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                // Main tabs
                ...List.generate(_tabs.length, (i) {
                  final isActive =
                      i == _currentTab && _moreMenuSelection == null;
                  final tab = _tabs[i];
                  return GestureDetector(
                    onTap: () => setState(() {
                      _currentTab = i;
                      _moreMenuSelection = null;
                    }),
                    behavior: HitTestBehavior.opaque,
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(16),
                        color: isActive
                            ? primary.withOpacity(0.12)
                            : Colors.transparent,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          AnimatedScale(
                            scale: isActive ? 1.15 : 1.0,
                            duration: const Duration(milliseconds: 200),
                            child: Icon(
                              tab['icon'] as IconData,
                              size: 24,
                              color: isActive ? primary : textMuted,
                            ),
                          ),
                          const SizedBox(height: 3),
                          Text(
                            tab['label'] as String,
                            style: GoogleFonts.nunito(
                              fontSize: 9,
                              fontWeight: FontWeight.w700,
                              color: isActive
                                  ? primary
                                  : AppColors.textDimColor(context),
                              letterSpacing: 0.2,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
                // More menu (3 dots)
                GestureDetector(
                  onTap: () => _showMoreMenu(context),
                  behavior: HitTestBehavior.opaque,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(16),
                      color: _moreMenuSelection != null
                          ? primary.withOpacity(0.12)
                          : Colors.transparent,
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        AnimatedScale(
                          scale: _moreMenuSelection != null ? 1.15 : 1.0,
                          duration: const Duration(milliseconds: 200),
                          child: Icon(
                            Icons.more_vert_rounded,
                            size: 24,
                            color: _moreMenuSelection != null
                                ? primary
                                : textMuted,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          'More',
                          style: GoogleFonts.nunito(
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            color: _moreMenuSelection != null
                                ? primary
                                : AppColors.textDimColor(context),
                            letterSpacing: 0.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showMoreMenu(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Container(
          decoration: BoxDecoration(
            color: isDark ? AppColors.surfaceDark : AppColors.surface,
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(24),
              topRight: Radius.circular(24),
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(0, 12, 0, 8),
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: isDark
                        ? AppColors.textMutedDark.withValues(alpha: 0.2)
                        : AppColors.textMuted.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              // Add Medications
              _buildMoreMenuItem(
                context,
                icon: Icons.medication_outlined,
                label: 'Add Medications',
                onTap: () {
                  Navigator.pop(context);
                  setState(() {
                    _moreMenuSelection = 'medications';
                  });
                },
              ),
              // Contact Doctor
              _buildMoreMenuItem(
                context,
                icon: Icons.message_rounded,
                label: 'Contact Doctor',
                onTap: () {
                  Navigator.pop(context);
                  setState(() {
                    _moreMenuSelection = 'doctor';
                  });
                },
              ),
              // Profile
              _buildMoreMenuItem(
                context,
                icon: Icons.person_rounded,
                label: 'My Profile',
                onTap: () {
                  Navigator.pop(context);
                  setState(() {
                    _moreMenuSelection = 'profile';
                  });
                },
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  Widget _buildMoreMenuItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: primary.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: border, width: 0.5),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: primary.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: primary, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: isDark ? AppColors.textDark : AppColors.text,
                ),
              ),
            ),
            Icon(Icons.arrow_forward_rounded, color: primary, size: 20),
          ],
        ),
      ),
    );
  }
}
