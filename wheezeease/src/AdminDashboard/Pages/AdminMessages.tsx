import React, { useState } from "react";
import {
  MoreVertical, Send, CheckCheck, Paperclip,
  Smile, Search as SearchIcon, Mic,
  Image, FileText, User, Camera, X
} from "lucide-react";
import "../../AdminDashboard/Admin.module.css/adminMessages.css";

const AdminMessages: React.FC = () => {
  const [activeChat, setActiveChat] = useState(0);
  const [typedMsg, setTypedMsg] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // 🔥 MOBILE STATE ADDED
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const [chats, setChats] = useState([
    {
      id: 0,
      name: "Ali Ahmad",
      online: true,
      history: [{ t: "Bhai report ready hai?", s: false, time: "12:00 PM" }]
    },
    {
      id: 1,
      name: "Sara Khan",
      online: false,
      history: [{ t: "Okay, thanks!", s: false, time: "11:30 AM" }]
    }
  ]);

  const addEmoji = (emoji: string) => {
    setTypedMsg(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMsg.trim()) return;

    const newMsg = { t: typedMsg, s: true, time: "Just now" };
    const updatedChats = [...chats];
    updatedChats[activeChat].history.push(newMsg);

    setChats(updatedChats);
    setTypedMsg("");
  };

  return (
    <div className="admin-wa-full-screen">
      <div className={`admin-wa-container ${isMobileChatOpen ? "chat-open" : "chat-closed"}`}>

        {/* ================= SIDEBAR ================= */}
        <div className="admin-wa-aside">
          <header className="admin-wa-aside-header">
            <div className="admin-wa-user-avatar">T</div>

            <div className="admin-wa-actions">
              <MoreVertical
                onClick={() => setShowMenu(!showMenu)}
                className="clickable-icon"
              />

              {showMenu && (
                <div className="admin-wa-dropdown-menu">
                  <ul>
                    <li>New Group</li>
                    <li>Starred Messages</li>
                    <li>Settings</li>
                    <li onClick={() => setShowMenu(false)}>Log out</li>
                  </ul>
                </div>
              )}
            </div>
          </header>

          <div className="admin-wa-search-box">
            <div className="admin-wa-search-field">
              <SearchIcon size={18} />
              <input placeholder="Search or start new chat" />
            </div>
          </div>

          <div className="admin-wa-contacts-list">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`admin-wa-chat-row ${activeChat === chat.id ? "active" : ""}`}
                onClick={() => {
                  setActiveChat(chat.id);
                  setIsMobileChatOpen(true); // 🔥 open chat on mobile
                }}
              >
                <div className={`pfp ${chat.online ? "online" : ""}`}>
                  {chat.name[0]}
                </div>

                <div className="chat-meta">
                  <div className="row">
                    <span>{chat.name}</span>
                    <small>12:00 PM</small>
                  </div>
                  <p>{chat.history[chat.history.length - 1].t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CHAT WINDOW ================= */}
        <div className="admin-wa-chat-window">

          {/* HEADER */}
         <header className="admin-wa-chat-header">

  {/* 🔥 BACK ICON (mobile only) */}
  <div
    className="mobile-back-btn"
    onClick={() => setIsMobileChatOpen(false)}
  >
    ←
  </div>

  <div className="admin-wa-user-meta">
    <div className="pfp-small">
      {chats[activeChat].name[0]}
    </div>

    <div>
      <h3>{chats[activeChat].name}</h3>
      <p>{chats[activeChat].online ? "online" : "offline"}</p>
    </div>
  </div>

  <div className="admin-wa-header-tools">
    <SearchIcon onClick={() => setIsSearching(true)} />
    <MoreVertical />
  </div>

  {isSearching && (
    <div className="admin-wa-search-overlay">
      <SearchIcon size={18} />
      <input placeholder="Search in chat..." autoFocus />
      <X onClick={() => setIsSearching(false)} className="close-btn" />
    </div>
  )}
</header>

          {/* MESSAGES */}
          <div className="admin-wa-chat-body">
            {chats[activeChat].history.map((m, i) => (
              <div
                key={i}
                className={`msg-wrapper ${m.s ? "sent" : "received"}`}
              >
                <div className="msg-bubble">
                  {m.t}
                  <span className="msg-time">
                    {m.time} {m.s && <CheckCheck size={14} />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <footer className="admin-wa-chat-footer">

            <div className="control-group">
              <Smile
                onClick={() => setShowEmojis(!showEmojis)}
                className={showEmojis ? "active-icon" : ""}
              />

              {showEmojis && (
                <div className="admin-wa-emoji-panel">
                  {["😊", "😂", "🔥", "👍", "❤️", "🙌", "✨", "🤔"].map(e => (
                    <span key={e} onClick={() => addEmoji(e)}>
                      {e}
                    </span>
                  ))}
                </div>
              )}

              <div className="attach-wrapper">
                <Paperclip
                  onClick={() => setShowAttach(!showAttach)}
                  className={showAttach ? "active-icon" : ""}
                />

                {showAttach && (
                  <div className="admin-wa-attach-menu">
                    <div className="attach-item">
                      <Image size={20} /> Photos
                    </div>
                    <div className="attach-item">
                      <Camera size={20} /> Camera
                    </div>
                    <div className="attach-item">
                      <FileText size={20} /> Document
                    </div>
                    <div className="attach-item">
                      <User size={20} /> Contact
                    </div>
                  </div>
                )}
              </div>
            </div>

            <form className="admin-wa-input-form" onSubmit={handleSend}>
              <input
                placeholder="Type a message"
                value={typedMsg}
                onChange={e => setTypedMsg(e.target.value)}
              />

              <button type="submit">
                {typedMsg ? <Send size={24} /> : <Mic size={24} />}
              </button>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;