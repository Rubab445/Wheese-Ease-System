import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class ProfileScreen extends StatefulWidget {
  final String userName;
  final VoidCallback onLogout;

  const ProfileScreen({
    super.key,
    required this.userName,
    required this.onLogout,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final Map<String, bool> _toggles = {
    'high_risk': true,
    'mod_risk': true,
    'med_remind': true,
    'checkin_remind': true,
    'aqi_weather': false,
  };

  void _showToast(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(msg), behavior: SnackBarBehavior.floating),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final textDim = isDark ? AppColors.textDimDark : AppColors.textDim;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    final initials = widget.userName
        .split(' ')
        .map((w) => w.isNotEmpty ? w[0] : '')
        .take(2)
        .join()
        .toUpperCase();

    return SingleChildScrollView(
      child: Column(
        children: [
          // Header
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 22,
              left: 22,
              right: 22,
              bottom: 28,
            ),
            decoration: BoxDecoration(
              gradient: isDark
                  ? AppColors.primaryGradientDark
                  : AppColors.primaryGradient,
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(34),
                bottomRight: Radius.circular(34),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'My Profile',
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'Settings & preferences',
                      style: GoogleFonts.nunito(
                        fontSize: 12,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
                Icon(
                  Icons.person_outline_rounded,
                  size: 28,
                  color: Colors.white,
                ),
              ],
            ),
          ),

          // Avatar
          const SizedBox(height: 18),
          Container(
            width: 74,
            height: 74,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              gradient: isDark
                  ? AppColors.primaryGradientDark
                  : AppColors.primaryGradient,
              boxShadow: [
                BoxShadow(
                  color: primary.withValues(alpha: 0.3),
                  blurRadius: 22,
                  offset: const Offset(0, 8),
                ),
              ],
              border: Border.all(color: surface, width: 3),
            ),
            child: Center(
              child: Text(
                initials,
                style: GoogleFonts.nunito(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            widget.userName,
            style: GoogleFonts.playfairDisplay(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: text,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 7,
                height: 7,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.red,
                ),
              ),
              const SizedBox(width: 7),
              Text(
                'High Risk · Asthma + Dust Allergy',
                style: GoogleFonts.nunito(
                  fontSize: 12,
                  color: AppColors.red,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),

          // Health info
          _sectionLabel('Health Information', textMuted),
          _settingsList(surface, border, isDark, [
            _settingsItem(Icons.local_hospital_outlined, AppColors.blueDim, 'Conditions', 'Asthma, Dust Allergy',
                text, textMuted, textDim, border, primary, onTap: () {}),
            _settingsItem(Icons.medication_outlined, primary.withOpacity(0.12), 'Medications', 'Salbutamol, Fluticasone, Cetirizine',
                text, textMuted, textDim, border, primary, onTap: () {}),
            _settingsItem(Icons.warning_amber_rounded, AppColors.yellowDim, 'Known Triggers', 'Dust, Pollen, Cold air',
                text, textMuted, textDim, border, AppColors.yellow, onTap: () {}),
            _settingsItem(Icons.phone_outlined, AppColors.redDim, 'Emergency Contact', '+92 300 9876543',
                text, textMuted, textDim, border, AppColors.red, onTap: () {}),
          ]),

          // Notifications
          _sectionLabel('Notifications', textMuted),
          _settingsList(surface, border, isDark, [
            _toggleItem(Icons.error_outline, AppColors.redDim, 'High Risk Alerts', 'Immediate push notification',
                'high_risk', text, textMuted, border, primary, AppColors.red),
            _toggleItem(Icons.warning_amber_rounded, AppColors.yellowDim, 'Moderate Risk Alerts', 'Notify when risk 31–60%',
                'mod_risk', text, textMuted, border, primary, AppColors.yellow),
            _toggleItem(Icons.medication_outlined, primary.withOpacity(0.12), 'Medication Reminders', 'Daily dose alerts',
                'med_remind', text, textMuted, border, primary, primary),
            _toggleItem(Icons.assignment_outlined, AppColors.greenDim, 'Check-In Reminders', 'Daily at 9:00 AM',
                'checkin_remind', text, textMuted, border, primary, AppColors.green),
            _toggleItem(Icons.wb_sunny_outlined, AppColors.blueDim, 'AQI & Weather Alerts', 'When AQI exceeds 100',
                'aqi_weather', text, textMuted, border, primary, AppColors.blue),
          ]),

          // App settings
          _sectionLabel('App Settings', textMuted),
          _settingsList(surface, border, isDark, [
            _settingsItem(Icons.language_outlined, AppColors.blueDim, 'Language', 'English',
                text, textMuted, textDim, border, AppColors.blue,
                onTap: () => _showToast('Language: English')),
            _settingsItem(Icons.location_on_outlined, AppColors.greenDim, 'Location Access', 'Enabled — Gujranwala, PK',
                text, textMuted, textDim, border, AppColors.green,
                onTap: () => _showToast('Location: Gujranwala, PK')),
            _settingsItem(Icons.assessment_outlined, primary.withOpacity(0.12), 'Export Health Report', 'PDF for your doctor',
                text, textMuted, textDim, border, primary,
                onTap: () => _showToast('Exporting health report...')),
            _settingsItem(Icons.logout_outlined, AppColors.redDim, 'Sign Out', widget.userName,
                text, textMuted, textDim, border, AppColors.red,
                onTap: widget.onLogout, isDestructive: true),
          ]),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _sectionLabel(String text, Color muted) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(21, 20, 18, 9),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: GoogleFonts.nunito(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: muted,
            letterSpacing: 0.8,
          ),
        ),
      ),
    );
  }

  Widget _settingsList(Color surface, Color border, bool isDark, List<Widget> items) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05),
            blurRadius: 24,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(children: items),
    );
  }

  Widget _settingsItem(
    IconData icon,
    Color iconBg,
    String title,
    String subtitle,
    Color text,
    Color muted,
    Color dim,
    Color border,
    Color iconColor, {
    VoidCallback? onTap,
    bool isDestructive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: border)),
        ),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                color: iconBg,
              ),
              child: Center(
                child: Icon(icon, size: 17, color: isDestructive ? AppColors.red : iconColor),
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
                      fontWeight: FontWeight.w700,
                      color: isDestructive ? AppColors.red : text,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      color: muted,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '›',
              style: GoogleFonts.nunito(
                fontSize: 15,
                color: isDestructive ? AppColors.red : dim,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _toggleItem(
    IconData icon,
    Color iconBg,
    String title,
    String subtitle,
    String key,
    Color text,
    Color muted,
    Color border,
    Color primary,
    Color iconColor,
  ) {
    final isOn = _toggles[key] ?? false;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: border)),
      ),
      child: Row(
        children: [
          Container(
            width: 34,
            height: 34,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              color: iconBg,
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
                    fontWeight: FontWeight.w700,
                    color: text,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    color: muted,
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: () => setState(() => _toggles[key] = !isOn),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              width: 48,
              height: 28,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(14),
                color: isOn ? primary : border,
              ),
              child: AnimatedAlign(
                duration: const Duration(milliseconds: 250),
                alignment: isOn ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.all(3),
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: Colors.white,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.15),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
