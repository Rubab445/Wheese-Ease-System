export interface Message {
    id: string;
    text: string;
    sender: 'doctor' | 'patient';
    timestamp: Date;
    status?: 'sent' | 'delivered' | 'read';
}

export interface PatientContact {
    id: string;
    name: string;
    patientId: string;
    avatar: string;
    lastSeen: Date;
    online: boolean;
    unreadCount: number;
    lastMessage?: string;
    lastMessageTime?: Date;
    messages: Message[];
}