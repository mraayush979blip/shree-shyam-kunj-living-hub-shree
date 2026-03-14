import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="logo">Shyam Kunj Living Hub</Link>
        <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
          <Link to="/properties" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/properties' ? 'active' : ''}`}>Properties</Link>
          <Link to="/get-in-touch" onClick={() => setMobileMenuOpen(false)} className={`nav-link ${location.pathname === '/get-in-touch' ? 'active' : ''}`}>Get in Touch</Link>
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="nav-link mobile-only">Login</Link>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
