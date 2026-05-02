import React from 'react';

interface PatientFilterBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterRisk: string;
    setFilterRisk: (value: string) => void;
    filterLocation: string;
    setFilterLocation: (value: string) => void;
    filterInactive: boolean;
    setFilterInactive: (value: boolean) => void;
    locations: string[];
    riskLevels: string[];
}

const PatientFilterBar: React.FC<PatientFilterBarProps> = ({
    searchTerm,
    setSearchTerm,
    filterRisk,
    setFilterRisk,
    filterLocation,
    setFilterLocation,
    filterInactive,
    setFilterInactive,
    locations,
    riskLevels,
}) => {
    return (
        <div className="filter-bar-enhanced">
            <div className="filter-search-enhanced">
                <i className="fas fa-search"></i>
                <input
                    type="text"
                    placeholder="Search by name, ID, or any city (Gujrat, Lahore, etc.)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button className="clear-search" onClick={() => setSearchTerm('')}>
                        <i className="fas fa-times-circle"></i>
                    </button>
                )}
            </div>

            <div className="filter-group-enhanced">
                <div className="filter-select">
                    <i className="fas fa-flag"></i>
                    <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                        {riskLevels.map(risk => (
                            <option key={risk} value={risk}>
                                {risk === 'all' ? 'All Risks' : risk.charAt(0).toUpperCase() + risk.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-select">
                    <i className="fas fa-city"></i>
                    <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                        {locations.map(loc => (
                            <option key={loc} value={loc}>
                                {loc === 'All' ? 'All Cities' : loc}
                            </option>
                        ))}
                    </select>
                </div>

                <label className="filter-checkbox-enhanced">
                    <input
                        type="checkbox"
                        checked={filterInactive}
                        onChange={(e) => setFilterInactive(e.target.checked)}
                    />
                    <span><i className="fas fa-user-clock"></i> Show Inactive (48h+)</span>
                </label>
            </div>
        </div>
    );
};

export default PatientFilterBar;