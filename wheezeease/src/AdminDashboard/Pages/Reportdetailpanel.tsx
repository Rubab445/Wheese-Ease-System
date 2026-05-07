

import React, { useState, useEffect } from "react";
import {type Report, type ReportStatus,type Severity } from '../../AdminDashboard/Components/ReportCard'
import '../Admin.module.css/Reports.css'

// ─── Types ────────────────────────────────────────────────────

interface AdminNote {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

interface TimelineEvent {
  id: number;
  text: string;
  timestamp: string;
}

interface ReportDetailPanelProps {
  report: Report | null;
  onStatusChange: (reportId: string, newStatus: ReportStatus) => void;
  onClose: () => void;
}

// ─── Constants ────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ReportStatus; label: string }[] = [
  { value: "open",       label: "Open"        },
  { value: "inprogress", label: "In Progress" },
  { value: "resolved",   label: "Resolved"    },
  { value: "closed",     label: "Closed"      },
];

const SEVERITY_COLORS: Record<Severity, string> = {
  critical: "var(--severity-critical)",
  high:     "var(--severity-high)",
  medium:   "var(--severity-medium)",
  low:      "var(--severity-low)",
};

const TYPE_DESCRIPTIONS: Record<string, string> = {
  "Wrong AI Recommendation":
    "The AI model produced an inaccurate or potentially harmful recommendation for this patient. Review the AI log for the corresponding prediction.",
  "App Bug / Technical Issue":
    "A technical malfunction was reported. Check system logs for errors around the submission time.",
  "Incorrect Symptom Data":
    "The patient or doctor believes symptom data was logged incorrectly, either by the user or by the AI layer.",
  "Prescription/Medication Error":
    "A medication-related discrepancy was flagged. Requires immediate review by clinical staff.",
  "Account or Access Problem":
    "Login, permissions, or role-based access issues were reported.",
  "Environmental Data Mismatch":
    "Environmental API data (AQI, pollen, humidity) appears inconsistent with actual local conditions.",
  Other: "General report — see description for details.",
};

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Component ────────────────────────────────────────────────

