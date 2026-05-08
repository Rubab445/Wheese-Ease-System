import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import type { Message } from './types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.senderId === 'me';

  return (
    <div className={`wa-msg-row ${isMe ? 'sent' : 'received'}`}>
      <div className="wa-bubble">
        <div className="wa-bubble-text">
          {message.text}
        </div>
        <div className="wa-bubble-meta">
          {message.timestamp}
          {isMe && (
            <span className={message.status === 'read' ? 'wa-tick-blue' : 'wa-tick-gray'} style={{marginLeft:'2px', display: 'flex', alignItems: 'center'}}>
              {message.status === 'sent' ? <Check size={12} /> : <CheckCheck size={12} />}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
