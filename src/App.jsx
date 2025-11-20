// src/App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header.jsx';
import HomePage from './pages/HomePage.jsx'; // Import the new Home Page
import FeatureA from './pages/FeatureA.jsx';
import FeatureB from './pages/FeatureB.jsx';

function App() {
  const location = useLocation();

  // Check if we are on the Home page (the new landing page)
  const isHomePage = location.pathname === '/';

  return (
    <div className="app-container">
      
      {/* Only show the Header if NOT on the Home page */}
      {!isHomePage && <Header />}
      
      <main 
        className="main-content"
        style={{ 
          // Remove top padding if we are on the Home page
          paddingTop: isHomePage ? '0' : 'calc(var(--header-height) + 1.5rem)' 
        }}
      >
        <div className={isHomePage ? "" : "page-content"}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Route 1: The new Home Page */}
              <Route index element={<HomePage />} />
              
              {/* Route 2: Feature A */}
              <Route path="/trend-forecasting" element={<FeatureA />} />
              
              {/* Route 3: Feature B */}
              <Route path="/product-ideation" element={<FeatureB />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;