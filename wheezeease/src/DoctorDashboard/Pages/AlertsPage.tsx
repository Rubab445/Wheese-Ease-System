import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAlerts } from '../../lib/patientService';
import {
    Search, X, Clock, Check, UserRoundSearch,
    ShieldAlert, Zap, Wind, Smartphone, Bell,
    Tag, Flag, MapPin, AlertCircle, Radio, MessageSquare,
    CheckCircle2, Filter, Trash2
} from 'lucide-react';
import '../../styles/AlertsPage.css'

interface Alert {
    id: string;
    type: 'ai' | 'emergency' | 'system' | 'warning';
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    message: string;
    timestamp: string;
    patientName?: string;
    patientId?: string;
    patientLocation?: string;
    actionRequired: boolean;
    read: boolean;
    aiNote?: string;
    triggerData?: {
        aqi?: number;
        pollen?: number;
        location?: string;
        affectedPatients?: number;
    };
}

const AlertsHub: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [isPriorityOnly, setIsPriorityOnly] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAlerts().then(data => {
            setAlerts(data as Alert[]);
            setIsLoading(false);
        });
    }, []);

    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = searchTerm === '' ||
            alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alert.patientName && alert.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesType = filterType === 'all' || alert.type === filterType;
        const matchesPriority = !isPriorityOnly || alert.severity === 'critical';

        return matchesSearch && matchesType && matchesPriority;
    });

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleResolveAll = () => {
        if (window.confirm('Mark all currently visible alerts as resolved?')) {
            const visibleIds = filteredAlerts.map(a => a.id);
            setAlerts(prev => prev.map(a => visibleIds.includes(a.id) ? { ...a, read: true } : a));
        }
    };

    const handleBroadcast = (location: string) => {
        alert(`BROADCAST: Sending preventive protocols to all patients in ${location}.`);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
                <div style={{ width: 36, height: 36, border: '3px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: '#6B7280', fontSize: 14 }}>Loading alerts...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <div className="alerts-page-wrapper">
            {/* Header with Live Pulse */}
            <div className="alerts-header">
                <h1>
                    Alerts Hub
                    <div className="live-pulse" title="Live monitoring active" />
                </h1>

            </div>

            {/* Main Controls */}
            <div className="alerts-controls">
                <div className="search-container">
                    <Search className="search-icon-fixed" size={16} />
                    <input
                        type="text"
                        placeholder="Search alerts or patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group">
                    <div className="priority-toggle">
                        <button
                            className={!isPriorityOnly ? 'active' : ''}
                            onClick={() => setIsPriorityOnly(false)}
                        >
                            All Cases
                        </button>
                        <button
                            className={isPriorityOnly ? 'active' : ''}
                            onClick={() => setIsPriorityOnly(true)}
                        >
                            <Flag size={12} style={{ marginRight: '4px' }} />
                            Critical Only
                        </button>
                    </div>
                    <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Categories</option>
                        <option value="ai">AI Insights</option>
                        <option value="emergency">Emergency SOS</option>
                        <option value="warning">Environmental</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Toolbar */}
            <div className="bulk-actions-bar">
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {filteredAlerts.length} Alerts found
                </div>
                <div className="bulk-btn-group">
                    <button className="bulk-btn" onClick={handleResolveAll}>
                        <CheckCircle2 size={14} /> Resolve Visible
                    </button>
                    <button className="bulk-btn" onClick={() => setAlerts(prev => prev.filter(a => !a.read))}>
                        <Trash2 size={14} /> Clear Read
                    </button>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="alerts-table-card">
                <table className="alerts-main-table">
                    <thead>
                        <tr>
                            <th style={{ width: '60px' }}>Type</th>
                            <th>Alert Details & Context</th>
                            <th style={{ width: '180px' }}>Subject</th>
                            <th style={{ width: '110px' }}>Time</th>
                            <th style={{ width: '120px' }}>Severity</th>
                            <th style={{ width: '110px' }}>Status</th>
                            <th style={{ width: '140px' }}>Smart Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlerts.map(alertItem => (
                            <tr key={alertItem.id} className={!alertItem.read ? 'unread-row' : ''}>
                                <td>
                                    <div className={`alert-type-pill ${alertItem.type}`}>
                                        {alertItem.type === 'ai' ? <Zap size={16} /> :
                                            alertItem.type === 'emergency' ? <ShieldAlert size={16} /> :
                                                alertItem.type === 'warning' ? <Wind size={16} /> : <Smartphone size={16} />}
                                    </div>
                                </td>
                                <td onClick={() => setSelectedAlert(alertItem)} style={{ cursor: 'pointer' }}>
                                    <div className="alert-info-cell">
                                        <div className="alert-title-main">{alertItem.title}</div>
                                        <div className="alert-msg-sub">{alertItem.message}</div>
                                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                                            {alertItem.patientLocation && (
                                                <span className="tag-city">
                                                    <MapPin size={10} /> {alertItem.patientLocation}
                                                </span>
                                            )}
                                            {alertItem.triggerData?.aqi && (
                                                <span className="tag-data">AQI: {alertItem.triggerData.aqi}</span>
                                            )}
                                            {alertItem.triggerData?.pollen && (
                                                <span className="tag-data">Pollen: {alertItem.triggerData.pollen}</span>
                                            )}
                                            {alertItem.aiNote && (
                                                <span className="tag-ai-note">{alertItem.aiNote}</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="alert-info-cell">
                                        <div style={{ fontSize: '13px', fontWeight: '700' }}>{alertItem.patientName || 'Global System'}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alertItem.patientId || 'Meteorological'}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="status-indicator" style={{ color: 'var(--text-muted)' }}>
                                        <Clock size={12} /> {formatTime(alertItem.timestamp)}
                                    </div>
                                </td>
                                <td>
                                    <span className={`severity-pill ${alertItem.severity}`}>
                                        {alertItem.severity}
                                    </span>
                                </td>
                                <td>
                                    <div className="status-indicator">
                                        <div className={`status-dot ${alertItem.read ? 'read' : 'unread'}`} />
                                        {alertItem.read ? 'Resolved' : 'Active'}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {alertItem.type === 'system' || (alertItem.type === 'ai' && alertItem.triggerData?.location) ? (
                                            <button
                                                className="action-icon-btn btn-broadcast"
                                                title="Broadcast Protocol"
                                                onClick={() => handleBroadcast(alertItem.patientLocation || 'Region')}
                                            >
                                                <Radio size={14} />
                                            </button>
                                        ) : alertItem.type === 'emergency' ? (
                                            <button
                                                className="action-icon-btn btn-emergency"
                                                title="Message Patient"
                                                onClick={() => alert(`OPENING RESPONSE TEMPLATE FOR ${alertItem.patientName}`)}
                                            >
                                                <MessageSquare size={14} />
                                            </button>
                                        ) : (
                                            <button className="action-icon-btn" title="Review Context" onClick={() => navigate('/patients')}>
                                                <UserRoundSearch size={14} />
                                            </button>
                                        )}
                                        {!alertItem.read && (
                                            <button className="action-icon-btn" title="Resolve" onClick={() => {
                                                setAlerts(prev => prev.map(a => a.id === alertItem.id ? { ...a, read: true } : a));
                                            }}>
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {filteredAlerts.length === 0 && (
                    <div className="all-clear-state">
                        <div className="success-circle">
                            <CheckCircle2 size={32} />
                        </div>
                        <h3>All Clear</h3>
                        <p>No pending alerts found. All patients are currently within stable clinical parameters.</p>
                    </div>
                )}
            </div>

            {/* Alert Modal */}
            {selectedAlert && (
                <div className="alert-modal-overlay" onClick={() => setSelectedAlert(null)}>
                    <div className="alert-modal-card" onClick={e => e.stopPropagation()}>
                        <div className="alert-modal-header">
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <span className={`severity-pill ${selectedAlert.severity}`}>{selectedAlert.severity}</span>
                                    <span className="tag-ai-note">{selectedAlert.aiNote || 'Clinical Analysis'}</span>
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{selectedAlert.title}</h2>
                            </div>
                            <button className="action-icon-btn" onClick={() => setSelectedAlert(null)}><X size={16} /></button>
                        </div>
                        <div className="alert-modal-body">
                            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '20px' }}>
                                {selectedAlert.message}
                            </p>

                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <h4 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px' }}>Incident Context</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Location</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700' }}>{selectedAlert.patientLocation || 'Global'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>AI Confidence</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#16A34A' }}>94.2%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="alert-modal-footer">
                            <button className="btn-modern-secondary" onClick={() => setSelectedAlert(null)}>Cancel</button>
                            <button className="btn-modern-primary" onClick={() => {
                                setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, read: true } : a));
                                setSelectedAlert(null);
                            }}>Mark as Resolved</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertsHub;