import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import MetaTags from '../components/common/MetaTags';
import { BRAND } from '../constants/branding';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Custom Stage Backdrop & Cultural Decor',
    category: 'lighting',
    imageUrl: '/images/events/IMG-20260915-WA0019.jpg',
    description: 'Bespoke dowry ceremony backdrop with artisanal calabash accents, woven basketry, and vibrant red runway draping.',
  },
  {
    id: 2,
    title: 'Master of Ceremonies & Protocol Direction',
    category: 'mc',
    imageUrl: '/images/events/IMG-20260915-WA0008.jpg',
    description: 'MC Titoe presiding over live dowry proceedings, guest pacing, and ceremonial introductions on the red carpet.',
  },
  {
    id: 3,
    title: 'High-Energy Celebration & Dance Pacing',
    category: 'weddings',
    imageUrl: '/images/events/IMG-20260915-WA0011.jpg',
    description: 'Joyful family celebration, festive tinsel garlands, and rhythmic choreography orchestrated during live festivities.',
  },
  {
    id: 4,
    title: 'Concert PA Acoustics & Live Vocal Address',
    category: 'sound',
    imageUrl: '/images/events/IMG-20260915-WA0020.jpg',
    description: 'Crisp wireless frequency management and acoustic clarity for keynote family speeches and musical numbers.',
  },
  {
    id: 5,
    title: 'Lead Event Director & Production Hospitality',
    category: 'mc',
    imageUrl: '/images/events/IMG-20260915-WA0018.jpg',
    description: 'Calm, confident stage presence and on-site oversight ensuring every transition unfolds seamlessly.',
  },
  {
    id: 6,
    title: 'On-Site Staging & Acoustic Coordination',
    category: 'sound',
    imageUrl: '/images/events/IMG-20260915-WA0014.jpg',
    description: 'Coordinated audio setup with wide-dispersion speakers and stage floral enhancements for outdoor venues.',
  },
  {
    id: 7,
    title: 'Live Concert Stage & Atmospheric Beam Lighting',
    category: 'lighting',
    imageUrl: '/images/events/stage-lighting-night-concert.jpg',
    description: 'Night concert stage with illuminated multicolored beam lighting, live performance staging, and concert sound reinforcement.',
  },
  {
    id: 8,
    title: 'Live Band Backline & Musical Instruments',
    category: 'sound',
    imageUrl: '/images/events/musical-instruments-stage.jpg',
    description: 'Complete band backline setup including Yamaha keyboards, acoustic drum kit, Peavey amplification, and monitor staging.',
  },
  {
    id: 9,
    title: 'Outdoor Concert PA Towers & Heavy Line Array',
    category: 'sound',
    imageUrl: '/images/events/public-address-system-concert.jpg',
    description: 'Concert-grade outdoor sound system featuring dual ground-stacked subwoofers, line array cabinets, and weatherproof stage canopy.',
  },
  {
    id: 10,
    title: 'Aluminum Box Trussing & Roofing Structure',
    category: 'lighting',
    imageUrl: '/images/events/aluminum-stage-trussing-rig.jpg',
    description: 'Heavy-duty structural aluminum truss canopy with overhead par can illumination, chain blocks, and modular stage engineering.',
  },
  {
    id: 11,
    title: 'Complete Outdoor Festival Stage Production',
    category: 'galas',
    imageUrl: '/images/events/festival-stage-production-wide.jpg',
    description: 'Full-scale outdoor production with structural truss towers, VIP hospitality canopies, and high-impact acoustic coverage.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'mc', label: 'MC & Hosting' },
  { id: 'weddings', label: 'Weddings & Dowries' },
  { id: 'lighting', label: 'Decor & Staging' },
  { id: 'sound', label: 'PA & Acoustics' },
  { id: 'galas', label: 'Corporate & Galas' },
  { id: 'instruments', label: 'Backline & Instruments' },
].filter(cat => cat.id === 'all' || GALLERY_ITEMS.some(item => item.category === cat.id));

