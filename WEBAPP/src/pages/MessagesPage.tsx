import React, { useState, useEffect, useRef } from 'react';
import { PATIENTS, CHATS, ChatMessage } from '../data/patients';
import { riskColor } from '../utils/helpers';
import EmptyState from '../components/Shared/EmptyState';

interface MessagesPageProps {
  initialChatId?: string | null;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ initialChatId = null }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(CHATS);
  const [inputMessage, setInputMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, chats]);

  const activePatient = activeChatId ? PATIENTS.find(p => p.id === activeChatId) : null;
  const activeMessages = activeChatId && chats[activeChatId] ? chats[activeChatId] : [];

  const openChat = (id: string) => {
    setActiveChatId(id);
    if (!chats[id]) {
      setChats(prev => ({ ...prev, [id]: [] }));
    }
  };

  const sendMsg = () => {
    if (!inputMessage.trim() || !activeChatId) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = { from: 'out', text: inputMessage, time };
    setChats(prev => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));
    setInputMessage('');

    setTimeout(() => {
      const replies = [
        'Thank you doctor. I will follow your advice.',
        'Understood. Should I increase my inhaler dose?',
        'I will stay indoors today as you suggested.',
        'Yes doctor, I have been feeling better since yesterday.',
      ];
      const replyMessage: ChatMessage = {
        from: 'in',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChats(prev => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), replyMessage]
      }));
    }, 1100);
  };

  const renderChatWindow = () => {
    if (!activePatient) {
      return <EmptyState icon="💬" message="Select a patient to start messaging" />;
    }

    return (
      <>
        <div className="chat-top">
          <div className="contact-av" style={{ background: activePatient.color, width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#fff' }}>
            {activePatient.av}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>{activePatient.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {activePatient.cond} · Risk: <span style={{ color: riskColor(activePatient.risk), fontWeight: 800 }}>{activePatient.risk}%</span>
            </div>
          </div>
        </div>
        <div className="chat-area">
          {activeMessages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--dim)', fontSize: '12px', padding: '20px' }}>
              Start a conversation with {activePatient.name}
            </div>
          ) : (
            activeMessages.map((m, idx) => (
              <div key={idx}>
                <div className={`msg-bubble ${m.from}`}>{m.text}</div>
                <div className={`msg-time${m.from === 'out' ? ' right' : ''}`}>{m.time}</div>
              </div>
            ))
          )}
          <div ref={chatBottomRef}></div>
        </div>
        <div className="chat-input-wrap">
          <input
            className="chat-input"
            placeholder={`Send medical advice to ${activePatient.name}…`}
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMsg()}
          />
          <button className="send-btn" onClick={sendMsg}>➤</button>
        </div>
      </>
    );
  };

  return (
    <div className="messages-layout" style={{ flex: 1, minHeight: 0 }}>
      <div className="msg-contacts">
        {PATIENTS.map(p => {
          const lastMsg = chats[p.id]?.slice(-1)[0]?.text || 'No messages yet';
          return (
            <div key={p.id} className={`contact-item ${activeChatId === p.id ? 'active' : ''}`} onClick={() => openChat(p.id)}>
              <div className="contact-av" style={{ background: p.color }}>{p.av}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="contact-name">{p.name}</div>
                <div className="contact-preview">{lastMsg}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: riskColor(p.risk) }}></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-window">
        {renderChatWindow()}
      </div>
    </div>
  );
};