import React, { useEffect, useState } from 'react';
import { getGeneralProperties, Property } from '../lib/storage';
import { MapPin, Instagram } from 'lucide-react';

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getGeneralProperties();
      setProperties(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (properties.length > 0) {
      setTimeout(() => initReveal(), 100);
    }
  }, [properties]);

  const initReveal = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  };

  return (
    <main style={{ paddingTop: 'var(--header-height)' }}>
      <section className="section">
        <div className="container">
          <header className="reveal" style={{ marginBottom: '6rem', textAlign: 'center' }}>
            <p className="section-subtitle">
              Our Portfolio
            </p>
            <h1 className="section-title">Explore our <span className="text-editorial">listings</span></h1>
            <p style={{ fontSize: '1.125rem', color: 'var(--color-text-soft)', maxWidth: '600px', margin: '2rem auto 0', lineHeight: 1.8 }}>
              From high-rise premium flats to expansive residential plots, find your perfect match in the heart of Indore.
            </p>
          </header>

          <div id="property-grid" className="property-grid">
            {properties.map(p => (
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
                  <div style={{ display: 'grid', gap: '0.4rem', marginBottom: '1rem' }}>
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
                    {p.address && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-soft)' }}>{p.address}</p>}
                  </div>
                  
                  {p.instagramLink && (
                    <a href={p.instagramLink} target="_blank" rel="noopener noreferrer" 
                       style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#E1306C', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                      <Instagram size={16} /> View Property Video
                    </a>
                  )}

                  <div className="card-price">
                    <span>{p.price ? `₹ ${p.price}` : 'Market Rate'}</span>
                    <button 
                      onClick={() => {
                        import('../lib/utils').then(u => u.handleWhatsAppInquiry(p));
                      }}
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      Inquiry
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default PropertiesPage;
