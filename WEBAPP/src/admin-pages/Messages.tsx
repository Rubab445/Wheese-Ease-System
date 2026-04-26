// src/pages/Messages.tsx
import React, { useState, useEffect } from 'react';
import type{ Doctor, MessageChat } from '../types';
import NewMessageModal from '../admin-components/NewMessageModal';

interface MessagesProps {
  doctors: Doctor[];
  onOpenNewMessage: () => void;
  onSendNewMessage: (to: string, message: string) => void;
  onShowToast: (msg: string) => void;
}

const Messages: React.FC<MessagesProps> = ({ 
  doctors, 
  onOpenNewMessage, 
  onSendNewMessage,
  onShowToast 
}) => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Record<string, MessageChat[]>>({});
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);

  const activeDoctors = doctors.filter(d => d.status === 'active');
  const filtered = activeDoctors.filter(d => !searchQuery || d.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sendChatMsg = () => {
    const input = document.getElementById('chatInput') as HTMLInputElement;
    const text = input?.value.trim();
    if (!text || !activeChat) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChats(prev => ({
      ...prev,
      [activeChat!]: [...(prev[activeChat!] || []), { from: 'out', text, time }]
    }));
    if (input) input.value = '';
    setTimeout(() => {
      const replies = [
        'Understood. I will attend to this immediately.', 
        'Thank you for the update. I will review now.', 
        'Noted. I will contact the patient shortly.', 
        'Acknowledged. Please send any additional details.',
        'Received. I will get back to you shortly.',
        'Thanks for the information. I will take appropriate action.'
      ];
      setChats(prev => ({
        ...prev,
        [activeChat!]: [...(prev[activeChat!] || []), { 
          from: 'in', 
          text: replies[Math.floor(Math.random() * replies.length)], 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]
      }));
    }, 1000);
  };

  const handleOpenNewMessageModal = () => {
    setIsNewMessageModalOpen(true);
    onOpenNewMessage();
  };

  const handleSendNewMessageFromModal = (doctorId: string, message: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChats(prev => ({
        ...prev,
        [doctorId]: [...(prev[doctorId] || []), { from: 'out', text: message, time }]
      }));
      onSendNewMessage(doctor.name, message);
      setActiveChat(doctorId);
    }
  };

  useEffect(() => {
    if (activeChat) {
      const chatArea = document.getElementById('chatArea');
      if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
    }
  }, [chats, activeChat]);

  const currentDoctor = activeChat ? doctors.find(d => d.id === activeChat) : null;

  return (
    <div>
      <div className="page-head">
        <div><h2>Admin Messages</h2><p>Direct communication with doctors on the platform</p></div>
        <button className="btn btn-primary" onClick={handleOpenNewMessageModal}>✉️ New Message</button>
      </div>
      <div className="messages-container" style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:'0',background:'var(--white)',border:'1px solid var(--border)',borderRadius:'var(--r)',boxShadow:'var(--shadow)',height:'520px',overflow:'hidden'}}>
        <div className="contacts-list" style={{borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column'}}>
          <div style={{padding:'12px 14px',borderBottom:'1px solid var(--border)'}}>
            <input 
              className="field-input" 
              style={{padding:'8px 12px'}} 
              placeholder="Search doctors…" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
            />
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {filtered.map(d => {
              const lastMsg = chats[d.id]?.slice(-1)[0]?.text || 'No messages yet';
              return (
                <div 
                  key={d.id} 
                  className={`contact-item ${activeChat === d.id ? 'active' : ''}`}
                  style={{display:'flex',alignItems:'center',gap:'10px',padding:'12px 14px',cursor:'pointer',borderBottom:'1px solid var(--border)',background:activeChat === d.id ? 'var(--blue-lt)' : '',borderLeft:activeChat === d.id ? '3px solid var(--blue)' : ''}} 
                  onClick={() => setActiveChat(d.id)}
                >
                  <div className="tbl-av" style={{background:d.color,width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#fff'}}>{d.init}</div>
                  <div style={{flex:1,minWidth:'0'}}>
                    <div style={{fontSize:'13px',fontWeight:'600'}}>{d.name}</div>
                    <div style={{fontSize:'11px',color:'var(--muted)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{lastMsg}</div>
                  </div>
                  <div style={{width:'9px',height:'9px',borderRadius:'50%',background:'var(--green)',flexShrink:'0'}}></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="chat-area" style={{display:'flex',flexDirection:'column'}}>
          {activeChat && currentDoctor ? (
            <>
              <div style={{padding:'14px 18px',background:'var(--white)',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px'}}>
                <div className="tbl-av" style={{background:currentDoctor.color,width:'36px',height:'36px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'700',color:'#fff'}}>{currentDoctor.init}</div>
                <div>
                  <div style={{fontSize:'14px',fontWeight:'700'}}>{currentDoctor.name}</div>
                  <div style={{fontSize:'11px',color:'var(--muted)'}}>{currentDoctor.spec} · <span style={{color:'var(--green)'}}>Online</span></div>
                </div>
              </div>
              <div style={{flex:1,overflowY:'auto',padding:'16px',display:'flex',flexDirection:'column',gap:'10px'}} id="chatArea">
                {!chats[activeChat]?.length && (
                  <div style={{textAlign:'center',color:'var(--dim)',fontSize:'12px',marginTop:'40px'}}>
                    Start a conversation with {currentDoctor.name}
                  </div>
                )}
                {chats[activeChat]?.map((m, i) => (
                  <div key={i}>
                    <div className={`msg-${m.from}`}>{m.text}</div>
                    <div className={`msg-time${m.from === 'out' ? ' ' + m.from : ''}`}>{m.time}</div>
                  </div>
                ))}
              </div>
              <div style={{padding:'12px',background:'var(--white)',borderTop:'1px solid var(--border)',display:'flex',gap:'8px'}}>
                <input 
                  className="field-input" 
                  id="chatInput" 
                  placeholder={`Message ${currentDoctor.name}…`} 
                  style={{flex:1}} 
                  onKeyDown={e => e.key === 'Enter' && sendChatMsg()} 
                />
                <button className="btn btn-primary btn-sm" onClick={sendChatMsg}>Send ➤</button>
              </div>
            </>
          ) : (
            <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'10px',color:'var(--dim)'}}>
              <div style={{fontSize:'40px',opacity:'.3'}}>💬</div>
              <p style={{fontSize:'13px'}}>Select a doctor to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* New Message Modal */}
      <NewMessageModal
        isOpen={isNewMessageModalOpen}
        onClose={() => setIsNewMessageModalOpen(false)}
        doctors={doctors}
        onSendMessage={handleSendNewMessageFromModal}
        onShowToast={onShowToast}
      />
    </div>
  );
};

export default Messages;