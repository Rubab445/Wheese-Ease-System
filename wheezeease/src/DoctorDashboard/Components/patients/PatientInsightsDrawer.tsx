import React, { useEffect, useState } from 'react';
import { X, Activity, ShieldAlert, AlertTriangle, Wind, Bell, History, LineChart } from 'lucide-react';
import type { Patient } from '../../../types/patient.types';
import { fetchActivityLogs } from '../../../lib/patientService';

interface ActivityEntry {
  text: string;
  note?: string;
  time: string;
}

interface PatientInsightsDrawerProps {
  isOpen: boolean;
  patient: Patient | null;
  onClose: () => void;
  onSendUrgentAlert: (patient: Patient) => void;
}

const PatientInsightsDrawer: React.FC<PatientInsightsDrawerProps> = ({
  isOpen,
  patient,
  onClose,
  onSendUrgentAlert,
}) => {
  const [activityLogs, setActivityLogs] = useState<ActivityEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (!patient?.supabaseId) return;
    setLogsLoading(true);
    fetchActivityLogs(patient.supabaseId).then(logs => {
      setActivityLogs(logs);
      setLogsLoading(false);
    });
  }, [patient?.supabaseId]);

  const riskClass = patient?.status === 'critical' ? 'critical' : patient?.status === 'watch' ? 'watch' : 'stable';
  const riskScore = patient?.status === 'critical' ? 78 : patient?.status === 'watch' ? 47 : 12;

  return (
    <>
      <div className={`p-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`p-drawer ${isOpen ? 'open' : ''}`}>
        {patient ? (
          <>
            <div className="p-drawer-header">
              <div className="p-id-cell">
                <div className="p-avatar" style={{ background: patient.avatarBg, color: patient.avatarColor, width: '48px', height: '48px', fontSize: '18px' }}>
                  {patient.initials}
                </div>
                <div>
                  <div className="p-name" style={{ fontSize: '18px' }}>{patient.name}</div>
                  <div className="p-tag-id">{patient.id} · {patient.age}y {patient.gender}</div>
                  <div className={`p-risk-pill ${riskClass}`} style={{ marginTop: '8px' }}>
                    {patient.status === 'critical' ? <ShieldAlert size={12} /> : patient.status === 'watch' ? <AlertTriangle size={12} /> : <Activity size={12} />}
                    {riskScore}% {patient.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <button className="btn-icon" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className="p-drawer-body">
              {/* ── Trend Chart Section ── */}
              <section>
                <div className="p-drawer-section-title">
                  <LineChart size={14} />
                  7-Day Risk Trend
                </div>
                <div style={{ height: '120px', background: '#F8FAFC', borderRadius: '12px', border: '1px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px' }}>
                    {[30, 45, 40, 60, 55, 75, 78].map((v, i) => (
                      <div key={i} style={{ width: '20px', height: `${v}%`, background: v > 70 ? 'var(--red)' : 'var(--indigo)', borderRadius: '4px 4px 0 0', opacity: i === 6 ? 1 : 0.4 }} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: 'var(--text-dim)', fontWeight: '700' }}>
                  <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                </div>
              </section>

              {/* ── Environmental Context ── */}
              <section>
                <div className="p-drawer-section-title">
                  <Wind size={14} />
                  Environmental Context
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ padding: '12px', background: '#FEF2F2', borderLeft: '3px solid var(--red)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--red)' }}>High Dust Exposure</div>
                    <div style={{ fontSize: '11px', color: '#991B1B', marginTop: '2px' }}>Recorded at 2:00 PM · Local AQI: 158</div>
                  </div>
                  <div style={{ padding: '12px', background: '#FFFBEB', borderLeft: '3px solid var(--amber)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--amber)' }}>Pollen Spike Warning</div>
                    <div style={{ fontSize: '11px', color: '#B45309', marginTop: '2px' }}>Active in Gujrat sector · Expected to last 48h</div>
                  </div>
                </div>
              </section>

              {/* ── Recent Activity Log ── */}
              <section>
                <div className="p-drawer-section-title">
                  <History size={14} />
                  Recent Activity Log
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {logsLoading ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', padding: '8px 0' }}>Loading logs...</div>
                  ) : activityLogs.length === 0 ? (
                    <div style={{ fontSize: '12px', color: 'var(--text-dim)', padding: '8px 0' }}>No activity logged yet.</div>
                  ) : (
                    activityLogs.map((item, i) => (
                      <div key={i} className="p-activity-item">
                        <div className="p-activity-dot" />
                        <div className="p-activity-info">
                          <div className="p-activity-text">{item.text}</div>
                          {item.note && (
                            <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px', fontStyle: 'italic' }}>
                              "{item.note}"
                            </div>
                          )}
                          <div className="p-activity-time">{item.time}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="p-drawer-footer">
              <button className="btn-primary" style={{ background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', flex: 1, boxShadow: '0 2px 4px rgba(153, 27, 27, 0.05)' }} onClick={() => onSendUrgentAlert(patient)}>
                <Bell size={16} />
                SEND URGENT ALERT
              </button>
            </div>
          </>
        ) : (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-dim)' }}>
            No patient selected
          </div>
        )}
      </div>
    </>
  );
};

export default PatientInsightsDrawer;
