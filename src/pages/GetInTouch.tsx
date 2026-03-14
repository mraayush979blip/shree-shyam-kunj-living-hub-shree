import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowRight, Bell, Zap, Headphones, CheckCircle2 } from 'lucide-react';

const GetInTouch: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target.classList.contains('reveal') && entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Anti-Spam Check: Check if this user recently submitted
        const lastSubmit = localStorage.getItem('ssk_last_submit');
        if (lastSubmit && Date.now() - parseInt(lastSubmit) < 300000) { // 5-minute cooldown
            alert("Please wait a few minutes before trying again.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Check if number exists in DB
            const { data } = await supabase.from('subscribers').select('id').or(`phone.eq.${phone},email.eq.${email}`);
            if (data && data.length > 0) throw new Error("This contact info is already registered.");

            // 2. Direct Save to database
            const { error } = await supabase
                .from('subscribers')
                .insert([{ email, name, phone }]);

            if (error) throw error;

            // 3. Set Cooldown to prevent spam
            localStorage.setItem('ssk_last_submit', Date.now().toString());
            setIsSubscribed(true);
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
      {
        icon: <Bell className="text-accent" />,
        title: "Exclusive First-Look",
        desc: "Get notified the second a new property hits the market—before it goes public."
      },
      {
        icon: <Zap className="text-accent" />,
        title: "Priority Deal Alerts",
        desc: "Access exclusive pre-launch pricing and limited-time developer discounts."
      },
      {
        icon: <Headphones className="text-accent" />,
        title: "Dedicated Advisor",
        desc: "Direct WhatsApp line to our core team for personalized property scouting."
      }
    ];

    return (
        <main style={{ paddingTop: 'var(--header-height)' }}>
            <section className="section">
                <div className="container">
                    <div className="reveal" style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 6rem' }}>
                        <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 700, marginBottom: '2rem' }}>Exclusive Access</p>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>Join our <br /><span className="text-editorial">Signature</span> circle.</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-soft)', marginTop: '2rem' }}>
                           Don't just look for property. Be the first to be invited.
                        </p>
                    </div>

                    <div className="center-mobile-grid">
                        <div>
                            <div className="reveal" style={{ marginBottom: '4rem' }}>
                                <h3 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>The Benefits of Membership</h3>
                                <div style={{ display: 'grid', gap: '3rem' }}>
                                    {benefits.map((b, i) => (
                                      <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                                          <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>{b.icon}</div>
                                          <div>
                                              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{b.title}</h4>
                                              <p style={{ color: 'var(--color-text-soft)', fontSize: '0.95rem', lineHeight: 1.6 }}>{b.desc}</p>
                                          </div>
                                      </div>
                                    ))}
                                </div>
                            </div>

                            <div className="reveal" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}>
                                <p style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Direct WhatsApp Access:</p>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                  <a href="https://wa.me/+919617573084" target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'space-between' }}>
                                      <span>Shyam Jangid</span>
                                      <ArrowRight size={16} />
                                  </a>
                                </div>
                            </div>
                        </div>

                        <div className="reveal contact-form-card">
                            {isSubscribed ? (
                                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                    <CheckCircle2 size={64} style={{ color: 'var(--color-success)', marginBottom: '2rem' }} />
                                    <h3 style={{ marginBottom: '1rem' }}>Welcome to the Circle!</h3>
                                    <p style={{ color: 'var(--color-text-soft)' }}>Thank you, {name}. We have added you to our premium list. You will receive updates shortly.</p>
                                    <div style={{ marginTop: '2.5rem', display: 'grid', gap: '1rem' }}>
                                        <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>WANT TO CHAT NOW?</p>
                                        <a href="https://wa.me/919617573084" target="_blank" className="btn btn-outline">Message us on WhatsApp</a>
                                        <button onClick={() => window.location.reload()} style={{ background: 'none', border: 'none', color: 'var(--color-text-soft)', cursor: 'pointer', fontSize: '0.8rem' }}>Back to Home</button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>
                                    <h3 style={{ fontSize: '1.5rem' }}>Secure your <span className="text-editorial">spot</span></h3>
                                    <div>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                                        <input type="text" placeholder="Your Name" required value={name} onChange={(e) => setName(e.target.value)}
                                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0', outline: 'none' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>WhatsApp Number</label>
                                        <input type="tel" placeholder="+91 00000 00000" required value={phone} onChange={(e) => setPhone(e.target.value)}
                                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0', outline: 'none' }} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                                        <input type="email" placeholder="yourname@gmail.com" required value={email} onChange={(e) => setEmail(e.target.value)}
                                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--color-border)', padding: '0.5rem 0', outline: 'none' }} 
                                        />
                                    </div>
                                    <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ height: '60px' }}>
                                        {isSubmitting ? 'Syncing...' : 'Join Exclusive List'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default GetInTouch;
