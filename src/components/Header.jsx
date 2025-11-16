import React from 'react';
import { FiMenu } from 'react-icons/fi';

const Header = ({ isSidebarCollapsed, toggleSidebar, isMobile }) => {
  return (
    <header className={`header ${isMobile ? 'mobile' : ''}`}>
      {/* Left – Mobile Hamburger Menu */}
      {isMobile && (
        <button className="header-toggle-mobile" onClick={toggleSidebar}>
          <FiMenu />
        </button>
      )}

      {/* Center – Title */}
      <div className="header-title-wrap">
        <div className="header-title">
          <span className="header-title-pill">FMCG AI Studio</span>
        </div>
      </div>

      {/* Right – Download App */}
      <a
        href="/app-release.apk"   // <- file path (see note below)
        download="FMCG-AI-Studio.apk"
        className="header-download-btn"
      >
        Download App
      </a>
    </header>
  );
};

export default Header;
