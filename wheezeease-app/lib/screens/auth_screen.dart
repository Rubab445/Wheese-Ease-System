import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

enum AuthPage { welcome, login, signup }

class AuthScreen extends StatefulWidget {
  final VoidCallback onAuthComplete;
  final Function(String) onNameSet;

  const AuthScreen({
    super.key,
    required this.onAuthComplete,
    required this.onNameSet,
  });

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen>
    with SingleTickerProviderStateMixin {
  AuthPage _currentPage = AuthPage.welcome;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _agreeToTerms = false;

  // Login controllers
  final _loginEmailController = TextEditingController();
  final _loginPasswordController = TextEditingController();

  // Sign up controllers
  final _signupNameController = TextEditingController();
  final _signupEmailController = TextEditingController();
  final _signupPasswordController = TextEditingController();
  final _signupConfirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _loginEmailController.dispose();
    _loginPasswordController.dispose();
    _signupNameController.dispose();
    _signupEmailController.dispose();
    _signupPasswordController.dispose();
    _signupConfirmPasswordController.dispose();
    super.dispose();
  }

  void _navigateTo(AuthPage page) {
    setState(() => _currentPage = page);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            const Color(0xFFE8F6F3),
            const Color(0xFFF0F8FF),
            const Color(0xFFEEF9F6),
          ],
        ),
      ),
      child: SafeArea(
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 400),
          transitionBuilder: (child, animation) {
            return FadeTransition(opacity: animation, child: child);
          },
          child: _buildCurrentPage(),
        ),
      ),
    );
  }

  Widget _buildCurrentPage() {
    switch (_currentPage) {
      case AuthPage.welcome:
        return _buildWelcomePage();
      case AuthPage.login:
        return _buildLoginPage();
      case AuthPage.signup:
        return _buildSignupPage();
    }
  }

  // ══════════════════════════════════════════
  // WELCOME PAGE
  // ══════════════════════════════════════════
  Widget _buildWelcomePage() {
    final primary = AppColors.primaryColor(context);

    return SingleChildScrollView(
      key: const ValueKey('welcome'),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // Logo
            Image.asset(
              'images/logo.png',
              height: 60,
              width: 60,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 24),

            // Illustration area
            Center(
              child: Container(
                width: double.infinity,
                height: 340,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      const Color(0xFF1A7A6D).withOpacity(0.15),
                      const Color(0xFF5DC0B5).withOpacity(0.08),
                      Colors.transparent,
                    ],
                  ),
                ),
                child: Image.asset('images/welcome.png', fit: BoxFit.contain),
              ),
            ),
            const SizedBox(height: 16),

            // Page indicator dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildDot(isActive: true),
                const SizedBox(width: 8),
                _buildDot(isActive: false),
                const SizedBox(width: 8),
                _buildDot(isActive: false),
              ],
            ),
            const SizedBox(height: 24),

            // Title text
            Center(
              child: Text(
                'Breathe easier, live better',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textColor(context),
                ),
              ),
            ),
            const SizedBox(height: 10),
            Center(
              child: Text(
                'AI-powered asthma tracking built\naround your life',
                textAlign: TextAlign.center,
                style: GoogleFonts.nunito(
                  fontSize: 14,
                  color: AppColors.textMutedColor(context),
                  height: 1.6,
                ),
              ),
            ),
            const SizedBox(height: 40),

            // Get Started button
            _buildPrimaryButton('Get Started', () {
              _navigateTo(AuthPage.signup);
            }),
            const SizedBox(height: 16),

            // Already have an account
            Center(
              child: GestureDetector(
                onTap: () => _navigateTo(AuthPage.login),
                child: Text(
                  'I already have an account',
                  style: GoogleFonts.nunito(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: primary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  // ══════════════════════════════════════════
  // LOGIN PAGE
  // ══════════════════════════════════════════
  Widget _buildLoginPage() {
    final primary = AppColors.primaryColor(context);

    return SingleChildScrollView(
      key: const ValueKey('login'),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // Logo
            Image.asset(
              'images/logo.png',
              height: 50,
              width: 50,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 32),

            // Welcome back
            Center(
              child: Column(
                children: [
                  Text(
                    'Welcome back',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textColor(context),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Breathe easy. Your personal respiratory\nassistant is ready to help.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      color: AppColors.textMutedColor(context),
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),

            // Form card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF006B5E).withOpacity(0.06),
                    blurRadius: 20,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Email
                  _buildFieldLabel('Email Address'),
                  const SizedBox(height: 6),
                  _buildAuthTextField(
                    controller: _loginEmailController,
                    hint: 'name@example.com',
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 18),

                  // Password
                  _buildFieldLabel('Password'),
                  const SizedBox(height: 6),
                  _buildAuthTextField(
                    controller: _loginPasswordController,
                    hint: '••••••••',
                    prefixIcon: Icons.lock_outline_rounded,
                    obscureText: _obscurePassword,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: AppColors.textMutedColor(context),
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() => _obscurePassword = !_obscurePassword);
                      },
                    ),
                  ),
                  const SizedBox(height: 10),

                  // Forgot password
                  Align(
                    alignment: Alignment.centerRight,
                    child: GestureDetector(
                      onTap: () {},
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
                  const SizedBox(height: 20),

                  // Login button
                  _buildPrimaryButton('Login', () {
                    widget.onNameSet('User');
                    widget.onAuthComplete();
                  }),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // OR CONTINUE WITH divider
            Row(
              children: [
                Expanded(child: Divider(color: AppColors.borderColor(context))),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: Text(
                    'OR CONTINUE WITH',
                    style: GoogleFonts.nunito(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textMutedColor(context),
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
                Expanded(child: Divider(color: AppColors.borderColor(context))),
              ],
            ),
            const SizedBox(height: 16),

            // Social buttons
            Row(
              children: [
                Expanded(
                  child: _buildSocialButton(
                    'Google',
                    Icons.g_mobiledata_rounded,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSocialButton('Apple', Icons.apple_rounded),
                ),
              ],
            ),
            const SizedBox(height: 32),

            // Don't have an account
            Center(
              child: GestureDetector(
                onTap: () => _navigateTo(AuthPage.signup),
                child: RichText(
                  text: TextSpan(
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      color: AppColors.textColor(context),
                    ),
                    children: [
                      const TextSpan(text: "Don't have an account? "),
                      TextSpan(
                        text: 'Create an account',
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          color: primary,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Page dots
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildSmallDot(color: primary),
                const SizedBox(width: 6),
                _buildSmallDot(color: primary),
                const SizedBox(width: 6),
                _buildSmallDot(color: primary.withOpacity(0.4)),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  // ══════════════════════════════════════════
  // SIGN UP PAGE
  // ══════════════════════════════════════════
  Widget _buildSignupPage() {
    final primary = AppColors.primaryColor(context);

    return SingleChildScrollView(
      key: const ValueKey('signup'),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            // Logo
            Image.asset(
              'images/logo.png',
              height: 50,
              width: 50,
              fit: BoxFit.contain,
            ),
            const SizedBox(height: 24),

            // Title
            Text(
              'Breathe easier.',
              style: GoogleFonts.playfairDisplay(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: primary,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              'Join our community and take control of\nyour respiratory health with intelligent\nmonitoring.',
              style: GoogleFonts.nunito(
                fontSize: 14,
                color: AppColors.textMutedColor(context),
                height: 1.5,
              ),
            ),
            const SizedBox(height: 24),

            // Form card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF006B5E).withOpacity(0.06),
                    blurRadius: 20,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Full Name
                  _buildFieldLabel('Full Name'),
                  const SizedBox(height: 6),
                  _buildAuthTextField(
                    controller: _signupNameController,
                    hint: 'Enter your full name',
                    prefixIcon: Icons.person_outline_rounded,
                  ),
                  const SizedBox(height: 16),

                  // Email
                  _buildFieldLabel('Email Address'),
                  const SizedBox(height: 6),
                  _buildAuthTextField(
                    controller: _signupEmailController,
                    hint: 'name@example.com',
                    prefixIcon: Icons.email_outlined,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),

                  // Password
                  _buildFieldLabel('Password'),
                  const SizedBox(height: 6),
                  _buildAuthTextField(
                    controller: _signupPasswordController,
                    hint: 'Create a password',
                    prefixIcon: Icons.lock_outline_rounded,
                    obscureText: _obscurePassword,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: AppColors.textMutedColor(context),
                        size: 20,
                      ),
                      onPressed: () {
                        setState(() => _obscurePassword = !_obscurePassword);
                      },
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Confirm Password
                  _buildFieldLabel('Confirm Password'),
                  const SizedBox(height: 6),
                  _buildAuthTextField(
                    controller: _signupConfirmPasswordController,
                    hint: 'Re-enter password',
                    prefixIcon: Icons.verified_user_outlined,
                    obscureText: _obscureConfirmPassword,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureConfirmPassword
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: AppColors.textMutedColor(context),
                        size: 20,
                      ),
                      onPressed: () {
                        setState(
                          () => _obscureConfirmPassword =
                              !_obscureConfirmPassword,
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Terms checkbox
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      GestureDetector(
                        onTap: () {
                          setState(() => _agreeToTerms = !_agreeToTerms);
                        },
                        child: Container(
                          width: 20,
                          height: 20,
                          margin: const EdgeInsets.only(top: 2),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: _agreeToTerms
                                  ? primary
                                  : AppColors.borderColor(context),
                              width: 2,
                            ),
                            color: _agreeToTerms ? primary : Colors.transparent,
                          ),
                          child: _agreeToTerms
                              ? const Icon(
                                  Icons.check,
                                  size: 14,
                                  color: Colors.white,
                                )
                              : null,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: RichText(
                          text: TextSpan(
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              color: AppColors.textMutedColor(context),
                              height: 1.4,
                            ),
                            children: [
                              const TextSpan(text: 'I agree to the '),
                              TextSpan(
                                text: 'Terms of Service',
                                style: TextStyle(
                                  color: primary,
                                  fontWeight: FontWeight.w700,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                              const TextSpan(text: ' and '),
                              TextSpan(
                                text: 'Privacy Policy',
                                style: TextStyle(
                                  color: primary,
                                  fontWeight: FontWeight.w700,
                                  decoration: TextDecoration.underline,
                                ),
                              ),
                              const TextSpan(
                                text: ' regarding my health data.',
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Sign Up button
                  _buildPrimaryButton('Sign Up', () {
                    final name = _signupNameController.text.trim();
                    if (name.isNotEmpty) {
                      widget.onNameSet(name);
                    }
                    widget.onAuthComplete();
                  }),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Already have an account
            Center(
              child: GestureDetector(
                onTap: () => _navigateTo(AuthPage.login),
                child: RichText(
                  text: TextSpan(
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      color: AppColors.textColor(context),
                    ),
                    children: [
                      const TextSpan(text: 'Already have an account? '),
                      TextSpan(
                        text: 'Log in',
                        style: TextStyle(
                          fontWeight: FontWeight.w800,
                          color: primary,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // ══════════════════════════════════════════
  // REUSABLE WIDGETS
  // ══════════════════════════════════════════

  Widget _buildFieldLabel(String text) {
    return Text(
      text,
      style: GoogleFonts.nunito(
        fontSize: 13,
        fontWeight: FontWeight.w700,
        color: AppColors.textColor(context),
      ),
    );
  }

  Widget _buildAuthTextField({
    required TextEditingController controller,
    required String hint,
    required IconData prefixIcon,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      style: GoogleFonts.nunito(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textColor(context),
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: GoogleFonts.nunito(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: AppColors.textDimColor(context),
        ),
        prefixIcon: Icon(
          prefixIcon,
          size: 20,
          color: AppColors.textMutedColor(context),
        ),
        suffixIcon: suffixIcon,
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 16,
          vertical: 14,
        ),
        filled: true,
        fillColor: const Color(0xFFF5FAF8),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: AppColors.borderColor(context).withOpacity(0.3),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: AppColors.borderColor(context).withOpacity(0.3),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide(
            color: AppColors.primaryColor(context),
            width: 1.5,
          ),
        ),
      ),
    );
  }

  Widget _buildPrimaryButton(String text, VoidCallback onPressed) {
    return GestureDetector(
      onTap: onPressed,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: const Color(0xFF15504A),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF006B5E).withOpacity(0.3),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Center(
          child: Text(
            text,
            style: GoogleFonts.nunito(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: 0.3,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSocialButton(String label, IconData icon) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          color: Colors.white,
          border: Border.all(
            color: AppColors.borderColor(context).withOpacity(0.5),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 22, color: AppColors.textColor(context)),
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

  Widget _buildDot({required bool isActive}) {
    return Container(
      width: isActive ? 24 : 8,
      height: 8,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(4),
        color: isActive ? const Color(0xFF15504A) : const Color(0xFFCCDDD9),
      ),
    );
  }

  Widget _buildSmallDot({required Color color}) {
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(shape: BoxShape.circle, color: color),
    );
  }
}
