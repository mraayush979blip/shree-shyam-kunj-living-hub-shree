import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import GetInTouch from './pages/GetInTouch';
import PropertiesPage from './pages/PropertiesPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { initStorage } from './lib/storage';
import './style.css';

import Footer from './components/Footer';

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
        
        {/* Auth & Admin */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
