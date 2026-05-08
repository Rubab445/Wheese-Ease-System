import React, { useState } from 'react';
import '../Components/messages/MessagesHub.css';
import type { ChatSession, Message } from '../Components/messages/types';
import ChatSidebar from '../Components/messages/ChatSidebar';
import ChatArea from '../Components/messages/ChatArea';

const initialChats: ChatSession[] = [
  {
    id: 'PT-8492',
    patientName: 'Marcus Chen',
    avatar: 'https://ui-avatars.com/api/?name=Marcus+Chen&background=random',
    online: true,
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Marcus, how is your breathing today?', timestamp: '09:00 AM', status: 'read' },
      { id: 'm2', senderId: 'PT-8492', text: 'A bit tight this morning. I had to use my inhaler twice.', timestamp: '09:15 AM', status: 'read' },
      { id: 'm3', senderId: 'me', text: 'Have you checked your peak flow meter?', timestamp: '09:16 AM', status: 'read' },
      { id: 'm4', senderId: 'PT-8492', text: 'Yes, it was around 310.', timestamp: '09:20 AM', status: 'read' },
      { id: 'm5', senderId: 'PT-8492', text: 'Should I take my prescribed steroids?', timestamp: '09:21 AM', status: 'read' },
    ]
  },
  {
    id: 'PT-2231',
    patientName: 'Elena Rodriguez',
    avatar: null,
    online: false,
    lastSeen: 'today at 10:30 AM',
    unreadCount: 0,
    messages: [
      { id: 'm6', senderId: 'PT-2231', text: 'Thank you for the prescription refill Dr!', timestamp: 'Yesterday', status: 'read' },
      { id: 'm7', senderId: 'me', text: 'You are welcome. Make sure to avoid oak pollen areas this week.', timestamp: 'Yesterday', status: 'read' }
    ]
  },
  {
    id: 'PT-9901',
    patientName: 'David Kim',
    avatar: 'https://ui-avatars.com/api/?name=David+Kim&background=random',
    online: false,
    lastSeen: 'yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm8', senderId: 'PT-9901', text: 'Is it safe to run in the cold today?', timestamp: 'Yesterday', status: 'read' },
      { id: 'm9', senderId: 'me', text: 'I would advise against it given the sudden temp drop. If you must, wear a scarf.', timestamp: 'Yesterday', status: 'read' },
      { id: 'm10', senderId: 'PT-9901', text: 'Got it, thanks!', timestamp: 'Yesterday', status: 'read' }
    ]
  }
];

export default function Messages() {
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
    // Mark as read
    setChats(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  const handleSendMessage = (text: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return {
          ...c,
          messages: [...c.messages, newMessage]
        };
      }
      return c;
    }));

    // Simulate "delivered" and "read"
    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: 'delivered' } : m)
          };
        }
        return c;
      }));
    }, 1000);

    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: 'read' } : m)
          };
        }
        return c;
      }));
    }, 2500);
  };

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