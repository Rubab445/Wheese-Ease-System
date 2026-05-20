import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../services/profile_service.dart';

class MedicationsScreen extends StatefulWidget {
  const MedicationsScreen({super.key});

  @override
  State<MedicationsScreen> createState() => _MedicationsScreenState();
}

class _MedicationsScreenState extends State<MedicationsScreen> {
  List<Map<String, dynamic>> _meds = [];
  bool _medsLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMedications();
  }

  Future<void> _loadMedications() async {
    final profile = await ProfileService.getProfile();
    final medsStr = profile?['medications'] as String? ?? '';
    final names = medsStr
        .split(',')
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();

    final loaded = names.map((name) {
      final lower = name.toLowerCase();
      if (lower.contains('salbutamol') || lower.contains('ventolin')) {
        return {
          'name': name, 'type': 'Rescue Inhaler · β₂ agonist',
          'icon': Icons.air_rounded, 'badge': '100mcg/puff',
          'time': 'As needed', 'note': 'Alert if used more than 3x/day',
          'taken': false, 'toggle': true,
        };
      } else if (lower.contains('fluticasone') || lower.contains('flixotide')) {
        return {
          'name': name, 'type': 'Preventer Inhaler · Corticosteroid',
          'icon': Icons.cyclone_outlined, 'badge': '250mcg/dose',
          'time': '2:00 PM Daily', 'note': 'Daily reminder at 2:00 PM',
          'taken': false, 'toggle': true,
        };
      } else if (lower.contains('cetirizine') || lower.contains('zyrtec')) {
        return {
          'name': name, 'type': 'Antihistamine · Allergy tablet',
          'icon': Icons.medication_outlined, 'badge': '10mg',
          'time': 'Every morning', 'note': 'Daily reminder at 8:00 AM',
          'taken': false, 'toggle': true,
        };
      } else if (lower.contains('montelukast')) {
        return {
          'name': name, 'type': 'Leukotriene modifier · Tablet',
          'icon': Icons.medical_services_outlined, 'badge': '10mg',
          'time': 'Every evening', 'note': 'Take with or without food',
          'taken': false, 'toggle': true,
        };
      } else if (lower.contains('budesonide') || lower.contains('symbicort')) {
        return {
          'name': name, 'type': 'Combination Inhaler',
          'icon': Icons.cyclone_outlined, 'badge': '200mcg/dose',
          'time': 'Twice daily', 'note': 'Rinse mouth after use',
          'taken': false, 'toggle': true,
        };
      } else {
        return {
          'name': name, 'type': 'Prescribed medication',
          'icon': Icons.medication_outlined, 'badge': 'As prescribed',
          'time': 'As directed', 'note': 'Follow doctor\'s instructions',
          'taken': false, 'toggle': true,
        };
      }
    }).toList();

    if (!mounted) return;
    setState(() {
      _meds = loaded.isNotEmpty ? loaded : [
        {
          'name': 'Salbutamol (Ventolin)', 'type': 'Rescue Inhaler · β₂ agonist',
          'icon': Icons.air_rounded, 'badge': '100mcg/puff',
          'time': 'As needed', 'note': 'Alert if used more than 3x/day',
          'taken': false, 'toggle': true,
        },
      ];
      _medsLoading = false;
    });
  }

  // Inhaler usage form state
  String _inhalerType = 'Relief/Rescue inhaler';
  int _puffs = 2;
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  String _reason = 'Scheduled dose';

  // Inhaler usage history (in-memory)
  final List<Map<String, dynamic>> _inhalerHistory = [
    {
      'type': 'Relief/Rescue inhaler',
      'puffs': 2,
      'dateTime': DateTime.now().subtract(const Duration(hours: 3)),
      'reason': 'Sudden symptoms',
    },
    {
      'type': 'Controller/Preventer inhaler',
      'puffs': 1,
      'dateTime': DateTime.now().subtract(const Duration(hours: 8)),
      'reason': 'Scheduled dose',
    },
    {
      'type': 'Relief/Rescue inhaler',
      'puffs': 1,
      'dateTime': DateTime.now().subtract(const Duration(days: 1, hours: 2)),
      'reason': 'Before exercise',
    },
  ];

  void _takeMed(int index) {
    if (_meds[index]['taken'] == true) return;
    setState(() {
      _meds[index]['taken'] = true;
      _meds[index]['takenTime'] = TimeOfDay.now().format(context);
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Medication logged! Dr. Rahman notified.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _logInhalerUsage() {
    final entry = {
      'type': _inhalerType,
      'puffs': _puffs,
      'dateTime': DateTime(
        _selectedDate.year, _selectedDate.month, _selectedDate.day,
        _selectedTime.hour, _selectedTime.minute,
      ),
      'reason': _reason,
    };
    setState(() {
      _inhalerHistory.insert(0, entry);
      _puffs = 2;
      _selectedDate = DateTime.now();
      _selectedTime = TimeOfDay.now();
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_outline, color: Colors.white, size: 18),
            const SizedBox(width: 10),
            Text('Inhaler usage logged', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
          ],
        ),
        backgroundColor: AppColors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  Future<void> _pickDate() async {
    final d = await showDatePicker(
      context: context, initialDate: _selectedDate,
      firstDate: DateTime.now().subtract(const Duration(days: 30)),
      lastDate: DateTime.now(),
    );
    if (d != null) setState(() => _selectedDate = d);
  }

  Future<void> _pickTime() async {
    final t = await showTimePicker(context: context, initialTime: _selectedTime);
    if (t != null) setState(() => _selectedTime = t);
  }

  String _formatDateTime(DateTime dt) {
    final now = DateTime.now();
    final diff = now.difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays == 1) return 'Yesterday';
    return '${dt.day}/${dt.month} ${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: EdgeInsets.only(top: MediaQuery.of(context).padding.top + 22, left: 22, right: 22, bottom: 28),
            decoration: BoxDecoration(
              gradient: isDark ? AppColors.primaryGradientDark : AppColors.primaryGradient,
              borderRadius: const BorderRadius.only(bottomLeft: Radius.circular(34), bottomRight: Radius.circular(34)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Medications', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w800, color: Colors.white)),
                  Text('Your schedule & reminders', style: GoogleFonts.nunito(fontSize: 12, color: Colors.white70)),
                ]),
                const Icon(Icons.medication_outlined, color: Colors.white, size: 34),
              ],
            ),
          ),

          // Next dose card
          Container(
            margin: const EdgeInsets.fromLTRB(18, 16, 18, 0),
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: isDark ? AppColors.primaryGradientDark : AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [BoxShadow(color: primary.withValues(alpha: 0.3), blurRadius: 26, offset: const Offset(0, 8))],
            ),
            child: Row(children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  const Icon(Icons.access_time_outlined, color: Colors.white70, size: 12),
                  const SizedBox(width: 4),
                  Text('NEXT DOSE DUE', style: GoogleFonts.nunito(fontSize: 11, color: Colors.white70, fontWeight: FontWeight.w600, letterSpacing: 0.7)),
                ]),
                const SizedBox(height: 5),
                Text('Fluticasone', style: GoogleFonts.playfairDisplay(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                const SizedBox(height: 2),
                Text('Today at 2:00 PM · in 4h 19m', style: GoogleFonts.nunito(fontSize: 13, color: Colors.white.withValues(alpha: 0.9), fontWeight: FontWeight.w600)),
              ])),
              Icon(Icons.medication_outlined, size: 38, color: Colors.white.withValues(alpha: 0.4)),
            ]),
          ),

          // Med cards
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 0),
            child: Text('All Medications', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: text)),
          ),
          if (_medsLoading)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Center(child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(primary))),
            )
          else
            ...List.generate(_meds.length, (i) => _buildMedCard(i, surface, text, textMuted, border, primary, isDark)),

          const SizedBox(height: 24),

          // ══════════════════════════════════════
          // INHALER USAGE SECTION
          // ══════════════════════════════════════
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 0, 18, 10),
            child: Text('Log Inhaler Usage', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: text)),
          ),
          _buildInhalerForm(surface, text, textMuted, border, primary, isDark),

          const SizedBox(height: 20),

          // Inhaler history
          if (_inhalerHistory.isNotEmpty) ...[
            Padding(
              padding: const EdgeInsets.fromLTRB(18, 0, 18, 10),
              child: Text('Recent Inhaler Usage', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: text)),
            ),
            ..._inhalerHistory.map((e) => _buildInhalerHistoryCard(e, surface, text, textMuted, border, primary, isDark)),
          ],

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildInhalerForm(Color surface, Color text, Color textMuted, Color border, Color primary, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 18),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: border),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05), blurRadius: 24, offset: const Offset(0, 4))],
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Inhaler type dropdown
        Text('INHALER TYPE', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(color: border.withOpacity(0.2), borderRadius: BorderRadius.circular(12), border: Border.all(color: border)),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _inhalerType, isExpanded: true,
              dropdownColor: surface,
              style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w600, color: text),
              items: ['Relief/Rescue inhaler', 'Controller/Preventer inhaler'].map((v) => DropdownMenuItem(value: v, child: Text(v))).toList(),
              onChanged: (v) => setState(() => _inhalerType = v!),
            ),
          ),
        ),
        const SizedBox(height: 14),

        // Number of puffs
        Text('NUMBER OF PUFFS', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
        const SizedBox(height: 6),
        Row(children: [
          _counterBtn('−', () => setState(() => _puffs = (_puffs - 1).clamp(1, 10)), primary, border, text),
          const SizedBox(width: 16),
          Text('$_puffs', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w800, color: text)),
          const SizedBox(width: 16),
          _counterBtn('+', () => setState(() => _puffs = (_puffs + 1).clamp(1, 10)), primary, border, text),
        ]),
        const SizedBox(height: 14),

        // Date and time
        Text('DATE & TIME', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
        const SizedBox(height: 6),
        Row(children: [
          Expanded(child: GestureDetector(
            onTap: _pickDate,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(color: border.withOpacity(0.2), borderRadius: BorderRadius.circular(12), border: Border.all(color: border)),
              child: Row(children: [
                Icon(Icons.calendar_today_outlined, size: 16, color: primary),
                const SizedBox(width: 8),
                Text('${_selectedDate.day}/${_selectedDate.month}/${_selectedDate.year}', style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w600, color: text)),
              ]),
            ),
          )),
          const SizedBox(width: 10),
          Expanded(child: GestureDetector(
            onTap: _pickTime,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(color: border.withOpacity(0.2), borderRadius: BorderRadius.circular(12), border: Border.all(color: border)),
              child: Row(children: [
                Icon(Icons.access_time_outlined, size: 16, color: primary),
                const SizedBox(width: 8),
                Text(_selectedTime.format(context), style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w600, color: text)),
              ]),
            ),
          )),
        ]),
        const SizedBox(height: 14),

        // Reason dropdown
        Text('REASON FOR USE', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w800, color: textMuted, letterSpacing: 0.7)),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(color: border.withOpacity(0.2), borderRadius: BorderRadius.circular(12), border: Border.all(color: border)),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _reason, isExpanded: true,
              dropdownColor: surface,
              style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w600, color: text),
              items: ['Scheduled dose', 'Sudden symptoms', 'Before exercise', 'Other'].map((v) => DropdownMenuItem(value: v, child: Text(v))).toList(),
              onChanged: (v) => setState(() => _reason = v!),
            ),
          ),
        ),
        const SizedBox(height: 16),

        // Log button
        GestureDetector(
          onTap: _logInhalerUsage,
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 14),
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), gradient: AppColors.greenGradient),
            child: Center(child: Text('Log Inhaler Usage', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white))),
          ),
        ),
      ]),
    );
  }

  Widget _buildInhalerHistoryCard(Map<String, dynamic> entry, Color surface, Color text, Color textMuted, Color border, Color primary, bool isDark) {
    final dt = entry['dateTime'] as DateTime;
    final isRescue = (entry['type'] as String).contains('Rescue');
    return Container(
      margin: const EdgeInsets.fromLTRB(18, 0, 18, 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: surface, borderRadius: BorderRadius.circular(14),
        border: Border.all(color: border),
      ),
      child: Row(children: [
        Container(
          width: 38, height: 38,
          decoration: BoxDecoration(
            color: (isRescue ? AppColors.blue : primary).withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(isRescue ? Icons.air_rounded : Icons.cyclone_outlined, color: isRescue ? AppColors.blue : primary, size: 18),
        ),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(entry['type'] as String, style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: text)),
          const SizedBox(height: 2),
          Text('${entry['puffs']} puffs · ${entry['reason']}', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
        ])),
        Text(_formatDateTime(dt), style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w600, color: textMuted)),
      ]),
    );
  }

  Widget _counterBtn(String label, VoidCallback onTap, Color primary, Color border, Color text) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36, height: 36,
        decoration: BoxDecoration(shape: BoxShape.circle, color: primary.withOpacity(0.1), border: Border.all(color: border, width: 2)),
        child: Center(child: Text(label, style: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w700, color: text))),
      ),
    );
  }

  Widget _buildMedCard(int index, Color surface, Color text, Color textMuted, Color border, Color primary, bool isDark) {
    final med = _meds[index];
    final taken = med['taken'] as bool;
    return Container(
      margin: const EdgeInsets.fromLTRB(18, 10, 18, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: border),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05), blurRadius: 24, offset: const Offset(0, 4))],
      ),
      child: Column(children: [
        Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(med['name'] as String, style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: text)),
            const SizedBox(height: 2),
            Text(med['type'] as String, style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
          ])),
          Icon(med['icon'] as IconData, size: 24, color: primary),
        ]),
        const SizedBox(height: 10),
        Row(children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(20), color: primary.withOpacity(0.12), border: Border.all(color: primary.withValues(alpha: 0.2))),
            child: Text(med['badge'] as String, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w700, color: primary)),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(20), color: AppColors.blueDim, border: Border.all(color: AppColors.blue.withValues(alpha: 0.2))),
            child: Text(med['time'] as String, style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.blue)),
          ),
        ]),
        const SizedBox(height: 12),
        GestureDetector(
          onTap: () => _takeMed(index),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: double.infinity, padding: const EdgeInsets.symmetric(vertical: 11),
            decoration: BoxDecoration(borderRadius: BorderRadius.circular(13), color: taken ? AppColors.green : AppColors.greenDim, border: Border.all(color: AppColors.green, width: 2)),
            child: Center(child: Text(taken ? 'Taken at ${med['takenTime'] ?? ''}' : 'Mark as ${index == 0 ? 'Used' : 'Taken'}', style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w800, color: taken ? Colors.white : AppColors.green))),
          ),
        ),
        const SizedBox(height: 11),
        Container(
          padding: const EdgeInsets.only(top: 11),
          decoration: BoxDecoration(border: Border(top: BorderSide(color: border))),
          child: Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
            Flexible(child: Text(med['note'] as String, style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w600, color: textMuted), overflow: TextOverflow.ellipsis)),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: () => setState(() => med['toggle'] = !(med['toggle'] as bool)),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250), width: 48, height: 28,
                decoration: BoxDecoration(borderRadius: BorderRadius.circular(14), color: (med['toggle'] as bool) ? primary : border),
                child: AnimatedAlign(
                  duration: const Duration(milliseconds: 250),
                  alignment: (med['toggle'] as bool) ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.all(3), width: 22, height: 22,
                    decoration: BoxDecoration(shape: BoxShape.circle, color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.15), blurRadius: 6, offset: const Offset(0, 2))]),
                  ),
                ),
              ),
            ),
          ]),
        ),
      ]),
    );
  }
}
