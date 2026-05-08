import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreVertical, Paperclip, Mic, Send, ShieldAlert, Wind, Thermometer, BrainCircuit, X } from 'lucide-react';
import type { ChatSession } from './types';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  chat: ChatSession | null;
  onSendMessage: (text: string) => void;
}

export default function ChatArea({ chat, onSendMessage }: ChatAreaProps) {
  const [inputText, setInputText] = useState('');
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSend = (text?: string) => {
    const msg = text || inputText;
    if (msg.trim() !== '') {
      onSendMessage(msg.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  if (!chat) {
    return (
      <div className="wa-empty-state">
        <h2 className="wa-empty-title">Medical Consultation</h2>
        <p className="wa-empty-desc">
          Secure end-to-end encrypted messaging with your patients.<br />
          Select a patient to review their clinical status and start a consultation.
        </p>
      </div>
    );
  }

  // Mock patient info for sidebar
  const patientInfo = {
    risk: 78,
    riskLabel: 'High Risk',
    triggers: ['Pollen', 'Dust', 'Cold Air'],
    lastMed: 'Ventolin Inhaler',
    lastMedTime: '4 hours ago'
  };

  return (
    <div className="chat-main-wrap">
      <div className="wa-chat-area">
        <div className="wa-chat-header">
          <div className="wa-chat-header-info">
            <div className="wa-avatar" style={{ width: '40px', height: '40px' }}>
              {chat.avatar ? <img src={chat.avatar} alt={chat.patientName} /> : chat.patientName.charAt(0)}
            </div>
            {!isHeaderSearchOpen ? (
              <div className="wa-chat-header-text">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="wa-chat-header-name">{chat.patientName}</span>
                  <span className={`risk-pill ${patientInfo.risk >= 70 ? 'high' : patientInfo.risk >= 40 ? 'mod' : 'stable'}`}>
                    {patientInfo.risk}% {patientInfo.riskLabel}
                  </span>
                </div>
                <span className="wa-chat-header-status">
                  {chat.online ? 'Online' : (chat.lastSeen ? `last seen ${chat.lastSeen}` : 'Offline')}
                </span>
              </div>
            ) : (
              <div className="wa-input-container" style={{ marginLeft: '12px', height: '36px' }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search in chat..."
                  value={headerSearchQuery}
                  onChange={e => setHeaderSearchQuery(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
            )}
          </div>
          <div className="wa-sidebar-header-actions">
            <button
              className="wa-icon-btn"
              onClick={() => {
                setIsHeaderSearchOpen(!isHeaderSearchOpen);
                if (isHeaderSearchOpen) setHeaderSearchQuery('');
              }}
            >
              {isHeaderSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>
        </div>


        <div className="wa-messages-container">
          <div className="chat-bubbles-wrap">
            <div className="wa-date-divider">
              <div className="wa-date-box">Clinical Consultation Started</div>
            </div>

            {chat.messages.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Reply Chips */}
        <div className="quick-reply-container">
          <button className="quick-chip" onClick={() => handleSend("Stay indoors today due to high pollen levels.")}>Stay indoors today</button>
          <button className="quick-chip" onClick={() => handleSend("Please check your inhaler medication count.")}>Check your inhaler</button>
          <button className="quick-chip" onClick={() => handleSend("Please update your symptoms in the app.")}>Update symptoms</button>
        </div>

        <div className="wa-input-area">
          <button className="wa-icon-btn"><Paperclip size={20} color="#64748B" /></button>
          <div className="wa-input-container">
            <input
              type="text"
              placeholder="Advice your patient..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button className="wa-icon-btn" onClick={() => handleSend()}>
            <Send size={20} color="var(--medical-indigo)" />
          </button>
        </div>
      </div>

      {/* Patient Info Sidebar */}
      <div className="patient-info-sidebar">
        <div className="info-section">
          <h4 className="info-section-title">Clinical Insights</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="med-info-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <BrainCircuit size={14} color="var(--medical-indigo)" />
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--medical-indigo)' }}>AI PREDICTION</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--medical-text)', lineHeight: '1.4' }}>
                Risk elevated due to local AQI spike (158).
              </p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h4 className="info-section-title">Active Triggers</h4>
          <div className="trigger-list">
            {patientInfo.triggers.map(t => (
              <span key={t} className="trigger-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h4 className="info-section-title">Latest Medication</h4>
          <div className="med-info-box">
            <div className="med-name">{patientInfo.lastMed}</div>
            <div className="med-time">Used {patientInfo.lastMedTime}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
