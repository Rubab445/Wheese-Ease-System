import React, { useState } from "react";
import { THEME_COLORS } from "../../data/constants";

interface Message {
  from: "in" | "out";
  text: string;
  time: string;
}

interface MessagesPanelProps {
  chats: Record<string, Message[]>;
  activeChatId: string | null;
  onSendMessage: (patientId: string, text: string) => void;
  patients: any[];
}

export const MessagesPanel: React.FC<MessagesPanelProps> = ({
  chats,
  activeChatId,
  onSendMessage,
  patients,
}) => {
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    if (messageText.trim() && activeChatId) {
      onSendMessage(activeChatId, messageText);
      setMessageText("");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        background: THEME_COLORS.bg,
      }}
    >
      {/* Patient List */}
      <div
        style={{
          width: "260px",
          borderRight: `1px solid ${THEME_COLORS.border}`,
          display: "flex",
          flexDirection: "column",
          background: THEME_COLORS.white,
          overflowY: "auto",
        }}
      >
        {patients.map((p) => (
          <div
            key={p.id}
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${THEME_COLORS.border}`,
              cursor: "pointer",
              background:
                activeChatId === p.id ? THEME_COLORS.blueBg : "transparent",
              borderLeft:
                activeChatId === p.id
                  ? `3px solid ${THEME_COLORS.blue}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: p.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "11px",
                }}
              >
                {p.av}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: THEME_COLORS.text,
                  }}
                >
                  {p.name}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: THEME_COLORS.muted,
                  }}
                >
                  {p.condition}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeChatId && chats[activeChatId] ? (
          <>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              {chats[activeChatId].map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.from === "out" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "60%",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background:
                        msg.from === "out"
                          ? THEME_COLORS.blue
                          : THEME_COLORS.bg,
                      color: msg.from === "out" ? "#fff" : THEME_COLORS.text,
                      fontSize: "13px",
                      lineHeight: "1.4",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "16px",
                borderTop: `1px solid ${THEME_COLORS.border}`,
                background: THEME_COLORS.white,
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  border: `1px solid ${THEME_COLORS.border}`,
                  borderRadius: "10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  padding: "10px 16px",
                  background: THEME_COLORS.blue,
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: THEME_COLORS.muted,
            }}
          >
            Select a patient to start messaging
          </div>
        )}
      </div>
    </div>
  );
};
