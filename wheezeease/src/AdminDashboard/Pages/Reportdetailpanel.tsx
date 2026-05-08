import React, { useState, useEffect, useRef } from "react";
import { 
  type Report, 
  type ReportStatus, 
  type ReportSeverity
} from '../types';
import { 
  X, Send, AlertCircle, Clock,
  MessageSquare, FileText,
  Lock, CheckCircle2, Mailbox
} from 'lucide-react';
import '../Admin.module.css/Reports.css';

interface ReportDetailPanelProps {
  report: Report | null;
  onStatusChange: (reportId: string, newStatus: ReportStatus) => void;
  onAddMessage: (reportId: string, text: string) => void;
  onAddInternalNote: (reportId: string, text: string) => void;
  onClose: () => void;
}

const ReportDetailPanel: React.FC<ReportDetailPanelProps> = ({
  report,
  onStatusChange,
  onAddMessage,
  onAddInternalNote,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'dialog' | 'internal' | 'history'>('dialog');
  const [messageInput, setMessageInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === 'dialog') {
      scrollToBottom();
    }
  }, [report?.messages, activeTab]);

  if (!report) {
    return (
      <div className="rdp-empty">
        <div className="rdp-empty-icon"><Mailbox size={32} /></div>
        <h3>Select a report to view details</h3>
        <p>Choose a report from the list to start investigating and resolving the issue.</p>
      </div>
    );
  }

  const isLocked = report.status === 'resolved' || report.status === 'closed';

  const handleSendMessage = () => {
    if (!messageInput.trim() || isLocked) return;
    onAddMessage(report.id, messageInput);
    setMessageInput("");
  };

  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    onAddInternalNote(report.id, noteInput);
    setNoteInput("");
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString([], { day: '2-digit', month: 'short' });
  };

  return (
    <div className="rdp-container">
      {/* Header */}
      <div className="rdp-header">
        <div className="rdp-header-top">
          <div className="rdp-title-group">
            <span className="rdp-id">{report.id}</span>
            <h2 className="rdp-subject">{report.subject}</h2>
          </div>
          <button className="rdp-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="rdp-meta-strip">
          <div className="rdp-reporter-info">
            <div className={`rdp-avatar rdp-avatar-${report.reporterRole}`}>
              {report.reporterInitials}
            </div>
            <div className="rdp-reporter-text">
              <span className="rdp-name">{report.reporterName}</span>
              <span className="rdp-role">{report.reporterRole}</span>
            </div>
          </div>
          <div className="rdp-badges">
            <span className={`rp-badge rp-badge-severity-${report.severity}`}>
              {report.severity.toUpperCase()}
            </span>
            <span className={`rp-badge rp-badge-status-${report.status}`}>
              {report.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rdp-main">
        {/* Description & Context Section */}
        <div className="rdp-content-section">
          <div className="rdp-section-label">
            <FileText size={14} /> Problem Description
          </div>
          <div className="rdp-description-card">
            <p>{report.description}</p>
            <div className="rdp-timestamp">
              Submitted {formatDate(report.dateSubmitted)} at {formatTime(report.dateSubmitted)}
            </div>
          </div>

          {report.type === "Wrong AI Recommendation" && (
            <div className="rdp-ai-alert">
              <div className="rdp-ai-alert-icon">
                <AlertCircle size={18} />
              </div>
              <div className="rdp-ai-alert-content">
                <strong>AI Monitoring Flag</strong>
                <p>This report concerns an AI prediction. Please cross-check the AI Monitoring Module to investigate the prediction generated for this patient.</p>
              </div>
            </div>
          )}
          
          {report.patientId && (
            <div className="rdp-linked-info">
              <strong>Linked Patient:</strong> {report.patientId}
            </div>
          )}
        </div>

        {/* Workspace Tabs */}
        <div className="rdp-workspace">
          <div className="rdp-tabs">
            <button 
              className={`rdp-tab ${activeTab === 'dialog' ? 'active' : ''}`}
              onClick={() => setActiveTab('dialog')}
            >
              <MessageSquare size={16} /> Dialog Thread
            </button>
            <button 
              className={`rdp-tab ${activeTab === 'internal' ? 'active' : ''}`}
              onClick={() => setActiveTab('internal')}
            >
              <Lock size={16} /> Internal Notes
            </button>
            <button 
              className={`rdp-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={16} /> Timeline
            </button>
          </div>

          <div className="rdp-tab-content">
            {activeTab === 'dialog' && (
              <div className="rdp-dialog-pane">
                <div className="rdp-messages-list">
                  {report.messages.map((msg) => (
                    <div key={msg.id} className={`rdp-message ${msg.senderRole === 'admin' ? 'admin' : 'user'}`}>
                      <div className="rdp-message-bubble">
                        <div className="rdp-message-header">
                          <span className="rdp-msg-sender">{msg.senderName}</span>
                          <span className="rdp-msg-time">{formatTime(msg.timestamp)}</span>
                        </div>
                        <div className="rdp-message-text">{msg.text}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="rdp-input-area">
                  {isLocked ? (
                    <div className="rdp-locked-notice">
                      <Lock size={14} /> This thread is locked because the report is resolved/closed.
                    </div>
                  ) : (
                    <>
                      <textarea 
                        placeholder="Write a reply to the reporter..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                        <Send size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'internal' && (
              <div className="rdp-internal-pane">
                <div className="rdp-notes-list">
                  {report.internalNotes.length === 0 ? (
                    <div className="rdp-empty-state">No internal notes yet.</div>
                  ) : (
                    report.internalNotes.map((note) => (
                      <div key={note.id} className="rdp-note-item">
                        <div className="rdp-note-header">
                          <strong>{note.author}</strong>
                          <span>{formatDate(note.timestamp)} {formatTime(note.timestamp)}</span>
                        </div>
                        <div className="rdp-note-text">{note.text}</div>
                      </div>
                    ))
                  )}
                </div>
                <div className="rdp-note-input-area">
                  <textarea 
                    placeholder="Add a private note for the admin team..."
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                  />
                  <button onClick={handleAddNote} disabled={!noteInput.trim()}>
                    Add Internal Note
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="rdp-history-pane">
                <div className="rdp-timeline">
                  {report.timeline.map((event) => (
                    <div key={event.id} className="rdp-timeline-event">
                      <div className="rdp-timeline-dot" />
                      <div className="rdp-timeline-content">
                        <div className="rdp-event-text">{event.text}</div>
                        <div className="rdp-event-time">{formatDate(event.timestamp)} · {formatTime(event.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="rdp-footer">
        <div className="rdp-status-actions">
          <span className="rdp-footer-label">UPDATE STATUS:</span>
          <div className="rdp-status-btns">
            <button 
              className={`rdp-status-btn open ${report.status === 'open' ? 'active' : ''}`}
              onClick={() => onStatusChange(report.id, 'open')}
            >
              Open
            </button>
            <button 
              className={`rdp-status-btn in-progress ${report.status === 'inprogress' ? 'active' : ''}`}
              onClick={() => onStatusChange(report.id, 'inprogress')}
            >
              In Progress
            </button>
            <button 
              className={`rdp-status-btn resolved ${report.status === 'resolved' ? 'active' : ''}`}
              onClick={() => onStatusChange(report.id, 'resolved')}
            >
              <CheckCircle2 size={14} /> Resolve
            </button>
            <button 
              className={`rdp-status-btn closed ${report.status === 'closed' ? 'active' : ''}`}
              onClick={() => onStatusChange(report.id, 'closed')}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPanel;