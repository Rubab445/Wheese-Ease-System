import React, { useState, useMemo } from 'react';
import ReportCardList from '../Components/ReportCard';
import ReportDetailPanel from './Reportdetailpanel';
import { 
  type Report, 
  type ReportStatus, 
  type ReportMessage,
  type InternalNote,
  type ReportTimelineEvent
} from '../types';
import '../Admin.module.css/Reports.css';
import { Search, RefreshCw, FileText, AlertCircle, Loader, CheckCircle2, Clock } from 'lucide-react';

// Mock data generator for initial state
const INITIAL_REPORTS: Report[] = [
  {
    id: 'RPT-2024-001',
    subject: 'AI Recommendation seems dangerous',
    description: 'The AI model suggested a high dose of preventer medication when my peak flow was actually improving. This seems contradictory to the guidance I received from my GP.',
    type: 'Wrong AI Recommendation',
    severity: 'critical',
    status: 'open',
    reporterName: 'Alice Khan',
    reporterRole: 'patient',
    reporterInitials: 'AK',
    patientId: 'WE-PA-102',
    dateSubmitted: '2024-11-05T09:42:00Z',
    messages: [
      { id: 'm1', senderName: 'Alice Khan', senderRole: 'patient', text: 'Please check this as soon as possible.', timestamp: '2024-11-05T09:42:00Z' }
    ],
    timeline: [
      { id: 't1', text: 'Report submitted', timestamp: '2024-11-05T09:42:00Z', type: 'submission' }
    ],
    internalNotes: []
  },
  {
    id: 'RPT-2024-002',
    subject: 'App crashing on symptom log',
    description: 'Every time I try to save my daily symptom log, the app closes unexpectedly. I have tried restarting my phone but the issue persists.',
    type: 'App Bug / Technical Issue',
    severity: 'high',
    status: 'inprogress',
    reporterName: 'Dr. Zafar',
    reporterRole: 'doctor',
    reporterInitials: 'DZ',
    dateSubmitted: '2024-11-04T14:12:00Z',
    messages: [
      { id: 'm1', senderName: 'Dr. Zafar', senderRole: 'doctor', text: 'Multiple patients are complaining about this.', timestamp: '2024-11-04T14:12:00Z' },
      { id: 'm2', senderName: 'Admin', senderRole: 'admin', text: 'We are investigating the API logs for crash reports.', timestamp: '2024-11-04T16:05:00Z' }
    ],
    timeline: [
      { id: 't1', text: 'Report submitted', timestamp: '2024-11-04T14:12:00Z', type: 'submission' },
      { id: 't2', text: 'Status changed to IN PROGRESS', timestamp: '2024-11-04T16:00:00Z', type: 'status_change' }
    ],
    internalNotes: [
      { id: 'n1', text: 'Looks like a memory leak in the log submission handler.', author: 'Admin', timestamp: '2024-11-04T16:10:00Z' }
    ]
  },
  {
    id: 'RPT-2024-003',
    subject: 'Wrong dosage in prescription',
    description: 'The digital prescription sent to the pharmacy has 500mg instead of 250mg for my preventer inhaler.',
    type: 'Prescription/Medication Error',
    severity: 'critical',
    status: 'resolved',
    reporterName: 'Samir Patel',
    reporterRole: 'patient',
    reporterInitials: 'SP',
    patientId: 'WE-PA-445',
    dateSubmitted: '2024-11-02T11:30:00Z',
    messages: [
      { id: 'm1', senderName: 'Samir Patel', senderRole: 'patient', text: 'I noticed this at the pharmacy.', timestamp: '2024-11-02T11:30:00Z' },
      { id: 'm2', senderName: 'Admin', senderRole: 'admin', text: 'The prescription has been corrected and re-sent.', timestamp: '2024-11-02T12:45:00Z' }
    ],
    timeline: [
      { id: 't1', text: 'Report submitted', timestamp: '2024-11-02T11:30:00Z', type: 'submission' },
      { id: 't2', text: 'Status changed to RESOLVED', timestamp: '2024-11-02T12:45:00Z', type: 'status_change' }
    ],
    internalNotes: []
  }
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');

  // Stats calculation
  const stats = useMemo(() => {
    const total = reports.length;
    const open = reports.filter(r => r.status === 'open').length;
    const inProgress = reports.filter(r => r.status === 'inprogress').length;
    const resolved = reports.filter(r => r.status === 'resolved').length;
    
    // Mock avg resolution time
    const avgTime = "4.2 hrs";

    return { total, open, inProgress, resolved, avgTime };
  }, [reports]);

  const selectedReport = useMemo(() => 
    reports.find(r => r.id === selectedId) || null
  , [reports, selectedId]);

  const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
    setReports(prev => prev.map(r => {
      if (r.id !== reportId) return r;
      
      const statusLabel = newStatus.replace('-', ' ').toUpperCase();
      const newEvent: ReportTimelineEvent = {
        id: `t-${Date.now()}`,
        text: `Status changed to ${statusLabel}`,
        timestamp: new Date().toISOString(),
        type: 'status_change'
      };

      return {
        ...r,
        status: newStatus,
        timeline: [...r.timeline, newEvent]
      };
    }));
  };

  const handleAddMessage = (reportId: string, text: string) => {
    setReports(prev => prev.map(r => {
      if (r.id !== reportId) return r;

      const newMessage: ReportMessage = {
        id: `m-${Date.now()}`,
        senderName: 'Admin',
        senderRole: 'admin',
        text,
        timestamp: new Date().toISOString()
      };

      const newEvent: ReportTimelineEvent = {
        id: `t-msg-${Date.now()}`,
        text: 'Admin sent a reply',
        timestamp: new Date().toISOString(),
        type: 'comment'
      };

      return {
        ...r,
        messages: [...r.messages, newMessage],
        timeline: [...r.timeline, newEvent]
      };
    }));
  };

  const handleAddInternalNote = (reportId: string, text: string) => {
    setReports(prev => prev.map(r => {
      if (r.id !== reportId) return r;

      const newNote: InternalNote = {
        id: `n-${Date.now()}`,
        text,
        author: 'Admin',
        timestamp: new Date().toISOString()
      };

      const newEvent: ReportTimelineEvent = {
        id: `t-note-${Date.now()}`,
        text: 'Admin added an internal note',
        timestamp: new Date().toISOString(),
        type: 'comment'
      };

      return {
        ...r,
        internalNotes: [...r.internalNotes, newNote],
        timeline: [...r.timeline, newEvent]
      };
    }));
  };

  return (
    <div className="rp-page">
      {/* Header */}
      <header className="rp-header">
        <div className="rp-header-left">
          <h1 className="rp-module-name">System Reports</h1>
          <p className="rp-header__sub">Complaint management and communication portal</p>
        </div>
        <div className="rp-header-actions">
          <button className="rp-filter-select" onClick={() => {
            setSearchQuery('');
            setFilterStatus('all');
            setFilterSeverity('all');
          }}>
            <RefreshCw size={14} style={{ marginRight: 6 }} /> Reset View
          </button>
        </div>
      </header>

      {/* Statistics Strip */}
      <div className="rp-stats-strip">
        <div className="rp-stat-item" style={{ borderTop: '4px solid #60A5FA' }}>
          <div className="rp-stat-icon-wrapper" style={{ color: '#60A5FA' }}><FileText size={20} /></div>
          <div className="rp-stat-content">
            <span className="rp-stat-item__value">{stats.total}</span>
            <span className="rp-stat-item__label">Total Reports</span>
          </div>
        </div>
        <div className="rp-stat-item" style={{ borderTop: '4px solid #34D399' }}>
          <div className="rp-stat-icon-wrapper" style={{ color: '#34D399' }}><AlertCircle size={20} /></div>
          <div className="rp-stat-content">
            <span className="rp-stat-item__value">{stats.open}</span>
            <span className="rp-stat-item__label">Open Issues</span>
          </div>
        </div>
        <div className="rp-stat-item" style={{ borderTop: '4px solid #A78BFA' }}>
          <div className="rp-stat-icon-wrapper" style={{ color: '#A78BFA' }}><Loader size={20} /></div>
          <div className="rp-stat-content">
            <span className="rp-stat-item__value">{stats.inProgress}</span>
            <span className="rp-stat-item__label">In Progress</span>
          </div>
        </div>
        <div className="rp-stat-item" style={{ borderTop: '4px solid #FB923C' }}>
          <div className="rp-stat-icon-wrapper" style={{ color: '#FB923C' }}><CheckCircle2 size={20} /></div>
          <div className="rp-stat-content">
            <span className="rp-stat-item__value">{stats.resolved}</span>
            <span className="rp-stat-item__label">Resolved</span>
          </div>
        </div>
        <div className="rp-stat-item" style={{ borderTop: '4px solid #F472B6' }}>
          <div className="rp-stat-icon-wrapper" style={{ color: '#F472B6' }}><Clock size={20} /></div>
          <div className="rp-stat-content">
            <span className="rp-stat-item__value">{stats.avgTime}</span>
            <span className="rp-stat-item__label">Avg. Resolution</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className={`rp-main ${selectedId ? 'has-selection' : ''}`}>
        <section className="rp-list-panel">
          <div className="rp-toolbar">
            <div className="rp-search-wrap">
              <Search className="rp-search-icon" size={16} />
              <input
                type="text"
                className="rp-search"
                placeholder="Search by ID, name, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="rp-filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="inprogress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="rp-filter-select"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="all">All Severity</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <ReportCardList
            reports={reports}
            selectedId={selectedId}
            onSelect={(report) => setSelectedId(report.id)}
            searchQuery={searchQuery}
            filterStatus={filterStatus}
            filterSeverity={filterSeverity}
          />
        </section>

        <section className="rp-detail-panel-wrapper">
          <ReportDetailPanel
            report={selectedReport}
            onStatusChange={handleStatusChange}
            onAddMessage={handleAddMessage}
            onAddInternalNote={handleAddInternalNote}
            onClose={() => setSelectedId(null)}
          />
        </section>
      </main>
    </div>
  );
};

export default Reports;