const ReportDetailPanel: React.FC<ReportDetailPanelProps> = ({
  report,
  onStatusChange,
  onClose,
}) => {
  const [notes, setNotes]           = useState<AdminNote[]>([]);
  const [noteInput, setNoteInput]   = useState<string>("");
  const [replyInput, setReplyInput] = useState<string>("");
  const [replySent, setReplySent]   = useState<boolean>(false);
  const [timeline, setTimeline]     = useState<TimelineEvent[]>([]);

  // Reset state when a new report is selected
  useEffect(() => {
    if (!report) return;
    setNotes([]);
    setNoteInput("");
    setReplyInput("");
    setReplySent(false);
    setTimeline([
      {
        id: 1,
        text: `Report submitted by ${report.reporterName} (${report.reporterRole})`,
        timestamp: report.dateSubmitted,
      },
    ]);
  }, [report?.id]);

  if (!report) {
    return (
      <div className="rdp-empty">
        <div className="rdp-empty__icon">🗂️</div>
        <div className="rdp-empty__title">Select a Report</div>
        <div className="rdp-empty__sub">
          Click any report from the list to view details, manage status, and
          respond to the reporter.
        </div>
      </div>
    );
  }

  // ── Handlers ────────────────────────────────────────────────

  const handleStatusChange = (newStatus: ReportStatus): void => {
    if (newStatus === report.status) return;
    onStatusChange(report.id, newStatus);
    const label =
      STATUS_OPTIONS.find((s) => s.value === newStatus)?.label ?? newStatus;
    setTimeline((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `Status changed to "${label}" by Admin`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleAddNote = (): void => {
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    const newNote: AdminNote = {
      id: Date.now(),
      text: trimmed,
      author: "Admin",
      timestamp: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
    setNoteInput("");
    setTimeline((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: `Admin added an internal note`,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSendReply = (): void => {
    const trimmed = replyInput.trim();
    if (!trimmed) return;
    setReplySent(true);
    setReplyInput("");
    setTimeline((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: `Admin sent a reply to ${report.reporterName}`,
        timestamp: new Date().toISOString(),
      },
    ]);
    setTimeout(() => setReplySent(false), 5000);
  };

  const handleNoteKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && e.ctrlKey) handleAddNote();
  };

  // ── Render ──────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div className="rdp-header">
        <div>
          <div className="rdp-id">{report.id}</div>
          <div
            className="rdp-subject"
            style={{
              borderLeft: `3px solid ${SEVERITY_COLORS[report.severity]}`,
              paddingLeft: 10,
            }}
          >
            {report.subject}
          </div>
        </div>
        <button
          className="rdp-close-btn"
          onClick={onClose}
          aria-label="Close detail panel"
        >
          ✕
        </button>
      </div>

      {/* Badges */}
      <div className="rdp-badges">
        <span className={`rp-badge rp-badge--severity-${report.severity}`}>
          {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
        </span>
        <span className={`rp-badge rp-badge--status-${report.status}`}>
          {STATUS_OPTIONS.find((s) => s.value === report.status)?.label}
        </span>
        <span className={`rp-badge rp-badge--role-${report.reporterRole}`}>
          {report.reporterRole}
        </span>
        <span className="rp-badge rp-badge--type">{report.type}</span>
      </div>

      {/* Reporter info */}
      <div className="rdp-section">
        <div className="rdp-section-title">Reporter</div>
        <div className="rdp-reporter-card">
          <div
            className={`rdp-avatar rdp-avatar--${report.reporterRole}`}
          >
            {report.reporterInitials}
          </div>
          <div>
            <div className="rdp-reporter-name">{report.reporterName}</div>
            <div className="rdp-reporter-meta">
              {report.reporterRole.charAt(0).toUpperCase() +
                report.reporterRole.slice(1)}{" "}
              ·{" "}
              {report.patientId
                ? `Patient ID: ${report.patientId}`
                : "No linked patient ID"}{" "}
              · Submitted {formatDateTime(report.dateSubmitted)}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rdp-section">
        <div className="rdp-section-title">Description</div>
        <div className="rdp-description">{report.description}</div>
      </div>

      {/* AI note for wrong recommendation reports */}
      {report.type === "Wrong AI Recommendation" && (
        <div className="rdp-section">
          <div className="rdp-section-title">AI Flag</div>
          <div
            className="rdp-description"
            style={{
              borderLeft: "3px solid var(--accent-amber)",
              background: "#fffbeb",
              color: "var(--accent-amber)",
            }}
          >
            ⚠ This report concerns an AI-generated recommendation. Cross-check
            the AI Activity Log in the AI Monitoring Module for predictions
            linked to {report.reporterName} around the submission date.
          </div>
        </div>
      )}

      {/* Type context hint */}
      <div className="rdp-section">
        <div className="rdp-section-title">Admin Guidance</div>
        <div
          className="rdp-description"
          style={{ color: "var(--text-muted)", fontStyle: "italic", fontSize: 12 }}
        >
          {TYPE_DESCRIPTIONS[report.type] ?? TYPE_DESCRIPTIONS["Other"]}
        </div>
      </div>

      {/* Status changer */}
      <div className="rdp-section">
        <div className="rdp-section-title">Change Status</div>
        <div className="rdp-status-row">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleStatusChange(s.value)}
              className={`rdp-status-btn ${
                report.status === s.value ? "rdp-status-btn--active" : ""
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Internal notes */}
      <div className="rdp-section">
        <div className="rdp-section-title">
          Internal Notes ({notes.length})
        </div>

        {notes.length > 0 && (
          <div className="rdp-notes-list">
            {notes.map((note) => (
              <div key={note.id} className="rdp-note">
                <div className="rdp-note__text">{note.text}</div>
                <div className="rdp-note__meta">
                  {note.author} · {formatDateTime(note.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="rdp-note-form" style={{ marginTop: notes.length > 0 ? 8 : 0 }}>
          <textarea
            className="rdp-note-input"
            placeholder="Add internal note (Ctrl+Enter to save)..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={handleNoteKeyDown}
          />
        </div>
        <button
          onClick={handleAddNote}
          className="rp-btn rp-btn--secondary"
          style={{ marginTop: 8, fontSize: 12, padding: "7px 14px" }}
          disabled={!noteInput.trim()}
        >
          + Add Note
        </button>
      </div>

      {/* Reply to reporter */}
      <div className="rdp-section">
        <div className="rdp-section-title">
          Reply to {report.reporterName}
        </div>

        {replySent ? (
          <div className="rdp-reply-sent">
            ✓ Reply sent to {report.reporterName}
          </div>
        ) : (
          <div className="rdp-reply-form">
            <textarea
              className="rdp-reply-input"
              placeholder={`Write a message to ${report.reporterName}...`}
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
            />
            <button
              onClick={handleSendReply}
              className="rp-btn rp-btn--primary"
              style={{ alignSelf: "flex-end", fontSize: 12 }}
              disabled={!replyInput.trim()}
            >
              Send Reply →
            </button>
          </div>
        )}
      </div>

      {/* Change history timeline */}
      <div className="rdp-section">
        <div className="rdp-section-title">History</div>
        <div className="rdp-timeline">
          {[...timeline].reverse().map((event) => (
            <div key={event.id} className="rdp-timeline-item">
              <div className="rdp-timeline-dot" />
              <div className="rdp-timeline-content">
                <div className="rdp-timeline-text">{event.text}</div>
                <div className="rdp-timeline-time">
                  {formatDateTime(event.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPanel;