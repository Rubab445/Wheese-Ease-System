// src/components/SearchOverlay.tsx
import React, { useState, useEffect } from 'react';
import type { Doctor, Patient } from '../types';
import { riskBgCls, riskLabel } from '../utils/helper';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: Doctor[];
  patients: Patient[];
  onViewDoctor: (id: string) => void;
  onViewPatient: (id: string) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose, doctors, patients, onViewDoctor, onViewPatient }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredDocs = doctors.filter(d => d.name.toLowerCase().includes(query.toLowerCase()) || d.id.toLowerCase().includes(query.toLowerCase()) || d.spec.toLowerCase().includes(query.toLowerCase()));
  const filteredPts = patients.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()) || p.cond.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="search-overlay show" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-box-wrap">
        <div className="search-input-row">
          <span style={{fontSize:'18px'}}>🔍</span>
          <input id="searchInput" placeholder="Search doctors, patients, or IDs…" value={query} onChange={e => setQuery(e.target.value)} autoFocus />
          <button className="btn btn-ghost btn-xs" onClick={onClose}>Esc</button>
        </div>
        <div className="search-results">
          {!query && <div style={{padding:'20px',textAlign:'center',color:'var(--dim)',fontSize:'13px'}}>Type to search…</div>}
          {query && (
            <>
              {filteredDocs.length > 0 && (
                <>
                  <div className="search-cat">Doctors</div>
                  {filteredDocs.map(d => (
                    <div key={d.id} className="search-result-item" onClick={() => { onViewDoctor(d.id); onClose(); }}>
                      <div className="tbl-av" style={{background:d.color,width:'34px',height:'34px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'700',color:'#fff'}}>{d.init}</div>
                      <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'600'}}>{d.name}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>{d.spec} · {d.id}</div></div>
                      <span className={`badge ${d.status === 'active' ? 'badge-green' : d.status === 'pending' ? 'badge-amber' : 'badge-red'}`}>{d.status}</span>
                    </div>
                  ))}
                </>
              )}
              {filteredPts.length > 0 && (
                <>
                  <div className="search-cat">Patients</div>
                  {filteredPts.map(p => (
                    <div key={p.id} className="search-result-item" onClick={() => { onViewPatient(p.id); onClose(); }}>
                      <div className="tbl-av" style={{background:p.color,width:'34px',height:'34px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:'700',color:'#fff'}}>{p.init}</div>
                      <div style={{flex:1}}><div style={{fontSize:'13px',fontWeight:'600'}}>{p.name}</div><div style={{fontSize:'11px',color:'var(--muted)'}}>{p.cond} · {p.id}</div></div>
                      <span className={`badge ${riskBgCls(p.risk)}`}>{riskLabel(p.risk)}</span>
                    </div>
                  ))}
                </>
              )}
              {filteredDocs.length === 0 && filteredPts.length === 0 && (
                <div style={{padding:'28px',textAlign:'center',color:'var(--dim)',fontSize:'13px'}}>No results found for "{query}"</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;