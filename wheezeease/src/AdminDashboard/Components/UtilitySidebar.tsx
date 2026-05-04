import React, { useState } from 'react';
import '../Admin.module.css/UtilitySidebar.css';

const UtilityBar: React.FC = () => {
  const [msg, setMsg] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [list, setList] = useState([
    { id: 1, user: "AI", text: "Oxygen Drop: Ward 2 🫁", time: "10:15", type: "critical" },
    { id: 2, user: "Dr. Ahmad", text: "Report updated ✅", time: "10:45", type: "normal" }
  ]);

  const emojis = ["😊", "😂", "🚀", "✅", "⚠️", "🚨", "🫁", "👍", "🏥", "💉"];

  const send = () => {
    if (!msg.trim()) return;
    const newItem = {
      id: Date.now(),
      user: "You",
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: "user"
    };
    setList([newItem, ...list]);
    setMsg('');
    setShowEmoji(false);
  };

  const addEmoji = (emoji: string) => {
    setMsg(prev => prev + emoji);
  };

  return (
    <div className="ub-container">

      {/* PROFILE SECTION */}
      <div className="ub-profile-card">
        <div className="ub-avatar-box">
          <div className="ub-avatar">A</div>
          <span className="ub-online-dot"></span>
        </div>
        <h3 className="ub-name">Ahmad</h3>
        <p className="ub-tag">@admin</p>
        <div className="ub-top-actions">
          <button>💬</button>
          <button>📹</button>
          <button>⚙️</button>
        </div>
      </div>

      <div className="ub-divider">Activity</div>

      {/* FEED */}
      <div className="ub-feed-area">
        {list.map(item => (
          <div key={item.id} className={`ub-msg-card ${item.type}`}>
            <div className="ub-card-info">
              <strong>{item.user}</strong>
              <span>{item.time}</span>
            </div>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="ub-input-footer">
        {showEmoji && (
          <div className="ub-emoji-dropdown">
            {emojis.map(e => (
              <span key={e} onClick={() => addEmoji(e)}>{e}</span>
            ))}
          </div>
        )}

        <div className="ub-input-row">
          <button className="emoji-trigger" onClick={() => setShowEmoji(!showEmoji)}>😊</button>
          <input
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
          />
          <button className="send-btn" onClick={send}>🚀</button>
        </div>
      </div>
    </div>
  );
};

export default UtilityBar;