import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Minus,
  ShieldAlert, AlertCircle, Activity,
  Wind, Send, CheckCircle2
} from 'lucide-react';
import type { Patient } from '../../types/dashboard.types';

interface PatientRiskFeedProps {
  patients: Patient[];
  onPatientClick: (patient: Patient) => void;
}

type TagColor = 'high' | 'mod' | 'low' | 'info';

interface TriggerTag {
  label: string;
  color: TagColor;
}

const getTriggerTags = (p: Patient): TriggerTag[] => {
  const tags: TriggerTag[] = [];
  if (p.aqi >= 150)                             tags.push({ label: 'High AQI',       color: 'high' });
  else if (p.aqi >= 100)                        tags.push({ label: 'Mod AQI',        color: 'mod'  });
  if (p.pollen === 'High')                      tags.push({ label: 'High Pollen',    color: 'mod'  });
  if (p.inhaler >= 3)                           tags.push({ label: 'Inhaler Overuse',color: 'high' });
  if (p.trend === 'up' && p.risk >= 55)         tags.push({ label: 'Risk Rising',    color: 'high' });
  if (p.humidity >= 65)                         tags.push({ label: 'High Humidity',  color: 'info' });
  if (p.risk < 30)                              tags.push({ label: 'Stable',         color: 'low'  });
  return tags.slice(0, 3);
};

const getRiskClass = (risk: number) => risk >= 61 ? 'high' : risk >= 31 ? 'mod' : 'low';
const getRiskLabel = (risk: number) => risk >= 61 ? 'High Risk' : risk >= 31 ? 'Moderate' : 'Low Risk';
const getRiskIcon  = (risk: number) =>
  risk >= 61 ? <ShieldAlert size={13} /> :
  risk >= 31 ? <AlertCircle size={13} /> :
               <Activity    size={13} />;
const getTrendIcon = (trend: string) =>
  trend === 'up'   ? <TrendingUp   size={13} /> :
  trend === 'down' ? <TrendingDown size={13} /> :
                     <Minus        size={13} />;

const PatientRiskFeed: React.FC<PatientRiskFeedProps> = ({ patients, onPatientClick }) => {
  const [sentSet, setSentSet] = useState<Set<string>>(new Set());

  const handleSendAdvice = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSentSet(prev => new Set(prev).add(id));
    setTimeout(() => {
      setSentSet(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  };

  const sorted = [...patients].sort((a, b) => b.risk - a.risk);

  return (
    <div className="patient-risk-feed">
      {sorted.map((p, idx) => {
        const rc   = getRiskClass(p.risk);
        const tags = getTriggerTags(p);
        const sent = sentSet.has(p.id);

        return (
          <div
            key={p.id}
            className="feed-row"
            style={{ animationDelay: `${idx * 0.05}s` }}
            onClick={() => onPatientClick(p)}
          >
            {/* ── Main Row Content ── */}
            <div className="feed-row-top">
              <div className="feed-av" style={{ background: p.color }}>
                {p.av}
              </div>

              <div className="feed-info">
                <div className="feed-name">{p.name}</div>
                <div className="feed-sub">
                  <span>{p.id}</span>
                  <span>•</span>
                  <span>{p.cond}</span>
                  <span>•</span>
                  <span>{p.age}y</span>
                </div>
              </div>

              {/* Risk Badge (Central) */}
              <div className={`risk-badge ${rc}`}>
                {getRiskIcon(p.risk)}
                {getRiskLabel(p.risk)}
              </div>

              {/* AI Risk Score (Right) */}
              <div className="feed-risk">
                <div className="feed-risk-label">AI RISK</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {p.risk}%
                  <span className={`trend ${rc}`}>
                    {getTrendIcon(p.trend)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Action Bar: Triggers & Button ── */}
            <div className="feed-row-footer">
              <div className="trigger-tags">
                <span style={{ fontSize: '10px', color: 'var(--dim)', fontWeight: '700', marginRight: '4px' }}>TRIGGERS:</span>
                {tags.map(tag => (
                  <span key={tag.label} className={`trigger-tag ${tag.color}`}>
                    {tag.label}
                  </span>
                ))}
              </div>

              <button
                className={`send-advice-btn ${sent ? 'sent' : ''}`}
                onClick={(e) => handleSendAdvice(e, p.id)}
                title="Send preventive advice to patient's mobile app"
              >
                {sent
                  ? <><CheckCircle2 size={13} /> ADVICE SENT</>
                  : <><Send size={13} /> SEND PREVENTIVE ADVICE</>
                }
              </button>
            </div>
            
            {/* Minimal Progress Bar for visual reinforcement */}
            <div className="progress-track" style={{ marginTop: '12px', marginBottom: '0' }}>
              <div className={`progress-bar ${rc}`} style={{ width: `${p.risk}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PatientRiskFeed;