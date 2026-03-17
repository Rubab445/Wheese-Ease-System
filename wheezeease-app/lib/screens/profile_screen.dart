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
            decoration: const BoxDecoration(
              gradient: AppColors.redOrangeGradient,
              borderRadius: BorderRadius.only(
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
                const Text('👤', style: TextStyle(fontSize: 34)),
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
              gradient: AppColors.bluePurple,
              boxShadow: [
                BoxShadow(
                  color: AppColors.blue.withValues(alpha: 0.3),
                  blurRadius: 22,
                  offset: const Offset(0, 8),
                ),
              ],
              border: Border.all(color: AppColors.surface, width: 3),
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
              color: AppColors.text,
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
          _sectionLabel('Health Information'),
          _settingsList([
            _settingsItem(
              '🏥',
              AppColors.blueDim,
              'Conditions',
              'Asthma, Dust Allergy',
              onTap: () {},
            ),
            _settingsItem(
              '💊',
              AppColors.purpleDim,
              'Medications',
              'Salbutamol, Fluticasone, Cetirizine',
              onTap: () {},
            ),
            _settingsItem(
              '⚠️',
              AppColors.yellowDim,
              'Known Triggers',
              'Dust, Pollen, Cold air',
              onTap: () {},
            ),
            _settingsItem(
              '📞',
              AppColors.redDim,
              'Emergency Contact',
              '+92 300 9876543',
              onTap: () {},
            ),
          ]),

          // Notifications
          _sectionLabel('Notifications'),
          _settingsList([
            _toggleItem(
              '🚨',
              AppColors.redDim,
              'High Risk Alerts',
              'Immediate push notification',
              'high_risk',
            ),
            _toggleItem(
              '⚠️',
              AppColors.yellowDim,
              'Moderate Risk Alerts',
              'Notify when risk 31–60%',
              'mod_risk',
            ),
            _toggleItem(
              '💊',
              AppColors.purpleDim,
              'Medication Reminders',
              'Daily dose alerts',
              'med_remind',
            ),
            _toggleItem(
              '📋',
              AppColors.greenDim,
              'Check-In Reminders',
              'Daily at 9:00 AM',
              'checkin_remind',
            ),
            _toggleItem(
              '🌤️',
              AppColors.blueDim,
              'AQI & Weather Alerts',
              'When AQI exceeds 100',
              'aqi_weather',
            ),
          ]),

          // App settings
          _sectionLabel('App Settings'),
          _settingsList([
            _settingsItem(
              '🌍',
              AppColors.blueDim,
              'Language',
              'English',
              onTap: () => _showToast('🌍 Language: English'),
            ),
            _settingsItem(
              '📍',
              AppColors.greenDim,
              'Location Access',
              'Enabled — Gujranwala, PK',
              onTap: () => _showToast('📍 Location: Gujranwala, PK'),
            ),
            _settingsItem(
              '📊',
              AppColors.purpleDim,
              'Export Health Report',
              'PDF for your doctor',
              onTap: () => _showToast('📊 Exporting health report...'),
            ),
            _settingsItem(
              '🚪',
              AppColors.redDim,
              'Sign Out',
              widget.userName,
              onTap: widget.onLogout,
              isDestructive: true,
            ),
          ]),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _sectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(21, 20, 18, 9),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: GoogleFonts.nunito(
            fontSize: 11,
            fontWeight: FontWeight.w800,
            color: AppColors.textMuted,
            letterSpacing: 0.8,
          ),
        ),
      ),
    );
  }

  Widget _settingsList(List<Widget> items) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(children: items),
    );
  }

  Widget _settingsItem(
    String icon,
    Color iconBg,
    String title,
    String subtitle, {
    VoidCallback? onTap,
    bool isDestructive = false,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          border: Border(bottom: BorderSide(color: AppColors.border)),
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
                child: Text(icon, style: const TextStyle(fontSize: 17)),
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
                      color: isDestructive ? AppColors.red : AppColors.text,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              '›',
              style: GoogleFonts.nunito(
                fontSize: 15,
                color: isDestructive ? AppColors.red : AppColors.textDim,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _toggleItem(
    String icon,
    Color iconBg,
    String title,
    String subtitle,
    String key,
  ) {
    final isOn = _toggles[key] ?? false;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        border: Border(bottom: BorderSide(color: AppColors.border)),
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
              child: Text(icon, style: const TextStyle(fontSize: 17)),
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
                    color: AppColors.text,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    color: AppColors.textMuted,
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
                color: isOn ? AppColors.green : AppColors.border,
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
