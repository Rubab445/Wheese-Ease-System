import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastSymptom: string;
  status: 'Stable' | 'Watch' | 'Critical';
  avatarColor: string;
}

interface PatientTableProps {
  patients: Patient[];
  onView: (id: string) => void;
}

const STATUS_DOT: Record<string, string> = {
  Stable: '#10b981',
  Watch: '#f59e0b',
  Critical: '#ef4444',
};

const AVATAR_INITIALS = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

export default function PatientTable({ patients, onView }: PatientTableProps) {
  return (
    <table className="pt-table">
      <thead>
        <tr>
          <th>Patient</th>
          <th>Age</th>
          <th>Last Symptom</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {patients.map(p => (
          <tr key={p.id}>
            <td>
              <div className="pt-name">
                <div className="pt-avatar" style={{ background: p.avatarColor }}>
                  {AVATAR_INITIALS(p.name)}
                </div>
                {p.name}
              </div>
            </td>
            <td>{p.age}</td>
            <td>{p.lastSymptom}</td>
            <td>
              <span className={`status-badge ${p.status.toLowerCase()}`}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: STATUS_DOT[p.status], display: 'inline-block' }} />
                {p.status}
              </span>
            </td>
            <td>
              <button className="pt-view-btn" onClick={() => onView(p.id)}>
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
