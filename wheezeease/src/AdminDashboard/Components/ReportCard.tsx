

import React from "react";
import '../Admin.module.css/Reports.css'

// ─── Types ────────────────────────────────────────────────────

export type Severity = "critical" | "high" | "medium" | "low";
export type ReportStatus = "open" | "inprogress" | "resolved" | "closed";
export type ReporterRole = "patient" | "doctor";

export type ReportType =
  | "App Bug / Technical Issue"
  | "Wrong AI Recommendation"
  | "Incorrect Symptom Data"
  | "Prescription/Medication Error"
  | "Account or Access Problem"
  | "Environmental Data Mismatch"
  | "Other";

export interface Report {
  id: string;
  subject: string;
  description: string;
  type: ReportType;
  severity: Severity;
  status: ReportStatus;
  reporterName: string;
  reporterRole: ReporterRole;
  reporterInitials: string;
  patientId?: string;
  dateSubmitted: string;
  assignedTo?: string;
}

interface ReportCardListProps {
  reports: Report[];
  selectedId: string | null;
  onSelect: (report: Report) => void;
  searchQuery: string;
  filterStatus: string;
  filterSeverity: string;
}

// ─── Helpers ──────────────────────────────────────────────────

const severityLabel: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const statusLabel: Record<ReportStatus, string> = {
  open: "Open",
  inprogress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ─── Sub-component: Single Card ───────────────────────────────

interface ReportCardProps {
  report: Report;
  isSelected: boolean;
  onClick: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  isSelected,
  onClick,
}) => {
  return (
    <div
      className={`rc-card rc-card--${report.severity} ${
        isSelected ? "rc-card--selected" : ""
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-pressed={isSelected}
    >
      {/* Top row */}
      <div className="rc-card__top">
        <div>
          <div className="rc-card__id-row">
            <span className="rc-card__id">{report.id}</span>
            <span className="rp-badge rp-badge--type">{report.type}</span>
          </div>
          <div className="rc-card__subject">{report.subject}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <span className={`rp-badge rp-badge--severity-${report.severity}`}>
            {severityLabel[report.severity]}
          </span>
          <span className={`rp-badge rp-badge--status-${report.status}`}>
            {statusLabel[report.status]}
          </span>
        </div>
      </div>

      {/* Description preview */}
      <p className="rc-card__desc">{report.description}</p>

      {/* Bottom: reporter + date */}
      <div className="rc-card__bottom">
        <div className="rc-card__reporter">
          <div
            className={`rc-card__avatar rc-card__avatar--${report.reporterRole}`}
          >
            {report.reporterInitials}
          </div>
          <span className="rc-card__reporter-name">
            {report.reporterName}
          </span>
          <span className={`rp-badge rp-badge--role-${report.reporterRole}`}>
            {report.reporterRole}
          </span>
        </div>

        <div className="rc-card__meta">
          <span className="rc-card__date">{formatDate(report.dateSubmitted)}</span>
          {report.assignedTo && (
            <span
              style={{
                fontSize: 10,
                color: "var(--text-ghost)",
                fontFamily: "var(--font-mono)",
                background: "var(--bg-hover)",
                padding: "1px 6px",
                borderRadius: "var(--radius-pill)",
              }}
            >
              → {report.assignedTo}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main List Component ───────────────────────────────────────

const ReportCardList: React.FC<ReportCardListProps> = ({
  reports,
  selectedId,
  onSelect,
  searchQuery,
  filterStatus,
  filterSeverity,
}) => {
  // Filter logic
  const filtered = reports.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.subject.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.reporterName.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === "all" || r.status === filterStatus;

    const matchesSeverity =
      filterSeverity === "all" || r.severity === filterSeverity;

    return matchesSearch && matchesStatus && matchesSeverity;
  });

  if (filtered.length === 0) {
    return (
      <div className="rc-empty">
        <div className="rc-empty__icon">📭</div>
        <div className="rc-empty__text">No reports found</div>
        <div className="rc-empty__sub">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : "Try adjusting your filters"}
        </div>
      </div>
    );
  }

  return (
    <div className="rc-list">
      {filtered.map((report) => (
        <ReportCard
          key={report.id}
          report={report}
          isSelected={selectedId === report.id}
          onClick={() => onSelect(report)}
        />
      ))}
    </div>
  );
};

export default ReportCardList;