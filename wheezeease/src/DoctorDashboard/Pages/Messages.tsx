import React, { useState } from 'react';
import ChatList from '../Components/messages/ChatList';
import ChatArea from '../Components/messages/ChatArea';
import type { PatientContact, Message } from '../../types/message.types';

// Mock Data
const mockPatients: PatientContact[] = [
    {
        id: '1', name: 'Matt Smith', patientId: 'PAT-001', avatar: 'MS',
        lastSeen: new Date(), online: true, unreadCount: 2,
        lastMessage: 'Doctor, my symptoms are getting worse',
        lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
        messages: [
            { id: '1', text: 'Hello Matt, how are you feeling today?', sender: 'doctor', timestamp: new Date(Date.now() - 30 * 60 * 1000), status: 'read' },
            { id: '2', text: 'Doctor, my symptoms are getting worse. Having trouble breathing.', sender: 'patient', timestamp: new Date(Date.now() - 10 * 60 * 1000), status: 'read' },
            { id: '3', text: 'I see. Have you used your rescue inhaler?', sender: 'doctor', timestamp: new Date(Date.now() - 8 * 60 * 1000), status: 'delivered' },
            { id: '4', text: 'Yes, but it\'s not helping much today', sender: 'patient', timestamp: new Date(Date.now() - 5 * 60 * 1000), status: 'read' }
        ]
    },
    {
        id: '2', name: 'Angelika Kravets', patientId: 'PAT-002', avatar: 'AK',
        lastSeen: new Date(Date.now() - 15 * 60 * 1000), online: false, unreadCount: 0,
        lastMessage: 'Thank you doctor!',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        messages: [
            { id: '1', text: 'Angelika, your recent reports look good. Keep it up!', sender: 'doctor', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), status: 'read' },
            { id: '2', text: 'Thank you doctor! I feel much better now.', sender: 'patient', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'read' }
        ]
    },
    {
        id: '3', name: 'Emily Blunt', patientId: 'PAT-003', avatar: 'EB',
        lastSeen: new Date(Date.now() - 45 * 60 * 1000), online: false, unreadCount: 1,
        lastMessage: 'When should I come for my next checkup?',
        lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
        messages: [
            { id: '1', text: 'Emily, your adherence score is improving!', sender: 'doctor', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), status: 'read' },
            { id: '2', text: 'When should I come for my next checkup?', sender: 'patient', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), status: 'sent' }
        ]
    },
    {
        id: '4', name: 'John Krasinski', patientId: 'PAT-004', avatar: 'JK',
        lastSeen: new Date(), online: true, unreadCount: 3,
        lastMessage: 'The pollen levels are very high today',
        lastMessageTime: new Date(Date.now() - 2 * 60 * 1000),
        messages: [
            { id: '1', text: 'John, have you been taking your medication regularly?', sender: 'doctor', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'read' },
            { id: '2', text: 'Yes doctor, but the pollen levels are very high today', sender: 'patient', timestamp: new Date(Date.now() - 5 * 60 * 1000), status: 'read' },
            { id: '3', text: 'I recommend staying indoors and using your air purifier', sender: 'doctor', timestamp: new Date(Date.now() - 3 * 60 * 1000), status: 'delivered' }
        ]
    },
    {
        id: '5', name: 'Anna Jonson', patientId: 'PAT-005', avatar: 'AJ',
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), online: false, unreadCount: 0,
        lastMessage: 'Prescription refill needed',
        lastMessageTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
        messages: [
            { id: '1', text: 'Anna, your prescription is ready for refill', sender: 'doctor', timestamp: new Date(Date.now() - 13 * 60 * 60 * 1000), status: 'read' },
            { id: '2', text: 'Prescription refill needed. Can you send it to my pharmacy?', sender: 'patient', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), status: 'read' }
        ]
    },
    {
        id: '6', name: 'Zara Khan', patientId: 'PAT-006', avatar: 'ZK',
        lastSeen: new Date(), online: true, unreadCount: 0,
        lastMessage: 'My symptoms have reduced significantly',
        lastMessageTime: new Date(Date.now() - 20 * 60 * 1000),
        messages: [
            { id: '1', text: 'Zara, how are you responding to the new medication?', sender: 'doctor', timestamp: new Date(Date.now() - 30 * 60 * 1000), status: 'read' },
            { id: '2', text: 'My symptoms have reduced significantly! Thank you doctor.', sender: 'patient', timestamp: new Date(Date.now() - 20 * 60 * 1000), status: 'read' }
        ]
    }
];

const Messages: React.FC = () => {
    const [patients, setPatients] = useState<PatientContact[]>(mockPatients);
    const [selectedPatient, setSelectedPatient] = useState<PatientContact | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectPatient = (patient: PatientContact) => {
        if (selectedPatient?.id === patient.id) return;
        setPatients(prev => prev.map(p =>
            p.id === patient.id ? { ...p, unreadCount: 0 } : p
        ));
        setSelectedPatient({ ...patient, unreadCount: 0 });
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedPatient) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'doctor',
            timestamp: new Date(),
            status: 'sent'
        };

        setPatients(prev => prev.map(p =>
            p.id === selectedPatient.id
                ? {
                    ...p,
                    messages: [...p.messages, newMsg],
                    lastMessage: newMessage,
                    lastMessageTime: new Date(),
                    unreadCount: 0
                }
                : p
        ));

        setSelectedPatient(prev => prev ? {
            ...prev,
            messages: [...prev.messages, newMsg],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
            unreadCount: 0
        } : null);

        setNewMessage('');

        // Auto reply after 2 seconds
        setTimeout(() => {
            const replies = [
                'Thank you doctor, I\'ll follow your advice.',
                'I appreciate your help!',
                'I\'ll make sure to take my medication on time.',
                'Should I be worried about the pollen levels?',
                'When should I come for my next checkup?',
                'Thank you for the quick response!'
            ];
            const replyMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: replies[Math.floor(Math.random() * replies.length)],
                sender: 'patient',
                timestamp: new Date(),
                status: 'read'
            };
            
            setPatients(prev => prev.map(p =>
                p.id === selectedPatient.id
                    ? { ...p, messages: [...p.messages, replyMsg], lastMessage: replyMsg.text, lastMessageTime: new Date() }
                    : p
            ));
            setSelectedPatient(prev => prev ? {
                ...prev,
                messages: [...prev.messages, replyMsg],
                lastMessage: replyMsg.text,
                lastMessageTime: new Date()
            } : null);
        }, 2000);
    };

    return (
        <div className="messages-page">
            <div className="messages-container">
                <ChatList
                    patients={filteredPatients}
                    selectedPatientId={selectedPatient?.id || null}
                    onSelectPatient={handleSelectPatient}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />
                <ChatArea
                    patient={selectedPatient}
                    newMessage={newMessage}
                    onNewMessageChange={setNewMessage}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    );
};

export default Messages;