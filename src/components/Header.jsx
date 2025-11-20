// src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiBriefcase } from 'react-icons/fi';

const Header = () => {
  return (
    <header className="header">
      {/* Left – Logo (links to Home Page) */}
      <NavLink to="/" className="header-logo">
        <div className="logo-icon">
          <FiBriefcase className="icon" />
        </div>
        <div className="logo-text">
          <h1>FMCG-AI</h1>
        </div>
      </NavLink>

      {/* Center – Navigation */}
      <nav className="header-nav">
        <NavLink to="/trend-forecasting">Trend Forecasting</NavLink>
        <NavLink to="/product-ideation">Product Ideation</NavLink>
      </nav>

      {/* Right – Download App */}
      <a
        href="/app-release.apk"
        download="FMCG-AI-Studio.apk"
        className="header-download-btn"
      >
        Download App
      </a>

      <button className="header-toggle-mobile">
        {/* <FiMenu /> */}
      </button>
    </header>
  );
};

export default Header;