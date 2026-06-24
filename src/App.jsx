import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LandingPage from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ScanPage from './pages/Scan.jsx';
import ReportPage from './pages/Report.jsx';
import DatabasePage from './pages/Database.jsx';
import AnalyzePage from './pages/Analyze.jsx';

export default function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <Navbar />
      <main className={`flex-1 ${isLanding ? 'w-full' : 'max-w-[1280px] mx-auto w-full px-4 md:px-10'}`} style={{ paddingTop: '72px' }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
