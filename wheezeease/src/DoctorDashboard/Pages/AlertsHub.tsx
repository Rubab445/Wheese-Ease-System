import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const [filterSeverity, setFilterSeverity] = useState<string>('all');
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    // Mock alerts data
    const [alerts, setAlerts] = useState<Alert[]>([
        {
            id: '1',
            type: 'ai',
            severity: 'critical',
            title: 'Extreme Pollen Spike Predicted',
            message: 'AI predicts 40% increase in pollen levels in Gujrat within 24 hours. 12 high-risk patients in this zone.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            patientLocation: 'Gujrat',
            actionRequired: true,
            read: false,
            triggerData: { pollen: 340, location: 'Gujrat', affectedPatients: 12 }
        },
        {
            id: '2',
            type: 'emergency',
            severity: 'critical',
            title: 'SOS Alert - Matt Smith',
            message: 'Patient reported severe breathing difficulty. Immediate attention required.',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            patientName: 'Matt Smith',
            patientId: 'PAT-001',
            patientLocation: 'Gujrat',
            actionRequired: true,
            read: false
        },
        {
            id: '3',
            type: 'warning',
            severity: 'high',
            title: 'High AQI Alert - Lahore',
            message: 'Air Quality Index reached 158 (Unhealthy). 6 patients in this area showing increased symptoms.',
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            patientLocation: 'Lahore',
            actionRequired: true,
            read: false,
            triggerData: { aqi: 158, location: 'Lahore', affectedPatients: 6 }
        },
        {
            id: '4',
            type: 'ai',
            severity: 'medium',
            title: 'Adherence Alert',
            message: 'Anna Jonson\'s medication adherence dropped to 65%. Schedule a follow-up.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            patientName: 'Anna Jonson',
            patientId: 'PAT-005',
            actionRequired: true,
            read: false
        },
        {
            id: '5',
            type: 'system',
            severity: 'medium',
            title: 'Patient Inactivity Warning',
            message: 'Michael Brown hasn\'t synced their device for 3 days. Check-in recommended.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            patientName: 'Michael Brown',
            patientId: 'PAT-009',
            actionRequired: false,
            read: true
        },
        {
            id: '6',
            type: 'emergency',
            severity: 'high',
            title: 'SOS Alert - Angelika Kravets',
            message: 'Patient reported chest tightness and wheezing. Rescue inhaler used.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            patientName: 'Angelika Kravets',
            patientId: 'PAT-002',
            patientLocation: 'Sialkot',
            actionRequired: true,
            read: true
        },
        {
            id: '7',
            type: 'ai',
            severity: 'low',
            title: 'Preventive Care Recommendation',
            message: 'High humidity expected in Karachi tomorrow. Suggest preventive medication for 3 patients.',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            patientLocation: 'Karachi',
            actionRequired: false,
            read: true,
            triggerData: { location: 'Karachi', affectedPatients: 3 }
        },
        {
            id: '8',
            type: 'warning',
            severity: 'high',
            title: 'PM2.5 Spike - Sialkot',
            message: 'PM2.5 levels reached dangerous levels. 4 warning patients in this zone.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            patientLocation: 'Sialkot',
            actionRequired: true,
            read: false,
            triggerData: { aqi: 189, location: 'Sialkot', affectedPatients: 4 }
        }
    ]);

    // Filter alerts
    const filteredAlerts = alerts.filter(alert => {
        const matchesSearch = searchTerm === '' ||
            alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alert.patientName && alert.patientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (alert.patientLocation && alert.patientLocation.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = filterType === 'all' || alert.type === filterType;
        const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
        
        return matchesSearch && matchesType && matchesSeverity;
    });

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hr ago`;
        return `${days} day ago`;
    };

    const markAsRead = (alertId: string) => {
        setAlerts(alerts.map(alert => 
            alert.id === alertId ? { ...alert, read: true } : alert
        ));
    };

    const handleReviewPatient = (patientId?: string) => {
        if (patientId) {
            navigate(`/patients/${patientId}`);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ai': return '🤖';
            case 'emergency': return '🚨';
            case 'warning': return '⚠️';
            case 'system': return '📱';
            default: return '📢';
        }
    };

    const getSeverityText = (severity: string) => {
        switch (severity) {
            case 'critical': return 'CRITICAL';
            case 'high': return 'HIGH';
            case 'medium': return 'MEDIUM';
            case 'low': return 'LOW';
            default: return '';
        }
    };

    return (
        <div className="alerts-container">
            {/* Header */}
            <div className="alerts-header">
                <div>
                    <h1>Alerts Hub</h1>
                    <p>Monitor and manage all patient alerts in one place</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="alerts-search-bar">
                <div className="search-input-wrapper">
                    <i className="fas fa-search search-icon"></i>
                    <input 
                        type="text" 
                        placeholder="Search by title, message, patient name or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
                <div className="filters-wrapper">
                    <div className="filter-dropdown">
                        <i className="fas fa-tag filter-icon"></i>
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                            <option value="all">All Types</option>
                            <option value="ai">🤖 AI Predictions</option>
                            <option value="emergency">🚨 SOS Alerts</option>
                            <option value="warning">⚠️ Warnings</option>
                            <option value="system">📱 System</option>
                        </select>
                    </div>
                    <div className="filter-dropdown">
                        <i className="fas fa-flag filter-icon"></i>
                        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                            <option value="all">All Severities</option>
                            <option value="critical">🔴 Critical</option>
                            <option value="high">🟠 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Alerts Table */}
            <div className="alerts-table-wrapper">
                <table className="alerts-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Alert Details</th>
                            <th>Patient</th>
                            <th>Time</th>
                            <th>Severity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlerts.map(alert => (
                            <tr key={alert.id} className={!alert.read ? 'unread' : ''}>
                                <td className="type-col">
                                    <span className="type-badge">{getTypeIcon(alert.type)}</span>
                                </td>
                                <td className="details-col" onClick={() => setSelectedAlert(alert)}>
                                    <div className="alert-title">{alert.title}</div>
                                    <div className="alert-message">{alert.message.substring(0, 70)}...</div>
                                    {alert.triggerData && (
                                        <div className="alert-tags">
                                            {alert.triggerData.aqi && <span className="tag">AQI: {alert.triggerData.aqi}</span>}
                                            {alert.triggerData.pollen && <span className="tag">Pollen: {alert.triggerData.pollen}</span>}
                                            {alert.triggerData.location && <span className="tag location">{alert.triggerData.location}</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="patient-col" onClick={() => setSelectedAlert(alert)}>
                                    {alert.patientName ? (
                                        <>
                                            <span className="patient-name">{alert.patientName}</span>
                                            <span className="patient-id">{alert.patientId}</span>
                                        </>
                                    ) : (
                                        <span className="system-alert">System Alert</span>
                                    )}
                                </td>
                                <td className="time-col">
                                    <i className="far fa-clock"></i> {formatTime(alert.timestamp)}
                                </td>
                                <td className="severity-col">
                                    <span className={`severity ${alert.severity}`}>
                                        {getSeverityText(alert.severity)}
                                    </span>
                                </td>
                                <td className="status-col">
                                    {!alert.read ? (
                                        <span className="status unread">Unread</span>
                                    ) : (
                                        <span className="status read">Read</span>
                                    )}
                                </td>
                                <td className="actions-col">
                                    <div className="action-buttons">
                                        {!alert.read && (
                                            <button 
                                                className="action-btn mark-read"
                                                onClick={() => markAsRead(alert.id)}
                                                title="Mark as read"
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                        {alert.patientId && (
                                            <button 
                                                className="action-btn review"
                                                onClick={() => handleReviewPatient(alert.patientId)}
                                                title="Review patient"
                                            >
                                                <i className="fas fa-user-md"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Empty State */}
                {filteredAlerts.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">🔔</div>
                        <h3>No alerts found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>

            {/* Alert Modal */}
            {selectedAlert && (
                <div className="modal-overlay" onClick={() => setSelectedAlert(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-icon">
                                {getTypeIcon(selectedAlert.type)}
                            </div>
                            <div className="modal-title">
                                <h2>{selectedAlert.title}</h2>
                                <div className="modal-meta">
                                    <span><i className="far fa-clock"></i> {formatTime(selectedAlert.timestamp)}</span>
                                    <span className={`severity ${selectedAlert.severity}`}>
                                        {getSeverityText(selectedAlert.severity)}
                                    </span>
                                </div>
                            </div>
                            <button className="modal-close" onClick={() => setSelectedAlert(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p className="modal-message">{selectedAlert.message}</p>
                            
                            {selectedAlert.triggerData && (
                                <div className="modal-section">
                                    <h4>Environmental Data</h4>
                                    <div className="data-grid">
                                        {selectedAlert.triggerData.aqi && (
                                            <div className="data-item">
                                                <span>AQI Level</span>
                                                <strong>{selectedAlert.triggerData.aqi}</strong>
                                            </div>
                                        )}
                                        {selectedAlert.triggerData.pollen && (
                                            <div className="data-item">
                                                <span>Pollen Count</span>
                                                <strong>{selectedAlert.triggerData.pollen}</strong>
                                            </div>
                                        )}
                                        {selectedAlert.triggerData.location && (
                                            <div className="data-item">
                                                <span>Location</span>
                                                <strong>{selectedAlert.triggerData.location}</strong>
                                            </div>
                                        )}
                                        {selectedAlert.triggerData.affectedPatients && (
                                            <div className="data-item">
                                                <span>Patients Affected</span>
                                                <strong>{selectedAlert.triggerData.affectedPatients}</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            
                            {selectedAlert.patientName && (
                                <div className="modal-section">
                                    <h4>Patient Details</h4>
                                    <div className="patient-info">
                                        <div><strong>Name:</strong> {selectedAlert.patientName}</div>
                                        <div><strong>ID:</strong> {selectedAlert.patientId}</div>
                                        {selectedAlert.patientLocation && (
                                            <div><strong>Location:</strong> {selectedAlert.patientLocation}</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            {selectedAlert.patientId && (
                                <button className="btn-review" onClick={() => {
                                    setSelectedAlert(null);
                                    handleReviewPatient(selectedAlert.patientId);
                                }}>
                                    <i className="fas fa-user-md"></i> Review Patient
                                </button>
                            )}
                            {!selectedAlert.read && (
                                <button className="btn-mark-read" onClick={() => {
                                    markAsRead(selectedAlert.id);
                                    setSelectedAlert(null);
                                }}>
                                    <i className="fas fa-check"></i> Mark as Read
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlertsHub;