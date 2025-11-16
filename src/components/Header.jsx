import React from 'react';
import { FiMenu } from 'react-icons/fi';

const Header = ({ isSidebarCollapsed, toggleSidebar, isMobile }) => {
  return (
    <header className={`header ${isMobile ? 'mobile' : ''}`}>
      {/* Mobile Hamburger Menu */}
      {isMobile && (
        <button className="header-toggle-mobile" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      )}

      <div className="header-title">
        <span className="header-title-pill">FMCG AI Studio</span>
      </div>
    </header>
  );
};

export default Header;
