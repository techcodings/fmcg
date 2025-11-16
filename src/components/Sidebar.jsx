import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiTrendingUp, FiCpu, FiChevronsLeft, FiBriefcase, FiX } from 'react-icons/fi';

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile }) => {
  
  const mobileOpenClass = isMobile && !isCollapsed ? 'mobile-open' : '';
  const desktopCollapsedClass = !isMobile && isCollapsed ? 'collapsed' : '';

  return (
    <aside 
      className={`sidebar ${isMobile ? 'mobile' : ''} ${mobileOpenClass} ${desktopCollapsedClass}`}
      style={{ 
        width: isMobile ? 'var(--sidebar-width)' : (isCollapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)')
      }}
    >
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FiBriefcase className="sidebar-logo-icon" />
          {/* Show text if not collapsed OR if mobile (as mobile is always full-width) */}
          {(!isCollapsed || isMobile) && <span className="sidebar-logo-text">ProductAI</span>}
        </div>
        
        {/* Show desktop toggle */}
        {!isMobile && (
          <button className="sidebar-toggle-desktop" onClick={toggleSidebar}>
            <FiChevronsLeft />
          </button>
        )}
        {/* Show mobile close button */}
        {isMobile && (
          <button className="header-toggle-mobile" onClick={toggleSidebar} style={{display: 'flex'}}>
            <FiX />
          </button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <SidebarLink to="/" text="Dashboard" icon={<FiHome />} isCollapsed={isCollapsed} isMobile={isMobile} />
        <SidebarLink to="/trend-forecasting" text="Trend Forecasting" icon={<FiTrendingUp />} isCollapsed={isCollapsed} isMobile={isMobile} />
        <SidebarLink to="/product-ideation" text="Product Ideation" icon={<FiCpu />} isCollapsed={isCollapsed} isMobile={isMobile} />
      </nav>
    </aside>
  );
};

const SidebarLink = ({ to, text, icon, isCollapsed, isMobile }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `sidebar-nav-link ${isActive ? 'active' : ''}`
      }
      title={isCollapsed && !isMobile ? text : ''} // Tooltip only on collapsed desktop
    >
      <span className="sidebar-nav-icon">{icon}</span>
      {/* Show text if not collapsed OR if mobile */}
      {(!isCollapsed || isMobile) && <span className="sidebar-nav-text">{text}</span>}
    </NavLink>
  );
};

export default Sidebar;