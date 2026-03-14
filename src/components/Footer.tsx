import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="section" style={{ borderTop: '1px solid var(--color-border)', padding: '4rem 0' }}>
            <div className="container footer-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-soft)', fontSize: '0.875rem' }}>
                <p>© 2025 Shyam Kunj Living Hub. All rights reserved.</p>
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/about">About</Link>
                    <Link to="/properties">Properties</Link>
                    <Link to="/get-in-touch">Get in Touch</Link>
                    <Link to="/login" style={{ opacity: 0.5 }}>Admin Login</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
