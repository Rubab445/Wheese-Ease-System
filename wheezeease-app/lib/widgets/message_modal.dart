import 'dart:math';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../theme/app_colors.dart';

class MessageModal extends StatefulWidget {
  final VoidCallback onClose;

  const MessageModal({super.key, required this.onClose});

  @override
  State<MessageModal> createState() => _MessageModalState();
}

class _MessageModalState extends State<MessageModal> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();
  final List<Map<String, String>> _messages = [
    {
      'type': 'in',
      'text':
          "Hello Sara! I've reviewed your check-in. Risk is high today — please stay indoors.",
    },
    {
      'type': 'in',
      'text':
          'Carry your rescue inhaler and take Fluticasone at 2PM as scheduled.',
    },
  ];

  final _replies = [
    "Thank you Sara. I'll monitor your risk closely.",
    "Please take medication on time. I'll check your data.",
    "Understood. Rest and stay indoors. We'll talk at your next visit.",
    "Noted. If symptoms worsen, please contact me immediately.",
  ];

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    setState(() => _messages.add({'type': 'out', 'text': text}));
    _controller.clear();
    Future.delayed(
      const Duration(milliseconds: 100),
      () =>
          _scrollController.jumpTo(_scrollController.position.maxScrollExtent),
    );

    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) {
        setState(
          () => _messages.add({
            'type': 'in',
            'text': _replies[Random().nextInt(_replies.length)],
          }),
        );
        Future.delayed(
          const Duration(milliseconds: 100),
          () => _scrollController.jumpTo(
            _scrollController.position.maxScrollExtent,
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final primary = isDark ? AppColors.primaryDark : AppColors.primary;
    final surface = isDark ? AppColors.surfaceDark : AppColors.surface;
    final surface2 = isDark ? AppColors.surface2Dark : AppColors.surface2;
    final surface3 = isDark ? AppColors.surface2Dark : AppColors.surface3;
    final text = isDark ? AppColors.textDark : AppColors.text;
    final textMuted = isDark ? AppColors.textMutedDark : AppColors.textMuted;
    final textDim = isDark ? AppColors.textDimDark : AppColors.textDim;
    final border = isDark ? AppColors.borderDark : AppColors.border;

    return GestureDetector(
      onTap: widget.onClose,
      child: Container(
        color: Colors.black.withValues(alpha: isDark ? 0.6 : 0.4),
        child: Align(
          alignment: Alignment.bottomCenter,
          child: GestureDetector(
            onTap: () {},
            child: Container(
              margin: const EdgeInsets.all(14),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: surface,
                borderRadius: BorderRadius.circular(26),
                boxShadow: [
                  BoxShadow(
                    color:
                        Colors.black.withValues(alpha: isDark ? 0.4 : 0.2),
                    blurRadius: 40,
                    offset: const Offset(0, -8),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Message Dr. Rahman',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: text,
                        ),
                      ),
                      GestureDetector(
                        onTap: widget.onClose,
                        child: Icon(
                          Icons.close,
                          size: 19,
                          color: textMuted,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxHeight: 200),
                    child: ListView.separated(
                      controller: _scrollController,
                      shrinkWrap: true,
                      itemCount: _messages.length,
                      separatorBuilder: (_, __) =>
                          const SizedBox(height: 9),
                      itemBuilder: (context, i) {
                        final msg = _messages[i];
                        final isOut = msg['type'] == 'out';
                        return Align(
                          alignment: isOut
                              ? Alignment.centerRight
                              : Alignment.centerLeft,
                          child: Container(
                            constraints: BoxConstraints(
                              maxWidth:
                                  MediaQuery.of(context).size.width * 0.65,
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 13,
                              vertical: 9,
                            ),
                            decoration: BoxDecoration(
                              color: isOut ? primary : surface3,
                              borderRadius: BorderRadius.only(
                                topLeft: const Radius.circular(17),
                                topRight: const Radius.circular(17),
                                bottomLeft:
                                    Radius.circular(isOut ? 17 : 4),
                                bottomRight:
                                    Radius.circular(isOut ? 4 : 17),
                              ),
                            ),
                            child: Text(
                              msg['text']!,
                              style: GoogleFonts.nunito(
                                fontSize: 13,
                                color: isOut ? Colors.white : text,
                                height: 1.5,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _controller,
                          onSubmitted: (_) => _send(),
                          style: GoogleFonts.nunito(
                            fontSize: 14,
                            color: text,
                          ),
                          decoration: InputDecoration(
                            hintText: 'Type a message...',
                            hintStyle: GoogleFonts.nunito(
                              fontSize: 14,
                              color: textDim,
                            ),
                            filled: true,
                            fillColor: surface2,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 15,
                              vertical: 11,
                            ),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide(
                                color: border,
                                width: 2,
                              ),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide(
                                color: border,
                                width: 2,
                              ),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(15),
                              borderSide: BorderSide(
                                color: primary,
                                width: 2,
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 9),
                      GestureDetector(
                        onTap: _send,
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(13),
                            color: primary,
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.send_rounded,
                              color: Colors.white,
                              size: 17,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
