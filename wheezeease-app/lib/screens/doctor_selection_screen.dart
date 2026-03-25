import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';
import '../models/doctor.dart';

class DoctorSelectionScreen extends StatefulWidget {
  final Function(Doctor) onDoctorSelected;

  const DoctorSelectionScreen({super.key, required this.onDoctorSelected});

  @override
  State<DoctorSelectionScreen> createState() => _DoctorSelectionScreenState();
}

class _DoctorSelectionScreenState extends State<DoctorSelectionScreen> {
  final List<Doctor> _doctors = Doctor.sampleDoctors;
  int? _selectedDocId;
  String _activeFilter = 'all';
  String _searchQuery = '';

  List<Doctor> get _filteredDoctors {
    return _doctors.where((d) {
      final matchFilter =
          _activeFilter == 'all' ||
          d.spec.toLowerCase().contains(_activeFilter) ||
          (_activeFilter == 'online' && d.avail == 'online');
      final q = _searchQuery.toLowerCase();
      final matchQuery =
          q.isEmpty ||
          d.name.toLowerCase().contains(q) ||
          d.spec.toLowerCase().contains(q) ||
          d.hospital.toLowerCase().contains(q) ||
          d.tags.any((t) => t.toLowerCase().contains(q));
      return matchFilter && matchQuery;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredDoctors;
    final selectedDoc = _selectedDocId != null
        ? _doctors.firstWhere(
            (d) => d.id == _selectedDocId,
            orElse: () => _doctors.first,
          )
        : null;

    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final surface3 = isDark ? AppColors.surface2Dark : AppColors.surface3;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final textDim = isDark ? AppColors.textDimDark : AppColors.textDim;
    final border = isDark ? AppColors.borderDark : AppColors.border;
    final bg = isDark ? AppColors.bgDark : AppColors.bg;

    return Scaffold(
      backgroundColor: bg,
      body: Column(
        children: [
          // Header
          Container(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top + 20,
              left: 20,
              right: 20,
              bottom: 22,
            ),
            decoration: BoxDecoration(
              gradient: isDark
                  ? AppColors.primaryGradientDark
                  : AppColors.primaryGradient,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(32),
                bottomRight: Radius.circular(32),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Step 5 of 5',
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    color: Colors.white70,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Choose Your Doctor',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 23,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 5),
                Text(
                  'Select a registered WheezeEase specialist near you',
                  style: GoogleFonts.nunito(
                    fontSize: 13,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),

          // Location strip
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              color: primary.withValues(alpha: 0.08),
              border: Border.all(color: primary.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    color: AppColors.green,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Location Detected',
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: primary,
                        ),
                      ),
                      Text(
                        'Gujranwala, Punjab, Pakistan',
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          color: textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  '${filtered.length} doctors found',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    color: AppColors.textDim,
                  ),
                ),
              ],
            ),
          ),

          // Search bar
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 18),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            decoration: BoxDecoration(
              color: surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: border, width: 2),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05),
                  blurRadius: 24,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: TextField(
              onChanged: (v) => setState(() => _searchQuery = v),
              style: GoogleFonts.nunito(fontSize: 14, color: text),
              decoration: InputDecoration(
                hintText: 'Search by name or speciality…',
                hintStyle: GoogleFonts.nunito(
                  fontSize: 14,
                  color: textDim,
                ),
                border: InputBorder.none,
                icon: Icon(Icons.search, size: 16, color: textDim),
              ),
            ),
          ),

