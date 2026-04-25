import React, { useState, useEffect, useRef } from 'react';
import { PATIENTS, CHATS, ChatMessage } from '../data/patients';
import { riskColor } from '../utils/helpers';

interface MessagesPageProps {
  initialChatId?: string | null;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ initialChatId = null }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(initialChatId);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>(CHATS);
  const [inputMessage, setInputMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatId, chats]);

  useEffect(() => {
    // Search messages when chat search term changes
    if (chatSearchTerm.trim() && activeMessages.length > 0) {
      const results: number[] = [];
      activeMessages.forEach((msg, idx) => {
        if (msg.text.toLowerCase().includes(chatSearchTerm.toLowerCase())) {
          results.push(idx);
        }
      });
      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
      
      // Scroll to first result
      if (results.length > 0) {
        setTimeout(() => {
          messageRefs.current[results[0]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [chatSearchTerm, activeChatId]);

  const activePatient = activeChatId ? PATIENTS.find(p => p.id === activeChatId) : null;
  const activeMessages = activeChatId && chats[activeChatId] ? chats[activeChatId] : [];

  // Filter patients based on search and unread filter
  const filteredPatients = PATIENTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === 'unread') {
      return matchesSearch;
    }
    return matchesSearch;
  });

  const openChat = (id: string) => {
    setActiveChatId(id);
    setChatSearchTerm('');
    setShowChatSearch(false);
    setSearchResults([]);
    setCurrentSearchIndex(-1);
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
        'Thanks for your help! 🙏',
        'I will take the medication as prescribed.',
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  };

  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = currentSearchIndex + 1 >= searchResults.length ? 0 : currentSearchIndex + 1;
    } else {
      newIndex = currentSearchIndex - 1 < 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    
    setCurrentSearchIndex(newIndex);
    messageRefs.current[searchResults[newIndex]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="messages-container">
      {/* Contacts Sidebar - Left */}
      <div className="contacts-sidebar">
        <div className="contacts-header-simple">
          <h2>Chats</h2>
        </div>

        <div className="chat-filters">
          <button 
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filterType === 'unread' ? 'active' : ''}`}
            onClick={() => setFilterType('unread')}
          >
            Unread
          </button>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="contacts-list">
          {filteredPatients.length === 0 ? (
            <div className="no-contacts">
              <span>👤</span>
              <p>No patients found</p>
            </div>
          ) : (
            filteredPatients.map(p => {
              const lastMessage = chats[p.id]?.[chats[p.id].length - 1]?.text || 'Tap to start chatting';
              const lastTime = chats[p.id]?.[chats[p.id].length - 1]?.time || '';
              
              return (
                <div
                  key={p.id}
                  className={`contact-item ${activeChatId === p.id ? 'active' : ''}`}
                  onClick={() => openChat(p.id)}
                >
                  <div className="contact-avatar" style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}>
                    {p.av}
                  </div>
                  <div className="contact-info">
                    <div className="contact-name-row">
                      <span className="contact-name">{p.name}</span>
                      {lastTime && <span className="contact-time">{lastTime}</span>}
                    </div>
                    <div className="contact-preview-row">
                      <span className="contact-preview">{lastMessage}</span>
                      <div className="contact-status" style={{ background: riskColor(p.risk) }}></div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Window - Right */}
      <div className="chat-window">
        {!activeChatId ? (
          <div className="no-chat-selected">
            <div className="no-chat-icon">💬</div>
            <h3>Select a conversation</h3>
            <p>Choose a patient from the list to start messaging</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="chat-avatar" style={{ background: activePatient?.color }}>
                {activePatient?.av}
              </div>
              <div className="chat-info">
                <div className="chat-name">{activePatient?.name}</div>
                <div className="chat-status">
                  {activePatient?.cond} · Risk: <span style={{ color: riskColor(activePatient?.risk || 0) }}>{activePatient?.risk}%</span>
                </div>
              </div>
              <div className="chat-header-actions">
                <button 
                  className="chat-search-btn"
                  onClick={() => setShowChatSearch(!showChatSearch)}
                  title="Search in chat"
                >
                  🔍
                </button>
              </div>
            </div>

            {/* Chat Search Bar */}
            {showChatSearch && (
              <div className="chat-search-container">
                <div className="chat-search-input-wrapper">
                  <span className="chat-search-icon">🔍</span>
                  <input
                    type="text"
                    className="chat-search-input"
                    placeholder="Search in this chat..."
                    value={chatSearchTerm}
                    onChange={(e) => setChatSearchTerm(e.target.value)}
                    autoFocus
                  />
                  {chatSearchTerm && (
                    <button 
                      className="chat-search-clear"
                      onClick={() => setChatSearchTerm('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {chatSearchTerm && searchResults.length > 0 && (
                  <div className="chat-search-nav">
                    <span className="search-results-count">
                      {currentSearchIndex + 1} of {searchResults.length}
                    </span>
                    <button 
                      className="search-nav-btn"
                      onClick={() => navigateSearch('prev')}
                      disabled={searchResults.length === 0}
                    >
                      ▲
                    </button>
                    <button 
                      className="search-nav-btn"
                      onClick={() => navigateSearch('next')}
                      disabled={searchResults.length === 0}
                    >
                      ▼
                    </button>
                  </div>
                )}
                {chatSearchTerm && searchResults.length === 0 && (
                  <div className="chat-search-no-results">
                    No messages found for "{chatSearchTerm}"
                  </div>
                )}
              </div>
            )}

            <div className="chat-messages">
              {activeMessages.length === 0 ? (
                <div className="no-messages">
                  <span>💬</span>
                  <span>No messages yet. Start a conversation with {activePatient?.name}</span>
                </div>
              ) : (
                activeMessages.map((m, idx) => {
                  const isHighlighted = searchResults.includes(idx) && chatSearchTerm !== '';
                  const isCurrentResult = currentSearchIndex === idx;
                  
                  return (
                    <div 
                      key={idx} 
                      ref={el => messageRefs.current[idx] = el}
                      className={`message-wrapper ${m.from} ${isHighlighted ? 'search-highlight' : ''} ${isCurrentResult ? 'current-highlight' : ''}`}
                    >
                      <div className={`message-bubble ${m.from}`}>
                        <span className="message-text">{m.text}</span>
                        <span className="message-time">{m.time}</span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <input
                className="chat-input"
                placeholder={`Send medical advice to ${activePatient?.name}...`}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button className="send-button" onClick={sendMsg}>➤</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};