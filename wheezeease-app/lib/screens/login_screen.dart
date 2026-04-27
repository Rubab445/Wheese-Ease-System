import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

/// Login screen using the app's existing teal/green theme.
/// Email/password fields first, then social logins below "Or" divider.
/// Frontend only — no backend.
class LoginScreen extends StatefulWidget {
  final VoidCallback onLogin;
  final VoidCallback onCreateAccount;

  const LoginScreen({
    super.key,
    required this.onLogin,
    required this.onCreateAccount,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen>
    with SingleTickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  late AnimationController _fadeCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _fadeCtrl.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _fadeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = AppColors.primaryColor(context);
    final surface = AppColors.surfaceColor(context);
    final border = AppColors.borderColor(context);

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
                colors: [Color(0xFFE8F4FF), Color(0xFFF5F0FF)],
              ),
      ),
      child: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnim,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              children: [
                const SizedBox(height: 16),

                // ── Logo ──
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(14),
                        gradient: isDark
                            ? AppColors.primaryGradientDark
                            : AppColors.primaryGradient,
                        boxShadow: [
                          BoxShadow(
                            color: primary.withValues(alpha: 0.35),
                            blurRadius: 16,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(Icons.air_rounded,
                            color: Colors.white, size: 20),
                      ),
                    ),
                    const SizedBox(width: 10),
                    RichText(
                      text: TextSpan(
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textColor(context),
                        ),
                        children: [
                          const TextSpan(text: 'Wheeze'),
                          TextSpan(
                            text: 'Ease',
                            style: TextStyle(color: primary),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 28),

                // ── Title ──
                Text(
                  "Let's Login you in",
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 25,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textColor(context),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Log in to pick up where you left off. Your health\ndata, streaks, and progress are waiting for you.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    color: AppColors.textMutedColor(context),
                    height: 1.6,
                  ),
                ),
                const SizedBox(height: 28),

                // ── Email field ──
                _buildLabel('EMAIL'),
                _buildTextField(
                  controller: _emailController,
                  hint: 'e.g. sara@email.com',
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  surface: surface,
                  border: border,
                ),
                const SizedBox(height: 14),

                // ── Password field ──
                _buildLabel('PASSWORD'),
                _buildTextField(
                  controller: _passwordController,
                  hint: 'Enter your password',
                  icon: Icons.lock_outline_rounded,
                  obscure: _obscurePassword,
                  onToggleObscure: () =>
                      setState(() => _obscurePassword = !_obscurePassword),
                  surface: surface,
                  border: border,
                ),
                const SizedBox(height: 8),

                // ── Forgot password ──
                Align(
                  alignment: Alignment.centerRight,
                  child: TextButton(
                    onPressed: () {},
                    style: TextButton.styleFrom(
                      padding: EdgeInsets.zero,
                      minimumSize: const Size(0, 30),
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                    ),
                    child: Text(
                      'Forgot Password?',
                      style: GoogleFonts.nunito(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: primary,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // ── Login with Email button ──
                GestureDetector(
                  onTap: widget.onLogin,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(18),
                      gradient: isDark
                          ? AppColors.primaryGradientDark
                          : AppColors.primaryGradient,
                      boxShadow: [
                        BoxShadow(
                          color: primary.withOpacity(0.3),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: Center(
                      child: Text(
                        'Login with Email',
                        style: GoogleFonts.nunito(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          letterSpacing: 0.3,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 22),

                // ── "Or" divider ──
                Row(
                  children: [
                    Expanded(child: Container(height: 1, color: border)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Or continue with',
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: AppColors.textMutedColor(context),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    Expanded(child: Container(height: 1, color: border)),
                  ],
                ),
                const SizedBox(height: 18),

                // ── Social login buttons (Google + Facebook) ──
                Row(
                  children: [
                    Expanded(
                      child: _socialButton(
                        context,
                        icon: Icons.g_mobiledata_rounded,
                        iconColor: const Color(0xFFEA4335),
                        label: 'Google',
                        surface: surface,
                        border: border,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _socialButton(
                        context,
                        icon: Icons.facebook_rounded,
                        iconColor: const Color(0xFF1877F2),
                        label: 'Facebook',
                        surface: surface,
                        border: border,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 28),

                // ── Create account link ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have an account? ",
                      style: GoogleFonts.nunito(
                        fontSize: 14,
                        color: AppColors.textMutedColor(context),
                      ),
                    ),
                    GestureDetector(
                      onTap: widget.onCreateAccount,
                      child: Text(
                        'Create An account',
                        style: GoogleFonts.nunito(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: primary,
                          decoration: TextDecoration.underline,
                          decorationColor: primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          text,
          style: GoogleFonts.nunito(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: AppColors.textMutedColor(context),
            letterSpacing: 0.7,
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    required Color surface,
    required Color border,
    TextInputType? keyboardType,
    bool obscure = false,
    VoidCallback? onToggleObscure,
  }) {
    final primary = AppColors.primaryColor(context);

    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscure,
      style: GoogleFonts.nunito(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textColor(context),
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.nunito(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: AppColors.textDimColor(context),
        ),
        prefixIcon:
            Icon(icon, color: AppColors.textDimColor(context), size: 20),
        suffixIcon: onToggleObscure != null
            ? GestureDetector(
                onTap: onToggleObscure,
                child: Icon(
                  obscure
                      ? Icons.visibility_off_outlined
                      : Icons.visibility_outlined,
                  color: AppColors.textDimColor(context),
                  size: 20,
                ),
              )
            : null,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        filled: true,
        fillColor: surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: border, width: 2),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: border, width: 2),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: primary, width: 2),
        ),
      ),
    );
  }

  Widget _socialButton(
    BuildContext context, {
    required IconData icon,
    required Color iconColor,
    required String label,
    required Color surface,
    required Color border,
  }) {
    return GestureDetector(
      onTap: widget.onLogin,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: surface,
          border: Border.all(color: border, width: 2),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: iconColor, size: 24),
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 14,
                fontWeight: FontWeight.w700,
                color: AppColors.textColor(context),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
