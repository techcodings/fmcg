import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FeatureA from './pages/FeatureA.jsx';
import FeatureB from './pages/FeatureB.jsx';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // On mobile, sidebar is "collapsed" (hidden) by default.
  // On desktop, sidebar is "open" (not collapsed) by default.
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(isMobile);
  
  const location = useLocation();

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // If we switch to desktop, open the sidebar.
      // If we switch to mobile, close it.
      if (!mobile) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // When route changes on mobile, close the sidebar
  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  }, [location, isMobile]);


  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="app-container">
      {/* Mobile-only overlay to close sidebar */}
      {isMobile && !isSidebarCollapsed && (
        <div 
          className="sidebar-overlay mobile-open"
          onClick={toggleSidebar}
        ></div>
      )}

      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
      />
      
      <main
  className={`main-content ${isMobile ? 'mobile' : ''}`}
  style={{
    marginLeft: isMobile ? '0' : (
      isSidebarCollapsed
        ? 'var(--sidebar-width-collapsed)'
        : 'var(--sidebar-width)'
    )
  }}
>

        <Header 
          isSidebarCollapsed={isSidebarCollapsed} 
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        
        <div className="page-content">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route index element={<Dashboard />} />
              <Route path="/trend-forecasting" element={<FeatureA />} />
              <Route path="/product-ideation" element={<FeatureB />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;