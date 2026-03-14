import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import GetInTouch from './pages/GetInTouch';
import PropertiesPage from './pages/PropertiesPage';
import { initStorage } from './lib/storage';
import './style.css';
import Footer from './components/Footer';

// Lazy load non-critical pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Loading component for lazy routes
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
    <div className="text-editorial" style={{ fontSize: '1.5rem', animation: 'pulse 1.5s infinite' }}>Loading...</div>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    initStorage();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Standard Layout */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/get-in-touch" element={<><Navbar /><GetInTouch /><Footer /></>} />
        <Route path="/properties" element={<><Navbar /><PropertiesPage /><Footer /></>} />
        
        {/* Auth & Admin - Lazy Loaded */}
        <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
        <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
        <Route path="/dashboard/:tab" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
      </Routes>
    </Router>
  );
};

export default App;
