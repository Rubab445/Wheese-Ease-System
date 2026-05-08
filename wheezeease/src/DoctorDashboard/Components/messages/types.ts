export interface Message {
  id: string;
  senderId: string; // 'me' for the doctor, or patient ID
  text: string;
  timestamp: string; // e.g., '10:45 AM'
  status: 'sent' | 'delivered' | 'read'; // for messages sent by 'me'
}

export interface ChatSession {
  id: string; // usually same as patientId
  patientName: string;
  avatar: string | null;
  online: boolean;
  lastSeen?: string;
  unreadCount: number;
  messages: Message[];
}