export const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeItem, setActiveItem] = useState(null);

  const filteredItems = selectedCategory === 'all' 
    ? GALLERY_ITEMS 
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="gallery-page" style={{ paddingBottom: '6rem' }}>
      <MetaTags 
        title={`Portfolio & Gallery | ${BRAND.name}`} 
        description="Visual portfolio of past event staging, concert sound engineering, decor, and architectural illumination."
      />

      {/* Header Banner */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: '#FFFFFF',
        padding: '5rem 0 4rem',
        textAlign: 'center',
      }}>
        <div className="container-narrow">
          <span className="badge-eyebrow" style={{ color: 'var(--color-champagne)' }}>
            Visual Portfolio
          </span>
          <h1 className="font-h1" style={{ color: '#FFFFFF', marginBottom: '1rem' }}>
            Production Moments & Staging
          </h1>
          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(255, 255, 255, 0.82)',
            maxWidth: '620px',
            margin: '0 auto',
            lineHeight: 1.65,
          }}>
            Explore our visual showcase demonstrating the synergy of sound reinforcement, ambient lighting, master hosting, and refined event architecture.
          </p>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding">
        <div className="container">
          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '3.5rem',
          }}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 'var(--radius-full)',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isSelected ? '1.5px solid var(--color-accent)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--color-muted)',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Image Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(1.25rem, 3vw, 2rem)',
          }}>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="card-luxury gallery-card"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  loading="lazy"
                  className="gallery-card-img"
                />
                <div className="gallery-card-overlay">
                  <h4 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.2rem',
                    color: '#FFFFFF',
                    marginBottom: '0.35rem',
                    lineHeight: 1.3,
                  }}>
                    {item.title}
                  </h4>
                  <p style={{
                    fontSize: '0.825rem',
                    color: 'rgba(255, 255, 255, 0.88)',
                    lineHeight: 1.45,
                  }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <style>{`
            .gallery-card {
              position: relative;
              height: 340px;
              border-radius: 16px;
              overflow: hidden;
              cursor: pointer;
              background-color: var(--color-primary);
            }
            .gallery-card-img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center 20%;
              transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
              display: block;
            }
            .gallery-card:hover .gallery-card-img {
              transform: scale(1.06);
            }
            .gallery-card-overlay {
              position: absolute;
              inset: 0;
              background: linear-gradient(to top, rgba(4, 13, 22, 0.95) 0%, rgba(8, 26, 43, 0.7) 50%, transparent 100%);
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              padding: 1.5rem;
              opacity: 0;
              transform: translateY(10px);
              transition: opacity 0.35s ease, transform 0.35s ease;
              pointer-events: none;
            }
            .gallery-card:hover .gallery-card-overlay,
            .gallery-card:focus-visible .gallery-card-overlay {
              opacity: 1;
              transform: translateY(0);
            }
          `}</style>

          {/* Lightbox Modal */}
          {activeItem && (
            <div 
              onClick={() => setActiveItem(null)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(4, 13, 22, 0.88)',
                backdropFilter: 'blur(6px)',
                zIndex: 1200,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: '860px',
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-xs)',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <button
                  onClick={() => setActiveItem(null)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                  }}
                >
                  <X size={20} />
                </button>
                <div style={{ backgroundColor: '#071524', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={activeItem.imageUrl} 
                    alt={activeItem.title} 
                    style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ padding: '1.75rem 2rem' }}>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                    {activeItem.title}
                  </h3>
                  <p style={{ color: 'var(--color-muted)', fontSize: '0.925rem', lineHeight: 1.6 }}>
                    {activeItem.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          <div style={{
            marginTop: '5rem',
            textAlign: 'center',
            padding: '3.5rem 2rem',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}>
            <h3 className="font-h3" style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
              Envisioning Similar Staging for Your Event?
            </h3>
            <p style={{ maxWidth: '520px', margin: '0 auto 2rem', color: 'var(--color-muted)' }}>
              Let our team tailor lighting, acoustics, and production to your exact specifications.
            </p>
            <Link to="/plan-event" className="btn btn-primary btn-lg">
              Plan Your Event <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;
