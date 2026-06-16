import React, { useState, useEffect, useRef } from 'react';
import '../Components/messages/MessagesHub.css';
import type { ChatSession, Message } from '../Components/messages/types';
import ChatSidebar from '../Components/messages/ChatSidebar';
import ChatArea from '../Components/messages/ChatArea';
import { supabase } from '../../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export default function Messages() {
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const activeChatRef = useRef<string | null>(null);

  // keep ref in sync so real-time callback can read current value
  useEffect(() => { activeChatRef.current = activeChatId; }, [activeChatId]);

  // Load doctor + patients + messages on mount
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      const docId = session.user.id;
      setDoctorId(docId);

      const { data: patients } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('doctor_id', docId)
        .eq('onboarding_completed', true);

      if (!patients?.length) { setLoading(false); return; }

      const sessions: ChatSession[] = await Promise.all(
        patients.map(async (p) => {
          const { data: msgs } = await supabase
            .from('messages')
            .select('*')
            .or(
              `and(sender_id.eq.${docId},receiver_id.eq.${p.id}),` +
              `and(sender_id.eq.${p.id},receiver_id.eq.${docId})`
            )
            .order('created_at', { ascending: true });

          const unread = (msgs ?? []).filter(
            m => m.sender_id === p.id && !m.read_at
          ).length;

          return {
            id: p.id,
            patientName: p.full_name ?? 'Patient',
            avatar: null,
            online: false,
            unreadCount: unread,
            messages: (msgs ?? []).map(m => toMessage(m, docId)),
          };
        })
      );

      setChats(sessions);
      setLoading(false);
    };

    init();
  }, []);

  // Real-time subscription — listen for incoming messages to doctor
  useEffect(() => {
    if (!doctorId) return;

    channelRef.current = supabase
      .channel(`doctor-messages-${doctorId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${doctorId}` },
        (payload) => {
          const msg = payload.new as DbMessage;
          const newMsg: Message = toMessage(msg, doctorId);
          setChats(prev => prev.map(c => {
            if (c.id !== msg.sender_id) return c;
            const isActive = activeChatRef.current === c.id;
            return {
              ...c,
              messages: [...c.messages, newMsg],
              unreadCount: isActive ? 0 : c.unreadCount + 1,
            };
          }));
        }
      )
      .subscribe();

    return () => { channelRef.current?.unsubscribe(); };
  }, [doctorId]);

  const handleSelectChat = async (id: string) => {
    setActiveChatId(id);
    if (doctorId) {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('sender_id', id)
        .eq('receiver_id', doctorId)
        .is('read_at', null);
    }
    setChats(prev => prev.map(c => c.id === id ? { ...c, unreadCount: 0 } : c));
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatId || !doctorId) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({ sender_id: doctorId, receiver_id: activeChatId, text })
      .select()
      .single();

    if (!error && data) {
      setChats(prev => prev.map(c => {
        if (c.id !== activeChatId) return c;
        return { ...c, messages: [...c.messages, toMessage(data, doctorId)] };
      }));
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#6B7280', fontSize: 14 }}>
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="messages-hub">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <ChatArea
        chat={activeChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────

interface DbMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  read_at: string | null;
}

function toMessage(m: DbMessage, myId: string): Message {
  return {
    id: m.id,
    senderId: m.sender_id === myId ? 'me' : m.sender_id,
    text: m.text,
    timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: m.read_at ? 'read' : 'delivered',
  };
}
