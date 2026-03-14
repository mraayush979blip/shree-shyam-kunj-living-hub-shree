import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProperties, Property } from '../lib/storage';
import { ArrowRight, MapPin } from 'lucide-react';

const Home: React.FC = () => {
  const [featured, setFeatured] = useState<Property[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getFeaturedProperties();
      setFeatured(data);
      initReveal();
    };
    loadData();
  }, []);

  const initReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    // Select all reveal variants
    document.querySelectorAll('[class*="reveal"]').forEach(el => observer.observe(el));
  };

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content reveal" style={{ transitionDelay: '0.1s' }}>

            <h1 className="hero-title" style={{ fontWeight: 600 }}>
              Living the <span className="text-editorial">Dream</span>.<br />
              Owning the <span className="text-editorial" style={{ color: 'var(--color-accent)' }}>Future</span>.
            </h1>
            <p className="hero-sub" style={{ fontSize: '1.25rem' }}>
              We curate exclusive architectural marvels in Indore's most prestigious locations. Experience a legacy of transparency, quality, and luxury.
            </p>
            <div className="hero-actions">
              <Link to="/properties" className="btn btn-primary" style={{ padding: '1.25rem 3rem' }}>Explore Assets</Link>
            </div>
          </div>
          <div className="hero-image-container reveal" style={{ transitionDelay: '0.4s' }}>
            <div className="hero-image-float" style={{ borderRadius: '0', boxShadow: '20px 20px 60px rgba(0,0,0,0.1)' }}>
                <img src="https://lh3.googleusercontent.com/gps-cs-s/AHVAweqo2Q-kP3etYMDaKafQRfDXq16mC2zfVHwoVeSdI7PszcTYSJjz6q77hnbLLGTUbWLTUUBrmZ6jsBeHVLtMs-RfiA40TeBEWqx-ZcKs6e7e-x5Xqi8gQLf80kVhdXNYUKjUjj1s5p80tBxc=s1360-w1360-h1020-rw" alt="Shyam Kunj Living Hub Signature Asset" />
                <div className="stats-overlay" style={{ bottom: '-30px', left: '-30px' }}>
                    <div className="stat-circle" style={{ background: 'var(--color-text-main)', width: '130px', height: '130px', border: '1px solid #FFF', borderRadius: '0' }}>
                        <strong style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)' }}>10+</strong>
                        <span style={{ fontSize: '0.6rem' }}>EXPERIENCE</span>
                    </div>
                </div>
            </div>
            <div className="hero-image-bg" style={{ borderRadius: '0', border: '1px solid var(--color-border)', background: '#FFF' }}></div>
          </div>
        </div>
      </section>

      <section id="featured" className="section">
        <div className="container">
          <div className="reveal section-header">
            <div>
              <p className="section-subtitle">The Collection</p>
              <h2 className="section-title">Featured Properties</h2>
            </div>
            <Link to="/properties" className="btn btn-outline">View Collection</Link>
          </div>

          <div id="property-grid" className="property-grid">
            {featured.map(p => (
              <article key={p.id} className="property-card reveal">
                <div className="card-img-wrapper">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    loading="lazy" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://lh3.googleusercontent.com/p/AF1QipNOENXVUPQa76gxiCbtk1auzfJESAqm10KYwCBS=s1360-w1360-h1020-rw';
                    }}
                  />
                </div>
                <div className="card-content">
                  <div className="card-tag">{p.type}</div>
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-location">
                    <MapPin size={16} /> 
                    {p.googleMapsLink ? (
                      <a href={p.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {p.location}
                      </a>
                    ) : (
                      p.location
                    )}
                  </p>
                  <div className="card-price">
                    <span>{p.price ? `₹ ${p.price}` : 'Exclusive'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="center-mobile-grid">
            <div className="reveal">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Why Shyam Kunj Living Hub?</h2>
              <p style={{ color: 'var(--color-text-soft)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                We don't just sell property; we build trust. Our platform is dedicated to providing transparent, verified, and premium real estate options across Indore.
              </p>
            </div>
            <div className="reveal why-grid">
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>01. Transparency</h3>
                <p style={{ color: 'var(--color-text-soft)' }}>Every listing is verified for legal and structural integrity.</p>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem' }}>02. Expertise</h3>
                <p style={{ color: 'var(--color-text-soft)' }}>Guidance from industry veterans with decades of local Indore knowledge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="reveal cta-card">
            <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Ready to find your <span className="text-editorial">address</span>?</h2>
            <p style={{ marginBottom: '3rem', color: '#94A3B8', fontSize: '1.2rem' }}>Join hundreds of families who trusted us for their dream home in Indore.</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/get-in-touch" className="btn btn-primary" style={{ background: '#FFF', color: 'var(--color-text-main)', padding: '1.25rem 3rem' }}>Get in Touch Today</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
