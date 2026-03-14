import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        
        // Check if already logged in
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) navigate('/dashboard');
        });
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
            <div className="reveal login-card">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Link to="/" className="logo" style={{ fontSize: '2rem' }}>Shyam Kunj Living Hub</Link>
                    <p style={{ color: 'var(--color-text-soft)', marginTop: '1rem' }}>Welcome back. Please login to your account.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'grid', gap: '2rem' }}>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }} 
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '1rem' }}>Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            required 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '1.25rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', fontFamily: 'inherit', fontSize: '1rem', outline: 'none' }} 
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: '60px', fontSize: '1.1rem' }}>
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.875rem', textAlign: 'center', marginTop: '1rem' }}>
                            {error}
                        </p>
                    )}
                </form>

                <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-soft)' }}>
                    <p>Return to <Link to="/" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>Home</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
