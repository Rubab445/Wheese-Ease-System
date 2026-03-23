import 'package:flutter/foundation.dart'
    show TargetPlatform, defaultTargetPlatform, kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'theme/app_colors.dart';
import 'theme/app_theme.dart';
import 'models/doctor.dart';
import 'screens/onboarding_screen.dart';
import 'screens/location_permission_screen.dart';
import 'screens/doctor_selection_screen.dart';
import 'screens/home_screen.dart';
import 'screens/checkin_screen.dart';
import 'screens/history_screen.dart';
import 'screens/medications_screen.dart';
import 'screens/doctor_detail_screen.dart';
import 'screens/profile_screen.dart';
import 'widgets/sos_modal.dart';
import 'widgets/message_modal.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([DeviceOrientation.portraitUp]);
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
      home: const AppShell(),
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

enum AppFlow { onboarding, location, doctorSelection, main }

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  AppFlow _flow = AppFlow.onboarding;
  int _currentTab = 0;
  String _userName = 'Sara Ahmed';
  bool _showSos = false;
  bool _showMessage = false;

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
    {'icon': Icons.add_circle_outline, 'label': 'Check-In'},
    {'icon': Icons.show_chart_rounded, 'label': 'History'},
    {'icon': Icons.medication_outlined, 'label': 'Meds'},
    {'icon': Icons.medical_services_outlined, 'label': 'Doctor'},
    {'icon': Icons.person_outline_rounded, 'label': 'Profile'},
  ];

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
      _flow = AppFlow.onboarding;
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

          if (_flow == AppFlow.main && !_showSos)
            Positioned(
              bottom: 104,
              right: 16,
              child: GestureDetector(
                onTap: () => setState(() => _showSos = true),
                child: Container(
                  width: 54,
                  height: 54,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(17),
                    color: AppColors.red,
                    boxShadow: [
                      BoxShadow(
                        color: AppColors.red.withValues(alpha: 0.45),
                        blurRadius: 20,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      'SOS',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 0.3,
                      ),
                    ),
                  ),
                ),
              ),
            ),

          if (_showSos)
            SosModal(onClose: () => setState(() => _showSos = false)),

          if (_showMessage)
            MessageModal(onClose: () => setState(() => _showMessage = false)),
        ],
      ),
      bottomNavigationBar: _flow == AppFlow.main ? _buildBottomNav() : null,
    );
  }

  Widget _buildCurrentFlow() {
    switch (_flow) {
      case AppFlow.onboarding:
        return OnboardingScreen(
          onComplete: _onOnboardingComplete,
          onNameSet: (name) => setState(() => _userName = name),
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
    return IndexedStack(
      index: _currentTab,
      children: [
        HomeScreen(
          userName: _userName,
          patientData: _lastPatientData,
          onCheckinTap: () => setState(() => _currentTab = 1),
        ),
        CheckinScreen(
          onComplete: () => setState(() => _currentTab = 0),
          onPatientDataUpdate: (data) {
            setState(() => _lastPatientData = data);
          },
        ),
        const HistoryScreen(),
        const MedicationsScreen(),
        DoctorDetailScreen(
          onMessageTap: () => setState(() => _showMessage = true),
        ),
        ProfileScreen(userName: _userName, onLogout: _logout),
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
              children: List.generate(_tabs.length, (i) {
                final isActive = i == _currentTab;
                final tab = _tabs[i];
                return GestureDetector(
                  onTap: () => setState(() => _currentTab = i),
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
                        Stack(
                          clipBehavior: Clip.none,
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
                            if (i == 3)
                              Positioned(
                                top: -4,
                                right: -8,
                                child: Container(
                                  width: 15,
                                  height: 15,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: AppColors.red,
                                    border: Border.all(
                                      color: surface,
                                      width: 2,
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '1',
                                      style: GoogleFonts.nunito(
                                        fontSize: 8,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                          ],
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
            ),
          ),
        );
      },
    );
  }
}
