import React from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface PatientFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  ageFilter: string;
  onAgeChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

const PatientFilters: React.FC<PatientFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  ageFilter,
  onAgeChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="p-filter-bar">
      <div className="p-search-box">
        <Search size={18} color="#94A3B8" />
        <input
          type="text"
          placeholder="Search by name or patient ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
          <Filter size={14} />
          <span>Filter:</span>
        </div>
        <select
          className="p-filter-dropdown"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="stable">Stable</option>
          <option value="watch">Watch</option>
          <option value="critical">Critical</option>
        </select>

        <select
          className="p-filter-dropdown"
          value={ageFilter}
          onChange={(e) => onAgeChange(e.target.value)}
        >
          <option value="">All Ages</option>
          <option value="child">Child (0–12)</option>
          <option value="teen">Teen (13–17)</option>
          <option value="adult">Adult (18–60)</option>
          <option value="senior">Senior (60+)</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '13px', fontWeight: '600' }}>
          <ArrowUpDown size={14} />
          <span>Sort:</span>
        </div>
        <select
          className="p-filter-dropdown"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="name">Patient Name</option>
          <option value="risk">Urgency / Risk</option>
          <option value="recent">Last Active</option>
        </select>
      </div>
    </div>
  );
};

export default PatientFilters;