import React from 'react';
import { MessageSquarePlus, MoreVertical, Search, Filter } from 'lucide-react';
import type { ChatSession } from './types';

interface ChatSidebarProps {
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function ChatSidebar({ chats, activeChatId, onSelectChat, searchQuery, onSearchChange }: ChatSidebarProps) {

  const filteredChats = chats.filter(c => c.patientName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="wa-sidebar">
      <div className="wa-sidebar-header">
        <div className="wa-avatar" style={{ width: '36px', height: '36px' }}>
          <span style={{ fontSize: '13px' }}>Dr.</span>
        </div>
      </div>

      <div className="wa-search-container">
        <div className="wa-search-box">
          <Search size={14} color="var(--medical-text-muted)" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Filter size={14} color="var(--medical-text-muted)" />
        </div>
      </div>

      <div className="wa-chat-list">
        {filteredChats.map(chat => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          return (
            <div
              key={chat.id}
              className={`wa-chat-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="wa-avatar">
                {chat.avatar ? <img src={chat.avatar} alt={chat.patientName} /> : chat.patientName.charAt(0)}
              </div>
              <div className="wa-chat-details">
                <div className="wa-chat-row">
                  <div className="wa-chat-name">{chat.patientName}</div>
                  <div className="wa-chat-time">
                    {lastMessage ? lastMessage.timestamp : ''}
                  </div>
                </div>
                <div className="wa-chat-row-2">
                  <div className="wa-chat-msg-preview">
                    {lastMessage && lastMessage.senderId === 'me' && (
                      <span style={{ color: 'var(--wa-ticks)', fontWeight: 'bold', fontSize: '10px' }}>
                        {lastMessage.status === 'read' ? '✓✓ ' : '✓ '}
                      </span>
                    )}
                    {lastMessage ? lastMessage.text : 'No messages yet'}
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
