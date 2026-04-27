import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

/// Sign-up / Create Account screen using the app's existing theme.
/// Frontend only — no backend.
class SignupScreen extends StatefulWidget {
  final VoidCallback onSignup;
  final VoidCallback onBackToLogin;

  const SignupScreen({
    super.key,
    required this.onSignup,
    required this.onBackToLogin,
  });

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen>
    with SingleTickerProviderStateMixin {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _agreeTerms = false;

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
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),

                // ── Back button ──
                GestureDetector(
                  onTap: widget.onBackToLogin,
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: surface,
                      border: Border.all(color: border, width: 2),
                    ),
                    child: Icon(
                      Icons.arrow_back_rounded,
                      color: AppColors.textColor(context),
                      size: 20,
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // ── Title ──
                Center(
                  child: Column(
                    children: [
                      Text(
                        'Create An Account',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 25,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textColor(context),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Create an account to set goals, track your\nprogress, and stay motivated every step of the way.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          color: AppColors.textMutedColor(context),
                          height: 1.6,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // ── Form fields ──
                _buildLabel('YOUR FULL NAME'),
                _buildField(
                  controller: _nameController,
                  hint: 'e.g. Sara Ahmed',
                  icon: Icons.person_outline_rounded,
                  surface: surface,
                  border: border,
                ),
                const SizedBox(height: 14),

                _buildLabel('EMAIL'),
                _buildField(
                  controller: _emailController,
                  hint: 'e.g. sara@email.com',
                  icon: Icons.email_outlined,
                  keyboardType: TextInputType.emailAddress,
                  surface: surface,
                  border: border,
                ),
                const SizedBox(height: 14),

                _buildLabel('PASSWORD'),
                _buildField(
                  controller: _passwordController,
                  hint: 'Enter password',
                  icon: Icons.lock_outline_rounded,
                  obscure: _obscurePassword,
                  onToggleObscure: () =>
                      setState(() => _obscurePassword = !_obscurePassword),
                  surface: surface,
                  border: border,
                ),
                const SizedBox(height: 14),

                _buildLabel('CONFIRM PASSWORD'),
                _buildField(
                  controller: _confirmPasswordController,
                  hint: 'Re-enter password',
                  icon: Icons.lock_outline_rounded,
                  obscure: _obscureConfirm,
                  onToggleObscure: () =>
                      setState(() => _obscureConfirm = !_obscureConfirm),
                  surface: surface,
                  border: border,
                ),
                const SizedBox(height: 18),

                // ── Terms checkbox ──
                GestureDetector(
                  onTap: () => setState(() => _agreeTerms = !_agreeTerms),
                  child: Row(
                    children: [
                      AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        width: 22,
                        height: 22,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(6),
                          color: _agreeTerms
                              ? primary
                              : Colors.transparent,
                          border: Border.all(
                            color: _agreeTerms ? primary : border,
                            width: 2,
                          ),
                        ),
                        child: _agreeTerms
                            ? const Icon(Icons.check,
                                size: 14, color: Colors.white)
                            : null,
                      ),
                      const SizedBox(width: 10),
                      RichText(
                        text: TextSpan(
                          style: GoogleFonts.nunito(
                            fontSize: 13,
                            color: AppColors.textMutedColor(context),
                          ),
                          children: [
                            const TextSpan(text: 'I agree to the '),
                            TextSpan(
                              text: 'Terms & Condition',
                              style: GoogleFonts.nunito(
                                fontWeight: FontWeight.w700,
                                color: primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 22),

                // ── Create Account button ──
                GestureDetector(
                  onTap: widget.onSignup,
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
                        'Create an Account',
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

                // ── Or Login with ──
                Center(
                  child: Text(
                    'Or Login with',
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      color: AppColors.textMutedColor(context),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(height: 14),

                // ── Social icons ──
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _socialIcon(
                      Icons.g_mobiledata_rounded,
                      const Color(0xFFEA4335),
                      surface,
                      border,
                    ),
                    const SizedBox(width: 14),
                    _socialIcon(
                      Icons.facebook_rounded,
                      const Color(0xFF1877F2),
                      surface,
                      border,
                    ),
                  ],
                ),
                const SizedBox(height: 22),

                // ── Already have account? ──
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Already have an account? ',
                        style: GoogleFonts.nunito(
                          fontSize: 14,
                          color: AppColors.textMutedColor(context),
                        ),
                      ),
                      GestureDetector(
                        onTap: widget.onBackToLogin,
                        child: Text(
                          'Login',
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
      child: Text(
        text,
        style: GoogleFonts.nunito(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: AppColors.textMutedColor(context),
          letterSpacing: 0.7,
        ),
      ),
    );
  }

  Widget _buildField({
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
        prefixIcon: Icon(icon, color: AppColors.textDimColor(context), size: 20),
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
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
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

  Widget _socialIcon(
    IconData icon,
    Color color,
    Color surface,
    Color border,
  ) {
    return GestureDetector(
      onTap: widget.onSignup,
      child: Container(
        width: 56,
        height: 56,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: surface,
          border: Border.all(color: border, width: 2),
        ),
        child: Icon(icon, size: 24, color: color),
      ),
    );
  }
}
