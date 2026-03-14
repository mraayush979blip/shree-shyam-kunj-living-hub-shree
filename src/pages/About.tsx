import React, { useEffect } from 'react';

const About: React.FC = () => {
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
  }, []);

  return (
    <main style={{ paddingTop: 'var(--header-height)' }}>
      <section className="section">
        <div className="container">
          <div className="reveal" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <p className="section-subtitle">Our Story</p>
            <h1 className="section-title">Built on <span className="text-editorial">Trust</span>.</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-soft)', lineHeight: 1.8 }}>
              Shyam Kunj Living Hub began with a simple mission: to make property ownership in Indore transparent, accessible, and high-quality.
            </p>
          </div>

          <div className="hero-grid" style={{ marginTop: '8rem', alignItems: 'start' }}>
            <div className="reveal">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>A Legacy of <br />Excellence.</h2>
              <p style={{ color: 'var(--color-text-soft)', fontSize: '1.1rem', lineHeight: 2 }}>
                With over a decade of experience in the real estate industry, we have developed a deep understanding of the Indore market. Our portfolio includes everything from affordable residential plots to ultra-luxury flats, with signature projects in Shree Nagar and Kailashpuri.
              </p>
            </div>
            <div className="reveal" style={{ background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '4rem', borderRadius: '0', textAlign: 'center', border: '1px solid rgba(228, 228, 231, 0.5)', boxShadow: '10px 10px 30px rgba(0,0,0,0.05)' }}>
               <div style={{ fontSize: '5rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>10+</div>
               <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, fontSize: '0.7rem', marginTop: '1rem' }}>Years of Excellence</p>
               <div style={{ margin: '3rem 0', height: '1px', background: 'var(--color-border)' }}></div>
               <div style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1, fontFamily: 'var(--font-display)' }}>500+</div>
               <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, fontSize: '0.7rem', marginTop: '1rem' }}>Families Served</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