          // Filter chips
          SizedBox(
            height: 48,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
              children: [
                _filterChip('All', 'all'),
                _filterChip('Pulmonologist', 'pulmonologist'),
                _filterChip('Allergist', 'allergist'),
                _filterChip('General Physician', 'general'),
                _filterChip('Online Now', 'online'),
              ],
            ),
          ),

          // Doctor list
          Expanded(
            child: filtered.isEmpty
                ? Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.search_outlined, color: AppColors.textMuted, size: 40),
                        const SizedBox(height: 12),
                        Text(
                          'No doctors found',
                          style: GoogleFonts.nunito(
                            fontSize: 15,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Try a different search or filter',
                          style: GoogleFonts.nunito(
                            fontSize: 13,
                            color: textMuted,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 18,
                      vertical: 6,
                    ),
                    itemCount: filtered.length,
                    itemBuilder: (context, i) => _buildDocCard(filtered[i]),
                  ),
          ),

          // Confirm bar
          if (selectedDoc != null)
            Container(
              padding: const EdgeInsets.fromLTRB(18, 12, 18, 16),
              decoration: BoxDecoration(
                color: surface,
                border: Border(top: BorderSide(color: border)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 14,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.blueDim,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(
                        color: AppColors.blue.withValues(alpha: 0.2),
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(11),
                            gradient: selectedDoc.color,
                          ),
                          child: Center(
                            child: Text(
                              selectedDoc.initials,
                              style: GoogleFonts.playfairDisplay(
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                selectedDoc.name,
                                style: GoogleFonts.nunito(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: text,
                                ),
                              ),
                              Text(
                                '${selectedDoc.spec} · ${selectedDoc.hospital}',
                                style: GoogleFonts.nunito(
                                  fontSize: 11,
                                  color: textMuted,
                                ),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.check_circle_outline, color: AppColors.green, size: 18),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  GestureDetector(
                    onTap: () => widget.onDoctorSelected(selectedDoc),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(18),
                        gradient: AppColors.greenGradient,
                        boxShadow: [
                          BoxShadow(
                            color: AppColors.green.withValues(alpha: 0.3),
                            blurRadius: 22,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Center(
                        child: Text(
                          'Confirm & Start Monitoring',
                          style: GoogleFonts.nunito(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _filterChip(String label, String filter) {
    final isActive = _activeFilter == filter;
    final primary = AppColors.primaryColor(context);
    final surface = AppColors.surfaceColor(context);
    final border = AppColors.borderColor(context);
    final textMuted = AppColors.textMutedColor(context);
    return GestureDetector(
      onTap: () => setState(() => _activeFilter = filter),
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          color: isActive ? primary.withOpacity(0.12) : surface,
          border: Border.all(
            color: isActive ? primary : border,
            width: 1.5,
          ),
        ),
        child: Text(
          label,
          style: GoogleFonts.nunito(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: isActive ? primary : textMuted,
          ),
        ),
      ),
    );
  }

  Widget _buildDocCard(Doctor doc) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = AppColors.primaryColor(context);
    final surface = AppColors.surfaceColor(context);
    final surface3 = isDark ? AppColors.surface2Dark : AppColors.surface3;
    final text = AppColors.textColor(context);
    final textMuted = AppColors.textMutedColor(context);
    final textDim = AppColors.textDimColor(context);
    final border = AppColors.borderColor(context);
    final isSelected = doc.id == _selectedDocId;
    return GestureDetector(
      onTap: () => setState(() => _selectedDocId = doc.id),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? primary.withOpacity(0.08) : surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? primary : border,
            width: 2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: isDark ? 0.15 : 0.05),
              blurRadius: 24,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 54,
                  height: 54,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: doc.color,
                  ),
                  child: Center(
                    child: Text(
                      doc.initials,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        doc.name,
                        style: GoogleFonts.nunito(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
                          color: text,
                        ),
                      ),
                      Text(
                        doc.spec,
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          color: textMuted,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        doc.hospital,
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          color: textDim,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Text(
                            '${doc.rating}',
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: text,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: List.generate(5, (i) {
                              return Icon(
                                i < (doc.rating >= 4.8 ? 5 : 4) ? Icons.star : Icons.star_border,
                                size: 11,
                                color: AppColors.yellow,
                              );
                            }),
                          ),
                          const SizedBox(width: 4),
                          Flexible(
                            child: Text(
                              '(${doc.reviews} reviews)',
                              style: GoogleFonts.nunito(
                                fontSize: 11,
                                color: textMuted,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                _buildSelectBtn(isSelected),
              ],
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 6,
              runSpacing: 6,
              children: doc.tags
                  .map(
                    (t) => Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20),
                        color: surface3,
                      ),
                      child: Text(
                        t,
                        style: GoogleFonts.nunito(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: textMuted,
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.only(top: 12),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: border)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${doc.distance} away',
                    style: GoogleFonts.nunito(
                      fontSize: 12,
                      color: textMuted,
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      color: doc.avail == 'online'
                          ? AppColors.greenDim
                          : AppColors.yellowDim,
                    ),
                    child: Text(
                      doc.avail == 'online' ? '● Online Now' : '◌ Busy',
                      style: GoogleFonts.nunito(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: doc.avail == 'online'
                            ? AppColors.green
                            : AppColors.yellow,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectBtn(bool isSelected) {
    final primary = AppColors.primaryColor(context);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(12),
        color: isSelected ? AppColors.greenDim : primary.withOpacity(0.08),
        border: Border.all(
          color: isSelected
              ? AppColors.green.withValues(alpha: 0.3)
              : primary.withValues(alpha: 0.3),
          width: 1.5,
        ),
      ),
      child: Text(
        isSelected ? 'Selected' : 'Select',
        style: GoogleFonts.nunito(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          color: isSelected ? AppColors.green : primary,
        ),
      ),
    );
  }
}
