import React from "react";
import { Patient } from "../data/patients";
import { MessagesPanel } from "../components/sections/MessagesPanel";

interface Message {
  from: "in" | "out";
  text: string;
  time: string;
}

interface MessagesPageProps {
  patients: Patient[];
  chats: Record<string, Message[]>;
  activeChatId: string | null;
  onSetActiveChatId: (id: string | null) => void;
  onSendMessage: (patientId: string, text: string) => void;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({
  patients,
  chats,
  activeChatId,
  onSendMessage,
}) => {
  return (
    <MessagesPanel
      chats={chats}
      activeChatId={activeChatId}
      onSendMessage={onSendMessage}
      patients={patients}
    />
  );
};
