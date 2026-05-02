import React, { useRef, useEffect } from 'react';
import type { PatientContact, Message } from '../../../types/message.types';

interface ChatAreaProps {
    patient: PatientContact | null;
    newMessage: string;
    onNewMessageChange: (text: string) => void;
    onSendMessage: () => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
    patient,
    newMessage,
    onNewMessageChange,
    onSendMessage
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // FIXED: Ab ye sirf tab chalega jab messages ki counting badle gi,
    // poore object par depend karne se infinite loop ka khatra hota hai.
    useEffect(() => {
        if (patient?.messages?.length) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [patient?.messages?.length]); 

    if (!patient) {
        return (
            <div className="no-chat-selected">
                <i className="fas fa-comment-dots"></i>
                <h3>Select a patient to start chatting</h3>
                <p>Choose a patient from the list to view conversation history</p>
            </div>
        );
    }

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatLastSeen = (): string => {
        const diff = new Date().getTime() - patient.lastSeen.getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const hours = Math.floor(diff / 1000 / 60 / 60);
        if (minutes < 1) return 'Online now';
        if (minutes < 60) return `Last seen ${minutes} min ago`;
        if (hours < 24) return `Last seen ${hours} hr ago`;
        return `Last seen ${Math.floor(hours / 24)} days ago`;
    };

    const getStatusIcon = (status?: string) => {
        if (status === 'read') return <i className="fas fa-check-double"></i>;
        if (status === 'delivered') return <i className="fas fa-check"></i>;
        if (status === 'sent') return <i className="fas fa-clock"></i>;
        return null;
    };

    return (
        <div className="chat-area">
            {/* Header */}
            <div className="chat-header">
                <div className="chat-patient-info">
                    <div className="chat-avatar">{patient.avatar}</div>
                    <div className="chat-patient-details">
                        <h3>{patient.name}</h3>
                        <p className="patient-status">
                            {patient.online ? (
                                <><span className="online-indicator"></span> Online</>
                            ) : (
                                formatLastSeen()
                            )}
                        </p>
                    </div>
                </div>
                <div className="chat-actions">
                    <button className="chat-action-btn" title="View Profile" onClick={() => alert(`Viewing ${patient.name}'s profile`)}>
                        <i className="fas fa-user-circle"></i>
                    </button>
                    <button className="chat-action-btn" title="Share Prescription" onClick={() => alert(`Send prescription to ${patient.name}`)}>
                        <i className="fas fa-prescription"></i>
                    </button>
                    <button className="chat-action-btn" title="Video Call" onClick={() => alert(`Starting video call with ${patient.name}`)}>
                        <i className="fas fa-video"></i>
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="messages-area">
                {patient.messages.map((msg: Message) => (
                    <div key={msg.id} className={`message-bubble ${msg.sender === 'doctor' ? 'sent' : 'received'}`}>
                        <div className="message-content">
                            <p>{msg.text}</p>
                            <div className="message-meta">
                                <span className="message-time">{formatTime(msg.timestamp)}</span>
                                {msg.sender === 'doctor' && msg.status && (
                                    <span className="message-status">{getStatusIcon(msg.status)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="message-input-area">
                <button className="attach-btn" title="Attach file" onClick={() => alert('Attach file coming soon')}>
                    <i className="fas fa-paperclip"></i>
                </button>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
                />
                <button className="emoji-btn" title="Add emoji" onClick={() => alert('Emoji picker coming soon')}>
                    <i className="fas fa-smile"></i>
                </button>
                <button className="send-btn" onClick={onSendMessage} disabled={!newMessage.trim()}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default ChatArea;