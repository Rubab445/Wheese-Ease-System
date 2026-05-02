import React from 'react';
import type { PatientContact } from '../../../types/message.types';

interface ChatListProps {
    patients: PatientContact[];
    selectedPatientId: string | null;
    onSelectPatient: (patient: PatientContact) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({
    patients,
    selectedPatientId,
    onSelectPatient,
    searchTerm,
    onSearchChange
}) => {
    const formatTime = (date: Date): string => {
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2><i className="fas fa-comments"></i> Chats</h2>
                <div className="search-box">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </div>
            
            <div className="patient-list">
                {patients.map(patient => (
                    <div
                        key={patient.id}
                        className={`patient-item ${selectedPatientId === patient.id ? 'active' : ''}`}
                        onClick={() => onSelectPatient(patient)}
                    >
                        <div className="patient-avatar">
                            {patient.avatar}
                            {patient.online && <span className="online-dot"></span>}
                        </div>
                        <div className="patient-info">
                            <div className="patient-name-row">
                                <span className="patient-name">{patient.name}</span>
                                <span className="patient-id">{patient.patientId}</span>
                            </div>
                            <div className="patient-last-message">{patient.lastMessage}</div>
                        </div>
                        <div className="patient-meta">
                            <div className="message-time">
                                {patient.lastMessageTime && formatTime(patient.lastMessageTime)}
                            </div>
                            {patient.unreadCount > 0 && (
                                <div className="unread-badge">{patient.unreadCount}</div>
                            )}
                        </div>
                    </div>
                ))}
                {patients.length === 0 && (
                    <div className="no-patients">
                        <i className="fas fa-user-slash"></i>
                        <p>No patients found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatList;