import React from 'react';

const Header: React.FC = () => {
    return (
        <div className="header-container">
            <div className="header-row">
                <div className="search-area">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Search" />
                </div>
                <div className="bell-icon">
                    <i className="far fa-bell"></i>
                </div>
            </div>
            <div className="header-divider"></div>
        </div>
    );
};

export default Header;