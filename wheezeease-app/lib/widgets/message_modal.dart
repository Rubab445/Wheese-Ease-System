import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
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
  final _supabase = Supabase.instance.client;

  List<Map<String, dynamic>> _messages = [];
  String? _patientId;
  String? _doctorId;
  String _doctorName = 'Your Doctor';
  RealtimeChannel? _channel;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    final user = _supabase.auth.currentUser;
    if (user == null) { setState(() => _loading = false); return; }
    _patientId = user.id;

    // Get doctor_id from patient's profile
    final profile = await _supabase
        .from('profiles')
        .select('doctor_id')
        .eq('id', _patientId!)
        .maybeSingle();

    if (profile == null || profile['doctor_id'] == null) {
      setState(() => _loading = false);
      return;
    }
    _doctorId = profile['doctor_id'] as String;

    // Get doctor name
    final doctor = await _supabase
        .from('doctors')
        .select('full_name')
        .eq('id', _doctorId!)
        .maybeSingle();
    if (doctor != null && doctor['full_name'] != null) {
      _doctorName = 'Dr. ${(doctor['full_name'] as String).split(' ').last}';
    }

    // Load existing messages
    await _loadMessages();

    // Subscribe to new messages from doctor
    _channel = _supabase
        .channel('patient-chat-$_patientId')
        .onPostgresChanges(
          event: PostgresChangeEvent.insert,
          schema: 'public',
          table: 'messages',
          filter: PostgresChangeFilter(
            type: PostgresChangeFilterType.eq,
            column: 'receiver_id',
            value: _patientId!,
          ),
          callback: (payload) {
            final row = payload.newRecord;
            if (row['sender_id'] == _doctorId) {
              if (mounted) {
                setState(() {
                  _messages.add({'type': 'in', 'text': row['text'] as String});
                });
                _scrollToBottom();
              }
            }
          },
        )
        .subscribe();

    if (mounted) setState(() => _loading = false);
    _scrollToBottom();
  }

  Future<void> _loadMessages() async {
    if (_patientId == null || _doctorId == null) return;

    final data = await _supabase
        .from('messages')
        .select('sender_id, text, created_at')
        .or(
          'and(sender_id.eq.$_patientId,receiver_id.eq.$_doctorId),'
          'and(sender_id.eq.$_doctorId,receiver_id.eq.$_patientId)',
        )
        .order('created_at', ascending: true);

    if (mounted) {
      setState(() {
        _messages = (data as List)
            .map((m) => {
                  'type': m['sender_id'] == _patientId ? 'out' : 'in',
                  'text': m['text'] as String,
                })
            .toList();
      });
    }

    // Mark doctor's messages as read
    await _supabase
        .from('messages')
        .update({'read_at': DateTime.now().toIso8601String()})
        .eq('sender_id', _doctorId!)
        .eq('receiver_id', _patientId!)
        .isFilter('read_at', null);
  }

  Future<void> _send() async {
    final text = _controller.text.trim();
    if (text.isEmpty || _patientId == null || _doctorId == null) return;

    _controller.clear();
    setState(() => _messages.add({'type': 'out', 'text': text}));
    _scrollToBottom();

    await _supabase.from('messages').insert({
      'sender_id': _patientId,
      'receiver_id': _doctorId,
      'text': text,
    });
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 200),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  void dispose() {
    _channel?.unsubscribe();
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
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
                    color: Colors.black.withValues(alpha: isDark ? 0.4 : 0.2),
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
                        'Message $_doctorName',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: text,
                        ),
                      ),
                      GestureDetector(
                        onTap: widget.onClose,
                        child: Icon(Icons.close, size: 19, color: textMuted),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  if (_loading)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: CircularProgressIndicator(color: primary, strokeWidth: 2),
                    )
                  else if (_doctorId == null)
                    Padding(
                      padding: const EdgeInsets.symmetric(vertical: 24),
                      child: Text(
                        'No doctor assigned yet.\nComplete onboarding first.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                      ),
                    )
                  else ...[
                    ConstrainedBox(
                      constraints: const BoxConstraints(maxHeight: 240),
                      child: _messages.isEmpty
                          ? Center(
                              child: Padding(
                                padding: const EdgeInsets.symmetric(vertical: 20),
                                child: Text(
                                  'No messages yet.\nSend a message to your doctor!',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                                ),
                              ),
                            )
                          : ListView.separated(
                              controller: _scrollController,
                              shrinkWrap: true,
                              itemCount: _messages.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 9),
                              itemBuilder: (context, i) {
                                final msg = _messages[i];
                                final isOut = msg['type'] == 'out';
                                return Align(
                                  alignment: isOut ? Alignment.centerRight : Alignment.centerLeft,
                                  child: Container(
                                    constraints: BoxConstraints(
                                      maxWidth: MediaQuery.of(context).size.width * 0.65,
                                    ),
                                    padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 9),
                                    decoration: BoxDecoration(
                                      color: isOut ? primary : surface3,
                                      borderRadius: BorderRadius.only(
                                        topLeft: const Radius.circular(17),
                                        topRight: const Radius.circular(17),
                                        bottomLeft: Radius.circular(isOut ? 17 : 4),
                                        bottomRight: Radius.circular(isOut ? 4 : 17),
                                      ),
                                    ),
                                    child: Text(
                                      msg['text'] as String,
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
                            style: GoogleFonts.nunito(fontSize: 14, color: text),
                            decoration: InputDecoration(
                              hintText: 'Type a message...',
                              hintStyle: GoogleFonts.nunito(fontSize: 14, color: textDim),
                              filled: true,
                              fillColor: surface2,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 11),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: BorderSide(color: border, width: 2),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: BorderSide(color: border, width: 2),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(15),
                                borderSide: BorderSide(color: primary, width: 2),
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
                              child: Icon(Icons.send_rounded, color: Colors.white, size: 17),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
